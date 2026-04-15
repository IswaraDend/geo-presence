package usecase

import (
	"absensi-backend/internal/repository"

	"github.com/google/uuid"
)

type StudentDashboardUseCase interface {
	GetDashboardSummary(userID uuid.UUID) (map[string]interface{}, error)
}

type studentDashboardUseCase struct {
	repo     repository.StudentDashboardRepository
	authRepo repository.AuthRepository
}

func NewStudentDashboardUseCase(repo repository.StudentDashboardRepository, authRepo repository.AuthRepository) StudentDashboardUseCase {
	return &studentDashboardUseCase{repo, authRepo}
}

func (u *studentDashboardUseCase) GetDashboardSummary(userID uuid.UUID) (map[string]interface{}, error) {
	// Ambil profil mahasiswa berdasarkan user_id dari JWT
	mahasiswa, err := u.authRepo.GetMahasiswaByUserID(userID)
	if err != nil {
		return nil, err
	}

	attendances, err := u.repo.GetAttendancesByMahasiswa(mahasiswa.ID)
	if err != nil {
		return nil, err
	}

	totalHadir := 0
	totalAlfa := 0
	totalIzin := 0
	totalSakit := 0

	for _, a := range attendances {
		switch a.StatusAbsensi {
		case "hadir":
			totalHadir++
		case "alfa":
			totalAlfa++
		case "izin":
			totalIzin++
		case "sakit":
			totalSakit++
		}
	}

	totalPertemuan := len(attendances)
	divisor := totalPertemuan
	if divisor == 0 {
		divisor = 1
	}
	persentase := (float64(totalHadir) / float64(divisor)) * 100

	todaySchedules, _ := u.repo.GetTodaySchedulesByKelas(mahasiswa.KelasID)

	recentHistory := attendances
	if len(recentHistory) > 5 {
		recentHistory = recentHistory[:5]
	}

	summary := map[string]interface{}{
		"mahasiswa": mahasiswa,
		"kehadiran": map[string]interface{}{
			"persentase":      persentase,
			"hadir_count":     totalHadir,
			"alfa_count":      totalAlfa,
			"izin_count":      totalIzin,
			"sakit_count":     totalSakit,
			"total_pertemuan": totalPertemuan,
		},
		"has_warning":     persentase < 75.0 && totalPertemuan >= 3,
		"today_schedules": todaySchedules,
		"recent_history":  recentHistory,
	}

	return summary, nil
}
