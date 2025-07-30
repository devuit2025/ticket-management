package repository

type BaseRepository[T any] interface {
    FindByID(id uint) (*T, error)
    FindAll() ([]T, error)
    Create(entity *T) error
    Update(entity *T) error
    Delete(id uint) error
}