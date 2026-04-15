package repository

import (
	"absensi-backend/internal/entity"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StudentDashboardRepository interface {
	GetAttendancesByMahasiswa(mahasiswaID uuid.UUID) ([]entity.Attendance, error)
	GetTodaySchedulesByKelas(kelasID uuid.UUID) ([]entity.JadwalKuliah, error)
}

type studentDashboardRepository struct {
	db *gorm.DB
}

func NewStudentDashboardRepository(db *gorm.DB) StudentDashboardRepository {
	return &studentDashboardRepository{db}
}

func (r *studentDashboardRepository) GetAttendancesByMahasiswa(mahasiswaID uuid.UUID) ([]entity.Attendance, error) {
	var attendances []entity.Attendance
	err := r.db.
		Preload("Jadwal.MataKuliah").
		Preload("Jadwal.Dosen.User").
		Where("mahasiswa_id = ?", mahasiswaID).
		Order("tanggal desc").
		Find(&attendances).Error
	return attendances, err
}

func (r *studentDashboardRepository) GetTodaySchedulesByKelas(kelasID uuid.UUID) ([]entity.JadwalKuliah, error) {
	weekdays := map[time.Weekday]string{
		time.Sunday:    "Minggu",
		time.Monday:    "Senin",
		time.Tuesday:   "Selasa",
		time.Wednesday: "Rabu",
		time.Thursday:  "Kamis",
		time.Friday:    "Jumat",
		time.Saturday:  "Sabtu",
	}
	today := weekdays[time.Now().Weekday()]

	var schedules []entity.JadwalKuliah
	err := r.db.
		Preload("MataKuliah").
		Preload("Dosen.User").
		Where("kelas_id = ? AND hari = ?", kelasID, today).
		Order("jam_mulai asc").
		Find(&schedules).Error
	return schedules, err
}
