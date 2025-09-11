package seeders

import (
	"math/rand"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedMultipleTrips() error {
	rand.Seed(time.Now().UnixNano())

	var routes []models.Route
	if err := config.DB.Find(&routes).Error; err != nil {
		return err
	}

	var buses []models.Bus
	if err := config.DB.Find(&buses).Error; err != nil {
		return err
	}

	var drivers []models.User
	if err := config.DB.Find(&drivers).Error; err != nil {
		return err
	}

	if len(buses) == 0 || len(drivers) == 0 {
		return nil // or return error if you require buses and drivers
	}

	for _, route := range routes {
		for i := 0; i < 3; i++ { // at least 3 trips per route
			// pick random bus and driver
			bus := buses[rand.Intn(len(buses))]
			driver := drivers[rand.Intn(len(drivers))]

			// generate a departure time within next 7 days
			// departureTime := time.Now().Add(time.Duration(rand.Intn(7*24)) * time.Hour)

			// Get tomorrow's date at 00:00
			now := time.Now()
			tomorrow := time.Date(
				now.Year(),
				now.Month(),
				now.Day()+1,
				0, 0, 0, 0,
				now.Location(),
			)

			// Add random hours/minutes within the day (e.g., 6 AM – 10 PM)
			hour := rand.Intn(16) + 6  // random hour between 6 and 21
			minute := rand.Intn(60)    // random minute 0–59

			departureTime := tomorrow.Add(time.Duration(hour) * time.Hour).Add(time.Duration(minute) * time.Minute)
			
			trip := models.Trip{
				RouteID:       route.ID,
				BusID:         bus.ID,
				DriverID:      driver.ID,
				DepartureTime: departureTime,
				IsActive:      true,
				IsCompleted:   false,
				Note:          "Auto generated trip",
			}

			if err := config.DB.Create(&trip).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
