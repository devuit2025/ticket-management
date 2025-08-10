package models

import (
	"gorm.io/gorm"
)

type Route struct {
	gorm.Model
	Origin        string  `json:"origin"`         // Điểm đi
	Destination   string  `json:"destination"`    // Điểm đến
	Distance      float64 `json:"distance"`       // Khoảng cách (km)
	Duration      string  `json:"duration"`       // Thời gian di chuyển (VD: "4h30m")
	BasePrice     float64 `json:"base_price"`     // Giá cơ bản
	IsActive      bool    `json:"is_active"`      // Trạng thái hoạt động
	TotalTrips    int64   `json:"total_trips"`    // Tổng số chuyến
	UpcomingTrips int64   `json:"upcoming_trips"` // Số chuyến sắp tới
	MinPrice      float64 `json:"min_price"`      // Giá thấp nhất
	MaxPrice      float64 `json:"max_price"`      // Giá cao nhất
}
