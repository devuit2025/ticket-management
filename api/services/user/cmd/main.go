package main

import (
    "github.com/devuit2025/ticket-management/api/services/user/config"
    "github.com/devuit2025/ticket-management/api/services/user/model"
    "github.com/devuit2025/ticket-management/api/services/user/router"
)

func main() {
    config.InitDB()
    config.DB.AutoMigrate(&model.User{})
    r := router.SetupRouter()
    r.Run(":8080")
}
