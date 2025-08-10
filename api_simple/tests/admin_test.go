package tests

import (
	"encoding/json"
	"net/http"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	SetupTestData(&testing.T{})
	os.Exit(m.Run())
}

func TestGetUsers(t *testing.T) {
	logger := NewTestLogger("User Management API Tests")

	t.Run("successful_get_users", func(t *testing.T) {
		logger.LogTestStart("Get all users without any filters")
		logger.LogStep("Making request to /api/v1/admin/users")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/admin/users",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("with_pagination", func(t *testing.T) {
		logger.LogTestStart("Get users with pagination (page 1, 2 items per page)")
		logger.LogStep("Making request to /api/v1/admin/users with pagination parameters")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/admin/users?page=1&page_size=2",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		// Verify pagination data
		pagination := response["pagination"].(map[string]interface{})
		assert.Equal(t, float64(1), pagination["current_page"])
		assert.Equal(t, float64(2), pagination["page_size"])

		logger.LogTestResult(response, nil)
	})

	t.Run("with_role_filter", func(t *testing.T) {
		logger.LogTestStart("Get users filtered by role=admin")
		logger.LogStep("Making request to /api/v1/admin/users with role filter")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/admin/users?role=admin",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		// Verify only admin users are returned
		users := response["data"].([]interface{})
		for _, user := range users {
			userData := user.(map[string]interface{})
			assert.Equal(t, "admin", userData["role"])
		}

		logger.LogTestResult(response, nil)
	})

	t.Run("with_phone_filter", func(t *testing.T) {
		logger.LogTestStart("Get users filtered by phone number")
		logger.LogStep("Making request to /api/v1/admin/users with phone filter")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/admin/users?phone=0123456789",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		// Verify phone number filter
		users := response["data"].([]interface{})
		for _, user := range users {
			userData := user.(map[string]interface{})
			assert.Equal(t, "0123456789", userData["phone"])
		}

		logger.LogTestResult(response, nil)
	})

	t.Run("with_name_filter", func(t *testing.T) {
		logger.LogTestStart("Get users filtered by name containing 'Admin'")
		logger.LogStep("Making request to /api/v1/admin/users with name filter")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/admin/users?name=Admin",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		// Verify name filter (case insensitive)
		users := response["data"].([]interface{})
		for _, user := range users {
			userData := user.(map[string]interface{})
			name := userData["name"].(string)
			assert.Contains(t, name, "Admin")
		}

		logger.LogTestResult(response, nil)
	})

	t.Run("with_multiple_filters", func(t *testing.T) {
		logger.LogTestStart("Get users with multiple filters (role=admin AND phone=0123456789)")
		logger.LogStep("Making request to /api/v1/admin/users with multiple filters")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/admin/users?role=admin&phone=0123456789",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		// Verify multiple filters
		users := response["data"].([]interface{})
		for _, user := range users {
			userData := user.(map[string]interface{})
			assert.Equal(t, "admin", userData["role"])
			assert.Equal(t, "0123456789", userData["phone"])
		}

		logger.LogTestResult(response, nil)
	})
}
