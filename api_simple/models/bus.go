package models

import (
	"gorm.io/gorm"
)

type Bus struct {
	gorm.Model
	PlateNumber string `json:"plate_number" gorm:"unique"` // Biển số xe
	Type        string `json:"type"`                       // Loại xe (Giường nằm, Ghế ngồi, ...)
	SeatCount   int    `json:"seat_count"`                 // Số ghế
	FloorCount  int    `json:"floor_count"`                // Số tầng (1 hoặc 2)
	IsActive    bool   `json:"is_active"`                  // Trạng thái hoạt động
}
