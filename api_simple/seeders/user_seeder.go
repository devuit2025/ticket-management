package seeders

import (
	"log"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
)

func seedUsers() {
	log.Println("Seeding users...")
	truncateTable("users")

	users := []models.User{
		{
			Phone:    "0123456789",
			Password: "admin123",
			Name:     "Admin User",
			Role:     models.RoleAdmin,
		},
		{
			Phone:    "0123456788",
			Password: "staff123",
			Name:     "Staff User",
			Role:     models.RoleStaff,
		},
		{
			Phone:    "0123456787",
			Password: "driver123",
			Name:     "Driver User",
			Role:     models.RoleDriver,
		},
		{
			Phone:    "0123456786",
			Password: "customer123",
			Name:     "Customer User",
			Role:     models.RoleCustomer,
		},
	}

	for _, user := range users {
		if err := config.DB.Create(&user).Error; err != nil {
			log.Fatalf("Failed to seed user: %v", err)
		}
	}
}
