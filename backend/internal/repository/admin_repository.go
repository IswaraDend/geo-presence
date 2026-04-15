package repository

import (
	"absensi-backend/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AdminRepository interface {
	// Dosen
	GetAllDosen() ([]entity.Dosen, error)
	GetDosenByID(id uuid.UUID) (*entity.Dosen, error)
	CreateDosen(dosen *entity.Dosen) error
	UpdateDosen(dosen *entity.Dosen) error
	DeleteDosen(id uuid.UUID) error

	// Mahasiswa
	GetAllMahasiswa() ([]entity.Mahasiswa, error)
	GetMahasiswaByID(id uuid.UUID) (*entity.Mahasiswa, error)
	CreateMahasiswaFull(user *entity.User, mhs *entity.Mahasiswa) error
	UpdateMahasiswaFull(user *entity.User, mhs *entity.Mahasiswa) error
	DeleteMahasiswa(id uuid.UUID) error

	// Kelas
	GetAllKelas() ([]entity.Kelas, error)

	// Mata Kuliah
	GetAllMataKuliah() ([]entity.MataKuliah, error)
	GetMataKuliahByID(id uuid.UUID) (*entity.MataKuliah, error)
	CreateMataKuliah(mk *entity.MataKuliah) error
	UpdateMataKuliah(mk *entity.MataKuliah) error
	DeleteMataKuliah(id uuid.UUID) error

	// Jadwal
	GetAllJadwal() ([]entity.JadwalKuliah, error)
	GetJadwalByID(id uuid.UUID) (*entity.JadwalKuliah, error)
	CreateJadwal(j *entity.JadwalKuliah) error
	UpdateJadwal(j *entity.JadwalKuliah) error
	DeleteJadwal(id uuid.UUID) error

	// Absensi
	GetAllAbsensi() ([]entity.Attendance, error)
	GetAbsensiByID(id uuid.UUID) (*entity.Attendance, error)
	CreateAbsensi(a *entity.Attendance) error
	UpdateAbsensi(a *entity.Attendance) error
	DeleteAbsensi(id uuid.UUID) error

	// User helpers
	GetUserByEmail(email string) (*entity.User, error)
	CreateUser(user *entity.User) error
	UpdateUser(user *entity.User) error
	DeleteUser(id uuid.UUID) error
	GetAllDosenUsers() ([]entity.User, error)
}

type adminRepository struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) AdminRepository {
	return &adminRepository{db}
}

// ─── Dosen ─────────────────────────────────────────────────

func (r *adminRepository) GetAllDosen() ([]entity.Dosen, error) {
	var list []entity.Dosen
	err := r.db.Preload("User").Find(&list).Error
	return list, err
}

func (r *adminRepository) GetDosenByID(id uuid.UUID) (*entity.Dosen, error) {
	var d entity.Dosen
	err := r.db.Preload("User").First(&d, id).Error
	return &d, err
}

func (r *adminRepository) CreateDosen(dosen *entity.Dosen) error {
	return r.db.Create(dosen).Error
}

func (r *adminRepository) UpdateDosen(dosen *entity.Dosen) error {
	return r.db.Save(dosen).Error
}

func (r *adminRepository) DeleteDosen(id uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var d entity.Dosen
		if err := tx.First(&d, id).Error; err != nil {
			return err
		}
		if err := tx.Delete(&d).Error; err != nil {
			return err
		}
		return tx.Delete(&entity.User{}, d.UserID).Error
	})
}

// ─── Mahasiswa ─────────────────────────────────────────────

func (r *adminRepository) GetAllMahasiswa() ([]entity.Mahasiswa, error) {
	var list []entity.Mahasiswa
	err := r.db.Preload("User").Preload("Kelas").Find(&list).Error
	return list, err
}

func (r *adminRepository) GetMahasiswaByID(id uuid.UUID) (*entity.Mahasiswa, error) {
	var m entity.Mahasiswa
	err := r.db.Preload("User").Preload("Kelas").First(&m, id).Error
	return &m, err
}

func (r *adminRepository) CreateMahasiswaFull(user *entity.User, mhs *entity.Mahasiswa) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}
		mhs.UserID = user.ID
		return tx.Create(mhs).Error
	})
}

func (r *adminRepository) UpdateMahasiswaFull(user *entity.User, mhs *entity.Mahasiswa) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(user).Error; err != nil {
			return err
		}
		return tx.Save(mhs).Error
	})
}

func (r *adminRepository) DeleteMahasiswa(id uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var m entity.Mahasiswa
		if err := tx.First(&m, id).Error; err != nil {
			return err
		}
		if err := tx.Delete(&m).Error; err != nil {
			return err
		}
		return tx.Delete(&entity.User{}, m.UserID).Error
	})
}

// ─── Kelas ─────────────────────────────────────────────────

func (r *adminRepository) GetAllKelas() ([]entity.Kelas, error) {
	var list []entity.Kelas
	err := r.db.Find(&list).Error
	return list, err
}

// ─── Mata Kuliah ────────────────────────────────────────────

func (r *adminRepository) GetAllMataKuliah() ([]entity.MataKuliah, error) {
	var list []entity.MataKuliah
	err := r.db.Find(&list).Error
	return list, err
}

func (r *adminRepository) GetMataKuliahByID(id uuid.UUID) (*entity.MataKuliah, error) {
	var mk entity.MataKuliah
	err := r.db.First(&mk, id).Error
	return &mk, err
}

func (r *adminRepository) CreateMataKuliah(mk *entity.MataKuliah) error {
	return r.db.Create(mk).Error
}

func (r *adminRepository) UpdateMataKuliah(mk *entity.MataKuliah) error {
	return r.db.Save(mk).Error
}

func (r *adminRepository) DeleteMataKuliah(id uuid.UUID) error {
	return r.db.Delete(&entity.MataKuliah{}, id).Error
}

// ─── Jadwal ─────────────────────────────────────────────────

func (r *adminRepository) GetAllJadwal() ([]entity.JadwalKuliah, error) {
	var list []entity.JadwalKuliah
	err := r.db.Preload("Kelas").Preload("MataKuliah").Preload("Dosen.User").Find(&list).Error
	return list, err
}

func (r *adminRepository) GetJadwalByID(id uuid.UUID) (*entity.JadwalKuliah, error) {
	var j entity.JadwalKuliah
	err := r.db.Preload("Kelas").Preload("MataKuliah").Preload("Dosen.User").First(&j, id).Error
	return &j, err
}

func (r *adminRepository) CreateJadwal(j *entity.JadwalKuliah) error {
	return r.db.Create(j).Error
}

func (r *adminRepository) UpdateJadwal(j *entity.JadwalKuliah) error {
	return r.db.Save(j).Error
}

func (r *adminRepository) DeleteJadwal(id uuid.UUID) error {
	return r.db.Delete(&entity.JadwalKuliah{}, id).Error
}

// ─── Absensi ────────────────────────────────────────────────

func (r *adminRepository) GetAllAbsensi() ([]entity.Attendance, error) {
	var list []entity.Attendance
	err := r.db.Preload("Mahasiswa.User").Preload("Jadwal.MataKuliah").Preload("Jadwal.Dosen.User").
		Order("tanggal desc").Find(&list).Error
	return list, err
}

func (r *adminRepository) GetAbsensiByID(id uuid.UUID) (*entity.Attendance, error) {
	var a entity.Attendance
	err := r.db.Preload("Mahasiswa.User").Preload("Jadwal.MataKuliah").First(&a, id).Error
	return &a, err
}

func (r *adminRepository) CreateAbsensi(a *entity.Attendance) error {
	return r.db.Create(a).Error
}

func (r *adminRepository) UpdateAbsensi(a *entity.Attendance) error {
	return r.db.Save(a).Error
}

func (r *adminRepository) DeleteAbsensi(id uuid.UUID) error {
	return r.db.Delete(&entity.Attendance{}, id).Error
}

// ─── User helpers ────────────────────────────────────────────

func (r *adminRepository) GetUserByEmail(email string) (*entity.User, error) {
	var u entity.User
	err := r.db.Where("email = ?", email).First(&u).Error
	return &u, err
}

func (r *adminRepository) CreateUser(user *entity.User) error {
	return r.db.Create(user).Error
}

func (r *adminRepository) UpdateUser(user *entity.User) error {
	return r.db.Save(user).Error
}

func (r *adminRepository) DeleteUser(id uuid.UUID) error {
	return r.db.Delete(&entity.User{}, id).Error
}

func (r *adminRepository) GetAllDosenUsers() ([]entity.User, error) {
	var list []entity.User
	err := r.db.Where("role = ?", "dosen").Find(&list).Error
	return list, err
}
