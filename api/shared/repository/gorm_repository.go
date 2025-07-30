// shared/repository/gorm_repository.go
package repository

import (
    "gorm.io/gorm"
)

type GormRepository[T any] struct {
    DB *gorm.DB
}

func (r *GormRepository[T]) FindByID(id uint) (*T, error) {
    var entity T
    if err := r.DB.First(&entity, id).Error; err != nil {
        return nil, err
    }
    return &entity, nil
}

func (r *GormRepository[T]) FindAll() ([]T, error) {
    var entities []T
    if err := r.DB.Find(&entities).Error; err != nil {
        return nil, err
    }
    return entities, nil
}

func (r *GormRepository[T]) Create(entity *T) error {
    return r.DB.Create(entity).Error
}

func (r *GormRepository[T]) Update(entity *T) error {
    return r.DB.Save(entity).Error
}

func (r *GormRepository[T]) Delete(id uint) error {
    var entity T
    return r.DB.Delete(&entity, id).Error
}
