package utils

import (
	"crypto/rand"
	"encoding/base32"
)

// GenerateRandomString generates a random string of specified length
func GenerateRandomString(length int) string {
	randomBytes := make([]byte, length)
	rand.Read(randomBytes)
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(randomBytes)[:length]
} 