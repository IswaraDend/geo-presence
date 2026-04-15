package repository

import (
	"absensi-backend/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthRepository interface {
	// User
	GetUserByEmail(email string) (*entity.User, error)
	GetUserByID(id uuid.UUID) (*entity.User, error)
	CreateUser(user *entity.User) error

	// Admin profile
	GetAdminByUserID(userID uuid.UUID) (*entity.Admin, error)
	CreateAdmin(admin *entity.Admin) error

	// Dosen profile
	GetDosenByUserID(userID uuid.UUID) (*entity.Dosen, error)

	// Mahasiswa profile
	GetMahasiswaByUserID(userID uuid.UUID) (*entity.Mahasiswa, error)
	GetMahasiswaByID(id uuid.UUID) (*entity.Mahasiswa, error)
	CreateMahasiswa(mahasiswa *entity.Mahasiswa) error
	UpdateMahasiswa(mahasiswa *entity.Mahasiswa) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db}
}

func (r *authRepository) GetUserByEmail(email string) (*entity.User, error) {
	var user entity.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *authRepository) GetUserByID(id uuid.UUID) (*entity.User, error) {
	var user entity.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *authRepository) CreateUser(user *entity.User) error {
	return r.db.Create(user).Error
}

func (r *authRepository) GetAdminByUserID(userID uuid.UUID) (*entity.Admin, error) {
	var admin entity.Admin
	if err := r.db.Where("user_id = ?", userID).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *authRepository) CreateAdmin(admin *entity.Admin) error {
	return r.db.Create(admin).Error
}

func (r *authRepository) GetDosenByUserID(userID uuid.UUID) (*entity.Dosen, error) {
	var dosen entity.Dosen
	if err := r.db.Preload("User").Where("user_id = ?", userID).First(&dosen).Error; err != nil {
		return nil, err
	}
	return &dosen, nil
}

func (r *authRepository) GetMahasiswaByUserID(userID uuid.UUID) (*entity.Mahasiswa, error) {
	var mahasiswa entity.Mahasiswa
	if err := r.db.Preload("Kelas").Preload("User").Where("user_id = ?", userID).First(&mahasiswa).Error; err != nil {
		return nil, err
	}
	return &mahasiswa, nil
}

func (r *authRepository) GetMahasiswaByID(id uuid.UUID) (*entity.Mahasiswa, error) {
	var mahasiswa entity.Mahasiswa
	if err := r.db.Preload("Kelas").Preload("User").First(&mahasiswa, id).Error; err != nil {
		return nil, err
	}
	return &mahasiswa, nil
}

func (r *authRepository) CreateMahasiswa(mahasiswa *entity.Mahasiswa) error {
	return r.db.Create(mahasiswa).Error
}

func (r *authRepository) UpdateMahasiswa(mahasiswa *entity.Mahasiswa) error {
	return r.db.Save(mahasiswa).Error
}
