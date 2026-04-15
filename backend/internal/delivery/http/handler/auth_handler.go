package handler

import (
	"absensi-backend/internal/usecase"
	"absensi-backend/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuthHandler struct {
	useCase usecase.AuthUseCase
}

func NewAuthHandler(useCase usecase.AuthUseCase) *AuthHandler {
	return &AuthHandler{useCase}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Login adalah satu endpoint universal untuk semua role (admin, dosen, mahasiswa)
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.useCase.Login(req.Email, req.Password)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Login berhasil", gin.H{
		"token": result.Token,
		"role":  result.Role,
	})
}

// GetMe mengembalikan data user yang sedang login (+ profil spesifik sesuai role)
func (h *AuthHandler) GetMe(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var id uuid.UUID
	switch v := userID.(type) {
	case string:
		id, _ = uuid.Parse(v)
	case uuid.UUID:
		id = v
	}

	role, _ := c.Get("role")

	user, err := h.useCase.GetUserByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "User tidak ditemukan")
		return
	}

	switch role {
	case "mahasiswa":
		mhs, err := h.useCase.GetMahasiswaByUserID(id)
		if err != nil {
			response.Success(c, http.StatusOK, "Data akun berhasil diambil", user)
			return
		}
		response.Success(c, http.StatusOK, "Data akun berhasil diambil", gin.H{
			"user":      user,
			"mahasiswa": mhs,
		})
	case "dosen":
		dosen, err := h.useCase.GetDosenByUserID(id)
		if err != nil {
			response.Success(c, http.StatusOK, "Data akun berhasil diambil", user)
			return
		}
		response.Success(c, http.StatusOK, "Data akun berhasil diambil", gin.H{
			"user":  user,
			"dosen": dosen,
		})
	default:
		response.Success(c, http.StatusOK, "Data akun berhasil diambil", user)
	}
}
