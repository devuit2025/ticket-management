package handlers

import (
	"net/http"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"

	"github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
	user := c.MustGet("user").(*models.User)
	c.JSON(http.StatusOK, user)
}

func UpdateProfile(c *gin.Context) {
	user := c.MustGet("user").(*models.User)

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

	if err := config.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}
