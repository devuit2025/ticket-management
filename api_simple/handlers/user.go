package handlers

import (
	"net/http"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/utils"

	"github.com/gin-gonic/gin"
)

// GetProfile returns the profile of the currently authenticated user
func GetProfile(c *gin.Context) {
	// Get user ID from context (set by AuthMiddleware)
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": utils.ErrTokenRequired})
		return
	}

	// Convert userID safely
	var userID uint
	switch v := userIDInterface.(type) {
	case float64:
		userID = uint(v)
	case int:
		userID = uint(v)
	case uint:
		userID = v
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid userID type"})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)
	user, err := userRepo.FindByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Return only necessary fields
	c.JSON(http.StatusOK, gin.H{
		"id":        user.ID,
		"name":      user.Name,
		"phone":     user.Phone,
		"role":      user.Role,
		"status":    user.Status,
		"createdAt": user.CreatedAt,
		"updatedAt": user.UpdatedAt,
	})
}

// UpdateProfile allows updating name and phone only
func UpdateProfile(c *gin.Context) {
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID, ok := userIDInterface.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)
	user, err := userRepo.FindByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var req struct {
		Name  string `json:"name"`
		Phone string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}

	if err := userRepo.Update(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":        user.ID,
		"name":      user.Name,
		"phone":     user.Phone,
		"role":      user.Role,
		"status":    user.Status,
		"createdAt": user.CreatedAt,
		"updatedAt": user.UpdatedAt,
	})
}
