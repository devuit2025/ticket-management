package handlers

import (
	"net/http"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/utils"

	"github.com/gin-gonic/gin"
)

// GetUsers returns list of users with optional filters
func GetUsers(c *gin.Context) {
	userRepo := repository.NewUserRepository(config.DB)

	// Get query parameters
	phone := c.Query("phone")
	role := c.Query("role")

	// Build filter
	filter := make(map[string]interface{})
	if phone != "" {
		filter["phone"] = phone
	}
	if role != "" {
		filter["role"] = role
	}

	users, err := userRepo.FindAll(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"total": len(users),
	})
}

// GetStatistics returns system statistics
func GetStatistics(c *gin.Context) {
	// Get repositories
	userRepo := repository.NewUserRepository(config.DB)
	routeRepo := repository.NewRouteRepository(config.DB)
	tripRepo := repository.NewTripRepository(config.DB)
	bookingRepo := repository.NewBookingRepository(config.DB)

	// Get total users
	users, err := userRepo.FindAll(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Count users by role
	userStats := make(map[string]int)
	for _, user := range users {
		userStats[string(user.Role)]++
	}

	// Get total routes
	routes, err := routeRepo.FindAll(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Get total trips
	trips, err := tripRepo.FindAll(nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Get total bookings
	bookings, total, err := bookingRepo.FindAll(nil, 1, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Get total revenue
	var totalRevenue float64
	for _, booking := range bookings {
		if booking.Status == models.BookingStatusConfirmed && booking.PaymentStatus == models.PaymentStatusPaid {
			totalRevenue += booking.TotalAmount
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"total_users":    len(users),
		"users_by_role":  userStats,
		"total_routes":   len(routes),
		"total_trips":    len(trips),
		"total_bookings": total,
		"total_revenue":  totalRevenue,
	})
}

func UpdateUserRole(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var req struct {
		Role models.Role `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate role
	validRoles := []models.Role{models.RoleAdmin, models.RoleStaff, models.RoleDriver, models.RoleCustomer}
	isValidRole := false
	for _, role := range validRoles {
		if req.Role == role {
			isValidRole = true
			break
		}
	}
	if !isValidRole {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		return
	}

	user.Role = req.Role
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	c.JSON(http.StatusOK, user)
}
