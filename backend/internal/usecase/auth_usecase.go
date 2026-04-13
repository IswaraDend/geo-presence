package usecase

import (
	"absensi-backend/config"
	"absensi-backend/internal/entity"
	"absensi-backend/internal/repository"
	"absensi-backend/pkg/hash"
	"absensi-backend/pkg/jwt"
	"errors"

	"github.com/google/uuid"
)

type AuthUseCase interface {
	LoginAdmin(email, password string) (string, error)
	LoginStudent(email, password string) (string, error)
	GetStudentProfile(id uuid.UUID) (*entity.Student, error)
}

type authUseCase struct {
	repo repository.AuthRepository
	cfg  *config.Config
}

func NewAuthUseCase(repo repository.AuthRepository, cfg *config.Config) AuthUseCase {
	return &authUseCase{repo, cfg}
}

func (u *authUseCase) LoginAdmin(email, password string) (string, error) {
	admin, err := u.repo.GetAdminByEmail(email)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	if !hash.CheckPasswordHash(password, admin.Password) {
		return "", errors.New("invalid email or password")
	}

	token, err := jwt.GenerateToken(admin.ID, admin.Role, u.cfg.JWTSecret)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (u *authUseCase) LoginStudent(email, password string) (string, error) {
	student, err := u.repo.GetStudentByEmail(email)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	if !student.IsActive {
		return "", errors.New("account is not active")
	}

	if !hash.CheckPasswordHash(password, student.Password) {
		return "", errors.New("invalid email or password")
	}

	token, err := jwt.GenerateToken(student.ID, student.Role, u.cfg.JWTSecret)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (u *authUseCase) GetStudentProfile(id uuid.UUID) (*entity.Student, error) {
	return u.repo.GetStudentByID(id)
}
