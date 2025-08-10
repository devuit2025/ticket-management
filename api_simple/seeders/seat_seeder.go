package seeders

import (
	"fmt"
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func SeedSeats(tripID uint, basePrice float64) error {
	// Create seats for floor 1 (downstairs)
	for i := 1; i <= 20; i++ {
		seatNumber := fmt.Sprintf("A%02d", i)
		seatType := models.SeatTypeSingle
		price := basePrice

		// Special seats (first 4 seats)
		if i <= 4 {
			seatType = models.SeatTypeSpecial
			price = basePrice * 1.2 // +20% for special
		}

		// Double seats (odd numbers)
		if i%2 != 0 {
			seatType = models.SeatTypeDouble
		}

		seat := models.Seat{
			TripID: tripID,
			Number: seatNumber,
			Type:   seatType,
			Floor:  1,
			Status: models.SeatStatusAvailable,
			Price:  price,
		}

		if err := config.DB.Create(&seat).Error; err != nil {
			return err
		}
	}

	// Create seats for floor 2 (upstairs)
	for i := 1; i <= 20; i++ {
		seatNumber := fmt.Sprintf("B%02d", i)
		seatType := models.SeatTypeSingle
		price := basePrice * 1.1 // +10% for upstairs

		// Special seats (first 4 seats)
		if i <= 4 {
			seatType = models.SeatTypeSpecial
			price = basePrice * 1.3 // +30% for special upstairs
		}

		// Double seats (odd numbers)
		if i%2 != 0 {
			seatType = models.SeatTypeDouble
		}

		seat := models.Seat{
			TripID: tripID,
			Number: seatNumber,
			Type:   seatType,
			Floor:  2,
			Status: models.SeatStatusAvailable,
			Price:  price,
		}

		if err := config.DB.Create(&seat).Error; err != nil {
			return err
		}
	}

	return nil
}
