package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type SeatStatus string

const (
	SeatStatusAvailable SeatStatus = "available" // Ghế trống
	SeatStatusBooked    SeatStatus = "booked"    // Đã đặt
	SeatStatusLocked    SeatStatus = "locked"    // Đang khóa (đang trong quá trình đặt)
)

type SeatType string

const (
	SeatTypeSingle  SeatType = "single"  // Ghế đơn
	SeatTypeDouble  SeatType = "double"  // Ghế đôi
	SeatTypeSpecial SeatType = "special" // Ghế đặc biệt (VIP, etc.)
)

type Seat struct {
	gorm.Model
	TripID      uint       `json:"trip_id" gorm:"not null"`
	Trip        *Trip      `json:"trip,omitempty"`
	Number      string     `json:"number" gorm:"not null"` // Số ghế (VD: A01, B02)
	Floor       int        `json:"floor" gorm:"not null"`  // Tầng (1 hoặc 2)
	Type        SeatType   `json:"type" gorm:"not null"`   // Loại ghế
	Status      SeatStatus `json:"status" gorm:"not null"` // Trạng thái ghế
	Price       float64    `json:"price"`                  // Giá ghế (có thể khác nhau theo loại)
	LockedUntil *time.Time `json:"locked_until,omitempty"` // Thời gian khóa ghế
	LockedBy    *uint      `json:"locked_by,omitempty"`    // ID người khóa ghế
}

// BeforeCreate hook to set default values
func (s *Seat) BeforeCreate(tx *gorm.DB) error {
	if s.Status == "" {
		s.Status = SeatStatusAvailable
	}
	if s.Price == 0 {
		// Get price from trip
		var trip Trip
		if err := tx.First(&trip, s.TripID).Error; err != nil {
			return err
		}
		// Apply price multiplier based on seat type
		multiplier := 1.0
		switch s.Type {
		case SeatTypeDouble:
			multiplier = 1.2
		case SeatTypeSpecial:
			multiplier = 1.5
		}
		s.Price = trip.Price * multiplier
	}
	return nil
}

// Validate validates seat data
func (s *Seat) Validate() error {
	if s.TripID == 0 {
		return errors.New("trip_id is required")
	}
	if s.Number == "" {
		return errors.New("seat number is required")
	}
	if s.Floor < 1 || s.Floor > 2 {
		return errors.New("floor must be 1 or 2")
	}
	if s.Type == "" {
		return errors.New("seat type is required")
	}
	if s.Status == "" {
		return errors.New("seat status is required")
	}
	if s.Price < 0 {
		return errors.New("price cannot be negative")
	}
	return nil
}
