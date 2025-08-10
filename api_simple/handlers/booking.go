package handlers

import (
	"net/http"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"

	"github.com/gin-gonic/gin"
)

type CreateBookingRequest struct {
	TripID      uint   `json:"trip_id" binding:"required"`
	SeatID      uint   `json:"seat_id" binding:"required"`
	PhoneNumber string `json:"phone_number" binding:"required"`
	Name        string `json:"name" binding:"required"`
}

func CreateBooking(c *gin.Context) {
	var req CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start transaction
	tx := config.DB.Begin()

	// Check if seat is available
	var seat models.Seat
	if err := tx.Where("id = ? AND status = ?", req.SeatID, "vacant").First(&seat).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Seat is not available"})
		return
	}

	// Get or create user
	var user models.User
	var userID uint

	// Try to get existing user by phone
	if err := tx.Where("phone = ?", req.PhoneNumber).First(&user).Error; err == nil {
		userID = user.ID
	} else {
		// Create new user if not exists
		user = models.User{
			Phone: req.PhoneNumber,
			Name:  req.Name,
			Role:  models.RoleCustomer,
		}
		if err := tx.Create(&user).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
		userID = user.ID
	}

	// Create booking
	booking := models.Booking{
		UserID: userID,
		TripID: req.TripID,
		SeatID: req.SeatID,
		Status: models.BookingStatusPending,
	}

	if err := tx.Create(&booking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	// Update seat status
	seat.Status = "booked"
	if err := tx.Save(&seat).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seat status"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusCreated, booking)
}

func GetUserBookings(c *gin.Context) {
	user := c.MustGet("user").(*models.User)
	var bookings []models.Booking

	result := config.DB.Where("user_id = ?", user.ID).
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

func GetBooking(c *gin.Context) {
	id := c.Param("id")
	phoneNumber := c.Query("phone_number")

	var booking models.Booking
	result := config.DB.Preload("User").
		Preload("Trip.Route").
		Preload("Trip.Bus").
		Preload("Seat").
		Joins("JOIN users ON users.id = bookings.user_id").
		Where("bookings.id = ? AND users.phone = ?", id, phoneNumber).
		First(&booking)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

func CancelBooking(c *gin.Context) {
	id := c.Param("id")
	phoneNumber := c.Query("phone_number")

	tx := config.DB.Begin()

	var booking models.Booking
	if err := tx.Preload("User").
		Joins("JOIN users ON users.id = bookings.user_id").
		Where("bookings.id = ? AND users.phone = ?", id, phoneNumber).
		First(&booking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	if booking.Status == models.BookingStatusCanceled {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Booking is already canceled"})
		return
	}

	// Update booking status
	booking.Status = models.BookingStatusCanceled
	if err := tx.Save(&booking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel booking"})
		return
	}

	// Update seat status back to vacant
	if err := tx.Model(&models.Seat{}).Where("id = ?", booking.SeatID).Update("status", "vacant").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seat status"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"id":     booking.ID,
		"status": booking.Status,
	})
}
