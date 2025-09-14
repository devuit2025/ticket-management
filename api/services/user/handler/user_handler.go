package handler

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/devuit2025/ticket-management/api/services/user/model"
    "github.com/devuit2025/ticket-management/api/services/user/service"
	"github.com/devuit2025/ticket-management/api/services/user/utils"
)

func GetUsers(c *gin.Context) {
    users, err := service.GetUsers()
    if err != nil {
		// c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		utils.RespondError(c, http.StatusInternalServerError, "Failed to get users", nil)
        return
    }
		utils.RespondSuccess(c, users, "Get users successfully")
}

func GetUser(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    user, err := service.GetUser(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    c.JSON(http.StatusOK, user)
}

func CreateUser(c *gin.Context) {
    var user model.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := service.Create(&user); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, user)
}

func UpdateUser(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var user model.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    user.ID = uint(id)

    if err := service.Update(&user); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, user)
}

func DeleteUser(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))

    if err := service.Delete(uint(id)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
