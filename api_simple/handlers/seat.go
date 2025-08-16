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

// GetTripSeats returns all seats for a trip
func GetTripSeats(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get trip ID from path
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get trip
	trip, err := tripRepo.FindByID(uint(tripID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Get seats
	seats, err := seatRepo.FindByTrip(uint(tripID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Group seats by floor
	seatsByFloor := make(map[int][]models.Seat)
	for _, seat := range seats {
		seatsByFloor[seat.Floor] = append(seatsByFloor[seat.Floor], seat)
	}

	// Format response
	floors := make([]map[string]interface{}, 0)
	for floor, seats := range seatsByFloor {
		floors = append(floors, map[string]interface{}{
			"floor": floor,
			"seats": seats,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"trip_info": map[string]interface{}{
			"id":             trip.ID,
			"route":          fmt.Sprintf("%s - %s", trip.Route.Origin, trip.Route.Destination),
			"departure_time": trip.DepartureTime.Format("2006-01-02 15:04:05"),
			"bus_type":       trip.Bus.Type,
			"base_price":     trip.Price,
		},
		"floors": floors,
	})
}

// GetAvailableSeats returns available seats for a trip
func GetAvailableSeats(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get trip ID from path
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get trip
	trip, err := tripRepo.FindByID(uint(tripID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Get available seats
	seats, err := seatRepo.FindAvailableByTrip(uint(tripID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Group seats by floor
	seatsByFloor := make(map[int][]models.Seat)
	for _, seat := range seats {
		seatsByFloor[seat.Floor] = append(seatsByFloor[seat.Floor], seat)
	}

	// Format response
	floors := make([]map[string]interface{}, 0)
	for floor, seats := range seatsByFloor {
		floors = append(floors, map[string]interface{}{
			"floor": floor,
			"seats": seats,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"trip_info": map[string]interface{}{
			"id":             trip.ID,
			"route":          fmt.Sprintf("%s - %s", trip.Route.Origin, trip.Route.Destination),
			"departure_time": trip.DepartureTime.Format("2006-01-02 15:04:05"),
			"bus_type":       trip.Bus.Type,
			"base_price":     trip.Price,
		},
		"floors": floors,
	})
}

// CheckSeatStatus checks if seats are available
func CheckSeatStatus(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get trip ID from path
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get trip
	_, err = tripRepo.FindByID(uint(tripID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Get seat IDs from request
	var seatIDs []int64
	if err := c.ShouldBindJSON(&seatIDs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng chọn ghế"})
		return
	}

	// Get seats
	seats, err := seatRepo.FindByIDs(uint(tripID), seatIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Check seat status
	seatStatus := make(map[string]string)
	for _, seat := range seats {
		seatStatus[seat.Number] = string(seat.Status)
	}

	c.JSON(http.StatusOK, gin.H{
		"seat_status": seatStatus,
	})
}

// LockSeats locks seats for a user
func LockSeats(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get trip ID from path
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get trip
	_, err = tripRepo.FindByID(uint(tripID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Get seat IDs from request
	var seatIDs []int64
	if err := c.ShouldBindJSON(&seatIDs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng chọn ghế"})
		return
	}

	// Get user ID from token if logged in
	var userID uint
	if user, exists := c.Get("user"); exists {
		userID = user.(*models.User).ID
	}

	// Lock seats in transaction
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// Get seats
		seats, err := seatRepo.FindByIDs(uint(tripID), seatIDs)
		if err != nil {
			return err
		}

		// Check if seats are available
		for _, seat := range seats {
			if seat.Status != models.SeatStatusAvailable {
				return fmt.Errorf("ghế %s đã được đặt", seat.Number)
			}
		}

		// Lock seats
		for _, seat := range seats {
			if err := seatRepo.LockSeat(seat.ID, userID, 15*time.Minute); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Khóa ghế thành công"})
}

// UnlockSeats unlocks seats
func UnlockSeats(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get trip ID from path
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get trip
	_, err = tripRepo.FindByID(uint(tripID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Get seat IDs from request
	var seatIDs []int64
	if err := c.ShouldBindJSON(&seatIDs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng chọn ghế"})
		return
	}

	// Get user ID from token if logged in
	var userID uint
	if user, exists := c.Get("user"); exists {
		userID = user.(*models.User).ID
	}

	// Unlock seats in transaction
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// Get seats
		seats, err := seatRepo.FindByIDs(uint(tripID), seatIDs)
		if err != nil {
			return err
		}

		// Check if seats are locked by this user
		for _, seat := range seats {
			if seat.Status != models.SeatStatusLocked {
				return fmt.Errorf("ghế %s không bị khóa", seat.Number)
			}
			if seat.LockedBy != nil && *seat.LockedBy != userID {
				return fmt.Errorf("ghế %s được khóa bởi người khác", seat.Number)
			}
		}

		// Unlock seats
		for _, seat := range seats {
			if err := seatRepo.UnlockSeat(seat.ID); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mở khóa ghế thành công"})
}

// CreateSeats creates seats for a trip
func CreateSeats(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get trip ID from path
	tripID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get trip
	trip, err := tripRepo.FindByID(uint(tripID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Get bus floor count
	floorCount := trip.Bus.FloorCount
	seatsPerFloor := trip.Bus.SeatCount / floorCount

	// Create seats in transaction
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		for floor := 1; floor <= floorCount; floor++ {
			for i := 1; i <= seatsPerFloor; i++ {
				// Determine seat type
				var seatType models.SeatType
				if i <= 4 { // First 4 seats are special
					seatType = models.SeatTypeSpecial
				} else if i%2 == 0 { // Even numbered seats are double
					seatType = models.SeatTypeDouble
				} else { // Odd numbered seats are single
					seatType = models.SeatTypeSingle
				}

				// Create seat
				seat := models.Seat{
					TripID: trip.ID,
					Number: fmt.Sprintf("%c%02d", 'A'+rune(floor-1), i),
					Floor:  floor,
					Type:   seatType,
					Status: models.SeatStatusAvailable,
				}

				if err := seatRepo.Create(&seat); err != nil {
					return err
				}
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Tạo ghế thành công"})
}
