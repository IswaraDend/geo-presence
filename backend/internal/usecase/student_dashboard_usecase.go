package usecase

import (
	"absensi-backend/internal/entity"
	"absensi-backend/internal/repository"
	"time"

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
	// 1. Get student profile
	mahasiswa, err := u.authRepo.GetMahasiswaByUserID(userID)
	if err != nil {
		return nil, err
	}

	// 2. Get all attendances
	attendances, err := u.repo.GetAttendancesByMahasiswa(mahasiswa.ID)
	if err != nil {
		attendances = []entity.Attendance{}
	}

	// 3. Get all schedules for the student's class
	allSchedules, err := u.repo.GetSchedulesByKelas(mahasiswa.KelasID)
	if err != nil {
		allSchedules = []entity.JadwalKuliah{}
	}

	// 4. Calculate overall statistics
	totalHadir, totalAlfa, totalIzin, totalSakit := 0, 0, 0, 0
	for _, a := range attendances {
		switch a.StatusAbsensi {
		case "hadir": totalHadir++
		case "alfa": totalAlfa++
		case "izin": totalIzin++
		case "sakit": totalSakit++
		}
	}

	totalPertemuan := len(attendances)
	overallPersentase := 0.0
	if totalPertemuan > 0 {
		overallPersentase = (float64(totalHadir) / float64(totalPertemuan)) * 100
	}

	// 5. Calculate per-mata kuliah statistics for warnings
	// Map attendance records to JadwalID
	absByJadwal := make(map[uuid.UUID][]entity.Attendance)
	for _, a := range attendances {
		absByJadwal[a.JadwalID] = append(absByJadwal[a.JadwalID], a)
	}

	var warnings []map[string]interface{}
	for _, s := range allSchedules {
		mhsAbs := absByJadwal[s.ID]
		if len(mhsAbs) >= 1 { // Trigger peringatan meski baru 1 pertemuan
			hCount := 0
			for _, a := range mhsAbs {
				if a.StatusAbsensi == "hadir" { hCount++ }
			}
			perc := (float64(hCount) / float64(len(mhsAbs))) * 100
			if perc < 75.0 {
				warnings = append(warnings, map[string]interface{}{
					"mata_kuliah": s.MataKuliah.NamaMK,
					"persentase":  perc,
					"hadir":       hCount,
					"total":       len(mhsAbs),
				})
			}
		}
	}

	// 6. Get announcements
	announcements, _ := u.repo.GetAnnouncements("mahasiswa")

	// 7. Filter today's schedules
	weekdays := map[string]string{
		"Monday": "Senin", "Tuesday": "Selasa", "Wednesday": "Rabu",
		"Thursday": "Kamis", "Friday": "Jumat", "Saturday": "Sabtu", "Sunday": "Minggu",
	}
	today := weekdays[time.Now().Format("Monday")]
	var todaySchedules []entity.JadwalKuliah
	for _, s := range allSchedules {
		if s.Hari == today {
			todaySchedules = append(todaySchedules, s)
		}
	}

	return map[string]interface{}{
		"mahasiswa": mahasiswa,
		"kehadiran": map[string]interface{}{
			"persentase":      overallPersentase,
			"hadir_count":     totalHadir,
			"alfa_count":      totalAlfa,
			"izin_count":      totalIzin,
			"sakit_count":     totalSakit,
			"total_pertemuan": totalPertemuan,
		},
		"warnings":        warnings,
		"has_warning":     len(warnings) > 0,
		"today_schedules": todaySchedules,
		"all_schedules":   allSchedules,
		"history":         attendances,
		"announcements":   announcements,
	}, nil
}
