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

	id, err := uuid.Parse(userID.(string))
	if err != nil {
		id = userID.(uuid.UUID)
	}

	summary, err := h.useCase.GetDashboardSummary(id)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to load dashboard data")
		return
	}

	response.Success(c, http.StatusOK, "Dashboard data loaded", summary)
}
