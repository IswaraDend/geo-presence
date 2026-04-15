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

type LoginResponse struct {
	Token string `json:"token"`
	Role  string `json:"role"`
}

type AuthUseCase interface {
	Login(email, password string) (*LoginResponse, error)
	GetUserByID(id uuid.UUID) (*entity.User, error)
	GetMahasiswaByUserID(userID uuid.UUID) (*entity.Mahasiswa, error)
	GetDosenByUserID(userID uuid.UUID) (*entity.Dosen, error)
}

type authUseCase struct {
	repo repository.AuthRepository
	cfg  *config.Config
}

func NewAuthUseCase(repo repository.AuthRepository, cfg *config.Config) AuthUseCase {
	return &authUseCase{repo, cfg}
}

// Login adalah satu endpoint universal untuk semua role (admin, dosen, mahasiswa)
func (u *authUseCase) Login(email, password string) (*LoginResponse, error) {
	user, err := u.repo.GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("email atau password salah")
	}

	if !user.IsActive {
		return nil, errors.New("akun tidak aktif")
	}

	if !hash.CheckPasswordHash(password, user.PasswordHash) {
		return nil, errors.New("email atau password salah")
	}

	// Validasi tambahan untuk mahasiswa: cek status aktif di tabel mahasiswas
	if user.Role == "mahasiswa" {
		mhs, err := u.repo.GetMahasiswaByUserID(user.ID)
		if err != nil {
			return nil, errors.New("data mahasiswa tidak ditemukan")
		}
		if !mhs.StatusAktif {
			return nil, errors.New("status mahasiswa tidak aktif")
		}
	}

	token, err := jwt.GenerateToken(user.ID, user.Role, u.cfg.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{Token: token, Role: user.Role}, nil
}

func (u *authUseCase) GetUserByID(id uuid.UUID) (*entity.User, error) {
	return u.repo.GetUserByID(id)
}

func (u *authUseCase) GetMahasiswaByUserID(userID uuid.UUID) (*entity.Mahasiswa, error) {
	return u.repo.GetMahasiswaByUserID(userID)
}

func (u *authUseCase) GetDosenByUserID(userID uuid.UUID) (*entity.Dosen, error) {
	return u.repo.GetDosenByUserID(userID)
}
