package filters

import (
	"gorm.io/gorm"
)

// FilterField defines the structure of a filter field
type FilterField struct {
	Type      string                                 // Type of the field (string, int, bool, etc.)
	Operation string                                 // Default operation (eq, neq, gt, lt, like, etc.)
	Validate  func(value string) (interface{}, bool) // Optional validation function
}

// FilterCondition represents a single filter condition
type FilterCondition struct {
	Field     string
	Operation string
	Value     interface{}
}

// Pagination defines the pagination parameters
type Pagination struct {
	Page     int   `form:"page,default=1"`
	PageSize int   `form:"page_size,default=10"`
	Total    int64 `json:"total"`
}

// ApplyPagination applies pagination to the query
func ApplyPagination(query *gorm.DB, p *Pagination) (*gorm.DB, error) {
	// Count total before pagination
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	// Set default values if needed
	if p.Page < 1 {
		p.Page = 1
	}
	if p.PageSize < 1 {
		p.PageSize = 10
	}

	// Calculate offset
	offset := (p.Page - 1) * p.PageSize

	// Update total
	p.Total = total

	// Apply pagination
	return query.Offset(offset).Limit(p.PageSize), nil
}
