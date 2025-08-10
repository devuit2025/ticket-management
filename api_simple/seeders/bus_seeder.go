package seeders

import (
	"log"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedBuses() {
	log.Println("Seeding buses...")
	truncateTable("buses")

	buses := []models.Bus{
		{
			PlateNumber: "51A-12345",
			Type:        "Sleeper",
			SeatCount:   40,
		},
		{
			PlateNumber: "51A-12346",
			Type:        "Seater",
			SeatCount:   45,
		},
		{
			PlateNumber: "51A-12347",
			Type:        "Limousine",
			SeatCount:   30,
		},
	}

	for _, bus := range buses {
		if err := config.DB.Create(&bus).Error; err != nil {
			log.Fatalf("Failed to seed bus: %v", err)
		}
	}
}
