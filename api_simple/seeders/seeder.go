package seeders

import (
	"log"
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func Seed() {
	// Clean up old data
	config.DB.Exec("DELETE FROM seats")
	config.DB.Exec("DELETE FROM bookings")
	config.DB.Exec("DELETE FROM trips")
	config.DB.Exec("DELETE FROM buses")
	config.DB.Exec("DELETE FROM routes")
	config.DB.Exec("DELETE FROM users")

	// Reset auto increment
	config.DB.Exec("ALTER SEQUENCE users_id_seq RESTART WITH 1")
	config.DB.Exec("ALTER SEQUENCE routes_id_seq RESTART WITH 1")
	config.DB.Exec("ALTER SEQUENCE buses_id_seq RESTART WITH 1")
	config.DB.Exec("ALTER SEQUENCE trips_id_seq RESTART WITH 1")
	config.DB.Exec("ALTER SEQUENCE seats_id_seq RESTART WITH 1")
	config.DB.Exec("ALTER SEQUENCE bookings_id_seq RESTART WITH 1")

	// Seed users
	if err := seedUsers(); err != nil {
		log.Fatal("Error seeding users:", err)
	}

	// Seed routes
	if err := seedRoutes(); err != nil {
		log.Fatal("Error seeding routes:", err)
	}

	// Seed buses
	if err := seedBuses(); err != nil {
		log.Fatal("Error seeding buses:", err)
	}

	// Seed trips
	if err := seedTrips(); err != nil {
		log.Fatal("Error seeding trips:", err)
	}

	// Get all trips
	var trips []models.Trip
	if err := config.DB.Find(&trips).Error; err != nil {
		log.Fatal("Error finding trips:", err)
	}

	// Seed seats for each trip
	for _, trip := range trips {
		if err := SeedSeats(config.DB, trip.ID, trip.Price); err != nil {
			log.Fatal("Error seeding seats:", err)
		}
	}

	if err := seedMultipleTrips(); err != nil {
		log.Fatal("Error seeding trips:", err)
	}

	log.Println("Seeding completed successfully!")
}
