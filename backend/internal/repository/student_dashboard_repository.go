package repository

import (
	"absensi-backend/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StudentDashboardRepository interface {
	GetAttendancesByMahasiswa(mahasiswaID uuid.UUID) ([]entity.Attendance, error)
	GetSchedulesByKelas(kelasID uuid.UUID) ([]entity.JadwalKuliah, error)
	GetAnnouncements(role string) ([]entity.Announcement, error)
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
	// Implementation for GetTodaySchedulesByKelas
	return nil, nil
}

func (r *studentDashboardRepository) GetSchedulesByKelas(kelasID uuid.UUID) ([]entity.JadwalKuliah, error) {
	var schedules []entity.JadwalKuliah
	err := r.db.
		Preload("MataKuliah").
		Preload("Dosen.User").
		Where("kelas_id = ?", kelasID).
		Order("hari asc, jam_mulai asc").
		Find(&schedules).Error
	return schedules, err
}

func (r *studentDashboardRepository) GetAnnouncements(role string) ([]entity.Announcement, error) {
	var announcements []entity.Announcement
	err := r.db.
		Where("target_role = ? OR target_role = 'all'", role).
		Order("created_at desc").
		Find(&announcements).Error
	return announcements, err
}
