package middleware

import (
	"net/http"
	"strings"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const (
	TokenExpiration = 24 * time.Hour // Token expires in 24 hours
	BlacklistPrefix = "blacklist:"   // Prefix for blacklisted tokens in Redis
)

// GenerateToken generates a new JWT token for a user
func GenerateToken(user *models.User) (string, error) {
	// Create claims
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(TokenExpiration).Unix(),
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Vui lòng đăng nhập"})
			c.Abort()
			return
		}

		// Check if token is in correct format
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			c.Abort()
			return
		}

		// Tempotary comment this
		// Check if token is blacklisted
		// isBlacklisted, err := IsTokenBlacklisted(tokenString)
		// if err != nil {
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		// 	c.Abort()
		// 	return
		// }
		// if isBlacklisted {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Token đã hết hạn"})
		// 	c.Abort()
		// 	return
		// }

		// Parse and validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.JWTSecret), nil
		})

		if err != nil {
			if err.Error() == "Token is expired" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token đã hết hạn"})
				c.Abort()
				return
			}
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			c.Abort()
			return
		}

		// Get claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			c.Abort()
			return
		}

		// Check expiration
		exp, ok := claims["exp"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			c.Abort()
			return
		}

		if float64(time.Now().Unix()) > exp {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token đã hết hạn"})
			c.Abort()
			return
		}

		// Get user ID from claims
		userID, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			c.Abort()
			return
		}

		// Get user from database
		userRepo := repository.NewUserRepository(config.DB)
		user, err := userRepo.FindByID(uint(userID))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Người dùng không tồn tại"})
			c.Abort()
			return
		}

		// Set user in context
		c.Set("user", user)
		c.Next()
	}
}

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Vui lòng đăng nhập"})
			c.Abort()
			return
		}

		if user.(*models.User).Role != models.RoleAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Không có quyền truy cập"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func StaffMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetString("role")
		if role != string(models.RoleStaff) && role != string(models.RoleAdmin) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Staff access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// BlacklistToken adds a token to the blacklist
func BlacklistToken(token string) error {
	// Add token to Redis with expiration
	err := config.RedisClient.Set(config.Ctx, BlacklistPrefix+token, true, TokenExpiration).Err()
	if err != nil {
		return err
	}
	return nil
}

// IsTokenBlacklisted checks if a token is blacklisted
func IsTokenBlacklisted(token string) (bool, error) {
	// Check if token exists in Redis
	exists, err := config.RedisClient.Exists(config.Ctx, BlacklistPrefix+token).Result()
	if err != nil {
		return false, err
	}
	return exists > 0, nil
}
