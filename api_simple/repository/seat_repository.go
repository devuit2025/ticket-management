package repository

import (
	"time"

	"ticket-management/api_simple/models"

	"gorm.io/gorm"
)

type SeatRepository struct {
	db *gorm.DB
}

func NewSeatRepository(db *gorm.DB) *SeatRepository {
	return &SeatRepository{db: db}
}

// Create creates a new seat
func (r *SeatRepository) Create(seat *models.Seat) error {
	return r.db.Create(seat).Error
}

// FindByID finds a seat by ID
func (r *SeatRepository) FindByID(id uint) (*models.Seat, error) {
	var seat models.Seat
	err := r.db.First(&seat, id).Error
	if err != nil {
		return nil, err
	}
	return &seat, nil
}

// FindByIDs finds seats by IDs for a specific trip
func (r *SeatRepository) FindByIDs(tripID uint, seatIDs []int64) ([]models.Seat, error) {
	var seats []models.Seat
	err := r.db.Where("trip_id = ? AND id IN ?", tripID, seatIDs).Find(&seats).Error
	return seats, err
}

// FindByTrip finds all seats for a trip
func (r *SeatRepository) FindByTrip(tripID uint) ([]models.Seat, error) {
	var seats []models.Seat
	err := r.db.Where("trip_id = ?", tripID).Find(&seats).Error
	return seats, err
}

// FindAvailableByTrip finds available seats for a trip
func (r *SeatRepository) FindAvailableByTrip(tripID uint) ([]models.Seat, error) {
	var seats []models.Seat
	err := r.db.Where("trip_id = ? AND status = ?", tripID, models.SeatStatusAvailable).Find(&seats).Error
	return seats, err
}

// UpdateStatus updates seat status
func (r *SeatRepository) UpdateStatus(id uint, status models.SeatStatus) error {
	return r.db.Model(&models.Seat{}).Where("id = ?", id).Update("status", status).Error
}

// LockSeat locks a seat for a user
func (r *SeatRepository) LockSeat(id uint, userID uint, duration time.Duration) error {
	lockedUntil := time.Now().Add(duration)
	return r.db.Model(&models.Seat{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status":       models.SeatStatusLocked,
		"locked_until": lockedUntil,
		"locked_by":    userID,
	}).Error
}

// UnlockSeat unlocks a seat
func (r *SeatRepository) UnlockSeat(id uint) error {
	return r.db.Model(&models.Seat{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status":       models.SeatStatusAvailable,
		"locked_until": nil,
		"locked_by":    nil,
	}).Error
}

// UnlockExpiredSeats unlocks all seats that have expired locks
func (r *SeatRepository) UnlockExpiredSeats() error {
	return r.db.Model(&models.Seat{}).
		Where("status = ? AND locked_until < ?", models.SeatStatusLocked, time.Now()).
		Updates(map[string]interface{}{
			"status":       models.SeatStatusAvailable,
			"locked_until": nil,
			"locked_by":    nil,
		}).Error
}

// CountByStatus counts seats by status for a trip
func (r *SeatRepository) CountByStatus(tripID uint, status models.SeatStatus) (int64, error) {
	var count int64
	err := r.db.Model(&models.Seat{}).
		Where("trip_id = ? AND status = ?", tripID, status).
		Count(&count).Error
	return count, err
}
