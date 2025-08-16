package filters

import (
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// FilterBuilder helps build and apply filters
type FilterBuilder struct {
	fields map[string]FilterField
}

// NewFilterBuilder creates a new FilterBuilder
func NewFilterBuilder(fields map[string]FilterField) *FilterBuilder {
	return &FilterBuilder{
		fields: fields,
	}
}

// BuildFromContext builds filters from gin context
func (b *FilterBuilder) BuildFromContext(c *gin.Context) ([]FilterCondition, error) {
	var filters []FilterCondition

	// Get all query parameters
	for field, def := range b.fields {
		if value := c.Query(field); value != "" {
			// Get operation from query or use default
			operation := c.Query(field + "_op")
			if operation == "" {
				operation = def.Operation
			}

			// Validate value if needed
			var finalValue interface{} = value
			if def.Validate != nil {
				var ok bool
				finalValue, ok = def.Validate(value)
				if !ok {
					return nil, fmt.Errorf("invalid value for field %s", field)
				}
			} else {
				// Convert value based on type
				var err error
				finalValue, err = convertValue(value, def.Type)
				if err != nil {
					return nil, fmt.Errorf("invalid value for field %s: %v", field, err)
				}
			}

			filters = append(filters, FilterCondition{
				Field:     field,
				Operation: operation,
				Value:     finalValue,
			})
		}
	}

	return filters, nil
}

// ApplyFilters applies filters to the query
func (b *FilterBuilder) ApplyFilters(query *gorm.DB, filters []FilterCondition) *gorm.DB {
	for _, filter := range filters {
		def := b.fields[filter.Field]
		query = applyFilter(query, filter, def)
	}
	return query
}

// applyFilter applies a single filter to the query
func applyFilter(query *gorm.DB, filter FilterCondition, def FilterField) *gorm.DB {
	switch filter.Operation {
	case OpEqual:
		return query.Where(fmt.Sprintf("%s = ?", filter.Field), filter.Value)
	case OpNotEqual:
		return query.Where(fmt.Sprintf("%s != ?", filter.Field), filter.Value)
	case OpGreaterThan:
		return query.Where(fmt.Sprintf("%s > ?", filter.Field), filter.Value)
	case OpGreaterThanOrEqual:
		return query.Where(fmt.Sprintf("%s >= ?", filter.Field), filter.Value)
	case OpLessThan:
		return query.Where(fmt.Sprintf("%s < ?", filter.Field), filter.Value)
	case OpLessThanOrEqual:
		return query.Where(fmt.Sprintf("%s <= ?", filter.Field), filter.Value)
	case OpLike:
		return query.Where(fmt.Sprintf("%s LIKE ?", filter.Field), fmt.Sprintf("%%%v%%", filter.Value))
	case OpIn:
		if strValue, ok := filter.Value.(string); ok {
			values := strings.Split(strValue, ",")
			return query.Where(fmt.Sprintf("%s IN (?)", filter.Field), values)
		}
		return query.Where(fmt.Sprintf("%s IN (?)", filter.Field), filter.Value)
	case OpNotIn:
		if strValue, ok := filter.Value.(string); ok {
			values := strings.Split(strValue, ",")
			return query.Where(fmt.Sprintf("%s NOT IN (?)", filter.Field), values)
		}
		return query.Where(fmt.Sprintf("%s NOT IN (?)", filter.Field), filter.Value)
	case OpIsNull:
		return query.Where(fmt.Sprintf("%s IS NULL", filter.Field))
	case OpIsNotNull:
		return query.Where(fmt.Sprintf("%s IS NOT NULL", filter.Field))
	case OpBetween:
		if strValue, ok := filter.Value.(string); ok {
			values := strings.Split(strValue, ",")
			if len(values) == 2 {
				return query.Where(fmt.Sprintf("%s BETWEEN ? AND ?", filter.Field), values[0], values[1])
			}
		}
	}
	return query
}

// convertValue converts a string value to the appropriate type
func convertValue(value string, fieldType string) (interface{}, error) {
	switch fieldType {
	case TypeString:
		return value, nil
	case TypeInt:
		return parseInt(value)
	case TypeFloat:
		return parseFloat(value)
	case TypeBoolean:
		return parseBoolean(value)
	case TypeDate:
		return parseDate(value)
	default:
		return value, nil
	}
}

// Helper functions for type conversion
func parseInt(value string) (interface{}, error) {
	// Add implementation
	return value, nil
}

func parseFloat(value string) (interface{}, error) {
	// Add implementation
	return value, nil
}

func parseBoolean(value string) (interface{}, error) {
	// Add implementation
	return value, nil
}

func parseDate(value string) (interface{}, error) {
	// Add implementation
	return time.Parse("2006-01-02", value)
}
