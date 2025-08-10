package filters

// Filter operations
const (
	OpEqual              = "eq"
	OpNotEqual           = "neq"
	OpGreaterThan        = "gt"
	OpGreaterThanOrEqual = "gte"
	OpLessThan           = "lt"
	OpLessThanOrEqual    = "lte"
	OpLike               = "like"
	OpIn                 = "in"
	OpNotIn              = "notin"
	OpIsNull             = "isnull"
	OpIsNotNull          = "isnotnull"
	OpBetween            = "between"
)

// Field types
const (
	TypeString  = "string"
	TypeInt     = "int"
	TypeFloat   = "float"
	TypeBoolean = "bool"
	TypeDate    = "date"
	TypeEnum    = "enum"
)
