package tests

import (
	"context"
	"testing"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/handlers"
	"ticket-management/api_simple/middleware"
	"ticket-management/api_simple/models"

	"github.com/alicebob/miniredis/v2"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// TestDB represents a test database with transaction support
type TestDB struct {
	*gorm.DB
	tx *gorm.DB
}

var (
	testDB *TestDB
	mr     *miniredis.Miniredis
)

// generateTestToken generates a token that expires in 24 hours
func generateTestToken(userID uint, role models.Role) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(), // 7 days for testing
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.JWTSecret))
}

func init() {
	// Use SQLite in-memory database for testing
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto migrate
	err = db.AutoMigrate(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Trip{},
		&models.Seat{},
		&models.Booking{},
	)
	if err != nil {
		panic("failed to migrate database")
	}

	// Initialize TestDB
	testDB = &TestDB{DB: db}
	config.DB = db

	// Initialize miniredis
	mr, err = miniredis.Run()
	if err != nil {
		panic(err)
	}

	// Initialize Redis client with miniredis
	config.RedisClient = redis.NewClient(&redis.Options{
		Addr: mr.Addr(),
		DB:   0,
	})

	// Set global context
	config.Ctx = context.Background()

	// Set JWT secret
	config.JWTSecret = "test_secret"
}

// BeginTx starts a new transaction for testing
func BeginTx(t *testing.T) {
	// Reset miniredis
	mr.FlushAll()

	tx := testDB.Begin()
	if tx.Error != nil {
		t.Fatalf("Failed to begin transaction: %v", tx.Error)
	}
	testDB.tx = tx
	config.DB = tx // Replace global DB with transaction
}

// RollbackTx rolls back the current transaction
func RollbackTx(t *testing.T) {
	if testDB.tx != nil {
		err := testDB.tx.Rollback().Error
		if err != nil {
			t.Errorf("Failed to rollback transaction: %v", err)
		}
		testDB.tx = nil
		config.DB = testDB.DB // Restore global DB
	}
}

// SetupTestRouter returns a new router instance for testing
func SetupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Setup routes
	api := router.Group("/api/v1")
	setupRoutes(api)

	return router
}

// setupRoutes sets up all routes for testing
func setupRoutes(api *gin.RouterGroup) {
	// Public routes
	api.POST("/auth/register", handlers.Register)
	api.POST("/auth/login", handlers.Login)
	api.POST("/auth/forgot-password", handlers.ForgotPassword)
	api.POST("/auth/verify-otp", handlers.VerifyOTP)
	api.POST("/auth/reset-password", handlers.ResetPassword)

	api.GET("/routes", handlers.GetRoutes)
	api.GET("/routes/popular", handlers.GetPopularRoutes)
	api.GET("/routes/:id", handlers.GetRoute)

	api.GET("/buses", handlers.GetBuses)
	api.GET("/buses/:id", handlers.GetBus)

	api.GET("/trips", handlers.SearchTrips)
	api.GET("/trips/available", handlers.GetAvailableTrips)
	api.GET("/trips/:id", handlers.GetTrip)
	api.GET("/trips/:id/seats", handlers.GetTripSeats)
	api.GET("/trips/:id/seats/available", handlers.GetAvailableSeats)
	api.POST("/trips/:id/seats/check", handlers.CheckSeatStatus)
	api.POST("/trips/:id/seats/lock", handlers.LockSeats)
	api.POST("/trips/:id/seats/unlock", handlers.UnlockSeats)

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/auth/logout", handlers.Logout)
		protected.POST("/auth/change-password", handlers.ChangePassword)

		// Admin routes
		admin := protected.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		{
			// Route management
			admin.POST("/routes", handlers.CreateRoute)
			admin.PUT("/routes/:id", handlers.UpdateRoute)
			admin.DELETE("/routes/:id", handlers.DeleteRoute)

			// Bus management
			admin.POST("/buses", handlers.CreateBus)
			admin.PUT("/buses/:id", handlers.UpdateBus)
			admin.DELETE("/buses/:id", handlers.DeleteBus)

			// Trip management
			admin.POST("/trips", handlers.CreateTrip)
			admin.PUT("/trips/:id", handlers.UpdateTrip)
			admin.DELETE("/trips/:id", handlers.DeleteTrip)
			admin.POST("/trips/:id/seats", handlers.CreateSeats)

			// User management
			admin.GET("/users", handlers.GetUsers)
			admin.GET("/bookings", handlers.GetAllBookings)
			admin.GET("/statistics", handlers.GetStatistics)
		}
	}
}

// CleanupTestDB drops and recreates all tables
func CleanupTestDB(t *testing.T) {
	// Drop all tables
	err := testDB.DB.Migrator().DropTable(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Trip{},
		&models.Seat{},
		&models.Booking{},
	)
	if err != nil {
		t.Fatalf("Failed to drop tables: %v", err)
	}

	// Auto migrate to recreate tables
	err = testDB.DB.AutoMigrate(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Trip{},
		&models.Seat{},
		&models.Booking{},
	)
	if err != nil {
		t.Fatalf("Failed to migrate tables: %v", err)
	}
}

// SetupTestData creates test data for testing
func SetupTestData(t *testing.T) {
	// Create test users
	users := []models.User{
		{
			Phone:    "0987654321",
			Password: "Password123!",
			Name:     "Admin",
			Role:     models.RoleAdmin,
		},
		{
			Phone:    "0987654322",
			Password: "Password123!",
			Name:     "Customer",
			Role:     models.RoleCustomer,
		},
		{
			Phone:    "0987654323",
			Password: "Password123!",
			Name:     "Driver",
			Role:     models.RoleDriver,
		},
	}
	for _, user := range users {
		if err := config.DB.Create(&user).Error; err != nil {
			t.Fatalf("Failed to create test user: %v", err)
		}
	}

	// Create test routes
	routes := []models.Route{
		{
			Origin:      "Hà Nội",
			Destination: "Sapa",
			Distance:    320,
			Duration:    "5h30m",
			BasePrice:   350000,
			IsActive:    true,
		},
		{
			Origin:      "Hà Nội",
			Destination: "Hải Phòng",
			Distance:    120,
			Duration:    "2h30m",
			BasePrice:   150000,
			IsActive:    true,
		},
	}
	for _, route := range routes {
		if err := config.DB.Create(&route).Error; err != nil {
			t.Fatalf("Failed to create test route: %v", err)
		}
	}

	// Create test buses
	buses := []models.Bus{
		{
			PlateNumber: "29B-12345",
			Type:        "Giường nằm",
			SeatCount:   40,
			FloorCount:  2,
			IsActive:    true,
		},
		{
			PlateNumber: "29B-12346",
			Type:        "Ghế ngồi",
			SeatCount:   45,
			FloorCount:  1,
			IsActive:    true,
		},
	}
	for _, bus := range buses {
		if err := config.DB.Create(&bus).Error; err != nil {
			t.Fatalf("Failed to create test bus: %v", err)
		}
	}
}
