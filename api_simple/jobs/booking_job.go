package jobs

import (
	"log"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"

	"gorm.io/gorm"
)

const (
	// BookingTimeout is the time to wait before cancelling unpaid bookings (15 minutes)
	BookingTimeout = 15
)

// StartBookingJobs starts all booking-related background jobs
func StartBookingJobs() {
	go CancelUnpaidBookings()
}

// CancelUnpaidBookings cancels all unpaid bookings that have exceeded the timeout
func CancelUnpaidBookings() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		bookingRepo := repository.NewBookingRepository(config.DB)
		seatRepo := repository.NewSeatRepository(config.DB)
		tripRepo := repository.NewTripRepository(config.DB)

		// Find pending bookings that have exceeded the timeout
		bookings, err := bookingRepo.FindPendingBookings(BookingTimeout)
		if err != nil {
			log.Printf("Error finding pending bookings: %v", err)
			continue
		}

		for _, booking := range bookings {
			// Cancel booking in transaction
			err := config.DB.Transaction(func(tx *gorm.DB) error {
				// Update booking status
				if err := bookingRepo.UpdateStatus(booking.ID, models.BookingStatusCancelled); err != nil {
					return err
				}

				// Update seat status
				for _, seatID := range booking.SeatIDs {
					if err := seatRepo.UpdateStatus(uint(seatID), models.SeatStatusAvailable); err != nil {
						return err
					}
				}

				// Update trip booked seats count
				trip, err := tripRepo.FindByID(booking.TripID)
				if err != nil {
					return err
				}
				trip.BookedSeats -= len(booking.SeatIDs)
				if err := tripRepo.Update(trip); err != nil {
					return err
				}

				return nil
			})

			if err != nil {
				log.Printf("Error cancelling booking %d: %v", booking.ID, err)
				continue
			}

			log.Printf("Successfully cancelled booking %d", booking.ID)
		}
	}
}
