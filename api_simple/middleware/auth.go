package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const (
	TokenExpiration = 24 * time.Hour // Token expires in 24 hours
	BlacklistPrefix = "blacklist:"   // Prefix for blacklisted tokens in Redis
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		tokenString := bearerToken[1]

		// Check if token is blacklisted
		if IsTokenBlacklisted(tokenString) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been invalidated"})
			c.Abort()
			return
		}

		// Parse and validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userID := uint(claims["id"].(float64))
			role := models.Role(claims["role"].(string))
			c.Set("userID", userID)
			c.Set("role", role)
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}
	}
}

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetString("role")
		if role != string(models.RoleAdmin) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
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

func GenerateToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// BlacklistToken adds a token to the blacklist in Redis
func BlacklistToken(token string) error {
	// Parse the token to get its expiration time
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.JWTSecret), nil
	})
	if err != nil {
		return err
	}

	// Get token expiration time
	exp, ok := claims["exp"].(float64)
	if !ok {
		return errors.New("invalid token expiration")
	}

	// Calculate remaining time until token expiration
	expTime := time.Unix(int64(exp), 0)
	ttl := time.Until(expTime)
	if ttl <= 0 {
		return errors.New("token has already expired")
	}

	// Add token to Redis blacklist with TTL
	key := BlacklistPrefix + token
	err = config.RedisClient.Set(config.Ctx, key, "blacklisted", ttl).Err()
	if err != nil {
		return fmt.Errorf("failed to blacklist token: %v", err)
	}

	return nil
}

// IsTokenBlacklisted checks if a token is blacklisted in Redis
func IsTokenBlacklisted(token string) bool {
	key := BlacklistPrefix + token
	_, err := config.RedisClient.Get(config.Ctx, key).Result()
	return err == nil // If we can get the key, token is blacklisted
}
