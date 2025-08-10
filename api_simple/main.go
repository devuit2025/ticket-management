package main

import (
	"log"
	"os"
	"ticket-management/middleware"

	"github.com/devuit2025/ticket_management/api_simple/handlers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default()

	// Initialize database
	initDB()

	// Initialize Redis
	initRedis()

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

	// Auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// User routes
		users := protected.Group("/users")
		{
			users.GET("/me", handlers.GetProfile)
			users.PUT("/me", handlers.UpdateProfile)
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

		// Booking routes
		bookings := protected.Group("/bookings")
		{
			bookings.POST("", handlers.CreateBooking)
			bookings.GET("", handlers.GetUserBookings)
			bookings.GET("/:id", handlers.GetBooking)
			bookings.PUT("/:id/cancel", handlers.CancelBooking)
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
