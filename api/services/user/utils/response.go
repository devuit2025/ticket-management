package utils

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type APIResponse struct {
	Code    int         `json:"code"`    // HTTP status code
	Message string      `json:"message"` // Custom message
	Data    interface{} `json:"data"`    // Actual data
}

// Success response
func RespondSuccess(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, APIResponse{
		Code:    http.StatusOK,
		Message: message,
		Data:    data,
	})
}

// Error response
func RespondError(c *gin.Context, code int, message string, data interface{}) {
	c.JSON(code, APIResponse{
		Code:    code,
		Message: message,
		Data:    data,
	})
}
