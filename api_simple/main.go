package main

import (
	"log"
	"os"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/handlers"
	"ticket-management/api_simple/middleware"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/seeders"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	config.InitDB()

	// Auto Migrate the models
	if err := config.DB.AutoMigrate(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Trip{},
		&models.Seat{},
		&models.Booking{},
		&models.Payment{},
	); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Run seeders if --seed flag is provided
	if len(os.Args) > 1 && os.Args[1] == "--seed" {
		seeders.Seed()
		return
	}

	// Initialize Redis
	config.InitRedis()

	// Setup routes
	r := gin.Default()
	setupRoutes(r)

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}

func setupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")

	// Public routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)

		// Password reset flow
		auth.POST("/forgot-password", handlers.ForgotPassword)
		auth.POST("/verify-otp", handlers.VerifyOTP)
		auth.POST("/reset-password", handlers.ResetPassword)
	}

	// Public booking routes
	bookings := api.Group("/bookings")
	{
		bookings.POST("", handlers.CreateBooking)
		bookings.GET("/:id", handlers.GetBooking)
		bookings.PUT("/:id/cancel", handlers.CancelBooking)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Auth routes that require authentication
		auth := protected.Group("/auth")
		{
			auth.POST("/logout", handlers.Logout)
			auth.POST("/change-password", handlers.ChangePassword)
		}

		// Trip routes
		trips := protected.Group("/trips")
		{
			trips.GET("", handlers.GetTrips)
			trips.GET("/:id", handlers.GetTrip)
			trips.POST("", middleware.AdminMiddleware(), handlers.CreateTrip)
			trips.PUT("/:id", middleware.AdminMiddleware(), handlers.UpdateTrip)
			trips.DELETE("/:id", middleware.AdminMiddleware(), handlers.DeleteTrip)
		}

		// Admin routes
		admin := protected.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		{
			admin.GET("/users", handlers.GetUsers)
			admin.GET("/bookings", handlers.GetAllBookings)
			admin.GET("/statistics", handlers.GetStatistics)
		}
	}
}
