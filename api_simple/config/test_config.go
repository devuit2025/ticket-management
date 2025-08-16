package config

import (
	"context"
	"log"
	"ticket-management/api_simple/models"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	TestDB          *gorm.DB
	TestRedisClient *redis.Client
	TestRedisServer *miniredis.Miniredis
)

// SetupTestDB initializes test database using SQLite in-memory
func SetupTestDB() {
	var err error
	TestDB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to test database:", err)
	}

	// Auto migrate test models
	err = TestDB.AutoMigrate(
		&models.User{},
		&models.Route{},
		&models.Bus{},
		&models.Trip{},
		&models.Seat{},
		&models.Booking{},
	)
	if err != nil {
		log.Fatal("Failed to migrate test database:", err)
	}
}

// SetupTestRedis initializes test Redis using miniredis
func SetupTestRedis() {
	var err error
	TestRedisServer, err = miniredis.Run()
	if err != nil {
		log.Fatal("Failed to start test Redis server:", err)
	}

	TestRedisClient = redis.NewClient(&redis.Options{
		Addr: TestRedisServer.Addr(),
		DB:   0,
	})

	// Test the connection
	_, err = TestRedisClient.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("Failed to connect to test Redis:", err)
	}
}

// CleanupTestDB closes test database connection
func CleanupTestDB() {
	if TestDB != nil {
		sqlDB, err := TestDB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}

// CleanupTestRedis closes test Redis connection and server
func CleanupTestRedis() {
	if TestRedisClient != nil {
		TestRedisClient.Close()
	}
	if TestRedisServer != nil {
		TestRedisServer.Close()
	}
}
