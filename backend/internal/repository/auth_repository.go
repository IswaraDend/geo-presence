package repository

import (
	"absensi-backend/internal/entity"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthRepository interface {
	GetAdminByEmail(email string) (*entity.Admin, error)
	GetStudentByEmail(email string) (*entity.Student, error)
	CreateAdmin(admin *entity.Admin) error
	CreateStudent(student *entity.Student) error
	GetStudentByID(id uuid.UUID) (*entity.Student, error)
	UpdateStudent(student *entity.Student) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db}
}

func (r *authRepository) GetAdminByEmail(email string) (*entity.Admin, error) {
	var admin entity.Admin
	if err := r.db.Where("email = ?", email).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *authRepository) GetStudentByEmail(email string) (*entity.Student, error) {
	var student entity.Student
	if err := r.db.Where("email = ?", email).First(&student).Error; err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *authRepository) CreateAdmin(admin *entity.Admin) error {
	return r.db.Create(admin).Error
}

func (r *authRepository) CreateStudent(student *entity.Student) error {
	return r.db.Create(student).Error
}

func (r *authRepository) GetStudentByID(id uuid.UUID) (*entity.Student, error) {
	var student entity.Student
	if err := r.db.First(&student, id).Error; err != nil {
		return nil, err
	}
	return &student, nil
}

func (r *authRepository) UpdateStudent(student *entity.Student) error {
	return r.db.Save(student).Error
}
