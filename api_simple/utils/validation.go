package utils

import (
	"regexp"

	"golang.org/x/crypto/bcrypt"
	// "unicode"
)

// Validation constants
const (
	MinPasswordLength = 8
	MaxPasswordLength = 32
	PhoneRegex        = `^(0[0-9]{9})$` // Vietnamese phone number format
)

// Error messages
const (
	ErrPhoneInvalid         = "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 số)"
	ErrPhoneExists          = "Số điện thoại đã được đăng ký"
	ErrPhoneNotFound        = "Số điện thoại chưa được đăng ký"
	ErrPasswordTooShort     = "Mật khẩu phải có ít nhất 8 ký tự"
	ErrPasswordTooLong      = "Mật khẩu không được quá 32 ký tự"
	ErrPasswordRequirements = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
	ErrPasswordSame         = "Mật khẩu mới không được trùng với mật khẩu cũ"
	ErrNameRequired         = "Họ tên không được để trống"
	ErrNameTooShort         = "Họ tên phải có ít nhất 2 ký tự"
	ErrNameTooLong          = "Họ tên không được quá 50 ký tự"
	ErrInvalidCredentials   = "Thông tin đăng nhập không chính xác"
	ErrTokenInvalid         = "Token không hợp lệ hoặc đã hết hạn"
	ErrTokenRequired        = "Yêu cầu xác thực token"
	ErrOTPInvalid           = "Mã OTP không chính xác"
	ErrOTPExpired           = "Mã OTP đã hết hạn"
	ErrServerError          = "Có lỗi xảy ra, vui lòng thử lại sau"
)

// ValidatePhone checks if a phone number is valid
func ValidatePhone(phone string) bool {
	match, _ := regexp.MatchString(PhoneRegex, phone)
	return match
}

// ValidatePassword checks if a password meets the requirements
func ValidatePassword(password string) (bool, string) {
	if len(password) < MinPasswordLength {
		return false, ErrPasswordTooShort
	}
	if len(password) > MaxPasswordLength {
		return false, ErrPasswordTooLong
	}

	// var hasUpper, hasLower, hasNumber, hasSpecial bool
	// for _, char := range password {
	// 	switch {
	// 	case unicode.IsUpper(char):
	// 		hasUpper = true
	// 	case unicode.IsLower(char):
	// 		hasLower = true
	// 	case unicode.IsNumber(char):
	// 		hasNumber = true
	// 	case unicode.IsPunct(char) || unicode.IsSymbol(char):
	// 		hasSpecial = true
	// 	}
	// }

	// if !(hasUpper && hasLower && hasNumber && hasSpecial) {
	// 	return false, ErrPasswordRequirements
	// }

	return true, ""
}

// ValidateName checks if a name is valid
func ValidateName(name string) (bool, string) {
	if name == "" {
		return false, ErrNameRequired
	}
	if len(name) < 2 {
		return false, ErrNameTooShort
	}
	if len(name) > 50 {
		return false, ErrNameTooLong
	}
	return true, ""
}

// ValidatePlateNumber validates a plate number format
func ValidatePlateNumber(plateNumber string) bool {
	// For simplicity, just check if it matches the format: XXX-XXXXX
	// where X can be a letter or number
	// In production, use a more strict regex based on your country's plate number format
	return len(plateNumber) >= 8 && len(plateNumber) <= 10 && plateNumber[3] == '-'
}

// ValidateEmail checks if the email is valid
func ValidateEmail(email string) bool {
	// Simple email validation using regex
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// CheckPasswordHash compares a password with its hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
