package tests

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func init() {
	SetupTestData(&testing.T{})
}

func TestGetTrips(t *testing.T) {
	logger := NewTestLogger("Trip API Tests - Get All")

	t.Run("successful_get_trips", func(t *testing.T) {
		logger.LogTestStart("Get all trips")
		logger.LogStep("Making request to /api/v1/trips")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/trips",
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})
}

func TestGetTrip(t *testing.T) {
	logger := NewTestLogger("Trip API Tests - Get One")

	t.Run("successful_get_trip", func(t *testing.T) {
		logger.LogTestStart("Get a specific trip")
		logger.LogStep("Making request to /api/v1/trips/1")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/trips/1",
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("trip_not_found", func(t *testing.T) {
		logger.LogTestStart("Try to get non-existent trip")
		logger.LogStep("Making request to /api/v1/trips/999")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/trips/999",
		})

		assert.Equal(t, http.StatusNotFound, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}

func TestCreateTrip(t *testing.T) {
	logger := NewTestLogger("Trip API Tests - Create")

	t.Run("successful_create_trip", func(t *testing.T) {
		logger.LogTestStart("Create a new trip")
		logger.LogStep("Making request to /api/v1/trips")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/trips",
			Body: map[string]interface{}{
				"route_id":       1,
				"bus_id":         1,
				"driver_id":      1,
				"departure_time": "2025-08-10 08:00:00",
				"price":          100000,
			},
			Token: adminToken,
		})

		assert.Equal(t, http.StatusCreated, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("invalid_route", func(t *testing.T) {
		logger.LogTestStart("Try to create trip with invalid route")
		logger.LogStep("Making request to /api/v1/trips with invalid route")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/trips",
			Body: map[string]interface{}{
				"route_id":       999,
				"bus_id":         1,
				"driver_id":      1,
				"departure_time": "2025-08-10 08:00:00",
				"price":          100000,
			},
			Token: adminToken,
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("invalid_bus", func(t *testing.T) {
		logger.LogTestStart("Try to create trip with invalid bus")
		logger.LogStep("Making request to /api/v1/trips with invalid bus")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/trips",
			Body: map[string]interface{}{
				"route_id":       1,
				"bus_id":         999,
				"driver_id":      1,
				"departure_time": "2025-08-10 08:00:00",
				"price":          100000,
			},
			Token: adminToken,
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("invalid_driver", func(t *testing.T) {
		logger.LogTestStart("Try to create trip with invalid driver")
		logger.LogStep("Making request to /api/v1/trips with invalid driver")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/trips",
			Body: map[string]interface{}{
				"route_id":       1,
				"bus_id":         1,
				"driver_id":      999,
				"departure_time": "2025-08-10 08:00:00",
				"price":          100000,
			},
			Token: adminToken,
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}

func TestUpdateTrip(t *testing.T) {
	logger := NewTestLogger("Trip API Tests - Update")

	t.Run("successful_update_trip", func(t *testing.T) {
		logger.LogTestStart("Update an existing trip")
		logger.LogStep("Making request to /api/v1/trips/1")

		resp := MakeRequest(RequestConfig{
			Method: "PUT",
			URL:    "/api/v1/trips/1",
			Body: map[string]interface{}{
				"departure_time": "2025-08-11 08:00:00",
				"price":          150000,
			},
			Token: adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("trip_not_found", func(t *testing.T) {
		logger.LogTestStart("Try to update non-existent trip")
		logger.LogStep("Making request to /api/v1/trips/999")

		resp := MakeRequest(RequestConfig{
			Method: "PUT",
			URL:    "/api/v1/trips/999",
			Body: map[string]interface{}{
				"departure_time": "2025-08-11 08:00:00",
				"price":          150000,
			},
			Token: adminToken,
		})

		assert.Equal(t, http.StatusNotFound, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}

func TestDeleteTrip(t *testing.T) {
	logger := NewTestLogger("Trip API Tests - Delete")

	t.Run("successful_delete_trip", func(t *testing.T) {
		logger.LogTestStart("Delete an existing trip")
		logger.LogStep("Making request to /api/v1/trips/1")

		resp := MakeRequest(RequestConfig{
			Method: "DELETE",
			URL:    "/api/v1/trips/1",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("trip_not_found", func(t *testing.T) {
		logger.LogTestStart("Try to delete non-existent trip")
		logger.LogStep("Making request to /api/v1/trips/999")

		resp := MakeRequest(RequestConfig{
			Method: "DELETE",
			URL:    "/api/v1/trips/999",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusNotFound, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}
