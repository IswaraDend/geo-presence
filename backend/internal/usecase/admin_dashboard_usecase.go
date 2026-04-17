package usecase

import (
	"absensi-backend/internal/repository"
	"time"
)

type AdminDashboardUseCase interface {
	GetDashboardSummary() (*AdminDashboardSummary, error)
}

type adminDashboardUseCase struct {
	adminRepo repository.AdminRepository
}

func NewAdminDashboardUseCase(adminRepo repository.AdminRepository) AdminDashboardUseCase {
	return &adminDashboardUseCase{adminRepo}
}

func (u *adminDashboardUseCase) GetDashboardSummary() (*AdminDashboardSummary, error) {
	summary := &AdminDashboardSummary{}

	// 1. Total Students
	mhsList, err := u.adminRepo.GetAllMahasiswa()
	if err == nil {
		summary.TotalStudents = int64(len(mhsList))
	}

	// 2. Total Courses
	mkList, err := u.adminRepo.GetAllMataKuliah()
	if err == nil {
		summary.TotalCourses = int64(len(mkList))
	}

	// 3. Total Schedules
	jdList, err := u.adminRepo.GetAllJadwal()
	if err == nil {
		summary.TotalSchedules = int64(len(jdList))
	}

	// 4. Attendance Today (%)
	absensiList, err := u.adminRepo.GetAllAbsensi()
	if err == nil {
		now := time.Now()
		todayStr := now.Format("2006-01-02")

		var totalToday int64
		var hadirToday int64

		for _, a := range absensiList {
			if a.Tanggal.Format("2006-01-02") == todayStr {
				totalToday++
				if a.StatusAbsensi == "hadir" {
					hadirToday++
				}
			}
		}

		if totalToday > 0 {
			summary.AttendanceToday = float64(hadirToday) / float64(totalToday) * 100
		} else {
			summary.AttendanceToday = 0
		}

		// 5. Recent History (last 5)
		var recent []AttendanceHistory
		// Urutkan berdasarkan waktu/id jika memungkinkan, di sini kita ambil 5 terakhir dari list
		// (Asumsi list dari repo sudah cukup relevan atau kita filter)
		count := 0
		for i := len(absensiList) - 1; i >= 0 && count < 5; i-- {
			a := absensiList[i]
			recent = append(recent, AttendanceHistory{
				ID:         a.ID.String(),
				Nama:       a.Mahasiswa.User.Nama,
				NIM:        a.Mahasiswa.NIM,
				Waktu:      a.CreatedAt.Format("15:04"),
				Status:     a.StatusAbsensi,
				MataKuliah: a.Jadwal.MataKuliah.NamaMK,
			})
			count++
		}
		summary.RecentHistory = recent
	}

	return summary, nil
}
