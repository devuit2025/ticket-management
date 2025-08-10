package repository

import (
	"ticket-management/api_simple/models"

	"gorm.io/gorm"
)

type BusRepository struct {
	db *gorm.DB
}

func NewBusRepository(db *gorm.DB) *BusRepository {
	return &BusRepository{db: db}
}

// Create creates a new bus
func (r *BusRepository) Create(bus *models.Bus) error {
	return r.db.Create(bus).Error
}

// FindByID finds a bus by ID
func (r *BusRepository) FindByID(id uint) (*models.Bus, error) {
	var bus models.Bus
	err := r.db.First(&bus, id).Error
	if err != nil {
		return nil, err
	}
	return &bus, nil
}

// FindAll finds all buses with optional filters
func (r *BusRepository) FindAll(filters map[string]interface{}) ([]models.Bus, error) {
	var buses []models.Bus
	query := r.db

	if filters != nil {
		query = query.Where(filters)
	}

	err := query.Find(&buses).Error
	return buses, err
}

// Update updates a bus
func (r *BusRepository) Update(bus *models.Bus) error {
	return r.db.Save(bus).Error
}

// Delete soft deletes a bus
func (r *BusRepository) Delete(id uint) error {
	return r.db.Delete(&models.Bus{}, id).Error
}

// Exists checks if a bus exists with the given filters
func (r *BusRepository) Exists(filters map[string]interface{}) (bool, error) {
	var count int64
	err := r.db.Model(&models.Bus{}).Where(filters).Count(&count).Error
	return count > 0, err
}

// GetBusStatistics gets statistics for a bus
func (r *BusRepository) GetBusStatistics(busID uint) (map[string]interface{}, error) {
	var stats = make(map[string]interface{})

	// Get total trips
	var totalTrips int64
	if err := r.db.Model(&models.Trip{}).
		Where("bus_id = ?", busID).
		Count(&totalTrips).Error; err != nil {
		return nil, err
	}
	stats["total_trips"] = totalTrips

	// Get upcoming trips
	var upcomingTrips int64
	if err := r.db.Model(&models.Trip{}).
		Where("bus_id = ? AND is_completed = ?", busID, false).
		Count(&upcomingTrips).Error; err != nil {
		return nil, err
	}
	stats["upcoming_trips"] = upcomingTrips

	// Get total revenue
	var totalRevenue float64
	if err := r.db.Model(&models.Booking{}).
		Joins("JOIN trips ON trips.id = bookings.trip_id").
		Where("trips.bus_id = ? AND bookings.status = ? AND bookings.payment_status = ?",
			busID,
			models.BookingStatusConfirmed,
			models.PaymentStatusPaid).
		Select("COALESCE(SUM(bookings.total_amount), 0)").
		Row().
		Scan(&totalRevenue); err != nil {
		return nil, err
	}
	stats["total_revenue"] = totalRevenue

	return stats, nil
}

// GetAvailableBuses gets buses that are available for a trip
func (r *BusRepository) GetAvailableBuses(departureTime string) ([]models.Bus, error) {
	var buses []models.Bus
	err := r.db.
		Where("is_active = ? AND id NOT IN (SELECT bus_id FROM trips WHERE departure_time = ? AND is_completed = ?)",
			true, departureTime, false).
		Find(&buses).Error
	return buses, err
}

// GetPopularBuses gets most used buses
func (r *BusRepository) GetPopularBuses(limit int) ([]models.Bus, error) {
	var buses []models.Bus
	err := r.db.
		Joins("LEFT JOIN trips ON trips.bus_id = buses.id").
		Group("buses.id").
		Order("COUNT(trips.id) DESC").
		Limit(limit).
		Find(&buses).Error
	return buses, err
}
