package models

import "gorm.io/gorm"

type Seat struct {
	gorm.Model
	TripID uint   `json:"trip_id" gorm:"not null"`
	Number int    `json:"number" gorm:"not null"`
	Status string `json:"status" gorm:"not null;default:'vacant'"` // vacant, booked, reserved
	Trip   Trip   `json:"trip" gorm:"foreignKey:TripID"`
}
