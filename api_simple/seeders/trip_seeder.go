package seeders

import (
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/utils"
)

func seedTrips() error {
	trips := []models.Trip{
		{
			RouteID:       1,
			BusID:         1,
			DriverID:      3,
			DepartureTime: utils.ParseTime("2025-08-15 20:00:00"),
			Price:         380000,
			IsActive:      true,
			IsCompleted:   false,
			TotalSeats:    40,
			BookedSeats:   0,
		},
		{
			RouteID:       2,
			BusID:         2,
			DriverID:      3,
			DepartureTime: utils.ParseTime("2025-08-15 08:00:00"),
			Price:         180000,
			IsActive:      true,
			IsCompleted:   false,
			TotalSeats:    45,
			BookedSeats:   0,
		},
	}

	for _, trip := range trips {
		if err := config.DB.Create(&trip).Error; err != nil {
			return err
		}
	}

	return nil
}
