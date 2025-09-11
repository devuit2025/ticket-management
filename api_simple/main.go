package main

import (
	"fmt"
	"log"
	"os"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/handlers"
	"ticket-management/api_simple/jobs"
	"ticket-management/api_simple/middleware"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/seeders"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	config.InitDB()


	// config.InitRedis()

	// Auto migrate database
	config.DB.AutoMigrate(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Trip{},
		&models.Seat{},
		&models.Booking{},
	)

	// Seed database
	seeders.Seed()

	// Start background jobs
	jobs.StartBookingJobs()

	// Initialize router
	router := gin.Default()

	// Setup routes
	api := router.Group("/api/v1")
	setupRoutes(api)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	router.Run(fmt.Sprintf(":%s", port))
}

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

	// Booking routes (public)
	api.POST("/bookings", handlers.CreateBooking)
	api.GET("/bookings/:code", handlers.GetBookingByCode)

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/auth/logout", handlers.Logout)
		protected.POST("/auth/change-password", handlers.ChangePassword)

		// Booking routes (authenticated)
		protected.GET("/bookings", handlers.GetUserBookings)
		protected.PUT("/bookings/:id/cancel", handlers.CancelBooking)

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

			// Booking management
			admin.GET("/bookings", handlers.GetAllBookings)
			admin.PUT("/bookings/:id/confirm", handlers.ConfirmBooking)
			admin.PUT("/bookings/:id/payment", handlers.UpdateBookingPayment)

			// User management
			admin.GET("/users", handlers.GetUsers)
			admin.GET("/statistics", handlers.GetStatistics)
		}
	}
}
