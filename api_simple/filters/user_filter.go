package filters

import (
	"ticket-management/api_simple/models"
)

// UserFilterFields defines the available fields and their operations for User filtering
var UserFilterFields = map[string]FilterField{
	"role": {
		Type:      TypeEnum,
		Operation: OpEqual,
		Validate: func(value string) (interface{}, bool) {
			validRoles := map[string]models.Role{
				"admin":    models.RoleAdmin,
				"staff":    models.RoleStaff,
				"driver":   models.RoleDriver,
				"customer": models.RoleCustomer,
			}
			if role, ok := validRoles[value]; ok {
				return role, true
			}
			return nil, false
		},
	},
	"phone": {
		Type:      TypeString,
		Operation: OpEqual,
	},
	"name": {
		Type:      TypeString,
		Operation: OpLike,
	},
}
