package service

import (
    "github.com/devuit2025/ticket-management/api/services/user/model"
    "github.com/devuit2025/ticket-management/api/services/user/repository"
)

func GetUsers() ([]model.User, error) {
    return repository.GetAllUsers()
}

func GetUser(id uint) (model.User, error) {
    return repository.GetUserByID(id)
}

func Create(user *model.User) error {
    return repository.CreateUser(user)
}

func Update(user *model.User) error {
    return repository.UpdateUser(user)
}

func Delete(id uint) error {
    return repository.DeleteUser(id)
}
