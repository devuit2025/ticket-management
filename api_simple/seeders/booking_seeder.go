package seeders

import (
	"log"
	"math/rand"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"

	"gorm.io/gorm"
)

func seedBookings() {
	log.Println("Seeding bookings...")
	truncateTable("bookings")

	// Get sample data
	var customers []models.User
	if err := config.DB.Where("role = ?", models.RoleCustomer).Find(&customers).Error; err != nil {
		log.Fatalf("Failed to fetch customers: %v", err)
	}

	var trips []models.Trip
	if err := config.DB.Find(&trips).Error; err != nil {
		log.Fatalf("Failed to fetch trips: %v", err)
	}

	// Create random bookings
	for _, customer := range customers {
		// Create 2-3 bookings per customer
		numBookings := rand.Intn(2) + 2
		for i := 0; i < numBookings; i++ {
			// Select random trip
			trip := trips[rand.Intn(len(trips))]

			// Get available seat
			var seat models.Seat
			if err := config.DB.Where("trip_id = ? AND status = ?", trip.ID, "vacant").First(&seat).Error; err != nil {
				continue // Skip if no seats available
			}

			// Create booking
			booking := models.Booking{
				UserID: customer.ID,
				TripID: trip.ID,
				SeatID: seat.ID,
				Status: models.BookingStatusPending,
			}

			// Use transaction to update both booking and seat
			err := config.DB.Transaction(func(tx *gorm.DB) error {
				if err := tx.Create(&booking).Error; err != nil {
					return err
				}

				// Update seat status
				seat.Status = "booked"
				if err := tx.Save(&seat).Error; err != nil {
					return err
				}

				return nil
			})

			if err != nil {
				log.Printf("Failed to create booking: %v", err)
				continue
			}
		}
	}
}
