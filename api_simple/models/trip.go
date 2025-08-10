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
	ID           uint           `json:"id" gorm:"primaryKey"`
	RouteID      uint           `json:"route_id"`
	Route        Route          `json:"route"`
	BusID        uint           `json:"bus_id"`
	Bus          Bus            `json:"bus"`
	DriverID     uint           `json:"driver_id"`
	Driver       User           `json:"driver"`
	DepartureTime time.Time     `json:"departure_time"`
	Status       TripStatus     `json:"status" gorm:"type:varchar(20);default:'upcoming'"`
	Price        float64        `json:"price"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

type Route struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	Origin          string         `json:"origin" gorm:"not null"`
	Destination     string         `json:"destination" gorm:"not null"`
	EstimatedTime   int           `json:"estimated_time"` // in minutes
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}

type Bus struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	PlateNumber string         `json:"plate_number" gorm:"unique;not null"`
	Type        string         `json:"type" gorm:"not null"`
	SeatCount   int           `json:"seat_count" gorm:"not null"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type Seat struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	TripID    uint           `json:"trip_id"`
	Trip      Trip           `json:"trip"`
	Number    string         `json:"number" gorm:"not null"`
	Status    string         `json:"status" gorm:"type:varchar(20);default:'vacant'"` // vacant, reserved, paid, boarded
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
} 