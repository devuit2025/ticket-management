package seeders

import (
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/utils"

	"gorm.io/gorm"
)

// TestSeedUsers seeds users for testing
func TestSeedUsers(db *gorm.DB) error {
	users := []models.User{
		{
			Phone:    "0987654321",
			Password: "admin123",
			Name:     "Admin User",
			Role:     models.RoleAdmin,
		},
		{
			Phone:    "0987654322",
			Password: "driver123",
			Name:     "Driver User",
			Role:     models.RoleDriver,
		},
		{
			Phone:    "0987654323",
			Password: "customer123",
			Name:     "Customer User",
			Role:     models.RoleCustomer,
		},
	}

	for _, user := range users {
		// Always create new user for testing
		if err := db.Create(&user).Error; err != nil {
			return err
		}
	}

	return nil
}

// TestSeedRoutes seeds routes for testing
func TestSeedRoutes(db *gorm.DB) error {
	routes := []models.Route{
		{
			Origin:      "Hà Nội",
			Destination: "TP. Hồ Chí Minh",
			Distance:    1700,
			Duration:    "24h",
			BasePrice:   380000,
			IsActive:    true,
		},
		{
			Origin:      "Hà Nội",
			Destination: "Đà Nẵng",
			Distance:    800,
			Duration:    "12h",
			BasePrice:   180000,
			IsActive:    true,
		},
	}

	for _, route := range routes {
		// Always create new route for testing
		if err := db.Create(&route).Error; err != nil {
			return err
		}
	}

	return nil
}

// TestSeedBuses seeds buses for testing
func TestSeedBuses(db *gorm.DB) error {
	buses := []models.Bus{
		{
			PlateNumber: "29A-12345",
			Type:        "Giường nằm",
			SeatCount:   45,
			FloorCount:  2,
			IsActive:    true,
		},
		{
			PlateNumber: "29A-67890",
			Type:        "Giường nằm",
			SeatCount:   35,
			FloorCount:  2,
			IsActive:    true,
		},
	}

	for _, bus := range buses {
		// Always create new bus for testing
		if err := db.Create(&bus).Error; err != nil {
			return err
		}
	}

	return nil
}

// TestSeedTrips seeds trips for testing
func TestSeedTrips(db *gorm.DB) error {
	// Get first route and bus
	var firstRoute models.Route
	if err := db.First(&firstRoute).Error; err != nil {
		return err
	}

	var firstBus models.Bus
	if err := db.First(&firstBus).Error; err != nil {
		return err
	}

	// Get driver (user with driver role)
	var driver models.User
	if err := db.Where("role = ?", models.RoleDriver).First(&driver).Error; err != nil {
		return err
	}

	trips := []models.Trip{
		{
			RouteID:       firstRoute.ID,
			BusID:         firstBus.ID,
			DriverID:      driver.ID,
			DepartureTime: utils.ParseTime("2025-08-15 20:00:00"),
			Price:         380000,
			IsActive:      true,
			IsCompleted:   false,
			TotalSeats:    firstBus.SeatCount,
			BookedSeats:   0,
		},
	}

	// Get second route and bus if available
	var secondRoute models.Route
	if err := db.Offset(1).First(&secondRoute).Error; err == nil {
		var secondBus models.Bus
		if err := db.Offset(1).First(&secondBus).Error; err == nil {
			trips = append(trips, models.Trip{
				RouteID:       secondRoute.ID,
				BusID:         secondBus.ID,
				DriverID:      driver.ID,
				DepartureTime: utils.ParseTime("2025-08-15 08:00:00"),
				Price:         180000,
				IsActive:      true,
				IsCompleted:   false,
				TotalSeats:    secondBus.SeatCount,
				BookedSeats:   0,
			})
		}
	}

	for _, trip := range trips {
		if err := db.Create(&trip).Error; err != nil {
			return err
		}
	}

	return nil
}

// TestSeedSeats seeds seats for testing
func TestSeedSeats(db *gorm.DB) error {
	// Get all trips
	var trips []models.Trip
	if err := db.Find(&trips).Error; err != nil {
		return err
	}

	// Seed seats for each trip
	for _, trip := range trips {
		if err := SeedSeats(db, trip.ID, trip.Price); err != nil {
			return err
		}
	}

	return nil
}

// TestSeed seeds all test data
func TestSeed(db *gorm.DB) error {
	if err := TestSeedUsers(db); err != nil {
		return err
	}

	if err := TestSeedRoutes(db); err != nil {
		return err
	}

	if err := TestSeedBuses(db); err != nil {
		return err
	}

	if err := TestSeedTrips(db); err != nil {
		return err
	}

	if err := TestSeedSeats(db); err != nil {
		return err
	}

	return nil
}
