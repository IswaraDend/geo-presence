package handler

import (
	"absensi-backend/internal/usecase"
	"absensi-backend/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type DosenHandler struct {
	useCase usecase.DosenDashboardUseCase
}

func NewDosenHandler(useCase usecase.DosenDashboardUseCase) *DosenHandler {
	return &DosenHandler{useCase}
}

func (h *DosenHandler) GetDashboard(c *gin.Context) {
	userIDStr, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User ID tidak ditemukan")
		return
	}

	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "User ID tidak valid")
		return
	}

	summary, err := h.useCase.GetDashboardSummary(userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memuat data dashboard dosen")
		return
	}

	response.Success(c, http.StatusOK, "Data dashboard dosen berhasil dimuat", summary)
}

func (h *DosenHandler) GetKelas(c *gin.Context) {
	userIDStr, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User ID tidak ditemukan")
		return
	}

	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "User ID tidak valid")
		return
	}

	list, err := h.useCase.GetKelasList(userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memuat data kelas dosen")
		return
	}

	response.Success(c, http.StatusOK, "Data kelas dosen berhasil dimuat", list)
}
