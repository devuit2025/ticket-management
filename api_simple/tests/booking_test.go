package tests

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateBooking(t *testing.T) {
	logger := NewTestLogger("Booking API Tests - Create")

	t.Run("successful_create_booking", func(t *testing.T) {
		logger.LogTestStart("Create a new booking")
		logger.LogStep("Making request to /api/v1/bookings")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/bookings",
			Body: map[string]interface{}{
				"trip_id": 1,
				"seat_id": 1,
			},
			Token: customerToken,
		})

		assert.Equal(t, http.StatusCreated, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("invalid_trip", func(t *testing.T) {
		logger.LogTestStart("Try to create booking with invalid trip")
		logger.LogStep("Making request to /api/v1/bookings with invalid trip")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/bookings",
			Body: map[string]interface{}{
				"trip_id": 999,
				"seat_id": 1,
			},
			Token: customerToken,
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("invalid_seat", func(t *testing.T) {
		logger.LogTestStart("Try to create booking with invalid seat")
		logger.LogStep("Making request to /api/v1/bookings with invalid seat")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/bookings",
			Body: map[string]interface{}{
				"trip_id": 1,
				"seat_id": 999,
			},
			Token: customerToken,
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("seat_already_booked", func(t *testing.T) {
		logger.LogTestStart("Try to book an already booked seat")
		logger.LogStep("Making request to /api/v1/bookings with booked seat")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/bookings",
			Body: map[string]interface{}{
				"trip_id": 1,
				"seat_id": 1, // Already booked in first test
			},
			Token: customerToken,
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}

func TestGetBooking(t *testing.T) {
	logger := NewTestLogger("Booking API Tests - Get")

	t.Run("successful_get_booking", func(t *testing.T) {
		logger.LogTestStart("Get an existing booking")
		logger.LogStep("Making request to /api/v1/bookings/1")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/bookings/1?phone_number=0123456786",
			Token:  customerToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("booking_not_found", func(t *testing.T) {
		logger.LogTestStart("Try to get non-existent booking")
		logger.LogStep("Making request to /api/v1/bookings/999")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/bookings/999?phone_number=0123456786",
			Token:  customerToken,
		})

		assert.Equal(t, http.StatusNotFound, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("wrong_phone_number", func(t *testing.T) {
		logger.LogTestStart("Try to get booking with wrong phone number")
		logger.LogStep("Making request to /api/v1/bookings/1 with wrong phone")

		resp := MakeRequest(RequestConfig{
			Method: "GET",
			URL:    "/api/v1/bookings/1?phone_number=0000000000",
			Token:  customerToken,
		})

		assert.Equal(t, http.StatusNotFound, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}

func TestCancelBooking(t *testing.T) {
	logger := NewTestLogger("Booking API Tests - Cancel")

	t.Run("successful_cancel_booking", func(t *testing.T) {
		logger.LogTestStart("Cancel an existing booking")
		logger.LogStep("Making request to /api/v1/bookings/1/cancel")

		resp := MakeRequest(RequestConfig{
			Method: "PUT",
			URL:    "/api/v1/bookings/1/cancel?phone_number=0123456786",
			Token:  customerToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("booking_not_found", func(t *testing.T) {
		logger.LogTestStart("Try to cancel non-existent booking")
		logger.LogStep("Making request to /api/v1/bookings/999/cancel")

		resp := MakeRequest(RequestConfig{
			Method: "PUT",
			URL:    "/api/v1/bookings/999/cancel?phone_number=0123456786",
			Token:  customerToken,
		})

		assert.Equal(t, http.StatusNotFound, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("wrong_phone_number", func(t *testing.T) {
		logger.LogTestStart("Try to cancel booking with wrong phone number")
		logger.LogStep("Making request to /api/v1/bookings/1/cancel with wrong phone")

		resp := MakeRequest(RequestConfig{
			Method: "PUT",
			URL:    "/api/v1/bookings/1/cancel?phone_number=0000000000",
			Token:  customerToken,
		})

		assert.Equal(t, http.StatusNotFound, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}
