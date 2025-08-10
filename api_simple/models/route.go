package models

import "gorm.io/gorm"

type Route struct {
	gorm.Model
	Origin      string `json:"origin" gorm:"not null"`
	Destination string `json:"destination" gorm:"not null"`
	Distance    int    `json:"distance" gorm:"not null"` // in kilometers
	Duration    string `json:"duration" gorm:"not null"` // e.g. "48h", "24h"
}
