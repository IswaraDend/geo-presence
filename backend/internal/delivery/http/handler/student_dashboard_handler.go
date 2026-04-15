package handler

import (
	"absensi-backend/internal/usecase"
	"absensi-backend/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type StudentHandler struct {
	useCase usecase.StudentDashboardUseCase
}

func NewStudentHandler(useCase usecase.StudentDashboardUseCase) *StudentHandler {
	return &StudentHandler{useCase}
}

func (h *StudentHandler) GetDashboard(c *gin.Context) {
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

	summary, err := h.useCase.GetDashboardSummary(id)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memuat data dashboard")
		return
	}

	response.Success(c, http.StatusOK, "Data dashboard berhasil dimuat", summary)
}
