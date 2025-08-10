package seeders

import (
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedBuses() error {
	buses := []models.Bus{
		{
			PlateNumber: "29B-12345",
			Type:        "Giường nằm",
			SeatCount:   40,
			FloorCount:  2,
			IsActive:    true,
		},
		{
			PlateNumber: "29B-12346",
			Type:        "Ghế ngồi",
			SeatCount:   45,
			FloorCount:  1,
			IsActive:    true,
		},
	}

	for _, bus := range buses {
		if err := config.DB.Create(&bus).Error; err != nil {
			return err
		}
	}

	return nil
}
