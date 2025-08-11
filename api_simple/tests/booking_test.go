package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/handlers"
	"ticket-management/api_simple/middleware"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/seeders"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

// Import test helper functions
func init() {
	// This will be called before any tests run
}

type BookingTestSuite struct {
	suite.Suite
	router      *gin.Engine
	db          *gorm.DB
	userRepo    *repository.UserRepository
	routeRepo   *repository.RouteRepository
	busRepo     *repository.BusRepository
	tripRepo    *repository.TripRepository
	seatRepo    *repository.SeatRepository
	bookingRepo *repository.BookingRepository
	adminToken  string
	userToken   string
	trip1ID     uint
	trip2ID     uint
	seat1ID     int64
	seat2ID     int64
	seat3ID     int64
	seat4ID     int64
	seat5ID     int64
	seat6ID     int64
	seat7ID     int64
	seat8ID     int64
}

func (suite *BookingTestSuite) SetupSuite() {
	// Setup test database and Redis
	SetupTestDB()
	SetupTestRedis()

	// Override global config with test config
	config.DB = TestDB
	config.RedisClient = TestRedisClient

	// Clean up any existing data before seeding
	TestDB.Exec("DELETE FROM bookings")
	TestDB.Exec("DELETE FROM seats")
	TestDB.Exec("DELETE FROM trips")
	TestDB.Exec("DELETE FROM buses")
	TestDB.Exec("DELETE FROM routes")
	TestDB.Exec("DELETE FROM users")

	suite.db = TestDB
	suite.userRepo = repository.NewUserRepository(suite.db)
	suite.routeRepo = repository.NewRouteRepository(suite.db)
	suite.busRepo = repository.NewBusRepository(suite.db)
	suite.tripRepo = repository.NewTripRepository(suite.db)
	suite.seatRepo = repository.NewSeatRepository(suite.db)
	suite.bookingRepo = repository.NewBookingRepository(suite.db)

	// Setup router
	suite.router = gin.Default()
	suite.setupRoutes()

	// Seed test data
	suite.seedTestData()
}

func (suite *BookingTestSuite) TearDownSuite() {
	// We need to pass a testing.T parameter, but in TearDownSuite we don't have access to it
	// So we'll just close the connections directly
	if TestDB != nil {
		sqlDB, err := TestDB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
	CleanupTestRedis()
}

func (suite *BookingTestSuite) SetupTest() {
	// No transaction needed - each test will use the same database instance
	// This is simpler and avoids the isolation issues
}

func (suite *BookingTestSuite) TearDownTest() {
	// No rollback needed - each test will use the same database instance
	// This is simpler and avoids the isolation issues
}

func (suite *BookingTestSuite) setupRoutes() {
	api := suite.router.Group("/api/v1")

	// Public routes
	api.POST("/auth/register", handlers.Register)
	api.POST("/auth/login", handlers.Login)
	api.GET("/trips", handlers.SearchTrips)
	api.GET("/trips/:id/seats", handlers.GetTripSeats)
	api.GET("/bookings/:code", handlers.GetBookingByCode)

	// Guest booking route (no authentication required)
	api.POST("/bookings", handlers.CreateBooking)

	// Protected routes
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/bookings", handlers.GetUserBookings)
		protected.PUT("/bookings/:id/cancel", handlers.CancelBooking)
	}

	// Admin routes
	admin := api.Group("")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		admin.GET("/admin/bookings", handlers.GetAllBookings)
		admin.PUT("/admin/bookings/:id/confirm", handlers.ConfirmBooking)
		admin.PUT("/admin/bookings/:id/payment", handlers.UpdateBookingPayment)
	}
}

func (suite *BookingTestSuite) seedTestData() {
	// Seed basic data
	seeders.TestSeed(suite.db)

	// Get actual trip IDs for testing
	var trips []models.Trip
	suite.db.Find(&trips)
	if len(trips) < 2 {
		suite.T().Fatal("Not enough trips found after seeding")
	}

	// Store trip IDs for tests
	suite.trip1ID = trips[0].ID
	suite.trip2ID = trips[1].ID

	// Get actual seat IDs for testing - use different seats for each test
	var seats1 []models.Seat
	suite.db.Where("trip_id = ?", suite.trip1ID).Find(&seats1)
	if len(seats1) >= 8 {
		suite.seat1ID = int64(seats1[0].ID) // For TestCreateGuestBooking
		suite.seat2ID = int64(seats1[1].ID) // For TestCreateGuestBooking
		suite.seat3ID = int64(seats1[2].ID) // For TestCreateAuthenticatedBooking
		suite.seat4ID = int64(seats1[3].ID) // For TestCreateAuthenticatedBooking
		suite.seat5ID = int64(seats1[4].ID) // For TestCancelBooking
		suite.seat6ID = int64(seats1[5].ID) // For TestCancelBooking
		suite.seat7ID = int64(seats1[6].ID) // For TestAdminConfirmBooking
		suite.seat8ID = int64(seats1[7].ID) // For TestAdminConfirmBooking
	} else {
		suite.T().Fatalf("Not enough seats in trip1. Expected at least 8, got %d", len(seats1))
	}

	// Get admin and user tokens
	suite.adminToken = suite.getAdminToken()
	suite.userToken = suite.getUserToken()
}

func (suite *BookingTestSuite) getAdminToken() string {
	loginReq := handlers.LoginRequest{
		Phone:    "0987654321",
		Password: "admin123",
	}

	reqBody, _ := json.Marshal(loginReq)
	req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	return response["token"].(string)
}

func (suite *BookingTestSuite) getUserToken() string {
	loginReq := handlers.LoginRequest{
		Phone:    "0987654323",
		Password: "customer123",
	}

	reqBody, _ := json.Marshal(loginReq)
	req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	return response["token"].(string)
}

func (suite *BookingTestSuite) TestCreateGuestBooking() {
	// Test creating a booking without authentication (guest booking)
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{suite.seat1ID, suite.seat2ID},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn A",
			Phone: "0987654321",
			Email: "guest@example.com",
		},
		Note: "Test guest booking",
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Check that we have a booking in the response
	assert.Contains(suite.T(), response, "booking")
	bookingData := response["booking"].(map[string]interface{})

	assert.NotEmpty(suite.T(), bookingData["booking_code"])
	assert.Equal(suite.T(), "pending", bookingData["status"])
	assert.Equal(suite.T(), "unpaid", bookingData["payment_status"])

	// Verify total_amount is positive
	totalAmount := bookingData["total_amount"].(float64)
	assert.Greater(suite.T(), totalAmount, float64(0))

	// Verify guest info is set
	assert.NotNil(suite.T(), bookingData["guest_info"])
}

func (suite *BookingTestSuite) TestCreateAuthenticatedBooking() {
	// Test creating a booking with authentication
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{suite.seat3ID, suite.seat4ID},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn C",
			Phone: "0987654324",
			Email: "customer@example.com",
		},
		Note: "Test authenticated booking",
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+suite.userToken)

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Check that we have a booking in the response
	assert.Contains(suite.T(), response, "booking")
	bookingData := response["booking"].(map[string]interface{})

	assert.NotEmpty(suite.T(), bookingData["booking_code"])
	assert.Equal(suite.T(), "pending", bookingData["status"])
	assert.Equal(suite.T(), "unpaid", bookingData["payment_status"])

	// Verify total_amount is positive
	totalAmount := bookingData["total_amount"].(float64)
	assert.Greater(suite.T(), totalAmount, float64(0))

	// Note: user_id will be nil because CreateBooking is a public endpoint
	// that doesn't use AuthMiddleware, so it can't access the JWT token
	// This is the current API design - all bookings require GuestInfo
}

func (suite *BookingTestSuite) TestCreateBookingWithInvalidSeats() {
	// Test booking with invalid seat IDs (non-existent seats)
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{999999, 999998}, // Use non-existent seat IDs
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn B",
			Phone: "0987654321",
			Email: "guest2@example.com",
		},
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Contains(suite.T(), response, "error")
	// The actual error message is "Một số ghế không tồn tại"
	assert.Contains(suite.T(), response["error"], "ghế")
}

func (suite *BookingTestSuite) TestCreateBookingWithInvalidTrip() {
	// Test booking with non-existent trip
	bookingReq := handlers.CreateBookingRequest{
		TripID:      999,
		SeatIDs:     []int64{suite.seat1ID, suite.seat2ID},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn C",
			Phone: "0111222333",
			Email: "guest3@example.com",
		},
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusNotFound, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Contains(suite.T(), response, "error")
	// The actual error message is "Không tìm thấy chuyến đi"
	assert.Contains(suite.T(), response["error"], "chuyến đi")
}

func (suite *BookingTestSuite) TestGetBookingByCode() {
	// Get seats from trip1 (use seats beyond the pre-assigned ones)
	var seats []models.Seat
	suite.db.Where("trip_id = ?", suite.trip1ID).Find(&seats)
	if len(seats) < 22 {
		suite.T().Fatal("Not enough seats for TestGetBookingByCode")
	}

	// First create a booking
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{int64(seats[20].ID), int64(seats[21].ID)},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn H",
			Phone: "0987654329",
			Email: "code@example.com",
		},
		Note: "Test get by code",
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusCreated, w.Code)

	var createResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &createResponse)

	// Get the booking code from the response
	bookingData := createResponse["booking"].(map[string]interface{})
	bookingCode := bookingData["booking_code"].(string)

	// Now get the booking by code
	req = httptest.NewRequest("GET", "/api/v1/bookings/"+bookingCode, nil)

	w = httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Check that we have the booking data
	assert.Contains(suite.T(), response, "ID")
	assert.Contains(suite.T(), response, "booking_code")
	assert.Equal(suite.T(), bookingCode, response["booking_code"])
	assert.Contains(suite.T(), response, "status")
	assert.Contains(suite.T(), response, "total_amount")

	// Verify total_amount is positive
	totalAmount := response["total_amount"].(float64)
	assert.Greater(suite.T(), totalAmount, float64(0))
}

func (suite *BookingTestSuite) TestGetUserBookings() {
	// Get seats from trip1 (use seats beyond the pre-assigned ones)
	var seats []models.Seat
	suite.db.Where("trip_id = ?", suite.trip1ID).Find(&seats)
	if len(seats) < 24 {
		suite.T().Fatal("Not enough seats for TestGetUserBookings")
	}

	// First create a guest booking (current API design only supports guest bookings)
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{int64(seats[22].ID), int64(seats[23].ID)},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn G",
			Phone: "0987654328",
			Email: "userbookings@example.com",
		},
		Note: "Test guest booking",
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusCreated, w.Code)

	// Now get user bookings (should return 0 since the booking was created as a guest booking)
	req = httptest.NewRequest("GET", "/api/v1/bookings", nil)
	req.Header.Set("Authorization", "Bearer "+suite.userToken)

	w = httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Check that we have the response structure
	assert.Contains(suite.T(), response, "bookings")
	bookings := response["bookings"].([]interface{})

	// Current API design: guest bookings are not associated with users
	// So GetUserBookings returns 0 bookings for authenticated users
	// This is the expected behavior with the current API design
	assert.Equal(suite.T(), 0, len(bookings))
}

func (suite *BookingTestSuite) TestCancelBooking() {
	// First create a booking to cancel
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{suite.seat5ID, suite.seat6ID},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn D",
			Phone: "0987654325",
			Email: "cancel@example.com",
		},
		Note: "Test booking to cancel",
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Get the booking ID from the response
	bookingData := response["booking"].(map[string]interface{})
	bookingID := int(bookingData["ID"].(float64))

	// Now cancel the booking
	cancelReq := httptest.NewRequest("PUT", fmt.Sprintf("/api/v1/bookings/%d/cancel", bookingID), nil)
	cancelReq.Header.Set("Authorization", "Bearer "+suite.userToken)

	w = httptest.NewRecorder()
	suite.router.ServeHTTP(w, cancelReq)

	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var cancelResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &cancelResponse)

	assert.Contains(suite.T(), cancelResponse, "message")
	assert.Equal(suite.T(), "Hủy đơn thành công", cancelResponse["message"])
}

func (suite *BookingTestSuite) TestAdminConfirmBooking() {
	// First create a booking to confirm
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{suite.seat7ID, suite.seat8ID},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn E",
			Phone: "0987654326",
			Email: "confirm@example.com",
		},
		Note: "Test booking to confirm",
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Get the booking ID from the response
	bookingData := response["booking"].(map[string]interface{})
	bookingID := int(bookingData["ID"].(float64))

	// First update payment status to paid
	paymentReq := handlers.UpdatePaymentRequest{
		PaymentStatus: models.PaymentStatusPaid,
	}

	reqBody, _ = json.Marshal(paymentReq)
	paymentUpdateReq := httptest.NewRequest("PUT", fmt.Sprintf("/api/v1/admin/bookings/%d/payment", bookingID), bytes.NewBuffer(reqBody))
	paymentUpdateReq.Header.Set("Content-Type", "application/json")
	paymentUpdateReq.Header.Set("Authorization", "Bearer "+suite.adminToken)

	w = httptest.NewRecorder()
	suite.router.ServeHTTP(w, paymentUpdateReq)

	assert.Equal(suite.T(), http.StatusOK, w.Code)

	// Now confirm the booking as admin
	confirmReq := httptest.NewRequest("PUT", fmt.Sprintf("/api/v1/admin/bookings/%d/confirm", bookingID), nil)
	confirmReq.Header.Set("Authorization", "Bearer "+suite.adminToken)

	w = httptest.NewRecorder()
	suite.router.ServeHTTP(w, confirmReq)

	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var confirmResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &confirmResponse)

	assert.Contains(suite.T(), confirmResponse, "message")
	assert.Equal(suite.T(), "Xác nhận đơn thành công", confirmResponse["message"])
}

func (suite *BookingTestSuite) TestAdminUpdatePaymentStatus() {
	// Get seats from trip1 (use seats beyond the pre-assigned ones)
	var seats []models.Seat
	suite.db.Where("trip_id = ?", suite.trip1ID).Find(&seats)
	if len(seats) < 26 {
		suite.T().Fatal("Not enough seats for TestAdminUpdatePaymentStatus")
	}

	// First create a booking to update payment
	bookingReq := handlers.CreateBookingRequest{
		TripID:      suite.trip1ID,
		SeatIDs:     []int64{int64(seats[24].ID), int64(seats[25].ID)},
		PaymentType: models.PaymentTypeCash,
		GuestInfo: &models.GuestInfo{
			Name:  "Nguyễn Văn F",
			Phone: "0987654327",
			Email: "payment@example.com",
		},
		Note: "Test booking to update payment",
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusCreated, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Get the booking ID from the response
	bookingData := response["booking"].(map[string]interface{})
	bookingID := int(bookingData["ID"].(float64))

	// Now update payment status as admin
	paymentReq := handlers.UpdatePaymentRequest{
		PaymentStatus: models.PaymentStatusPaid,
	}

	reqBody, _ = json.Marshal(paymentReq)
	updateReq := httptest.NewRequest("PUT", fmt.Sprintf("/api/v1/admin/bookings/%d/payment", bookingID), bytes.NewBuffer(reqBody))
	updateReq.Header.Set("Content-Type", "application/json")
	updateReq.Header.Set("Authorization", "Bearer "+suite.adminToken)

	w = httptest.NewRecorder()
	suite.router.ServeHTTP(w, updateReq)

	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var updateResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &updateResponse)

	assert.Contains(suite.T(), updateResponse, "message")
	assert.Equal(suite.T(), "Cập nhật trạng thái thanh toán thành công", updateResponse["message"])
}

func (suite *BookingTestSuite) TestGetAllBookingsAdmin() {
	// Get all bookings as admin
	req := httptest.NewRequest("GET", "/api/v1/admin/bookings", nil)
	req.Header.Set("Authorization", "Bearer "+suite.adminToken)

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusOK, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	// Check that we have bookings in the response
	assert.Contains(suite.T(), response, "bookings")
	bookings := response["bookings"].([]interface{})
	assert.GreaterOrEqual(suite.T(), len(bookings), 1)

	// Verify first booking has required fields
	if len(bookings) > 0 {
		firstBooking := bookings[0].(map[string]interface{})
		assert.Contains(suite.T(), firstBooking, "ID")
		assert.Contains(suite.T(), firstBooking, "trip_id")
		assert.Contains(suite.T(), firstBooking, "status")
	}
}

func (suite *BookingTestSuite) TestValidationErrors() {
	// Test missing required fields
	bookingReq := handlers.CreateBookingRequest{
		TripID:  1,
		SeatIDs: []int64{},
		GuestInfo: &models.GuestInfo{
			Name:  "",
			Phone: "",
			Email: "invalid-email",
		},
	}

	reqBody, _ := json.Marshal(bookingReq)
	req := httptest.NewRequest("POST", "/api/v1/bookings", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	suite.router.ServeHTTP(w, req)

	assert.Equal(suite.T(), http.StatusBadRequest, w.Code)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Contains(suite.T(), response, "error")
	// The actual error message is "Vui lòng điền đầy đủ thông tin"
	assert.Contains(suite.T(), response["error"], "thông tin")
}

func TestBookingTestSuite(t *testing.T) {
	suite.Run(t, new(BookingTestSuite))
}
