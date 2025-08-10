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

type User struct {
	gorm.Model
	Phone    string `json:"phone" gorm:"unique;not null"`
	Password string `json:"-"`
	Name     string `json:"name"`
	Role     Role   `json:"role" gorm:"default:'customer'"`
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	if u.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		u.Password = string(hashedPassword)
	}
	return nil
}

func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}
