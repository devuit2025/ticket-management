package repository

import (
	"ticket-management/api_simple/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	*BaseRepository[models.User]
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		BaseRepository: NewBaseRepository[models.User](db),
	}
}

// FindByPhone finds a user by phone number
func (r *UserRepository) FindByPhone(phone string) (*models.User, error) {
	return r.FindOne(map[string]interface{}{"phone": phone})
}

// FindByRole finds users by role
func (r *UserRepository) FindByRole(role models.Role) ([]models.User, error) {
	return r.FindAll(map[string]interface{}{"role": role})
}

// UpdateRole updates a user's role
func (r *UserRepository) UpdateRole(userID uint, role models.Role) error {
	user, err := r.FindByID(userID)
	if err != nil {
		return err
	}
	user.Role = role
	return r.Update(user)
}

// Create creates a new user
func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

// Update updates a user
func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

// Add FindByID method
func (r *UserRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
