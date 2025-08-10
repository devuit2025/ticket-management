package handlers

import (
	"net/http"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"

	"github.com/gin-gonic/gin"
)

type CreateTripRequest struct {
	RouteID       uint      `json:"route_id" binding:"required"`
	BusID         uint      `json:"bus_id" binding:"required"`
	DriverID      uint      `json:"driver_id" binding:"required"`
	DepartureTime time.Time `json:"departure_time" binding:"required"`
	Price         float64   `json:"price" binding:"required"`
}

func GetTrips(c *gin.Context) {
	var trips []models.Trip
	result := config.DB.Preload("Route").Preload("Bus").Preload("Driver").Find(&trips)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch trips"})
		return
	}

	c.JSON(http.StatusOK, trips)
}

func GetTrip(c *gin.Context) {
	id := c.Param("id")
	var trip models.Trip
	result := config.DB.Preload("Route").Preload("Bus").Preload("Driver").First(&trip, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trip not found"})
		return
	}

	// Get available seats
	var seats []models.Seat
	if err := config.DB.Where("trip_id = ?", trip.ID).Find(&seats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch seats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"trip":  trip,
		"seats": seats,
	})
}

func CreateTrip(c *gin.Context) {
	var req CreateTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate route exists
	var route models.Route
	if err := config.DB.First(&route, req.RouteID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid route"})
		return
	}

	// Validate bus exists
	var bus models.Bus
	if err := config.DB.First(&bus, req.BusID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bus"})
		return
	}

	// Validate driver exists and is a driver
	var driver models.User
	if err := config.DB.First(&driver, req.DriverID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver"})
		return
	}
	if driver.Role != models.RoleDriver {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User is not a driver"})
		return
	}

	trip := models.Trip{
		RouteID:       req.RouteID,
		BusID:         req.BusID,
		DriverID:      req.DriverID,
		DepartureTime: req.DepartureTime,
		Price:         req.Price,
		Status:        models.TripStatusUpcoming,
	}

	tx := config.DB.Begin()

	if err := tx.Create(&trip).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create trip"})
		return
	}

	// Create seats for the trip
	for i := 1; i <= bus.SeatCount; i++ {
		seat := models.Seat{
			TripID: trip.ID,
			Number: i,
			Status: "vacant",
		}
		if err := tx.Create(&seat).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create seats"})
			return
		}
	}

	tx.Commit()

	c.JSON(http.StatusCreated, trip)
}

func UpdateTrip(c *gin.Context) {
	id := c.Param("id")
	var trip models.Trip
	if err := config.DB.First(&trip, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trip not found"})
		return
	}

	var req CreateTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	trip.RouteID = req.RouteID
	trip.BusID = req.BusID
	trip.DriverID = req.DriverID
	trip.DepartureTime = req.DepartureTime
	trip.Price = req.Price

	if err := config.DB.Save(&trip).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update trip"})
		return
	}

	c.JSON(http.StatusOK, trip)
}

func DeleteTrip(c *gin.Context) {
	id := c.Param("id")
	var trip models.Trip
	if err := config.DB.First(&trip, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trip not found"})
		return
	}

	if err := config.DB.Delete(&trip).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete trip"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Trip deleted successfully"})
}
