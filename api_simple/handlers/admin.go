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
	bookings, total, err := bookingRepo.FindAll(nil, 1, 1000) // Get all bookings for revenue calculation
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

// ==================== ADMIN DASHBOARD APIs ====================

// GetDashboardStats returns dashboard statistics
func GetDashboardStats(c *gin.Context) {
	// Get repositories
	userRepo := repository.NewUserRepository(config.DB)
	tripRepo := repository.NewTripRepository(config.DB)
	bookingRepo := repository.NewBookingRepository(config.DB)

	// Get total users
	users, err := userRepo.FindAll(nil)
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
	bookings, totalBookings, err := bookingRepo.FindAll(nil, 1, 1000) // Get all bookings for revenue calculation
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Calculate today's revenue
	today := time.Now().Format("2006-01-02")
	var todayRevenue float64
	var todayBookings int
	var totalRevenue float64

	for _, booking := range bookings {
		// Debug: Log each booking
		fmt.Printf("DEBUG: Booking ID %d - Status: %s, PaymentStatus: %s, Amount: %.2f, Date: %s\n",
			booking.ID, booking.Status, booking.PaymentStatus, booking.TotalAmount, booking.CreatedAt.Format("2006-01-02"))

		// Calculate total revenue
		if booking.Status == models.BookingStatusConfirmed && booking.PaymentStatus == models.PaymentStatusPaid {
			totalRevenue += booking.TotalAmount
			fmt.Printf("DEBUG: Added to total revenue: %.2f\n", booking.TotalAmount)
		}

		// Calculate today's revenue
		bookingDate := booking.CreatedAt.Format("2006-01-02")
		if bookingDate == today && booking.Status == models.BookingStatusConfirmed && booking.PaymentStatus == models.PaymentStatusPaid {
			todayRevenue += booking.TotalAmount
			todayBookings++
			fmt.Printf("DEBUG: Added to today revenue: %.2f\n", booking.TotalAmount)
		}
	}

	// Count cancelled bookings
	var cancelledBookings int
	for _, booking := range bookings {
		if booking.Status == models.BookingStatusCancelled {
			cancelledBookings++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"total_users":        len(users),
		"total_trips":        len(trips),
		"cancelled_bookings": cancelledBookings,
		"total_bookings":     totalBookings,
		"today_bookings":     todayBookings,
		"today_revenue":      todayRevenue,
		"total_revenue":      totalRevenue,
	})
}

// GetRecentActivity returns recent system activity
func GetRecentActivity(c *gin.Context) {
	bookingRepo := repository.NewBookingRepository(config.DB)

	// Get recent bookings (last 10)
	bookings, _, err := bookingRepo.FindAll(nil, 1, 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	var activities []gin.H
	for _, booking := range bookings {
		activity := gin.H{
			"id":        booking.ID,
			"type":      "booking",
			"message":   generateActivityMessage(booking),
			"timestamp": booking.CreatedAt,
			"status":    string(booking.Status),
		}
		activities = append(activities, activity)
	}

	c.JSON(http.StatusOK, gin.H{
		"activities": activities,
		"total":      len(activities),
	})
}

// ==================== ADMIN TRIPS APIs ====================

// GetAdminTrips returns trips with admin filters
func GetAdminTrips(c *gin.Context) {
	tripRepo := repository.NewTripRepository(config.DB)

	// Get query parameters
	status := c.Query("status")
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)

	// Build filter
	filter := make(map[string]interface{})
	if status != "" {
		filter["status"] = status
	}

	trips, err := tripRepo.FindAll(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"trips": trips,
		"total": len(trips),
		"page":  page,
		"limit": limit,
	})
}

// ==================== ADMIN BOOKINGS APIs ====================

// GetAdminBookings returns bookings with admin filters
func GetAdminBookings(c *gin.Context) {
	bookingRepo := repository.NewBookingRepository(config.DB)

	// Get query parameters
	status := c.Query("status")
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	dateFrom := c.Query("dateFrom")
	dateTo := c.Query("dateTo")

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)

	// Build filter
	filter := make(map[string]interface{})
	if status != "" {
		filter["status"] = status
	}
	if dateFrom != "" {
		filter["date_from"] = dateFrom
	}
	if dateTo != "" {
		filter["date_to"] = dateTo
	}

	bookings, total, err := bookingRepo.FindAll(filter, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bookings": bookings,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

// UpdateBookingStatus updates booking status
func UpdateBookingStatus(c *gin.Context) {
	id := c.Param("id")

	var booking models.Booking
	if err := config.DB.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	var req struct {
		Status models.BookingStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status
	validStatuses := []models.BookingStatus{
		models.BookingStatusPending,
		models.BookingStatusConfirmed,
		models.BookingStatusCancelled,
	}
	isValidStatus := false
	for _, status := range validStatuses {
		if req.Status == status {
			isValidStatus = true
			break
		}
	}
	if !isValidStatus {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	booking.Status = req.Status
	if err := config.DB.Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking status"})
		return
	}

	c.JSON(http.StatusOK, booking)
}

// ==================== HELPER FUNCTIONS ====================

func calculateTotalRevenue(bookings []models.Booking) float64 {
	var total float64
	for _, booking := range bookings {
		if booking.Status == models.BookingStatusConfirmed && booking.PaymentStatus == models.PaymentStatusPaid {
			total += booking.TotalAmount
		}
	}
	return total
}

func generateActivityMessage(booking models.Booking) string {
	statusText := map[models.BookingStatus]string{
		models.BookingStatusPending:   "đặt vé",
		models.BookingStatusConfirmed: "xác nhận vé",
		models.BookingStatusCancelled: "hủy vé",
	}

	// Handle nil pointers safely
	var customerName string
	if booking.GuestInfo != nil {
		customerName = booking.GuestInfo.Name
	} else {
		customerName = "Khách hàng"
	}

	var routeInfo string
	if booking.Trip != nil && booking.Trip.Route != nil {
		routeInfo = booking.Trip.Route.Origin + " - " + booking.Trip.Route.Destination
	} else {
		routeInfo = "chuyến xe"
	}

	return "Khách hàng " + customerName + " " + statusText[booking.Status] + " chuyến " + routeInfo
}

// UpdateUserRole updates user role
func UpdateUserRole(c *gin.Context) {
	userRepo := repository.NewUserRepository(config.DB)

	// Get user ID from URL parameter
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID người dùng không hợp lệ"})
		return
	}

	// Parse request body
	var req struct {
		Role string `json:"role" binding:"required,oneof=customer admin staff driver"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	// Update user role
	err = userRepo.UpdateRole(uint(userID), models.Role(req.Role))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật vai trò người dùng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cập nhật vai trò thành công",
	})
}

// UpdateUser updates user information (admin only)
func UpdateUser(c *gin.Context) {
	userRepo := repository.NewUserRepository(config.DB)

	// Get user ID from URL parameter
	userID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID người dùng không hợp lệ"})
		return
	}

	var req struct {
		Name  string `json:"name"`
		Phone string `json:"phone"`
		Role  string `json:"role"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	user, err := userRepo.FindByID(uint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy người dùng"})
		return
	}

	// Update user fields
	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.Role != "" {
		user.Role = models.Role(req.Role)
	}

	// Save updated user
	err = userRepo.Update(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật thông tin người dùng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cập nhật thông tin thành công",
		"user":    user,
	})
}

// CreateGuestBooking creates a booking for guest (admin only)
func CreateGuestBooking(c *gin.Context) {
	var req struct {
		TripID    uint `json:"trip_id" binding:"required"`
		GuestInfo struct {
			Name  string `json:"name" binding:"required"`
			Phone string `json:"phone" binding:"required"`
			Email string `json:"email"`
		} `json:"guest_info" binding:"required"`
		SeatIDs []int64 `json:"seat_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB

	// Check if trip exists
	var trip models.Trip
	if err := db.Preload("Route").Preload("Bus").First(&trip, req.TripID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Trip not found"})
		return
	}

	// Create guest info
	guestInfo := models.GuestInfo{
		Name:  req.GuestInfo.Name,
		Phone: req.GuestInfo.Phone,
		Email: req.GuestInfo.Email,
	}

	// Calculate total price
	totalPrice := trip.Price * float64(len(req.SeatIDs))

	// Create booking with embedded guest info
	booking := models.Booking{
		TripID:        req.TripID,
		GuestInfo:     &guestInfo,
		SeatIDs:       req.SeatIDs,
		TotalAmount:   totalPrice,
		Status:        models.BookingStatusConfirmed,
		PaymentStatus: models.PaymentStatusPaid,
	}

	if err := db.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	// Generate booking code
	bookingCode := fmt.Sprintf("BK%06d", booking.ID)
	db.Model(&booking).Update("booking_code", bookingCode)

	c.JSON(http.StatusOK, gin.H{
		"message": "Booking created successfully",
		"booking": gin.H{
			"id":           booking.ID,
			"booking_code": bookingCode,
			"trip_id":      booking.TripID,
			"total_amount": booking.TotalAmount,
			"status":       booking.Status,
			"seat_ids":     booking.SeatIDs,
		},
	})
}

// CreateUser creates a new user (admin only)
func CreateUser(c *gin.Context) {
	var req struct {
		Name     string `json:"name" binding:"required"`
		Phone    string `json:"phone" binding:"required"`
		Password string `json:"password" binding:"required"`
		Role     string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate role
	validRoles := []string{"customer", "admin", "staff", "driver"}
	roleValid := false
	for _, role := range validRoles {
		if req.Role == role {
			roleValid = true
			break
		}
	}
	if !roleValid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vai trò không hợp lệ"})
		return
	}

	// Validate phone format (basic)
	if len(req.Phone) < 10 || len(req.Phone) > 11 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Số điện thoại không hợp lệ"})
		return
	}

	// Validate password length
	if len(req.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Mật khẩu phải có ít nhất 6 ký tự"})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)

	// Check if phone already exists
	existingUser, err := userRepo.FindByPhone(req.Phone)
	if err == nil && existingUser != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Số điện thoại đã được sử dụng"})
		return
	}

	// Create user (password will be hashed automatically by BeforeSave hook)
	user := &models.User{
		Name:     req.Name,
		Phone:    req.Phone,
		Password: req.Password, // Raw password, will be hashed by BeforeSave
		Role:     models.Role(req.Role),
	}

	err = userRepo.Create(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo người dùng"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tạo người dùng thành công",
		"user":    user,
	})
}

// DeleteUser deletes a user (admin only)
func DeleteUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Test DeleteUser API",
		"status":  "working",
	})
}

// AdminCancelBooking cancels a booking (admin only)
func AdminCancelBooking(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Get repositories
	bookingRepo := repository.NewBookingRepository(config.DB)
	seatRepo := repository.NewSeatRepository(config.DB)

	// Get booking
	booking, err := bookingRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn đặt vé"})
		return
	}

	// Check if booking can be cancelled
	if booking.Status == models.BookingStatusCancelled {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Đơn đã được hủy"})
		return
	}

	// Cancel booking in transaction
	err = config.DB.Transaction(func(tx *gorm.DB) error {
		// Update booking status
		if err := bookingRepo.UpdateStatus(uint(id), models.BookingStatusCancelled); err != nil {
			return err
		}

		// Release seats
		for _, seatID := range booking.SeatIDs {
			if err := seatRepo.UpdateStatus(uint(seatID), models.SeatStatusAvailable); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể hủy đơn đặt vé"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Hủy đơn thành công"})
}
