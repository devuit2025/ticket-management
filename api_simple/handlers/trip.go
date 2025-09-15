package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateTripRequest struct {
	RouteID       uint      `json:"route_id" binding:"required"`
	BusID         uint      `json:"bus_id" binding:"required"`
	DriverID      uint      `json:"driver_id" binding:"required"`
	DepartureTime time.Time `json:"departure_time" binding:"required"`
	Price         float64   `json:"price" binding:"required,gt=0"`
	Note          string    `json:"note"`
}

type UpdateTripRequest struct {
	DriverID      uint      `json:"driver_id"`
	DepartureTime time.Time `json:"departure_time"`
	Price         float64   `json:"price" binding:"omitempty,gt=0"`
	IsActive      *bool     `json:"is_active"`
	IsCompleted   *bool     `json:"is_completed"`
	Note          string    `json:"note"`
}

type TripResponse struct {
	ID            uint          `json:"id"`
	RouteID       uint          `json:"route_id"`
	Route         *models.Route `json:"route,omitempty"`
	BusID         uint          `json:"bus_id"`
	Bus           *models.Bus   `json:"bus,omitempty"`
	DriverID      uint          `json:"driver_id"`
	Driver        *models.User  `json:"driver,omitempty"`
	DepartureTime string        `json:"departure_time"`
	Price         float64       `json:"price"`
	IsActive      bool          `json:"is_active"`
	IsCompleted   bool          `json:"is_completed"`
	TotalSeats    int           `json:"total_seats"`
	BookedSeats   int           `json:"booked_seats"`
	Note          string        `json:"note"`
	CreatedAt     string        `json:"created_at"`
	UpdatedAt     string        `json:"updated_at"`
}

// SearchTrips searches trips with filters
func SearchTrips(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)

	// Get query parameters
	routeID, _ := strconv.ParseUint(c.Query("route_id"), 10, 64)
	fromDate := c.Query("from_date")
	toDate := c.Query("to_date")
	minPrice, _ := strconv.ParseFloat(c.Query("min_price"), 64)
	maxPrice, _ := strconv.ParseFloat(c.Query("max_price"), 64)

	// Build filters
	filters := make(map[string]interface{})
	if routeID > 0 {
		filters["route_id"] = routeID
	}
	if minPrice > 0 {
		filters["price >= ?"] = minPrice
	}
	if maxPrice > 0 {
		filters["price <= ?"] = maxPrice
	}
	filters["is_active"] = true
	filters["is_completed"] = false

	// Parse dates
	var fromTime, toTime *time.Time
	if fromDate != "" {
		if t, err := time.Parse(time.RFC3339, fromDate); err == nil {
			fromTime = &t
		}
	}
	if toDate != "" {
		if t, err := time.Parse(time.RFC3339, toDate); err == nil {
			toTime = &t
		}
	}

	trips, err := tripRepo.SearchTrips(filters, fromTime, toTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Format response
	response := make([]TripResponse, len(trips))
	for i, trip := range trips {
		response[i] = *formatTripResponse(&trip)
	}

	c.JSON(http.StatusOK, gin.H{
		"trips": response,
		"total": len(response),
	})
}

// GetAvailableTrips returns available trips for a route and date
func GetAvailableTrips(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)

	// Get query parameters
	routeID, err := strconv.ParseUint(c.Query("route_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tuyến đường không hợp lệ"})
		return
	}

	date := c.Query("date")
	if date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng chọn ngày"})
		return
	}

	// Parse date
	departureDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Định dạng ngày không hợp lệ"})
		return
	}

	trips, err := tripRepo.FindAvailableTrips(uint(routeID), departureDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Format response
	response := make([]TripResponse, len(trips))
	for i, trip := range trips {
		response[i] = *formatTripResponse(&trip)
	}

	c.JSON(http.StatusOK, gin.H{
		"trips": response,
		"total": len(response),
	})
}

// GetTrip returns a single trip by ID
func GetTrip(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	trip, err := tripRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	c.JSON(http.StatusOK, formatTripResponse(trip))
}

// CreateTrip creates a new trip
func CreateTrip(c *gin.Context) {
	var req CreateTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if err.Error() == "Key: 'CreateTripRequest.Price' Error:Field validation for 'Price' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Giá vé phải lớn hơn 0"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	// Check if departure time is in the future
	if req.DepartureTime.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thời gian khởi hành phải ở tương lai"})
		return
	}

	trip := models.Trip{
		RouteID:       req.RouteID,
		BusID:         req.BusID,
		DriverID:      req.DriverID,
		DepartureTime: req.DepartureTime,
		Price:         req.Price,
		IsActive:      true,
		Note:          req.Note,
	}

	// Validate trip
	if err := trip.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tripRepo := repository.NewTripRepository(config.DB)
	if err := tripRepo.Create(&trip); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Create seats automatically based on bus configuration
	if err := createSeatsForTrip(&trip); err != nil {
		// If seat creation fails, delete the trip
		tripRepo.Delete(trip.ID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo ghế cho chuyến đi: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tạo chuyến đi thành công",
		"trip":    formatTripResponse(&trip),
	})
}

// UpdateTrip updates a trip
func UpdateTrip(c *gin.Context) {
	var req UpdateTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if err.Error() == "Key: 'UpdateTripRequest.Price' Error:Field validation for 'Price' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Giá vé phải lớn hơn 0"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	tripRepo := repository.NewTripRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	trip, err := tripRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Update fields if provided
	if req.DriverID != 0 {
		trip.DriverID = req.DriverID
	}
	if !req.DepartureTime.IsZero() {
		if req.DepartureTime.Before(time.Now()) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Thời gian khởi hành phải ở tương lai"})
			return
		}
		trip.DepartureTime = req.DepartureTime
	}
	if req.Price != 0 {
		trip.Price = req.Price
	}
	if req.IsActive != nil {
		trip.IsActive = *req.IsActive
	}
	if req.IsCompleted != nil {
		trip.IsCompleted = *req.IsCompleted
	}
	if req.Note != "" {
		trip.Note = req.Note
	}

	// Validate trip
	if err := trip.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := tripRepo.Update(trip); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cập nhật chuyến đi thành công",
		"trip":    formatTripResponse(trip),
	})
}

// DeleteTrip soft deletes a trip and related bookings
func DeleteTrip(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Check if trip exists
	trip, err := tripRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Delete in transaction to ensure data consistency
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// First, delete all bookings related to this trip
		if err := tx.Where("trip_id = ?", id).Delete(&models.Booking{}).Error; err != nil {
			return err
		}

		// Then delete all seats related to this trip
		if err := tx.Where("trip_id = ?", id).Delete(&models.Seat{}).Error; err != nil {
			return err
		}

		// Finally, delete the trip
		if err := tx.Delete(trip).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xóa chuyến đi và dữ liệu liên quan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "Xóa chuyến đi và tất cả booking liên quan thành công",
		"deleted_trip_id": id,
	})
}

// Helper function to format trip response
func formatTripResponse(trip *models.Trip) *TripResponse {
	return &TripResponse{
		ID:            trip.ID,
		RouteID:       trip.RouteID,
		Route:         trip.Route,
		BusID:         trip.BusID,
		Bus:           trip.Bus,
		DriverID:      trip.DriverID,
		Driver:        trip.Driver,
		DepartureTime: trip.DepartureTime.Format("2006-01-02 15:04:05"),
		Price:         trip.Price,
		IsActive:      trip.IsActive,
		IsCompleted:   trip.IsCompleted,
		TotalSeats:    trip.TotalSeats,
		BookedSeats:   trip.BookedSeats,
		Note:          trip.Note,
		CreatedAt:     trip.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:     trip.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}

// createSeatsForTrip creates seats automatically based on bus configuration
func createSeatsForTrip(trip *models.Trip) error {
	// Get bus information
	var bus models.Bus
	if err := config.DB.First(&bus, trip.BusID).Error; err != nil {
		return err
	}

	// Calculate seats per floor
	seatsPerFloor := bus.SeatCount
	if bus.FloorCount == 2 {
		seatsPerFloor = bus.SeatCount / 2
	}

	// Create seats for each floor
	for floor := 1; floor <= bus.FloorCount; floor++ {
		if err := createSeatsForFloor(trip.ID, floor, seatsPerFloor, trip.Price); err != nil {
			return err
		}
	}

	return nil
}

// createSeatsForFloor creates seats for a specific floor
func createSeatsForFloor(tripID uint, floor int, seatCount int, basePrice float64) error {
	floorPrefix := "A"
	if floor == 2 {
		floorPrefix = "B"
	}

	for i := 1; i <= seatCount; i++ {
		seatNumber := fmt.Sprintf("%s%02d", floorPrefix, i)
		seatType := models.SeatTypeSingle
		price := basePrice

		// Special seats (first 4 seats)
		if i <= 4 {
			seatType = models.SeatTypeSpecial
			price = basePrice * 1.2 // +20% for special
		}

		// Double seats (odd numbers)
		if i%2 != 0 {
			seatType = models.SeatTypeDouble
		}

		// Upstairs premium (+10% for floor 2)
		if floor == 2 {
			price = basePrice * 1.1
			if i <= 4 {
				price = basePrice * 1.3 // +30% for special upstairs
			}
		}

		seat := models.Seat{
			TripID: tripID,
			Number: seatNumber,
			Type:   seatType,
			Floor:  floor,
			Status: models.SeatStatusAvailable,
			Price:  price,
		}

		if err := config.DB.Create(&seat).Error; err != nil {
			return err
		}
	}

	return nil
}
