package handlers

import (
	"net/http"
	"strconv"

	"ticket-management/api_simple/config"
	"ticket-management/api_simple/models"
	"ticket-management/api_simple/repository"
	"ticket-management/api_simple/utils"

	"github.com/gin-gonic/gin"
)

type CreateRouteRequest struct {
	Origin      string  `json:"origin" binding:"required"`          // Điểm đi
	Destination string  `json:"destination" binding:"required"`     // Điểm đến
	Distance    float64 `json:"distance" binding:"required,gt=0"`   // Khoảng cách (km)
	Duration    string  `json:"duration" binding:"required"`        // Thời gian di chuyển (VD: "4h30m")
	BasePrice   float64 `json:"base_price" binding:"required,gt=0"` // Giá cơ bản
}

type UpdateRouteRequest struct {
	Origin      string  `json:"origin"`                              // Điểm đi
	Destination string  `json:"destination"`                         // Điểm đến
	Distance    float64 `json:"distance" binding:"omitempty,gt=0"`   // Khoảng cách (km)
	Duration    string  `json:"duration"`                            // Thời gian di chuyển
	BasePrice   float64 `json:"base_price" binding:"omitempty,gt=0"` // Giá cơ bản
	IsActive    *bool   `json:"is_active"`                           // Trạng thái hoạt động
}

type RouteResponse struct {
	ID            uint    `json:"id"`
	Origin        string  `json:"origin"`
	Destination   string  `json:"destination"`
	Distance      float64 `json:"distance"`
	Duration      string  `json:"duration"`
	BasePrice     float64 `json:"base_price"`
	IsActive      bool    `json:"is_active"`
	TotalTrips    int64   `json:"total_trips"`    // Tổng số chuyến
	UpcomingTrips int64   `json:"upcoming_trips"` // Số chuyến sắp tới
	MinPrice      float64 `json:"min_price"`      // Giá thấp nhất
	MaxPrice      float64 `json:"max_price"`      // Giá cao nhất
	CreatedAt     string  `json:"created_at"`
	UpdatedAt     string  `json:"updated_at"`
}

// CreateRoute creates a new route
func CreateRoute(c *gin.Context) {
	var req CreateRouteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if err.Error() == "Key: 'CreateRouteRequest.Distance' Error:Field validation for 'Distance' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Khoảng cách phải lớn hơn 0"})
			return
		}
		if err.Error() == "Key: 'CreateRouteRequest.BasePrice' Error:Field validation for 'BasePrice' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Giá vé phải lớn hơn 0"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng điền đầy đủ thông tin"})
		return
	}

	routeRepo := repository.NewRouteRepository(config.DB)

	// Check if route exists
	exists, err := routeRepo.Exists(map[string]interface{}{
		"origin":      req.Origin,
		"destination": req.Destination,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}
	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tuyến đường đã tồn tại"})
		return
	}

	route := models.Route{
		Origin:      req.Origin,
		Destination: req.Destination,
		Distance:    req.Distance,
		Duration:    req.Duration,
		BasePrice:   req.BasePrice,
		IsActive:    true,
	}

	if err := routeRepo.Create(&route); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tạo tuyến đường thành công",
		"route":   formatRouteResponse(&route),
	})
}

// GetRoutes returns list of routes with optional filters
func GetRoutes(c *gin.Context) {
	routeRepo := repository.NewRouteRepository(config.DB)

	// Get query parameters
	origin := c.Query("origin")
	destination := c.Query("destination")
	isActive := c.Query("is_active")

	// Build filter
	filter := make(map[string]interface{})
	if origin != "" {
		filter["origin"] = origin
	}
	if destination != "" {
		filter["destination"] = destination
	}
	if isActive != "" {
		filter["is_active"] = isActive == "true"
	}

	routes, err := routeRepo.FindAll(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Format response
	response := make([]RouteResponse, len(routes))
	for i, route := range routes {
		response[i] = *formatRouteResponse(&route)
	}

	c.JSON(http.StatusOK, gin.H{
		"routes": response,
		"total":  len(response),
	})
}

// GetPopularRoutes returns list of most booked routes
func GetPopularRoutes(c *gin.Context) {
	routeRepo := repository.NewRouteRepository(config.DB)

	routes, err := routeRepo.FindPopularRoutes(10) // Get top 10 popular routes
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	// Format response
	response := make([]RouteResponse, len(routes))
	for i, route := range routes {
		response[i] = *formatRouteResponse(&route)
	}

	c.JSON(http.StatusOK, gin.H{
		"routes": response,
		"total":  len(response),
	})
}

// GetRoute returns a single route by ID
func GetRoute(c *gin.Context) {
	routeRepo := repository.NewRouteRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	route, err := routeRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy tuyến đường"})
		return
	}

	c.JSON(http.StatusOK, formatRouteResponse(route))
}

// UpdateRoute updates a route
func UpdateRoute(c *gin.Context) {
	var req UpdateRouteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if err.Error() == "Key: 'UpdateRouteRequest.Distance' Error:Field validation for 'Distance' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Khoảng cách phải lớn hơn 0"})
			return
		}
		if err.Error() == "Key: 'UpdateRouteRequest.BasePrice' Error:Field validation for 'BasePrice' failed on the 'gt' tag" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Giá vé phải lớn hơn 0"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	routeRepo := repository.NewRouteRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	route, err := routeRepo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy tuyến đường"})
		return
	}

	// Update fields if provided
	if req.Origin != "" {
		route.Origin = req.Origin
	}
	if req.Destination != "" {
		route.Destination = req.Destination
	}
	if req.Distance != 0 {
		route.Distance = req.Distance
	}
	if req.Duration != "" {
		route.Duration = req.Duration
	}
	if req.BasePrice != 0 {
		route.BasePrice = req.BasePrice
	}
	if req.IsActive != nil {
		route.IsActive = *req.IsActive
	}

	if err := routeRepo.Update(route); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cập nhật tuyến đường thành công",
		"route":   formatRouteResponse(route),
	})
}

// DeleteRoute soft deletes a route
func DeleteRoute(c *gin.Context) {
	routeRepo := repository.NewRouteRepository(config.DB)

	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	// Check if route exists
	if _, err := routeRepo.FindByID(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy tuyến đường"})
		return
	}

	if err := routeRepo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": utils.ErrServerError})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Xóa tuyến đường thành công"})
}

// Helper function to format route response
func formatRouteResponse(route *models.Route) *RouteResponse {
	return &RouteResponse{
		ID:            route.ID,
		Origin:        route.Origin,
		Destination:   route.Destination,
		Distance:      route.Distance,
		Duration:      route.Duration,
		BasePrice:     route.BasePrice,
		IsActive:      route.IsActive,
		TotalTrips:    route.TotalTrips,
		UpcomingTrips: route.UpcomingTrips,
		MinPrice:      route.MinPrice,
		MaxPrice:      route.MaxPrice,
		CreatedAt:     route.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:     route.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}
