package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Trip struct {
	gorm.Model
	RouteID       uint      `json:"route_id"`
	Route         *Route    `json:"route,omitempty"`
	BusID         uint      `json:"bus_id"`
	Bus           *Bus      `json:"bus,omitempty"`
	DriverID      uint      `json:"driver_id"`
	Driver        *User     `json:"driver,omitempty"`
	DepartureTime time.Time `json:"departure_time"`
	Price         float64   `json:"price"`
	IsActive      bool      `json:"is_active" gorm:"default:true"`     // Trạng thái hoạt động
	IsCompleted   bool      `json:"is_completed" gorm:"default:false"` // Đã hoàn thành chuyến
	TotalSeats    int       `json:"total_seats"`                       // Tổng số ghế
	BookedSeats   int       `json:"booked_seats"`                      // Số ghế đã đặt
	Note          string    `json:"note"`                              // Ghi chú
}

// BeforeCreate hook to set default values
func (t *Trip) BeforeCreate(tx *gorm.DB) error {
	if t.Price == 0 {
		// Get base price from route
		var route Route
		if err := tx.First(&route, t.RouteID).Error; err != nil {
			return err
		}
		t.Price = route.BasePrice
	}

	// Get total seats from bus
	var bus Bus
	if err := tx.First(&bus, t.BusID).Error; err != nil {
		return err
	}
	t.TotalSeats = bus.SeatCount

	return nil
}

// Validate validates trip data
func (t *Trip) Validate() error {
	if t.RouteID == 0 {
		return errors.New("route_id is required")
	}
	if t.BusID == 0 {
		return errors.New("bus_id is required")
	}
	if t.DriverID == 0 {
		return errors.New("driver_id is required")
	}
	if t.DepartureTime.Before(time.Now()) {
		return errors.New("departure_time must be in the future")
	}
	if t.Price <= 0 {
		return errors.New("price must be positive")
	}
	return nil
}
