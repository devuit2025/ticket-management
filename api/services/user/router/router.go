package router

import (
    "github.com/gin-gonic/gin"
    "github.com/devuit2025/ticket-management/api/services/user/handler"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

    user := r.Group("/users")
    {
        user.GET("/", handler.GetUsers)
        user.GET("/:id", handler.GetUser)
        user.POST("/", handler.CreateUser)
        user.PUT("/:id", handler.UpdateUser)
        user.DELETE("/:id", handler.DeleteUser)
    }

    return r
}
