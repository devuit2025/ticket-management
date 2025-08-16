package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func getAdminToken(t *testing.T, router *gin.Engine, phone string) string {
	// Create a new admin user with the specified phone number
	registerBody := map[string]interface{}{
		"phone":    phone,
		"password": "Password123!",
		"name":     "Admin",
		"role":     "admin",
	}
	jsonRegisterBody, _ := json.Marshal(registerBody)
	registerReq := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonRegisterBody))
	registerReq.Header.Set("Content-Type", "application/json")

	// Check registration response
	registerW := httptest.NewRecorder()
	router.ServeHTTP(registerW, registerReq)

	// If registration fails due to existing phone, try to login with the existing user
	if registerW.Code == http.StatusBadRequest {
		// Try to login with the existing user (might be a different role)
		loginBody := map[string]interface{}{
			"phone":    phone,
			"password": "Password123!",
		}
		jsonBody, _ := json.Marshal(loginBody)
		loginReq := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
		loginReq.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		router.ServeHTTP(w, loginReq)

		var loginResponse map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &loginResponse)

		// Check if login was successful
		if token, exists := loginResponse["token"]; exists && token != nil {
			return token.(string)
		}

		// If login also failed, try with the seeded admin user
		loginBody = map[string]interface{}{
			"phone":    "0987654321", // Use seeded admin user
			"password": "admin123",
		}
		jsonBody, _ = json.Marshal(loginBody)
		loginReq = httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
		loginReq.Header.Set("Content-Type", "application/json")

		w = httptest.NewRecorder()
		router.ServeHTTP(w, loginReq)

		json.Unmarshal(w.Body.Bytes(), &loginResponse)

		if token, exists := loginResponse["token"]; exists && token != nil {
			return token.(string)
		}
	}

	// If registration was successful, login to get token
	loginBody := map[string]interface{}{
		"phone":    phone,
		"password": "Password123!",
	}
	jsonBody, _ := json.Marshal(loginBody)
	loginReq := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
	loginReq.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, loginReq)

	var loginResponse map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &loginResponse)

	// Check if token exists and is not nil
	token, exists := loginResponse["token"]
	if !exists || token == nil {
		t.Fatal("Failed to get admin token from login response")
	}

	return token.(string)
}

func TestRoute(t *testing.T) {
	// Setup
	router := SetupTestRouter()

	t.Run("CreateRoute", func(t *testing.T) {
		t.Run("Success", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654321")

			body := map[string]interface{}{
				"origin":      "Hà Nội",
				"destination": "Sapa",
				"distance":    320,
				"duration":    "5h30m",
				"base_price":  350000,
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/admin/routes", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusCreated, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "message")
			assert.Equal(t, "Tạo tuyến đường thành công", response["message"])
		})

		t.Run("DuplicateRoute", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654322")

			// Create first route
			firstBody := map[string]interface{}{
				"origin":      "Hà Nội",
				"destination": "Sapa",
				"distance":    320,
				"duration":    "5h30m",
				"base_price":  350000,
			}
			jsonFirstBody, _ := json.Marshal(firstBody)
			firstReq := httptest.NewRequest("POST", "/api/v1/admin/routes", bytes.NewBuffer(jsonFirstBody))
			firstReq.Header.Set("Content-Type", "application/json")
			firstReq.Header.Set("Authorization", "Bearer "+adminToken)
			router.ServeHTTP(httptest.NewRecorder(), firstReq)

			// Try to create duplicate route
			body := map[string]interface{}{
				"origin":      "Hà Nội",
				"destination": "Sapa",
				"distance":    320,
				"duration":    "5h30m",
				"base_price":  350000,
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/admin/routes", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Tuyến đường đã tồn tại", response["error"])
		})

		t.Run("InvalidDistance", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654323")

			body := map[string]interface{}{
				"origin":      "Hà Nội",
				"destination": "Sapa",
				"distance":    -1,
				"duration":    "5h30m",
				"base_price":  350000,
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/admin/routes", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Khoảng cách phải lớn hơn 0", response["error"])
		})

		t.Run("InvalidBasePrice", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654324")

			body := map[string]interface{}{
				"origin":      "Hà Nội",
				"destination": "Sapa",
				"distance":    320,
				"duration":    "5h30m",
				"base_price":  -1,
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/admin/routes", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Giá vé phải lớn hơn 0", response["error"])
		})
	})

	t.Run("GetRoutes", func(t *testing.T) {
		t.Run("Success", func(t *testing.T) {
			// Create test routes
			routes := []models.Route{
				{
					Origin:      "Hà Nội",
					Destination: "Sapa",
					Distance:    320,
					Duration:    "5h30m",
					BasePrice:   350000,
					IsActive:    true,
				},
				{
					Origin:      "Hà Nội",
					Destination: "Hải Phòng",
					Distance:    120,
					Duration:    "2h30m",
					BasePrice:   150000,
					IsActive:    true,
				},
			}
			for _, route := range routes {
				err := config.DB.Create(&route).Error
				assert.NoError(t, err)
			}

			req := httptest.NewRequest("GET", "/api/v1/routes", nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "routes")
			assert.Contains(t, response, "total")
		})

		t.Run("WithFilters", func(t *testing.T) {
			// Create test routes
			routes := []models.Route{
				{
					Origin:      "Hà Nội",
					Destination: "Sapa",
					Distance:    320,
					Duration:    "5h30m",
					BasePrice:   350000,
					IsActive:    true,
				},
				{
					Origin:      "Hà Nội",
					Destination: "Hải Phòng",
					Distance:    120,
					Duration:    "2h30m",
					BasePrice:   150000,
					IsActive:    true,
				},
			}
			for _, route := range routes {
				err := config.DB.Create(&route).Error
				assert.NoError(t, err)
			}

			// Build query params
			params := url.Values{}
			params.Add("origin", "Hà Nội")
			params.Add("min_price", "300000")

			req := httptest.NewRequest("GET", "/api/v1/routes?"+params.Encode(), nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "routes")
			assert.Contains(t, response, "total")
		})
	})

	t.Run("GetPopularRoutes", func(t *testing.T) {
		// Create test routes
		routes := []models.Route{
			{
				Origin:      "Hà Nội",
				Destination: "Sapa",
				Distance:    320,
				Duration:    "5h30m",
				BasePrice:   350000,
				IsActive:    true,
			},
			{
				Origin:      "Hà Nội",
				Destination: "Hải Phòng",
				Distance:    120,
				Duration:    "2h30m",
				BasePrice:   150000,
				IsActive:    true,
			},
		}
		for _, route := range routes {
			err := config.DB.Create(&route).Error
			assert.NoError(t, err)
		}

		req := httptest.NewRequest("GET", "/api/v1/routes/popular", nil)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Contains(t, response, "routes")
		assert.Contains(t, response, "total")
	})

	t.Run("GetRoute", func(t *testing.T) {
		t.Run("Success", func(t *testing.T) {
			// Create test route first
			route := models.Route{
				Origin:      "Hà Nội",
				Destination: "Sapa",
				Distance:    320,
				Duration:    "5h30m",
				BasePrice:   350000,
				IsActive:    true,
			}
			err := config.DB.Create(&route).Error
			assert.NoError(t, err)

			// Use the actual route ID from the database
			routeID := route.ID
			req := httptest.NewRequest("GET", "/api/v1/routes/"+fmt.Sprintf("%d", routeID), nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)

			var response map[string]interface{}
			err = json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "id")
			assert.Contains(t, response, "origin")
			assert.Contains(t, response, "destination")
		})

		t.Run("NotFound", func(t *testing.T) {
			req := httptest.NewRequest("GET", "/api/v1/routes/999", nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusNotFound, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Không tìm thấy tuyến đường", response["error"])
		})
	})

	t.Run("UpdateRoute", func(t *testing.T) {
		t.Run("Success", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654325")

			// Create test route
			route := models.Route{
				Origin:      "Hà Nội",
				Destination: "Sapa",
				Distance:    320,
				Duration:    "5h30m",
				BasePrice:   350000,
				IsActive:    true,
			}
			err := config.DB.Create(&route).Error
			assert.NoError(t, err)

			// Use the actual route ID from the database
			routeID := route.ID
			body := map[string]interface{}{
				"base_price": 380000,
				"is_active":  true,
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("PUT", "/api/v1/admin/routes/"+fmt.Sprintf("%d", routeID), bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)

			var response map[string]interface{}
			err = json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "message")
			assert.Equal(t, "Cập nhật tuyến đường thành công", response["message"])
		})

		t.Run("NotFound", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654326")

			body := map[string]interface{}{
				"base_price": 380000,
				"is_active":  true,
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("PUT", "/api/v1/admin/routes/999", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusNotFound, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Không tìm thấy tuyến đường", response["error"])
		})

		t.Run("InvalidBasePrice", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654327")

			// Create test route
			route := models.Route{
				Origin:      "Hà Nội",
				Destination: "Sapa",
				Distance:    320,
				Duration:    "5h30m",
				BasePrice:   350000,
				IsActive:    true,
			}
			err := config.DB.Create(&route).Error
			assert.NoError(t, err)

			// Use the actual route ID from the database
			routeID := route.ID
			body := map[string]interface{}{
				"base_price": -1,
				"is_active":  true,
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("PUT", "/api/v1/admin/routes/"+fmt.Sprintf("%d", routeID), bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err = json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Giá vé phải lớn hơn 0", response["error"])
		})
	})

	t.Run("DeleteRoute", func(t *testing.T) {
		t.Run("Success", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654328")

			// Create test route
			route := models.Route{
				Origin:      "Hà Nội",
				Destination: "Sapa",
				Distance:    320,
				Duration:    "5h30m",
				BasePrice:   350000,
				IsActive:    true,
			}
			err := config.DB.Create(&route).Error
			assert.NoError(t, err)

			// Use the actual route ID from the database
			routeID := route.ID
			req := httptest.NewRequest("DELETE", "/api/v1/admin/routes/"+fmt.Sprintf("%d", routeID), nil)
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)

			var response map[string]interface{}
			err = json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "message")
			assert.Equal(t, "Xóa tuyến đường thành công", response["message"])
		})

		t.Run("NotFound", func(t *testing.T) {
			// Get token with unique phone number
			adminToken := getAdminToken(t, router, "0987654329")

			req := httptest.NewRequest("DELETE", "/api/v1/admin/routes/999", nil)
			req.Header.Set("Authorization", "Bearer "+adminToken)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusNotFound, w.Code)

			var response map[string]interface{}
			var err error
			err = json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Không tìm thấy tuyến đường", response["error"])
		})
	})
}
