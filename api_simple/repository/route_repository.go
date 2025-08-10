package repository

import (
	"ticket-management/api_simple/models"

	"gorm.io/gorm"
)

type RouteRepository struct {
	*BaseRepository[models.Route]
}

func NewRouteRepository(db *gorm.DB) *RouteRepository {
	return &RouteRepository{
		BaseRepository: NewBaseRepository[models.Route](db),
	}
}

// FindPopularRoutes returns top N most booked routes
func (r *RouteRepository) FindPopularRoutes(limit int) ([]models.Route, error) {
	var routes []models.Route
	err := r.db.
		Order("total_trips DESC").
		Where("is_active = ?", true).
		Limit(limit).
		Find(&routes).Error
	return routes, err
}

// FindByOriginAndDestination finds a route by origin and destination
func (r *RouteRepository) FindByOriginAndDestination(origin, destination string) (*models.Route, error) {
	var route models.Route
	err := r.db.Where("origin = ? AND destination = ?", origin, destination).First(&route).Error
	if err != nil {
		return nil, err
	}
	return &route, nil
}

// UpdateStats updates route statistics
func (r *RouteRepository) UpdateStats(routeID uint) error {
	// Get total trips
	var totalTrips int64
	err := r.db.Model(&models.Trip{}).
		Where("route_id = ?", routeID).
		Count(&totalTrips).Error
	if err != nil {
		return err
	}

	// Get upcoming trips
	var upcomingTrips int64
	err = r.db.Model(&models.Trip{}).
		Where("route_id = ? AND departure_time > NOW()", routeID).
		Count(&upcomingTrips).Error
	if err != nil {
		return err
	}

	// Get min and max prices
	var minPrice, maxPrice float64
	err = r.db.Model(&models.Trip{}).
		Select("MIN(price) as min_price, MAX(price) as max_price").
		Where("route_id = ?", routeID).
		Row().Scan(&minPrice, &maxPrice)
	if err != nil {
		return err
	}

	// Update route stats
	return r.db.Model(&models.Route{}).
		Where("id = ?", routeID).
		Updates(map[string]interface{}{
			"total_trips":    totalTrips,
			"upcoming_trips": upcomingTrips,
			"min_price":      minPrice,
			"max_price":      maxPrice,
		}).Error
}
