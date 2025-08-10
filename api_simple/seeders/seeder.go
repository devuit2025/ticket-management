package seeders

import (
	"log"

	"ticket-management/api_simple/config"
)

func Seed() {
	// Seed in order of dependencies
	seedUsers()
	seedRoutes()
	seedBuses()
	seedTrips()
	seedBookings()
	seedPayments()

	log.Println("Seeding completed successfully!")
}

func truncateTable(tableName string) {
	config.DB.Exec("TRUNCATE TABLE " + tableName + " CASCADE")
}
