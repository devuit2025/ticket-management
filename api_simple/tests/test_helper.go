package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// RequestConfig defines the configuration for making a test request
type RequestConfig struct {
	Method  string
	URL     string
	Body    interface{}
	Token   string
	Headers map[string]string
}

var (
	adminToken    string
	customerToken string
	testDB        *gorm.DB
)

// CleanupTestDB drops all tables and recreates them
func CleanupTestDB(t *testing.T) {
	if testDB != nil {
		// Drop all tables
		err := testDB.Migrator().DropTable(
			&models.User{},
			&models.Route{},
			&models.Bus{},
			&models.Seat{},
			&models.Trip{},
			&models.Booking{},
			&models.Payment{},
		)
		if err != nil {
			t.Fatalf("Error dropping tables: %v", err)
		}

		// Recreate all tables
		err = testDB.AutoMigrate(
			&models.User{},
			&models.Route{},
			&models.Bus{},
			&models.Seat{},
			&models.Trip{},
			&models.Booking{},
			&models.Payment{},
		)
		if err != nil {
			t.Fatalf("Error recreating tables: %v", err)
		}
	}
}

func init() {
	gin.SetMode(gin.TestMode)
	var err error
	testDB, err = SetupTestDB()
	if err != nil {
		panic(err)
	}
}

// SetupTestDB sets up a test database
func SetupTestDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("file::memory:"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate
	err = db.AutoMigrate(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Seat{},
		&models.Trip{},
		&models.Booking{},
		&models.Payment{},
	)
	if err != nil {
		return nil, err
	}

	config.DB = db
	return db, nil
}

// SetupTestRouter sets up a test router
func SetupTestRouter() *gin.Engine {
	r := gin.Default()

	// Admin routes
	admin := r.Group("/api/v1/admin")
	{
		admin.GET("/users", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		admin.GET("/bookings", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		admin.GET("/statistics", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		admin.PUT("/users/:id/role", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
	}

	// Auth routes
	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/register", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		auth.POST("/login", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
	}

	// Booking routes
	bookings := r.Group("/api/v1/bookings")
	{
		bookings.POST("", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		bookings.GET("/:id", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		bookings.PUT("/:id/cancel", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
	}

	// Trip routes
	trips := r.Group("/api/v1/trips")
	{
		trips.GET("", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		trips.GET("/:id", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		trips.POST("", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		trips.PUT("/:id", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
		trips.DELETE("/:id", func(c *gin.Context) { c.JSON(200, gin.H{"message": "ok"}) })
	}

	return r
}

// CreateTestUser creates a test user
func CreateTestUser(t *testing.T, db *gorm.DB, phone, password, name string, role models.Role) *models.User {
	userRepo := repository.NewUserRepository(db)
	user := &models.User{
		Phone:    phone,
		Password: password,
		Name:     name,
		Role:     role,
	}
	err := userRepo.Create(user)
	if err != nil {
		t.Logf("Error creating test user: %v", err)
		return nil
	}
	return user
}

// MakeRequest makes a test request
func MakeRequest(config RequestConfig) *httptest.ResponseRecorder {
	var body []byte
	var err error
	if config.Body != nil {
		body, err = json.Marshal(config.Body)
		if err != nil {
			panic(err)
		}
	}

	req, _ := http.NewRequest(config.Method, config.URL, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	if config.Token != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", config.Token))
	}

	for key, value := range config.Headers {
		req.Header.Set(key, value)
	}

	w := httptest.NewRecorder()
	router := SetupTestRouter()
	router.ServeHTTP(w, req)

	return w
}

// ParseResponse parses a JSON response
func ParseResponse(t *testing.T, w *httptest.ResponseRecorder) map[string]interface{} {
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	return response
}

// SetupTestData sets up test data and tokens
func SetupTestData(t *testing.T) {
	// Create test users
	admin := CreateTestUser(t, testDB, "0123456789", "admin123", "Admin User", models.RoleAdmin)
	if admin == nil {
		t.Fatal("Failed to create admin user")
	}

	customer := CreateTestUser(t, testDB, "0123456786", "customer123", "Customer User", models.RoleCustomer)
	if customer == nil {
		t.Fatal("Failed to create customer user")
	}

	staff := CreateTestUser(t, testDB, "0123456788", "staff123", "Staff User", models.RoleStaff)
	if staff == nil {
		t.Fatal("Failed to create staff user")
	}

	driver := CreateTestUser(t, testDB, "0123456787", "driver123", "Driver User", models.RoleDriver)
	if driver == nil {
		t.Fatal("Failed to create driver user")
	}

	// Generate tokens
	adminToken = "test_admin_token"
	customerToken = "test_customer_token"

	// Create test route
	route := &models.Route{
		Origin:      "City A",
		Destination: "City B",
		Distance:    100,
		Duration:    "2h",
	}
	err := testDB.Create(route).Error
	if err != nil {
		t.Fatalf("Error creating test route: %v", err)
	}

	// Create test bus
	bus := &models.Bus{
		PlateNumber: "ABC123",
		Type:        "Sleeper",
		SeatCount:   40,
	}
	err = testDB.Create(bus).Error
	if err != nil {
		t.Fatalf("Error creating test bus: %v", err)
	}

	// Create test trip
	departureTime, _ := time.Parse("2006-01-02 15:04:05", "2025-08-10 08:00:00")
	trip := &models.Trip{
		RouteID:       route.ID,
		BusID:         bus.ID,
		DriverID:      driver.ID,
		DepartureTime: departureTime,
		Price:         100000,
		Status:        models.TripStatusUpcoming,
	}
	err = testDB.Create(trip).Error
	if err != nil {
		t.Fatalf("Error creating test trip: %v", err)
	}

	// Create test seats
	for i := 1; i <= 40; i++ {
		seat := &models.Seat{
			TripID: trip.ID,
			Number: i,
			Status: "vacant",
		}
		err = testDB.Create(seat).Error
		if err != nil {
			t.Fatalf("Error creating test seat %d: %v", i, err)
		}
	}

	// Create test booking
	booking := &models.Booking{
		UserID: customer.ID,
		TripID: trip.ID,
		SeatID: 1,
		Status: models.BookingStatusPending,
	}
	err = testDB.Create(booking).Error
	if err != nil {
		t.Fatalf("Error creating test booking: %v", err)
	}

	// Create test payment
	payment := &models.Payment{
		BookingID: booking.ID,
		Amount:    100000,
		Status:    models.PaymentStatusPending,
	}
	err = testDB.Create(payment).Error
	if err != nil {
		t.Fatalf("Error creating test payment: %v", err)
	}
}
