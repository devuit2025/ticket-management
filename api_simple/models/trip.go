package models

import (
	"time"

	"gorm.io/gorm"
)

type TripStatus string

const (
	TripStatusUpcoming   TripStatus = "upcoming"
	TripStatusInProgress TripStatus = "in_progress"
	TripStatusCompleted  TripStatus = "completed"
	TripStatusCanceled   TripStatus = "canceled"
)

type Trip struct {
	gorm.Model
	RouteID       uint       `json:"route_id" gorm:"not null"`
	Route         Route      `json:"route" gorm:"foreignKey:RouteID"`
	BusID         uint       `json:"bus_id" gorm:"not null"`
	Bus           Bus        `json:"bus" gorm:"foreignKey:BusID"`
	DriverID      uint       `json:"driver_id" gorm:"not null"`
	Driver        User       `json:"driver" gorm:"foreignKey:DriverID"`
	DepartureTime time.Time  `json:"departure_time" gorm:"not null"`
	Status        TripStatus `json:"status" gorm:"type:varchar(20);default:'upcoming'"`
	Price         float64    `json:"price" gorm:"not null"`
	Seats         []Seat     `json:"seats" gorm:"foreignKey:TripID"`
}
