package repository

import (
	"time"

	"ticket-management/api_simple/models"

	"gorm.io/gorm"
)

type TripRepository struct {
	db *gorm.DB
}

func NewTripRepository(db *gorm.DB) *TripRepository {
	return &TripRepository{db: db}
}

// Create creates a new trip
func (r *TripRepository) Create(trip *models.Trip) error {
	return r.db.Create(trip).Error
}

// FindByID finds a trip by ID
func (r *TripRepository) FindByID(id uint) (*models.Trip, error) {
	var trip models.Trip
	err := r.db.Preload("Route").Preload("Bus").Preload("Driver").First(&trip, id).Error
	if err != nil {
		return nil, err
	}
	return &trip, nil
}

// FindAll finds all trips with optional filters
func (r *TripRepository) FindAll(filters map[string]interface{}) ([]models.Trip, error) {
	var trips []models.Trip
	query := r.db.Preload("Route").Preload("Bus").Preload("Driver")

	if filters != nil {
		query = query.Where(filters)
	}

	err := query.Find(&trips).Error
	return trips, err
}

// Update updates a trip
func (r *TripRepository) Update(trip *models.Trip) error {
	return r.db.Save(trip).Error
}

// Delete soft deletes a trip
func (r *TripRepository) Delete(id uint) error {
	return r.db.Delete(&models.Trip{}, id).Error
}

// FindAvailableTrips finds available trips by route and date
func (r *TripRepository) FindAvailableTrips(routeID uint, date time.Time) ([]models.Trip, error) {
	var trips []models.Trip
	startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	err := r.db.Preload("Route").Preload("Bus").Preload("Driver").
		Where("route_id = ? AND departure_time BETWEEN ? AND ? AND is_active = ? AND is_completed = ?",
			routeID, startOfDay, endOfDay, true, false).
		Find(&trips).Error

	return trips, err
}

// SearchTrips searches trips with filters
func (r *TripRepository) SearchTrips(filters map[string]interface{}, fromDate, toDate *time.Time) ([]models.Trip, error) {
	var trips []models.Trip
	// query := r.db.Preload("Route").Preload("Bus").Preload("Driver")
	query := r.db.Debug().Preload("Route").Preload("Bus").Preload("Driver")

	// Apply filters
	if filters != nil {
		query = query.Where(filters)
	}

	// Apply date range
	if fromDate != nil && toDate != nil {
		query = query.Where("departure_time BETWEEN ? AND ?", fromDate, toDate)
	} else if fromDate != nil {
		query = query.Where("departure_time >= ?", fromDate)
	} else if toDate != nil {
		query = query.Where("departure_time <= ?", toDate)
	}

	err := query.Find(&trips).Error
	return trips, err
}

// CountTripsByRoute counts trips by route
func (r *TripRepository) CountTripsByRoute(routeID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Trip{}).Where("route_id = ?", routeID).Count(&count).Error
	return count, err
}

// CountUpcomingTripsByRoute counts upcoming trips by route
func (r *TripRepository) CountUpcomingTripsByRoute(routeID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Trip{}).
		Where("route_id = ? AND departure_time > ? AND is_active = ? AND is_completed = ?",
			routeID, time.Now(), true, false).
		Count(&count).Error
	return count, err
}

// GetTripPriceRange gets min and max price for a route
func (r *TripRepository) GetTripPriceRange(routeID uint) (float64, float64, error) {
	var minPrice, maxPrice float64
	err := r.db.Model(&models.Trip{}).
		Where("route_id = ?", routeID).
		Select("COALESCE(MIN(price), 0) as min_price, COALESCE(MAX(price), 0) as max_price").
		Row().
		Scan(&minPrice, &maxPrice)
	return minPrice, maxPrice, err
}

// UpdateTripStatus updates trip status based on time
func (r *TripRepository) UpdateTripStatus() error {
	now := time.Now()

	// Update completed trips
	err := r.db.Model(&models.Trip{}).
		Where("departure_time <= ? AND is_completed = ?", now, false).
		Update("is_completed", true).Error
	if err != nil {
		return err
	}

	return nil
}

// GetTripStatistics gets statistics for a trip
func (r *TripRepository) GetTripStatistics(tripID uint) (map[string]interface{}, error) {
	var stats = make(map[string]interface{})

	// Get total bookings
	var totalBookings int64
	if err := r.db.Model(&models.Booking{}).
		Where("trip_id = ? AND status != ?", tripID, models.BookingStatusCancelled).
		Count(&totalBookings).Error; err != nil {
		return nil, err
	}
	stats["total_bookings"] = totalBookings

	// Get total revenue
	var totalRevenue float64
	if err := r.db.Model(&models.Booking{}).
		Where("trip_id = ? AND status = ? AND payment_status = ?",
			tripID,
			models.BookingStatusConfirmed,
			models.PaymentStatusPaid).
		Select("COALESCE(SUM(total_amount), 0)").
		Row().
		Scan(&totalRevenue); err != nil {
		return nil, err
	}
	stats["total_revenue"] = totalRevenue

	return stats, nil
}

// GetPopularTrips gets most booked trips
func (r *TripRepository) GetPopularTrips(limit int) ([]models.Trip, error) {
	var trips []models.Trip
	err := r.db.Preload("Route").Preload("Bus").Preload("Driver").
		Where("is_active = ? AND is_completed = ?", true, false).
		Order("booked_seats DESC").
		Limit(limit).
		Find(&trips).Error
	return trips, err
}

// GetTripsByDriver gets trips assigned to a driver
func (r *TripRepository) GetTripsByDriver(driverID uint) ([]models.Trip, error) {
	var trips []models.Trip
	err := r.db.Preload("Route").Preload("Bus").
		Where("driver_id = ? AND is_completed = ?", driverID, false).
		Find(&trips).Error
	return trips, err
}

// GetTripsByBus gets trips assigned to a bus
func (r *TripRepository) GetTripsByBus(busID uint) ([]models.Trip, error) {
	var trips []models.Trip
	err := r.db.Preload("Route").Preload("Driver").
		Where("bus_id = ? AND is_completed = ?", busID, false).
		Find(&trips).Error
	return trips, err
}
