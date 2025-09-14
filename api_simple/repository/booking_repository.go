package repository

import (
	"fmt"
	"ticket-management/api_simple/models"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type BookingRepository struct {
	db *gorm.DB
}

func NewBookingRepository(db *gorm.DB) *BookingRepository {
	return &BookingRepository{db: db}
}

// Create creates a new booking
func (r *BookingRepository) Create(booking *models.Booking) error {
	return r.db.Create(booking).Error
}

// FindByID finds a booking by ID
func (r *BookingRepository) FindByID(id uint) (*models.Booking, error) {
	var booking models.Booking
	err := r.db.Preload("User").Preload("Trip.Route").Preload("Trip.Bus").Preload("Seats").First(&booking, id).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

// FindByCode finds a booking by booking code
func (r *BookingRepository) FindByCode(code string) (*models.Booking, error) {
	var booking models.Booking
	err := r.db.Preload("User").Preload("Trip.Route").Preload("Trip.Bus").Preload("Seats").Where("booking_code = ?", code).First(&booking).Error
	if err != nil {
		return nil, err
	}
	return &booking, nil
}

// FindAll finds all bookings with optional filters
func (r *BookingRepository) FindAll(filters map[string]interface{}, page, limit int) ([]models.Booking, int64, error) {
	var bookings []models.Booking
	var total int64

	query := r.db.Model(&models.Booking{})

	// Apply filters
	if filters != nil {
		query = query.Where(filters)
	}

	// Get total count
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err = query.Preload("User").Preload("Trip.Route").Preload("Trip.Bus").
		Offset((page - 1) * limit).
		Limit(limit).
		Find(&bookings).Error
	if err != nil {
		return nil, 0, err
	}

	// Load seats for each booking based on SeatIDs
	for i := range bookings {
		if len(bookings[i].SeatIDs) > 0 {
			var seats []models.Seat
			// Convert pq.Int64Array to []int64 slice
			seatIDs := []int64(bookings[i].SeatIDs)
			err := r.db.Where("id IN ?", seatIDs).Find(&seats).Error
			if err == nil {
				bookings[i].Seats = seats
			}
		}
	}

	return bookings, total, nil
}

// FindByUserID finds all bookings for a user
func (r *BookingRepository) FindByUserID(userID uint, page, limit int) ([]models.Booking, int64, error) {
	return r.FindAll(map[string]interface{}{"user_id": userID}, page, limit)
}

// FindByGuestPhone finds all bookings for a guest by phone number
func (r *BookingRepository) FindByGuestPhone(phone string, page, limit int) ([]models.Booking, int64, error) {
	return r.FindAll(map[string]interface{}{"guest_info_phone": phone}, page, limit)
}

// Update updates a booking
func (r *BookingRepository) Update(booking *models.Booking) error {
	return r.db.Save(booking).Error
}

// UpdateStatus updates booking status
func (r *BookingRepository) UpdateStatus(id uint, status models.BookingStatus) error {
	return r.db.Model(&models.Booking{}).Where("id = ?", id).Update("status", status).Error
}

// UpdatePaymentStatus updates payment status
func (r *BookingRepository) UpdatePaymentStatus(id uint, status models.PaymentStatus) error {
	return r.db.Model(&models.Booking{}).Where("id = ?", id).Update("payment_status", status).Error
}

// Delete soft deletes a booking
func (r *BookingRepository) Delete(id uint) error {
	return r.db.Delete(&models.Booking{}, id).Error
}

// FindPendingBookings finds all pending bookings that have exceeded the timeout
func (r *BookingRepository) FindPendingBookings(timeout int) ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Where("status = ? AND payment_status = ? AND created_at <= NOW() - INTERVAL ?",
		models.BookingStatusPending,
		models.PaymentStatusUnpaid,
		fmt.Sprintf("'%d minutes'", timeout)).
		Find(&bookings).Error
	return bookings, err
}

// FindConflictingBookings finds any active bookings that have overlapping seats for a trip
func (r *BookingRepository) FindConflictingBookings(tripID uint, seatIDs []int64) ([]models.Booking, error) {
	var bookings []models.Booking
	err := r.db.Where("trip_id = ? AND status != ? AND EXISTS (SELECT 1 FROM unnest(seat_ids) s WHERE s = ANY(?))",
		tripID,
		models.BookingStatusCancelled,
		pq.Array(seatIDs)).
		Find(&bookings).Error
	return bookings, err
}

// CountBookingsByTrip counts the number of bookings for a trip
func (r *BookingRepository) CountBookingsByTrip(tripID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Booking{}).
		Where("trip_id = ? AND status != ?", tripID, models.BookingStatusCancelled).
		Count(&count).Error
	return count, err
}

// CountBookingsByUser counts the number of bookings for a user
func (r *BookingRepository) CountBookingsByUser(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Booking{}).
		Where("user_id = ?", userID).
		Count(&count).Error
	return count, err
}
