package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Role string

const (
	RoleAdmin    Role = "admin"
	RoleStaff    Role = "staff"
	RoleDriver   Role = "driver"
	RoleCustomer Role = "customer"
)

type UserStatus int

const (
	UserStatusCreated  UserStatus = 1 // created but not verified
	UserStatusVerified UserStatus = 2 // verified
)

type User struct {
	gorm.Model
	Phone    string `json:"phone" gorm:"unique;not null"`
	Password string `json:"-"`
	Name     string `json:"name"`
	Role     Role   `json:"role" gorm:"default:'customer'"`
	Status   UserStatus `json:"status" gorm:"default:2"` // 1 = created, 2 = verified

}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.Password != "" {
		// Only hash if it's not already hashed
		if !isHashed(u.Password) {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			u.Password = string(hashedPassword)
		}
	}
	return nil
}

func isHashed(password string) bool {
	// bcrypt hashes always start with $2a$ or $2b$
	return len(password) > 0 && (password[0:4] == "$2a$" || password[0:4] == "$2b$")
}

func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}
