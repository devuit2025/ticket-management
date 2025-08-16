package models

import (
	"errors"
	"fmt"
	"time"

	"ticket-management/api_simple/utils"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type BookingStatus string

const (
	BookingStatusPending   BookingStatus = "pending"   // Đang chờ xác nhận
	BookingStatusConfirmed BookingStatus = "confirmed" // Đã xác nhận
	BookingStatusCancelled BookingStatus = "cancelled" // Đã hủy
)

type PaymentType string

const (
	PaymentTypeCash PaymentType = "cash" // Tiền mặt
)

type PaymentStatus string

const (
	PaymentStatusUnpaid   PaymentStatus = "unpaid"   // Chưa thanh toán
	PaymentStatusPaid     PaymentStatus = "paid"     // Đã thanh toán
	PaymentStatusRefunded PaymentStatus = "refunded" // Đã hoàn tiền
)

// GuestInfo stores information about non-logged-in customers
type GuestInfo struct {
	Name  string `json:"name" gorm:"not null"`  // Tên khách
	Phone string `json:"phone" gorm:"not null"` // Số điện thoại
	Email string `json:"email"`                 // Email (không bắt buộc)
}

// Booking represents a ticket booking
type Booking struct {
	gorm.Model
	UserID        *uint         `json:"user_id"`                                         // ID người dùng (nếu đã đăng nhập)
	User          *User         `json:"user,omitempty"`                                  // Thông tin người dùng
	GuestInfo     *GuestInfo    `json:"guest_info,omitempty" gorm:"embedded"`            // Thông tin khách vãng lai
	TripID        uint          `json:"trip_id" gorm:"not null"`                         // ID chuyến đi
	Trip          *Trip         `json:"trip,omitempty"`                                  // Thông tin chuyến đi
	SeatIDs       pq.Int64Array `json:"seat_ids" gorm:"type:integer[];not null"`         // Danh sách ID ghế
	Seats         []Seat        `json:"seats,omitempty" gorm:"many2many:booking_seats;"` // Thông tin ghế
	TotalAmount   float64       `json:"total_amount" gorm:"not null"`                    // Tổng tiền
	Status        BookingStatus `json:"status" gorm:"not null;default:'pending'"`        // Trạng thái đặt vé
	PaymentType   PaymentType   `json:"payment_type" gorm:"not null;default:'cash'"`     // Hình thức thanh toán
	PaymentStatus PaymentStatus `json:"payment_status" gorm:"not null;default:'unpaid'"` // Trạng thái thanh toán
	BookingCode   string        `json:"booking_code" gorm:"unique;not null"`             // Mã đặt vé
	Note          string        `json:"note"`                                            // Ghi chú
}

// BeforeCreate hook to generate booking code
func (b *Booking) BeforeCreate(tx *gorm.DB) error {
	// Generate unique booking code
	code, err := generateBookingCode()
	if err != nil {
		return err
	}
	b.BookingCode = code
	return nil
}

// Validate booking data
func (b *Booking) Validate() error {
	// Must have either UserID or GuestInfo
	if b.UserID == nil && b.GuestInfo == nil {
		return errors.New("booking must have either user_id or guest_info")
	}

	// Must have at least one seat
	if len(b.SeatIDs) == 0 {
		return errors.New("booking must have at least one seat")
	}

	// Total amount must be positive
	if b.TotalAmount <= 0 {
		return errors.New("total amount must be positive")
	}

	// Validate guest info if present
	if b.GuestInfo != nil {
		if b.GuestInfo.Name == "" {
			return errors.New("guest name is required")
		}
		if !utils.ValidatePhone(b.GuestInfo.Phone) {
			return errors.New("invalid guest phone number")
		}
		if b.GuestInfo.Email != "" && !utils.ValidateEmail(b.GuestInfo.Email) {
			return errors.New("invalid guest email")
		}
	}

	return nil
}

// generateBookingCode generates a unique booking code
func generateBookingCode() (string, error) {
	// Format: BK-YYYYMMDD-XXXXXX
	// Example: BK-20240810-A12B3C
	timestamp := time.Now().Format("20060102")
	randomStr := utils.GenerateRandomString(6)
	return fmt.Sprintf("BK-%s-%s", timestamp, randomStr), nil
}
