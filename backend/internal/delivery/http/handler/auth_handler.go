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

func (h *AuthHandler) AdminLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	token, err := h.useCase.LoginAdmin(req.Email, req.Password)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Login success", gin.H{"token": token})
}

func (h *AuthHandler) StudentLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	token, err := h.useCase.LoginStudent(req.Email, req.Password)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Login success", gin.H{"token": token})
}

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

	if role == "student" {
		student, err := h.useCase.GetStudentProfile(id)
		if err != nil {
			response.Error(c, http.StatusNotFound, "User not found")
			return
		}
		response.Success(c, http.StatusOK, "Profile fetched", student)
		return
	}

	response.Success(c, http.StatusOK, "Profile fetched", gin.H{"id": id, "role": role})
}
