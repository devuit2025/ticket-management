package tests

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRegister(t *testing.T) {
	// Clean up database before running tests
	CleanupTestDB(t)

	logger := NewTestLogger("Auth API Tests - Register")

	t.Run("successful_registration", func(t *testing.T) {
		logger.LogTestStart("Register a new user")
		logger.LogStep("Making request to /api/v1/auth/register")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/register",
			Body: map[string]interface{}{
				"phone":    "0987654321", // Changed to a different number
				"password": "password123",
				"name":     "New User",
			},
		})

		assert.Equal(t, http.StatusCreated, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)

		logger.LogTestResult(response, nil)
	})

	t.Run("duplicate_phone_number", func(t *testing.T) {
		// First register a user
		MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/register",
			Body: map[string]interface{}{
				"phone":    "0987654322",
				"password": "password123",
				"name":     "First User",
			},
		})

		// Try to register again with the same phone
		logger.LogTestStart("Try to register with existing phone number")
		logger.LogStep("Making request to /api/v1/auth/register with duplicate phone")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/register",
			Body: map[string]interface{}{
				"phone":    "0987654322",
				"password": "password123",
				"name":     "Another User",
			},
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("invalid_phone_number", func(t *testing.T) {
		logger.LogTestStart("Try to register with invalid phone number")
		logger.LogStep("Making request to /api/v1/auth/register with invalid phone")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/register",
			Body: map[string]interface{}{
				"phone":    "invalid",
				"password": "password123",
				"name":     "Invalid User",
			},
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("missing_required_fields", func(t *testing.T) {
		logger.LogTestStart("Try to register with missing fields")
		logger.LogStep("Making request to /api/v1/auth/register with missing fields")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/register",
			Body: map[string]interface{}{
				"phone": "0123456791",
			},
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}

func TestLogin(t *testing.T) {
	// Clean up and setup test data before running tests
	CleanupTestDB(t)
	SetupTestData(t)

	logger := NewTestLogger("Auth API Tests - Login")

	t.Run("successful_admin_login", func(t *testing.T) {
		logger.LogTestStart("Login as admin")
		logger.LogStep("Making request to /api/v1/auth/login with admin credentials")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/login",
			Body: map[string]interface{}{
				"phone":    "0123456789",
				"password": "admin123",
			},
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.NotEmpty(t, response["token"])

		logger.LogTestResult(response, nil)
	})

	t.Run("successful_customer_login", func(t *testing.T) {
		logger.LogTestStart("Login as customer")
		logger.LogStep("Making request to /api/v1/auth/login with customer credentials")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/login",
			Body: map[string]interface{}{
				"phone":    "0123456786",
				"password": "customer123",
			},
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.NotEmpty(t, response["token"])

		logger.LogTestResult(response, nil)
	})

	t.Run("invalid_phone_number", func(t *testing.T) {
		logger.LogTestStart("Try to login with invalid phone")
		logger.LogStep("Making request to /api/v1/auth/login with invalid phone")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/login",
			Body: map[string]interface{}{
				"phone":    "0000000000",
				"password": "password123",
			},
		})

		assert.Equal(t, http.StatusUnauthorized, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("wrong_password", func(t *testing.T) {
		logger.LogTestStart("Try to login with wrong password")
		logger.LogStep("Making request to /api/v1/auth/login with wrong password")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/login",
			Body: map[string]interface{}{
				"phone":    "0123456789",
				"password": "wrongpassword",
			},
		})

		assert.Equal(t, http.StatusUnauthorized, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("invalid_request_format", func(t *testing.T) {
		logger.LogTestStart("Try to login with invalid request format")
		logger.LogStep("Making request to /api/v1/auth/login with invalid format")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/login",
			Body: map[string]interface{}{
				"invalid": "format",
			},
		})

		assert.Equal(t, http.StatusBadRequest, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}

func TestLogout(t *testing.T) {
	// Clean up and setup test data before running tests
	CleanupTestDB(t)
	SetupTestData(t)

	logger := NewTestLogger("Auth API Tests - Logout")

	t.Run("successful_logout", func(t *testing.T) {
		logger.LogTestStart("Logout with valid token")
		logger.LogStep("Making request to /api/v1/auth/logout")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/logout",
			Token:  adminToken,
		})

		assert.Equal(t, http.StatusOK, resp.Code)

		var response map[string]interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "Successfully logged out", response["message"])

		logger.LogTestResult(response, nil)
	})

	t.Run("logout_without_token", func(t *testing.T) {
		logger.LogTestStart("Try to logout without token")
		logger.LogStep("Making request to /api/v1/auth/logout without token")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/logout",
		})

		assert.Equal(t, http.StatusUnauthorized, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("logout_with_invalid_token", func(t *testing.T) {
		logger.LogTestStart("Try to logout with invalid token")
		logger.LogStep("Making request to /api/v1/auth/logout with invalid token")

		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/logout",
			Token:  "invalid_token",
		})

		assert.Equal(t, http.StatusUnauthorized, resp.Code)
		logger.LogTestResult(nil, nil)
	})

	t.Run("logout_with_already_blacklisted_token", func(t *testing.T) {
		logger.LogTestStart("Try to logout with already blacklisted token")
		logger.LogStep("Making request to /api/v1/auth/logout with blacklisted token")

		// First logout to blacklist the token
		MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/logout",
			Token:  customerToken,
		})

		// Try to use the same token again
		resp := MakeRequest(RequestConfig{
			Method: "POST",
			URL:    "/api/v1/auth/logout",
			Token:  customerToken,
		})

		assert.Equal(t, http.StatusUnauthorized, resp.Code)
		logger.LogTestResult(nil, nil)
	})
}
