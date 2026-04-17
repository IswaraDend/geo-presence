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
	userIDVal, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User ID tidak ditemukan")
		return
	}

	var userID uuid.UUID
	switch v := userIDVal.(type) {
	case string:
		userID, _ = uuid.Parse(v)
	case uuid.UUID:
		userID = v
	}

	summary, err := h.useCase.GetDashboardSummary(userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memuat data dashboard dosen")
		return
	}

	response.Success(c, http.StatusOK, "Data dashboard dosen berhasil dimuat", summary)
}

func (h *DosenHandler) GetKelas(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User ID tidak ditemukan")
		return
	}

	var userID uuid.UUID
	switch v := userIDVal.(type) {
	case string:
		userID, _ = uuid.Parse(v)
	case uuid.UUID:
		userID = v
	}

	list, err := h.useCase.GetKelasList(userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memuat data kelas dosen")
		return
	}

	response.Success(c, http.StatusOK, "Data kelas dosen berhasil dimuat", list)
}

func (h *DosenHandler) GetMahasiswa(c *gin.Context) {
	jadwalIDStr := c.Query("jadwal_id")
	if jadwalIDStr == "" {
		response.Error(c, http.StatusBadRequest, "jadwal_id is required")
		return
	}

	jadwalID, err := uuid.Parse(jadwalIDStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid jadwal_id")
		return
	}

	list, err := h.useCase.GetMahasiswaByJadwal(jadwalID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memuat data mahasiswa")
		return
	}

	response.Success(c, http.StatusOK, "Data mahasiswa berhasil dimuat", list)
}

func (h *DosenHandler) SubmitAbsensi(c *gin.Context) {
	var req usecase.BulkAbsensiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.useCase.SubmitBulkAbsensi(req); err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal menyimpan absensi")
		return
	}

	response.Success(c, http.StatusOK, "Absensi berhasil disimpan", nil)
}
