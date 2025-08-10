package handlers

import (
	"net/http"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/middleware"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/utils"

	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Phone    string      `json:"phone" binding:"required"`
	Password string      `json:"password" binding:"required"`
	Name     string      `json:"name" binding:"required"`
	Role     models.Role `json:"role"`
}

type LoginRequest struct {
	Phone    string `json:"phone" binding:"required,min=10,max=11"`
	Password string `json:"password" binding:"required"`
}

type ForgotPasswordRequest struct {
	Phone string `json:"phone" binding:"required,min=10,max=11"`
}

type VerifyOTPRequest struct {
	Phone string `json:"phone" binding:"required,min=10,max=11"`
	OTP   string `json:"otp" binding:"required,len=6"`
}

type ResetPasswordRequest struct {
	Phone       string `json:"phone" binding:"required,min=10,max=11"`
	OTP         string `json:"otp" binding:"required,len=6"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6,nefield=OldPassword"`
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	// Validate phone
	if !utils.ValidatePhone(req.Phone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrPhoneInvalid})
		return
	}

	// Validate password
	if valid, msg := utils.ValidatePassword(req.Password); !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	// Validate name
	if valid, msg := utils.ValidateName(req.Name); !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)

	// Check if phone exists
	exists, err := userRepo.Exists(map[string]interface{}{"phone": req.Phone})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}
	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrPhoneExists})
		return
	}

	// Set default role to customer if not provided
	role := req.Role
	if role == "" {
		role = models.RoleCustomer
	}

	// Validate role
	if role != models.RoleAdmin && role != models.RoleCustomer && role != models.RoleDriver {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vai trò không hợp lệ"})
		return
	}

	user := models.User{
		Phone:    req.Phone,
		Password: req.Password,
		Name:     req.Name,
		Role:     role,
	}

	if err := userRepo.Create(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	token, err := middleware.GenerateToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user": gin.H{
			"id":    user.ID,
			"phone": user.Phone,
			"name":  user.Name,
			"role":  user.Role,
		},
	})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	// Validate phone
	if !utils.ValidatePhone(req.Phone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrPhoneInvalid})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)

	user, err := userRepo.FindByPhone(req.Phone)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": utils.ErrInvalidCredentials})
		return
	}

	if err := user.ComparePassword(req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": utils.ErrInvalidCredentials})
		return
	}

	token, err := middleware.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":    user.ID,
			"phone": user.Phone,
			"name":  user.Name,
			"role":  user.Role,
		},
	})
}

func Logout(c *gin.Context) {
	// Get token from Authorization header
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrTokenRequired})
		return
	}

	// Remove "Bearer " prefix if present
	if len(token) > 7 && token[:7] == "Bearer " {
		token = token[7:]
	}

	// Add token to blacklist in Redis
	err := middleware.BlacklistToken(token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đăng xuất thành công"})
}

func ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền số điện thoại"})
		return
	}

	// Validate phone
	if !utils.ValidatePhone(req.Phone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrPhoneInvalid})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)

	// Check if user exists
	_, err := userRepo.FindByPhone(req.Phone)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": utils.ErrPhoneNotFound})
		return
	}

	// Generate OTP
	otp := generateOTP()

	// Store OTP in Redis with expiration
	key := "otp:" + req.Phone
	err = config.RedisClient.Set(config.Ctx, key, otp, 5*time.Minute).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mã OTP đã được gửi thành công",
		"otp":     otp, // Remove in production
	})
}

func VerifyOTP(c *gin.Context) {
	var req VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	// Validate phone
	if !utils.ValidatePhone(req.Phone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrPhoneInvalid})
		return
	}

	// Get OTP from Redis
	key := "otp:" + req.Phone
	storedOTP, err := config.RedisClient.Get(config.Ctx, key).Result()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrOTPExpired})
		return
	}

	// Verify OTP
	if storedOTP != req.OTP {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrOTPInvalid})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Xác thực OTP thành công"})
}

func ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	// Validate phone
	if !utils.ValidatePhone(req.Phone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrPhoneInvalid})
		return
	}

	// Validate new password
	if valid, msg := utils.ValidatePassword(req.NewPassword); !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	// Verify OTP first
	key := "otp:" + req.Phone
	storedOTP, err := config.RedisClient.Get(config.Ctx, key).Result()
	if err != nil || storedOTP != req.OTP {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrOTPInvalid})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)

	// Get user and update password
	user, err := userRepo.FindByPhone(req.Phone)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": utils.ErrPhoneNotFound})
		return
	}

	user.Password = req.NewPassword
	if err := userRepo.Update(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Delete OTP after successful password reset
	config.RedisClient.Del(config.Ctx, key)

	c.JSON(http.StatusOK, gin.H{"message": "Đặt lại mật khẩu thành công"})
}

func ChangePassword(c *gin.Context) {
	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	// Validate new password
	if valid, msg := utils.ValidatePassword(req.NewPassword); !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	// Get user ID from context (set by AuthMiddleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": utils.ErrTokenRequired})
		return
	}

	userRepo := repository.NewUserRepository(config.DB)

	// Get user
	user, err := userRepo.FindByID(userID.(uint))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": utils.ErrPhoneNotFound})
		return
	}

	// Verify old password
	if err := user.ComparePassword(req.OldPassword); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": utils.ErrInvalidCredentials})
		return
	}

	// Check if new password is same as old password
	if req.OldPassword == req.NewPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.ErrPasswordSame})
		return
	}

	// Update password
	user.Password = req.NewPassword
	if err := userRepo.Update(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đổi mật khẩu thành công"})
}

// Helper function to generate 6-digit OTP
func generateOTP() string {
	// For simplicity, we'll generate a random 6-digit number
	// In production, use a more secure method
	return "123456"
}
