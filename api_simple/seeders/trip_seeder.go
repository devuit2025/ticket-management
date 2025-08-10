package seeders

import (
	"log"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedTrips() {
	log.Println("Seeding trips...")
	truncateTable("trips")
	truncateTable("seats")

	// Get sample data
	var routes []models.Route
	if err := config.DB.Find(&routes).Error; err != nil {
		log.Fatalf("Failed to fetch routes: %v", err)
	}

	var buses []models.Bus
	if err := config.DB.Find(&buses).Error; err != nil {
		log.Fatalf("Failed to fetch buses: %v", err)
	}

	var drivers []models.User
	if err := config.DB.Where("role = ?", models.RoleDriver).Find(&drivers).Error; err != nil {
		log.Fatalf("Failed to fetch drivers: %v", err)
	}

	// Create trips for next 7 days
	for i := 0; i < 7; i++ {
		departureTime := time.Now().AddDate(0, 0, i)

		for _, route := range routes {
			for _, bus := range buses {
				trip := models.Trip{
					RouteID:       route.ID,
					BusID:         bus.ID,
					DriverID:      drivers[0].ID, // Using first driver for simplicity
					DepartureTime: departureTime,
					Price:         500000 + float64(route.Distance)*1000,
					Status:        models.TripStatusUpcoming,
				}

				if err := config.DB.Create(&trip).Error; err != nil {
					log.Fatalf("Failed to seed trip: %v", err)
				}

				// Create seats for the trip
				for seatNum := 1; seatNum <= bus.SeatCount; seatNum++ {
					seat := models.Seat{
						TripID: trip.ID,
						Number: seatNum,
						Status: "vacant",
					}
					if err := config.DB.Create(&seat).Error; err != nil {
						log.Fatalf("Failed to seed seat: %v", err)
					}
				}
			}
		}
	}
}
