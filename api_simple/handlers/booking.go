package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateBookingRequest struct {
	User        *models.User       `json:"user" binding:"required"`
	UserId      *uint              `json:"user_id" binding:"required"`
	TripID      uint               `json:"trip_id" binding:"required"`
	SeatIDs     []int64            `json:"seat_ids" binding:"required,min=1"`
	PaymentType models.PaymentType `json:"payment_type" binding:"required,oneof=cash"`
	GuestInfo   *models.GuestInfo  `json:"guest_info"` // Required for non-logged-in users
	Note        string             `json:"note"`
}

type UpdatePaymentRequest struct {
	PaymentStatus models.PaymentStatus `json:"payment_status" binding:"required,oneof=paid refunded"`
}

// CreateBooking creates a new booking
func CreateBooking(c *gin.Context) {
	var req CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Printf("DEBUG: CreateBooking validation error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	fmt.Printf("DEBUG: CreateBooking request: %+v\n", req)

	// Get repositories
	bookingRepo := repository.NewBookingRepository(config.DB)
	tripRepo := repository.NewTripRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get trip
	trip, err := tripRepo.FindByID(req.TripID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chuyến đi"})
		return
	}

	// Check if trip is available
	if !trip.IsActive || trip.IsCompleted {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Chuyến đi không khả dụng"})
		return
	}

	// Check if seats exist and are available
	seats, err := seatRepo.FindByIDs(req.TripID, req.SeatIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}
	if len(seats) != len(req.SeatIDs) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Một số ghế không tồn tại"})
		return
	}
	for _, seat := range seats {
		if seat.Status != models.SeatStatusAvailable {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Một số ghế đã được đặt"})
			return
		}
	}

	// Check for conflicting bookings
	conflictingBookings, err := bookingRepo.FindConflictingBookings(req.TripID, req.SeatIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}
	if len(conflictingBookings) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Một số ghế đã được đặt"})
		return
	}

	// Calculate total amount
	var totalAmount float64
	for _, seat := range seats {
		totalAmount += seat.Price
	}

	// Create booking
	booking := &models.Booking{
		UserID:        req.UserId,
		User:          req.User,
		TripID:        req.TripID,
		SeatIDs:       req.SeatIDs,
		TotalAmount:   totalAmount,
		PaymentType:   req.PaymentType,
		PaymentStatus: models.PaymentStatusUnpaid,
		Status:        models.BookingStatusPending,
		Note:          req.Note,
	}

	// Set user or guest info
	if user, exists := c.Get("user"); exists {
		userID := user.(*models.User).ID
		booking.UserID = &userID
	} else {
		if req.GuestInfo == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng cung cấp thông tin khách hàng"})
			return
		}
		if err := validateGuestInfo(req.GuestInfo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		booking.GuestInfo = req.GuestInfo
	}

	// Validate booking
	if err := booking.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create booking in transaction
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// Create booking
		if err := bookingRepo.Create(booking); err != nil {
			return err
		}

		// Update seat status
		for _, seatID := range req.SeatIDs {
			if err := seatRepo.UpdateStatus(uint(seatID), models.SeatStatusBooked); err != nil {
				return err
			}
		}

		// Update trip booked seats count
		trip.BookedSeats += len(req.SeatIDs)
		if err := tripRepo.Update(trip); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Đặt vé thành công",
		"booking": booking,
	})
}

// GetBookingByCode gets a booking by its code
func GetBookingByCode(c *gin.Context) {
	code := c.Param("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng cung cấp mã đặt vé"})
		return
	}

	bookingRepo := repository.NewBookingRepository(config.DB)
	booking, err := bookingRepo.FindByCode(code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn đặt vé"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// GetUserBookings gets all bookings for the authenticated user
func GetUserBookings(c *gin.Context) {
	user := c.MustGet("user").(*models.User)
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	bookingRepo := repository.NewBookingRepository(config.DB)
	bookings, total, err := bookingRepo.FindByUserID(user.ID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookings": bookings,
		"total":    total,
	})
}

// GetAllBookings gets all bookings (admin only)
func GetAllBookings(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Build filters
	filters := make(map[string]interface{})
	if status := c.Query("status"); status != "" {
		filters["status"] = status
	}
	if paymentStatus := c.Query("payment_status"); paymentStatus != "" {
		filters["payment_status"] = paymentStatus
	}

	bookingRepo := repository.NewBookingRepository(config.DB)
	bookings, total, err := bookingRepo.FindAll(filters, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookings": bookings,
		"total":    total,
	})
}

// CancelBooking cancels a booking
func CancelBooking(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get repositories
	bookingRepo := repository.NewBookingRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)
	tripRepo := repository.NewTripRepository(config.DB)

	// Get booking
	booking, err := bookingRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn đặt vé"})
		return
	}

	// Check if user owns the booking
	user := c.MustGet("user").(*models.User)
	if booking.UserID != nil && *booking.UserID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Không có quyền hủy đơn này"})
		return
	}

	// Check if booking can be cancelled
	if booking.Status == models.BookingStatusCancelled {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Đơn đã được hủy"})
		return
	}
	if booking.Status == models.BookingStatusConfirmed {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không thể hủy đơn đã xác nhận"})
		return
	}

	// Cancel booking in transaction
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// Update booking status
		if err := bookingRepo.UpdateStatus(booking.ID, models.BookingStatusCancelled); err != nil {
			return err
		}

		// Update seat status
		for _, seatID := range booking.SeatIDs {
			if err := seatRepo.UpdateStatus(uint(seatID), models.SeatStatusAvailable); err != nil {
				return err
			}
		}

		// Update trip booked seats count
		trip, err := tripRepo.FindByID(booking.TripID)
		if err != nil {
			return err
		}
		trip.BookedSeats -= len(booking.SeatIDs)
		if err := tripRepo.Update(trip); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Hủy đơn thành công"})
}

// ConfirmBooking confirms a booking (admin only)
func ConfirmBooking(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	bookingRepo := repository.NewBookingRepository(config.DB)

	// Get booking
	booking, err := bookingRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn đặt vé"})
		return
	}

	// Check if booking can be confirmed
	if booking.Status != models.BookingStatusPending {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Chỉ có thể xác nhận đơn đang chờ"})
		return
	}
	// Remove payment status check - admin can confirm and mark as paid at the same time

	// Update booking status and payment status
	if err := bookingRepo.UpdateStatus(booking.ID, models.BookingStatusConfirmed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Also update payment status to paid when confirming
	if err := bookingRepo.UpdatePaymentStatus(booking.ID, models.PaymentStatusPaid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Debug: Log the update
	fmt.Printf("DEBUG: Updated booking ID %d - Status: %s, PaymentStatus: %s\n",
		booking.ID, models.BookingStatusConfirmed, models.PaymentStatusPaid)

	c.JSON(http.StatusOK, gin.H{"message": "Xác nhận đơn thành công"})
}

// UpdateBookingPayment updates booking payment status (admin only)
func UpdateBookingPayment(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	var req UpdatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	bookingRepo := repository.NewBookingRepository(config.DB)

	// Get booking
	booking, err := bookingRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn đặt vé"})
		return
	}

	// Update payment status
	if err := bookingRepo.UpdatePaymentStatus(booking.ID, req.PaymentStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cập nhật trạng thái thanh toán thành công"})
}

// validateGuestInfo validates guest information
func validateGuestInfo(info *models.GuestInfo) error {
	if info.Name == "" {
		return errors.New("tên khách hàng không được để trống")
	}
	if !utils.ValidatePhone(info.Phone) {
		return errors.New("số điện thoại không hợp lệ")
	}
	if info.Email != "" && !utils.ValidateEmail(info.Email) {
		return errors.New("email không hợp lệ")
	}
	return nil
}
