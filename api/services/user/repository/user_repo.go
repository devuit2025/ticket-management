package repository

import (
    "github.com/devuit2025/ticket-management/api/services/user/model"
    "github.com/devuit2025/ticket-management/api/services/user/config"
)

func GetAllUsers() ([]model.User, error) {
    var users []model.User
    result := config.DB.Find(&users)
    return users, result.Error
}

func GetUserByID(id uint) (model.User, error) {
    var user model.User
    result := config.DB.First(&user, id)
    return user, result.Error
}

func CreateUser(user *model.User) error {
    return config.DB.Create(user).Error
}

func UpdateUser(user *model.User) error {
    return config.DB.Save(user).Error
}

func DeleteUser(id uint) error {
    return config.DB.Delete(&model.User{}, id).Error
}
