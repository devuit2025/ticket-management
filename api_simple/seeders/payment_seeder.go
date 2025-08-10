package seeders

import (
	"log"
	"math/rand"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedPayments() {
	log.Println("Seeding payments...")
	truncateTable("payments")

	var bookings []models.Booking
	if err := config.DB.Preload("Trip").Find(&bookings).Error; err != nil {
		log.Fatalf("Failed to fetch bookings: %v", err)
	}

	for _, booking := range bookings {
		// 80% chance of payment being completed
		if rand.Float32() < 0.8 {
			payment := models.Payment{
				BookingID: booking.ID,
				Amount:    booking.Trip.Price,
				Method:    "CASH",
				Status:    models.PaymentStatusCompleted,
			}

			if err := config.DB.Create(&payment).Error; err != nil {
				log.Printf("Failed to create payment: %v", err)
				continue
			}

			// Update booking status
			booking.Status = models.BookingStatusConfirmed
			if err := config.DB.Save(&booking).Error; err != nil {
				log.Printf("Failed to update booking status: %v", err)
			}
		}
	}
}
