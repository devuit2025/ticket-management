package tests

import (
	"testing"
	"ticket-management/api_simple/models"

	"github.com/stretchr/testify/assert"
)

func TestDebug(t *testing.T) {
	// Setup test database
	SetupTestDB()
	defer CleanupTestDB(t)

	// Check if TestDB is not nil
	assert.NotNil(t, TestDB, "TestDB should not be nil")

	// Try to query the database
	var count int64
	err := TestDB.Model(&models.User{}).Count(&count).Error
	assert.NoError(t, err, "Should be able to query database")

	t.Logf("Database connection test successful. User count: %d", count)
}
