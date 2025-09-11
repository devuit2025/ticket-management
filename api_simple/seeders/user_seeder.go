package seeders

import (
	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedUsers() error {
	users := []models.User{
		{
			Phone:    "0966666666",
			Password: "123123",
			Name:     "Long Customer",
			Role:     models.RoleCustomer,
		},
		{
			Phone:    "0987654321",
			Password: "Password123!",
			Name:     "Admin",
			Role:     models.RoleAdmin,
		},
		{
			Phone:    "0987654322",
			Password: "Password123!",
			Name:     "Customer",
			Role:     models.RoleCustomer,
		},
		{
			Phone:    "0987654323",
			Password: "Password123!",
			Name:     "Driver",
			Role:     models.RoleDriver,
		},
	}

	for _, user := range users {
		if err := config.DB.Create(&user).Error; err != nil {
			return err
		}
	}

	return nil
}
