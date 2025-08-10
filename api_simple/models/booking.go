package models

import (
	"time"

	"gorm.io/gorm"
)

type BookingStatus string

const (
	BookingStatusPending   BookingStatus = "pending"
	BookingStatusConfirmed BookingStatus = "confirmed"
	BookingStatusCanceled  BookingStatus = "canceled"
	BookingStatusCompleted BookingStatus = "completed"
)

type Booking struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	UserID    uint           `json:"user_id"`
	User      User           `json:"user"`
	TripID    uint           `json:"trip_id"`
	Trip      Trip           `json:"trip"`
	SeatID    uint           `json:"seat_id"`
	Seat      Seat           `json:"seat"`
	Status    BookingStatus  `json:"status" gorm:"type:varchar(20);default:'pending'"`
	Payment   Payment        `json:"payment"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "pending"
	PaymentStatusCompleted PaymentStatus = "completed"
	PaymentStatusFailed    PaymentStatus = "failed"
	PaymentStatusRefunded  PaymentStatus = "refunded"
)

type PaymentMethod string

const (
	PaymentMethodCash    PaymentMethod = "cash"
	PaymentMethodEWallet PaymentMethod = "e_wallet"
	PaymentMethodBank    PaymentMethod = "bank"
)

type Payment struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	BookingID     uint           `json:"booking_id"`
	Amount        float64        `json:"amount"`
	Method        PaymentMethod  `json:"method" gorm:"type:varchar(20)"`
	Status        PaymentStatus  `json:"status" gorm:"type:varchar(20);default:'pending'"`
	TransactionID string         `json:"transaction_id"`
	PaidAt        *time.Time     `json:"paid_at"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
} 