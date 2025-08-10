package handlers

import (
	"net/http"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/filters"
	"ticket-management/api_simple/models"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	var users []models.User
	query := config.DB.Model(&models.User{})

	// Create filter builder
	filterBuilder := filters.NewFilterBuilder(filters.UserFilterFields)

	// Build filters from request
	filterList, err := filterBuilder.BuildFromContext(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Apply filters
	query = filterBuilder.ApplyFilters(query, filterList)

	// Handle pagination
	pagination := &filters.Pagination{}
	if err := c.ShouldBindQuery(pagination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Apply pagination
	query, err = filters.ApplyPagination(query, pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to apply pagination"})
		return
	}

	// Execute query
	if err := query.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": users,
		"pagination": gin.H{
			"current_page": pagination.Page,
			"page_size":    pagination.PageSize,
			"total":        pagination.Total,
		},
	})
}

func GetAllBookings(c *gin.Context) {
	var bookings []models.Booking
	result := config.DB.Preload("User").
		Preload("Trip.Route").
		Preload("Trip.Bus").
		Preload("Seat").
		Preload("Payment").
		Find(&bookings)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, bookings)
}

type Statistics struct {
	TotalRevenue     float64 `json:"total_revenue"`
	CompletedTrips   int64   `json:"completed_trips"`
	PendingTrips     int64   `json:"pending_trips"`
	TotalBookings    int64   `json:"total_bookings"`
	PendingBookings  int64   `json:"pending_bookings"`
	CanceledBookings int64   `json:"canceled_bookings"`
}

func GetStatistics(c *gin.Context) {
	var stats Statistics

	// Calculate total revenue from completed payments
	config.DB.Model(&models.Payment{}).
		Where("status = ?", models.PaymentStatusCompleted).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&stats.TotalRevenue)

	// Count trips by status
	config.DB.Model(&models.Trip{}).
		Where("status = ?", models.TripStatusCompleted).
		Count(&stats.CompletedTrips)

	config.DB.Model(&models.Trip{}).
		Where("status IN ?", []models.TripStatus{models.TripStatusUpcoming, models.TripStatusInProgress}).
		Count(&stats.PendingTrips)

	// Count bookings by status
	config.DB.Model(&models.Booking{}).Count(&stats.TotalBookings)

	config.DB.Model(&models.Booking{}).
		Where("status = ?", models.BookingStatusPending).
		Count(&stats.PendingBookings)

	config.DB.Model(&models.Booking{}).
		Where("status = ?", models.BookingStatusCanceled).
		Count(&stats.CanceledBookings)

	c.JSON(http.StatusOK, stats)
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
