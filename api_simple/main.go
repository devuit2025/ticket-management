package main

import (
	"log"
	"os"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/handlers"
	"ticket-management/api_simple/middleware"
	"ticket-management/api_simple/models"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default()

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

	// Initialize Redis
	config.InitRedis()

	// Setup routes
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
