package usecase

import (
	"absensi-backend/internal/repository"

	"github.com/google/uuid"
)

type StudentDashboardUseCase interface {
	GetDashboardSummary(studentID uuid.UUID) (map[string]interface{}, error)
}

type studentDashboardUseCase struct {
	repo repository.StudentDashboardRepository
}

func NewStudentDashboardUseCase(repo repository.StudentDashboardRepository) StudentDashboardUseCase {
	return &studentDashboardUseCase{repo}
}

func (u *studentDashboardUseCase) GetDashboardSummary(studentID uuid.UUID) (map[string]interface{}, error) {
	attendances, err := u.repo.GetAttendancesByStudent(studentID)
	if err != nil {
		return nil, err
	}

	totalHadir := 0
	totalTidakHadir := 0

	for _, a := range attendances {
		if a.Status == "hadir" {
			totalHadir++
		} else if a.Status == "alfa" || a.Status == "izin" || a.Status == "sakit" {
			totalTidakHadir++
		}
	}

	// Example logic:
	totalPertemuan := totalHadir + totalTidakHadir
	if totalPertemuan == 0 {
		totalPertemuan = 1 // avoid div by zero
	}

	persentase := (float64(totalHadir) / float64(totalPertemuan)) * 100

	todaySchedules, _ := u.repo.GetTodaySchedules(studentID)

	summary := map[string]interface{}{
		"kehadiran": map[string]interface{}{
			"persentase":     persentase,
			"hadir_count":    totalHadir,
			"absen_count":    totalTidakHadir,
			"total_pertemuan": totalPertemuan,
		},
		"has_warning":      persentase < 75.0 && totalPertemuan > 3,
		"today_schedules":  todaySchedules,
		"recent_history":   attendances, // could be sliced to top 5
	}

	return summary, nil
}
