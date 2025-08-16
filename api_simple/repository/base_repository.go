package repository

import (
	"fmt"
	"strings"

	"gorm.io/gorm"
)

// BaseRepository provides generic CRUD operations for any model
type BaseRepository[T any] struct {
	db *gorm.DB
}

// NewBaseRepository creates a new instance of BaseRepository
func NewBaseRepository[T any](db *gorm.DB) *BaseRepository[T] {
	return &BaseRepository[T]{
		db: db,
	}
}

// Create creates a new record
func (r *BaseRepository[T]) Create(entity *T) error {
	return r.db.Create(entity).Error
}

// FindByID finds a record by ID
func (r *BaseRepository[T]) FindByID(id uint) (*T, error) {
	var entity T
	err := r.db.First(&entity, id).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

// FindOne finds a single record by conditions
func (r *BaseRepository[T]) FindOne(conditions map[string]interface{}) (*T, error) {
	var entity T
	err := r.db.Where(conditions).First(&entity).Error
	if err != nil {
		return nil, err
	}
	return &entity, nil
}

// FindAll finds all records with optional conditions
func (r *BaseRepository[T]) FindAll(conditions map[string]interface{}) ([]T, error) {
	var entities []T
	query := r.db
	if len(conditions) > 0 {
		query = query.Where(conditions)
	}
	err := query.Find(&entities).Error
	if err != nil {
		return nil, err
	}
	return entities, nil
}

// Update updates a record
func (r *BaseRepository[T]) Update(entity *T) error {
	return r.db.Save(entity).Error
}

// Delete deletes a record
func (r *BaseRepository[T]) Delete(id uint) error {
	var entity T
	return r.db.Delete(&entity, id).Error
}

// DeleteWhere deletes records that match the conditions
func (r *BaseRepository[T]) DeleteWhere(conditions map[string]interface{}) error {
	var entity T
	return r.db.Where(conditions).Delete(&entity).Error
}

// Count counts records with optional conditions
func (r *BaseRepository[T]) Count(conditions map[string]interface{}) (int64, error) {
	var count int64
	query := r.db.Model(new(T))
	if len(conditions) > 0 {
		query = query.Where(conditions)
	}
	err := query.Count(&count).Error
	return count, err
}

// Exists checks if records exist with given conditions
func (r *BaseRepository[T]) Exists(conditions map[string]interface{}) (bool, error) {
	count, err := r.Count(conditions)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// Common types for querying
type Pagination struct {
	Page     int   `form:"page,default=1"`
	PageSize int   `form:"page_size,default=10"`
	Total    int64 `json:"total"`
}

type SortOrder string

const (
	ASC  SortOrder = "ASC"
	DESC SortOrder = "DESC"
)

type Sort struct {
	Field string    `form:"sort_field"`
	Order SortOrder `form:"sort_order,default=ASC"`
}

type Filter struct {
	Field    string `form:"filter_field"`
	Operator string `form:"filter_operator,default=eq"`
	Value    string `form:"filter_value"`
}

type QueryOptions struct {
	Pagination *Pagination
	Sorts      []Sort
	Filters    []Filter
	Preloads   []string
	Search     *SearchOptions
}

type SearchOptions struct {
	Fields []string
	Term   string
}

// FindWithOptions finds records with pagination, sorting, filtering, searching and preloading
func (r *BaseRepository[T]) FindWithOptions(opts QueryOptions) ([]T, *Pagination, error) {
	var entities []T
	query := r.db.Model(new(T))

	// Apply preloads
	for _, preload := range opts.Preloads {
		query = query.Preload(preload)
	}

	// Apply search if provided
	if opts.Search != nil && opts.Search.Term != "" {
		searchQuery := r.buildSearchQuery(opts.Search)
		if searchQuery != "" {
			query = query.Where(searchQuery)
		}
	}

	// Build conditions map for standard filters
	conditions := make(map[string]interface{})
	for _, filter := range opts.Filters {
		switch strings.ToLower(filter.Operator) {
		case "eq":
			conditions[filter.Field] = filter.Value
		case "neq":
			query = query.Where(fmt.Sprintf("%s != ?", filter.Field), filter.Value)
		case "gt":
			query = query.Where(fmt.Sprintf("%s > ?", filter.Field), filter.Value)
		case "gte":
			query = query.Where(fmt.Sprintf("%s >= ?", filter.Field), filter.Value)
		case "lt":
			query = query.Where(fmt.Sprintf("%s < ?", filter.Field), filter.Value)
		case "lte":
			query = query.Where(fmt.Sprintf("%s <= ?", filter.Field), filter.Value)
		case "like":
			query = query.Where(fmt.Sprintf("%s LIKE ?", filter.Field), fmt.Sprintf("%%%s%%", filter.Value))
		case "in":
			query = query.Where(fmt.Sprintf("%s IN (?)", filter.Field), strings.Split(filter.Value, ","))
		case "notin":
			query = query.Where(fmt.Sprintf("%s NOT IN (?)", filter.Field), strings.Split(filter.Value, ","))
		case "isnull":
			query = query.Where(fmt.Sprintf("%s IS NULL", filter.Field))
		case "isnotnull":
			query = query.Where(fmt.Sprintf("%s IS NOT NULL", filter.Field))
		case "between":
			values := strings.Split(filter.Value, ",")
			if len(values) == 2 {
				query = query.Where(fmt.Sprintf("%s BETWEEN ? AND ?", filter.Field), values[0], values[1])
			}
		}
	}

	// Apply standard conditions
	if len(conditions) > 0 {
		query = query.Where(conditions)
	}

	// Count total before pagination
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, nil, err
	}

	// Apply sorting
	for _, sort := range opts.Sorts {
		direction := "ASC"
		if sort.Order == DESC {
			direction = "DESC"
		}
		query = query.Order(fmt.Sprintf("%s %s", sort.Field, direction))
	}

	// Apply pagination
	if opts.Pagination != nil {
		if opts.Pagination.Page < 1 {
			opts.Pagination.Page = 1
		}
		if opts.Pagination.PageSize < 1 {
			opts.Pagination.PageSize = 10
		}
		offset := (opts.Pagination.Page - 1) * opts.Pagination.PageSize
		query = query.Offset(offset).Limit(opts.Pagination.PageSize)
	}

	// Execute query
	if err := query.Find(&entities).Error; err != nil {
		return nil, nil, err
	}

	// Update pagination total
	pagination := opts.Pagination
	if pagination != nil {
		pagination.Total = total
	}

	return entities, pagination, nil
}

// buildSearchQuery builds a search query for multiple fields
func (r *BaseRepository[T]) buildSearchQuery(search *SearchOptions) string {
	if len(search.Fields) == 0 || search.Term == "" {
		return ""
	}

	var conditions []string
	for _, field := range search.Fields {
		conditions = append(conditions, fmt.Sprintf("%s LIKE '%%%s%%'", field, search.Term))
	}
	return strings.Join(conditions, " OR ")
}

// Transaction executes operations in a transaction
func (r *BaseRepository[T]) Transaction(fn func(tx *gorm.DB) error) error {
	return r.db.Transaction(fn)
}

// BulkCreate creates multiple records in a single transaction
func (r *BaseRepository[T]) BulkCreate(entities []T) error {
	return r.db.Create(&entities).Error
}

// BulkUpdate updates multiple records in a single transaction
func (r *BaseRepository[T]) BulkUpdate(entities []T) error {
	return r.Transaction(func(tx *gorm.DB) error {
		for _, entity := range entities {
			if err := tx.Save(&entity).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

// BulkDelete deletes multiple records by IDs
func (r *BaseRepository[T]) BulkDelete(ids []uint) error {
	var entity T
	return r.db.Delete(&entity, ids).Error
}
