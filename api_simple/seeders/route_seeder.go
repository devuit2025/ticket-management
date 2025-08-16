package seeders

import (
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedRoutes() error {
	routes := []models.Route{
		{
			Origin:      "Hà Nội",
			Destination: "Sapa",
			Distance:    320,
			Duration:    "5h30m",
			BasePrice:   350000,
			IsActive:    true,
		},
		{
			Origin:      "Hà Nội",
			Destination: "Hải Phòng",
			Distance:    120,
			Duration:    "2h30m",
			BasePrice:   150000,
			IsActive:    true,
		},
	}

	for _, route := range routes {
		if err := config.DB.Create(&route).Error; err != nil {
			return err
		}
	}

	return nil
}
