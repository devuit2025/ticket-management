package handlers

import (
	"net/http"
	"strconv"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/utils"

	"github.com/gin-gonic/gin"
)

type CreateBusRequest struct {
	PlateNumber string `json:"plate_number" binding:"required"`
	Type        string `json:"type" binding:"required"`
	SeatCount   int    `json:"seat_count" binding:"required,gt=0"`
	FloorCount  int    `json:"floor_count" binding:"required,gt=0,lte=2"`
}

type UpdateBusRequest struct {
	Type       string `json:"type"`
	SeatCount  int    `json:"seat_count" binding:"omitempty,gt=0"`
	FloorCount int    `json:"floor_count" binding:"omitempty,gt=0,lte=2"`
	IsActive   *bool  `json:"is_active"`
}

type BusResponse struct {
	ID          uint   `json:"id"`
	PlateNumber string `json:"plate_number"`
	Type        string `json:"type"`
	SeatCount   int    `json:"seat_count"`
	FloorCount  int    `json:"floor_count"`
	IsActive    bool   `json:"is_active"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

// CreateBus creates a new bus
func CreateBus(c *gin.Context) {
	var req CreateBusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if err.Error() == "Key: 'CreateBusRequest.SeatCount' Error:Field validation for 'SeatCount' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Số ghế phải lớn hơn 0"})
			return
		}
		if err.Error() == "Key: 'CreateBusRequest.FloorCount' Error:Field validation for 'FloorCount' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Số tầng phải lớn hơn 0"})
			return
		}
		if err.Error() == "Key: 'CreateBusRequest.FloorCount' Error:Field validation for 'FloorCount' failed on the 'lte' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Số tầng không được quá 2"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	// Validate plate number format
	if !utils.ValidatePlateNumber(req.PlateNumber) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Biển số xe không hợp lệ"})
		return
	}

	busRepo := repository.NewBusRepository(config.DB)

	// Check if plate number exists
	exists, err := busRepo.Exists(map[string]interface{}{
		"plate_number": req.PlateNumber,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}
	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Biển số xe đã tồn tại"})
		return
	}

	bus := models.Bus{
		PlateNumber: req.PlateNumber,
		Type:        req.Type,
		SeatCount:   req.SeatCount,
		FloorCount:  req.FloorCount,
		IsActive:    true,
	}

	if err := busRepo.Create(&bus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tạo xe thành công",
		"bus":     formatBusResponse(&bus),
	})
}

// GetBuses returns list of buses with optional filters
func GetBuses(c *gin.Context) {
	busRepo := repository.NewBusRepository(config.DB)

	// Get query parameters
	plateNumber := c.Query("plate_number")
	busType := c.Query("type")
	isActive := c.Query("is_active")

	// Build filter
	filter := make(map[string]interface{})
	if plateNumber != "" {
		filter["plate_number"] = plateNumber
	}
	if busType != "" {
		filter["type"] = busType
	}
	if isActive != "" {
		filter["is_active"] = isActive == "true"
	}

	buses, err := busRepo.FindAll(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Format response
	response := make([]BusResponse, len(buses))
	for i, bus := range buses {
		response[i] = *formatBusResponse(&bus)
	}

	c.JSON(http.StatusOK, gin.H{
		"buses": response,
		"total": len(response),
	})
}

// GetBus returns a single bus by ID
func GetBus(c *gin.Context) {
	busRepo := repository.NewBusRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	bus, err := busRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy xe"})
		return
	}

	c.JSON(http.StatusOK, formatBusResponse(bus))
}

// UpdateBus updates a bus
func UpdateBus(c *gin.Context) {
	var req UpdateBusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if err.Error() == "Key: 'UpdateBusRequest.SeatCount' Error:Field validation for 'SeatCount' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Số ghế phải lớn hơn 0"})
			return
		}
		if err.Error() == "Key: 'UpdateBusRequest.FloorCount' Error:Field validation for 'FloorCount' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Số tầng phải lớn hơn 0"})
			return
		}
		if err.Error() == "Key: 'UpdateBusRequest.FloorCount' Error:Field validation for 'FloorCount' failed on the 'lte' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Số tầng không được quá 2"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	busRepo := repository.NewBusRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	bus, err := busRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy xe"})
		return
	}

	// Update fields if provided
	if req.Type != "" {
		bus.Type = req.Type
	}
	if req.SeatCount != 0 {
		bus.SeatCount = req.SeatCount
	}
	if req.FloorCount != 0 {
		bus.FloorCount = req.FloorCount
	}
	if req.IsActive != nil {
		bus.IsActive = *req.IsActive
	}

	if err := busRepo.Update(bus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cập nhật xe thành công",
		"bus":     formatBusResponse(bus),
	})
}

// DeleteBus soft deletes a bus
func DeleteBus(c *gin.Context) {
	busRepo := repository.NewBusRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Check if bus exists
	if _, err := busRepo.FindByID(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy xe"})
		return
	}

	if err := busRepo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Xóa xe thành công"})
}

// Helper function to format bus response
func formatBusResponse(bus *models.Bus) *BusResponse {
	return &BusResponse{
		ID:          bus.ID,
		PlateNumber: bus.PlateNumber,
		Type:        bus.Type,
		SeatCount:   bus.SeatCount,
		FloorCount:  bus.FloorCount,
		IsActive:    bus.IsActive,
		CreatedAt:   bus.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:   bus.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}
