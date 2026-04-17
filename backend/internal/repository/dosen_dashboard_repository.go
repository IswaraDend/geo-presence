package repository

import (
	"absensi-backend/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DosenDashboardRepository interface {
	GetDosenByUserID(userID uuid.UUID) (*entity.Dosen, error)
	GetJadwalByDosenID(dosenID uuid.UUID) ([]entity.JadwalKuliah, error)
	GetAbsensiByJadwalIDs(jadwalIDs []uuid.UUID) ([]entity.Attendance, error)
	GetMahasiswaByKelasIDs(kelasIDs []uuid.UUID) ([]entity.Mahasiswa, error)
	BulkCreateAbsensi(attendances []entity.Attendance) error
	GetJadwalByID(id uuid.UUID) (*entity.JadwalKuliah, error)
}

type dosenDashboardRepository struct {
	db *gorm.DB
}

func NewDosenDashboardRepository(db *gorm.DB) DosenDashboardRepository {
	return &dosenDashboardRepository{db}
}

func (r *dosenDashboardRepository) GetDosenByUserID(userID uuid.UUID) (*entity.Dosen, error) {
	var d entity.Dosen
	err := r.db.Preload("User").Where("user_id = ?", userID).First(&d).Error
	return &d, err
}

func (r *dosenDashboardRepository) GetJadwalByDosenID(dosenID uuid.UUID) ([]entity.JadwalKuliah, error) {
	var list []entity.JadwalKuliah
	err := r.db.Preload("Kelas").Preload("MataKuliah").Where("dosen_id = ?", dosenID).Find(&list).Error
	return list, err
}

func (r *dosenDashboardRepository) GetAbsensiByJadwalIDs(jadwalIDs []uuid.UUID) ([]entity.Attendance, error) {
	var list []entity.Attendance
	err := r.db.Preload("Mahasiswa.User").Preload("Jadwal.MataKuliah").Preload("Jadwal.Kelas").Where("jadwal_id IN ?", jadwalIDs).Find(&list).Error
	return list, err
}

func (r *dosenDashboardRepository) GetMahasiswaByKelasIDs(kelasIDs []uuid.UUID) ([]entity.Mahasiswa, error) {
	if len(kelasIDs) == 0 {
		return []entity.Mahasiswa{}, nil
	}
	var list []entity.Mahasiswa
	err := r.db.Preload("Kelas").Preload("User").Where("kelas_id IN ?", kelasIDs).Find(&list).Error
	return list, err
}

func (r *dosenDashboardRepository) BulkCreateAbsensi(absensi []entity.Attendance) error {
	return r.db.Create(&absensi).Error
}

func (r *dosenDashboardRepository) GetJadwalByID(id uuid.UUID) (*entity.JadwalKuliah, error) {
	var j entity.JadwalKuliah
	err := r.db.Preload("Kelas").Where("id = ?", id).First(&j).Error
	return &j, err
}
