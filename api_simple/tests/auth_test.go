package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAuth(t *testing.T) {
	// Setup
	router := SetupTestRouter()
	w := httptest.NewRecorder()

	t.Run("Register", func(t *testing.T) {
		CleanupTestDB(t)

		t.Run("Success", func(t *testing.T) {
			BeginTx(t)
			defer RollbackTx(t)

			// Create request body
			body := map[string]interface{}{
				"phone":    "0987654321",
				"password": "Password123!",
				"name":     "Test User",
				"role":     "admin",
			}
			jsonBody, _ := json.Marshal(body)

			// Create request
			req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			// Serve request
			router.ServeHTTP(w, req)

			// Assert
			assert.Equal(t, http.StatusCreated, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "token")
			assert.Contains(t, response, "user")
		})

		t.Run("DuplicatePhone", func(t *testing.T) {
			BeginTx(t)
			defer RollbackTx(t)

			// First registration
			firstBody := map[string]interface{}{
				"phone":    "0987654321",
				"password": "Password123!",
				"name":     "Test User",
				"role":     "admin",
			}
			jsonFirstBody, _ := json.Marshal(firstBody)
			firstReq := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonFirstBody))
			firstReq.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(httptest.NewRecorder(), firstReq)

			// Try to register with same phone
			body := map[string]interface{}{
				"phone":    "0987654321",
				"password": "Password123!",
				"name":     "Another User",
				"role":     "customer",
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Số điện thoại đã được đăng ký", response["error"])
		})

		t.Run("InvalidPhone", func(t *testing.T) {
			BeginTx(t)
			defer RollbackTx(t)

			body := map[string]interface{}{
				"phone":    "invalid",
				"password": "Password123!",
				"name":     "Test User",
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 số)", response["error"])
		})

		t.Run("InvalidPassword", func(t *testing.T) {
			BeginTx(t)
			defer RollbackTx(t)

			body := map[string]interface{}{
				"phone":    "0987654322",
				"password": "weak",
				"name":     "Test User",
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Contains(t, response["error"], "Mật khẩu phải")
		})

		t.Run("InvalidRole", func(t *testing.T) {
			BeginTx(t)
			defer RollbackTx(t)

			body := map[string]interface{}{
				"phone":    "0987654322",
				"password": "Password123!",
				"name":     "Test User",
				"role":     "invalid",
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusBadRequest, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Vai trò không hợp lệ", response["error"])
		})
	})

	t.Run("Login", func(t *testing.T) {
		t.Run("Success", func(t *testing.T) {
			BeginTx(t)
			defer RollbackTx(t)

			// Register a user first
			registerBody := map[string]interface{}{
				"phone":    "0987654321",
				"password": "Password123!",
				"name":     "Test User",
				"role":     "admin",
			}
			jsonRegisterBody, _ := json.Marshal(registerBody)
			registerReq := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonRegisterBody))
			registerReq.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(httptest.NewRecorder(), registerReq)

			// Try to login
			body := map[string]interface{}{
				"phone":    "0987654321",
				"password": "Password123!",
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "token")
		})

		t.Run("InvalidCredentials", func(t *testing.T) {
			BeginTx(t)
			defer RollbackTx(t)

			// Register a user first
			registerBody := map[string]interface{}{
				"phone":    "0987654321",
				"password": "Password123!",
				"name":     "Test User",
				"role":     "admin",
			}
			jsonRegisterBody, _ := json.Marshal(registerBody)
			registerReq := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonRegisterBody))
			registerReq.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(httptest.NewRecorder(), registerReq)

			// Try to login with wrong password
			body := map[string]interface{}{
				"phone":    "0987654321",
				"password": "WrongPassword123!",
			}
			jsonBody, _ := json.Marshal(body)

			req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusUnauthorized, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Thông tin đăng nhập không chính xác", response["error"])
		})
	})

	t.Run("Logout", func(t *testing.T) {
		BeginTx(t)
		defer RollbackTx(t)

		// Register and login first to get token
		registerBody := map[string]interface{}{
			"phone":    "0987654321",
			"password": "Password123!",
			"name":     "Test User",
			"role":     "admin",
		}
		jsonRegisterBody, _ := json.Marshal(registerBody)
		registerReq := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(jsonRegisterBody))
		registerReq.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(httptest.NewRecorder(), registerReq)

		loginBody := map[string]interface{}{
			"phone":    "0987654321",
			"password": "Password123!",
		}
		jsonBody, _ := json.Marshal(loginBody)

		loginReq := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(jsonBody))
		loginReq.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		router.ServeHTTP(w, loginReq)

		var loginResponse map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &loginResponse)
		token := loginResponse["token"].(string)

		t.Run("Success", func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/v1/auth/logout", nil)
			req.Header.Set("Authorization", "Bearer "+token)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "message")
			assert.Equal(t, "Đăng xuất thành công", response["message"])
		})

		t.Run("InvalidToken", func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/v1/auth/logout", nil)
			req.Header.Set("Authorization", "Bearer invalid")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusUnauthorized, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Token không hợp lệ", response["error"])
		})

		t.Run("NoToken", func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/v1/auth/logout", nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusUnauthorized, w.Code)

			var response map[string]interface{}
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Contains(t, response, "error")
			assert.Equal(t, "Vui lòng đăng nhập", response["error"])
		})
	})
}
