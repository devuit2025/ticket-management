package seeders

import (
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedRoutes() error {
	routes := []models.Route{
		// Northern Vietnam
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
		{
			Origin:      "Hà Nội",
			Destination: "Ninh Bình",
			Distance:    95,
			Duration:    "2h",
			BasePrice:   120000,
			IsActive:    true,
		},

		// Central Vietnam
		{
			Origin:      "Đà Nẵng",
			Destination: "Hội An",
			Distance:    30,
			Duration:    "45m",
			BasePrice:   70000,
			IsActive:    true,
		},
		{
			Origin:      "Đà Nẵng",
			Destination: "Huế",
			Distance:    100,
			Duration:    "2h30m",
			BasePrice:   150000,
			IsActive:    true,
		},
		{
			Origin:      "Đà Nẵng",
			Destination: "Quảng Ngãi",
			Distance:    180,
			Duration:    "4h",
			BasePrice:   200000,
			IsActive:    true,
		},

		// Southern Vietnam
		{
			Origin:      "Hồ Chí Minh",
			Destination: "Cần Thơ",
			Distance:    170,
			Duration:    "3h30m",
			BasePrice:   180000,
			IsActive:    true,
		},
		{
			Origin:      "Hồ Chí Minh",
			Destination: "Vũng Tàu",
			Distance:    120,
			Duration:    "2h30m",
			BasePrice:   150000,
			IsActive:    true,
		},
		{
			Origin:      "Hồ Chí Minh",
			Destination: "Đà Lạt",
			Distance:    300,
			Duration:    "6h",
			BasePrice:   320000,
			IsActive:    true,
		},
	}

	// Insert routes into DB
	for _, route := range routes {
		if err := config.DB.Create(&route).Error; err != nil {
			return err
		}
	}

	return nil
}
