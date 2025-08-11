package tests

import (
	"context"
	"fmt"
	"log"
	"os"
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/handlers"
	"ticket-management/api_simple/middleware"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/seeders"

	"testing"

	"github.com/alicebob/miniredis/v2"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	TestDB          *gorm.DB
	TestRedisClient *redis.Client
	TestRedisServer *miniredis.Miniredis
	originalTestDB  *gorm.DB
)

// SetupTestRouter initializes test router with all necessary middleware and routes
func SetupTestRouter() *gin.Engine {
	// Setup test database and Redis
	SetupTestDB()
	SetupTestRedis()

	// Override global config with test config
	config.DB = TestDB
	config.RedisClient = TestRedisClient

	// Set JWT secret for tests if not already set
	if config.JWTSecret == "" {
		config.JWTSecret = "test-jwt-secret-key-for-unit-testing"
	}

	// Setup router
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(gin.Recovery())

	// API routes
	api := router.Group("/api/v1")
	{
		// Public routes (no auth required)
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

		// Booking routes (public)
		api.POST("/bookings", handlers.CreateBooking)
		api.GET("/bookings/:code", handlers.GetBookingByCode)

		// Protected routes (require auth)
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/auth/logout", handlers.Logout)
			protected.POST("/auth/change-password", handlers.ChangePassword)

			// Booking routes (authenticated)
			protected.GET("/bookings", handlers.GetUserBookings)
			protected.PUT("/bookings/:id/cancel", handlers.CancelBooking)
		}

		// Admin routes (require auth + admin role)
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
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

			// Booking management
			admin.GET("/bookings", handlers.GetAllBookings)
			admin.PUT("/bookings/:id/confirm", handlers.ConfirmBooking)
			admin.PUT("/bookings/:id/payment", handlers.UpdateBookingPayment)

			// User management
			admin.GET("/users", handlers.GetUsers)
			admin.GET("/statistics", handlers.GetStatistics)
		}
	}

	return router
}

// BeginTx starts a new transaction for testing
func BeginTx(t *testing.T) {
	if TestDB == nil {
		SetupTestDB()
	}

	// Store original DB reference if not already stored
	if originalTestDB == nil {
		originalTestDB = TestDB
	}

	// Start a new transaction
	TestDB = TestDB.Begin()

	// Override global config to use transaction
	config.DB = TestDB
}

// RollbackTx rolls back the current transaction
func RollbackTx(t *testing.T) {
	if TestDB != nil && TestDB != originalTestDB {
		TestDB.Rollback()
		// Restore original DB connection
		TestDB = originalTestDB
		config.DB = TestDB
	}
}

// SetupTestDB initializes test database using PostgreSQL
func SetupTestDB() {
	// Use environment variables for database connection, fallback to localhost for local development
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "postgres"
	}
	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "postgres"
	}
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "ticket_management_test"
	}

	// Use PostgreSQL for tests to match production environment
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		host, user, password, dbname, port)

	var err error
	TestDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to test database:", err)
	}
	log.Println("Test database connected successfully")

	// Auto migrate test models
	err = TestDB.AutoMigrate(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Trip{},
		&models.Seat{},
		&models.Booking{},
	)
	if err != nil {
		log.Fatal("Failed to migrate test database:", err)
	}
	log.Println("Test database migrated successfully")

	// Always clean up and reseed for fresh test data
	log.Println("Cleaning up test database...")
	TestDB.Exec("DELETE FROM bookings")
	TestDB.Exec("DELETE FROM seats")
	TestDB.Exec("DELETE FROM trips")
	TestDB.Exec("DELETE FROM buses")
	TestDB.Exec("DELETE FROM routes")
	TestDB.Exec("DELETE FROM users")

	log.Println("Starting to seed test database...")
	err = seeders.TestSeed(TestDB)
	if err != nil {
		log.Fatal("Failed to seed test database:", err)
	}
	log.Println("Test database seeded successfully")
}

// SetupTestRedis initializes test Redis using miniredis
func SetupTestRedis() {
	var err error
	TestRedisServer, err = miniredis.Run()
	if err != nil {
		log.Fatal("Failed to start test Redis server:", err)
	}

	TestRedisClient = redis.NewClient(&redis.Options{
		Addr: TestRedisServer.Addr(),
		DB:   0,
	})

	// Test the connection
	_, err = TestRedisClient.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("Failed to connect to test Redis:", err)
	}
}

// CleanupTestDB closes test database connection and cleans up test data
func CleanupTestDB(t *testing.T) {
	if TestDB != nil {
		// Clean up test data instead of removing database file
		TestDB.Exec("DELETE FROM bookings")
		TestDB.Exec("DELETE FROM seats")
		TestDB.Exec("DELETE FROM trips")
		TestDB.Exec("DELETE FROM buses")
		TestDB.Exec("DELETE FROM routes")
		TestDB.Exec("DELETE FROM users")

		sqlDB, err := TestDB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}

// CleanupTestRedis closes test Redis connection and server
func CleanupTestRedis() {
	if TestRedisClient != nil {
		TestRedisClient.Close()
	}
	if TestRedisServer != nil {
		TestRedisServer.Close()
	}
}

// TestDBConnection is a simple test to verify database connection
func TestDBConnection(t *testing.T) {
	SetupTestDB()
	defer CleanupTestDB(t)

	// Try to query the database
	var count int64
	err := TestDB.Model(&models.User{}).Count(&count).Error
	if err != nil {
		t.Fatalf("Failed to query test database: %v", err)
	}

	t.Logf("Database connection test successful. User count: %d", count)
}
