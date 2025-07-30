// services/user/repository/user_repository.go
package repository

import (
    "ticket-management/shared/repository"
    "ticket-management/services/user/model"
    "gorm.io/gorm"
)

type UserRepository struct {
    repository.GormRepository[model.User]  // embed base
}

// Có thể thêm method riêng nếu cần
func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
    var user model.User
    if err := r.DB.Where("email = ?", email).First(&user).Error; err != nil {
        return nil, err
    }
    return &user, nil
}

func NewUserRepository(db *gorm.DB) *UserRepository {
    return &UserRepository{
        GormRepository: repository.GormRepository[model.User]{DB: db},
    }
}
