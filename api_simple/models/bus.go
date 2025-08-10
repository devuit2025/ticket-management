package models

import "gorm.io/gorm"

type Bus struct {
	gorm.Model
	PlateNumber string `json:"plate_number" gorm:"unique;not null"`
	Type        string `json:"type" gorm:"not null"`
	SeatCount   int    `json:"seat_count" gorm:"not null"`
}
