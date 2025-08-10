package seeders

import (
	"log"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedRoutes() {
	log.Println("Seeding routes...")
	truncateTable("routes")

	routes := []models.Route{
		{
			Origin:      "Ho Chi Minh City",
			Destination: "Ha Noi",
			Distance:    1760,
			Duration:    "48h",
		},
		{
			Origin:      "Ho Chi Minh City",
			Destination: "Da Nang",
			Distance:    850,
			Duration:    "24h",
		},
		{
			Origin:      "Ha Noi",
			Destination: "Da Nang",
			Distance:    760,
			Duration:    "20h",
		},
	}

	for _, route := range routes {
		if err := config.DB.Create(&route).Error; err != nil {
			log.Fatalf("Failed to seed route: %v", err)
		}
	}
}
