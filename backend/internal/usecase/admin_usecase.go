package usecase

import (
	"absensi-backend/internal/entity"
	"absensi-backend/internal/repository"
	"absensi-backend/pkg/hash"
	"errors"
	"time"

	"github.com/google/uuid"
)

type AdminUseCase interface {
	// Dosen
	GetAllDosen() ([]entity.Dosen, error)
	GetDosenByID(id uuid.UUID) (*entity.Dosen, error)
	CreateDosen(req CreateDosenRequest) error
	UpdateDosen(id uuid.UUID, req UpdateDosenRequest) error
	DeleteDosen(id uuid.UUID) error

	// Mahasiswa
	GetAllMahasiswa() ([]entity.Mahasiswa, error)
	GetMahasiswaByID(id uuid.UUID) (*entity.Mahasiswa, error)
	CreateMahasiswa(req CreateMahasiswaRequest) error
	UpdateMahasiswa(id uuid.UUID, req UpdateMahasiswaRequest) error
	DeleteMahasiswa(id uuid.UUID) error

	// Kelas
	GetAllKelas() ([]entity.Kelas, error)
	GetKelasByID(id uuid.UUID) (*entity.Kelas, error)
	CreateKelas(req CreateKelasRequest) error
	UpdateKelas(id uuid.UUID, req UpdateKelasRequest) error
	DeleteKelas(id uuid.UUID) error

	// Mata Kuliah
	GetAllMataKuliah() ([]entity.MataKuliah, error)
	GetMataKuliahByID(id uuid.UUID) (*entity.MataKuliah, error)
	CreateMataKuliah(req CreateMataKuliahRequest) error
	UpdateMataKuliah(id uuid.UUID, req UpdateMataKuliahRequest) error
	DeleteMataKuliah(id uuid.UUID) error

	// Jadwal
	GetAllJadwal() ([]entity.JadwalKuliah, error)
	GetJadwalByID(id uuid.UUID) (*entity.JadwalKuliah, error)
	CreateJadwal(req CreateJadwalRequest) error
	UpdateJadwal(id uuid.UUID, req UpdateJadwalRequest) error
	DeleteJadwal(id uuid.UUID) error

	// Absensi
	GetAllAbsensi() ([]entity.Attendance, error)
	GetAbsensiByID(id uuid.UUID) (*entity.Attendance, error)
	CreateAbsensi(req CreateAbsensiRequest) error
	UpdateAbsensi(id uuid.UUID, req UpdateAbsensiRequest) error
	DeleteAbsensi(id uuid.UUID) error

	// Dashboard
	GetDashboardSummary() (*AdminDashboardSummary, error)
}

type adminUseCase struct {
	repo repository.AdminRepository
}

func NewAdminUseCase(repo repository.AdminRepository) AdminUseCase {
	return &adminUseCase{repo}
}

// ─── DTOs ────────────────────────────────────────────────────

type CreateDosenRequest struct {
	Nama     string `json:"nama" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	NIDN     string `json:"nidn" binding:"required"`
	NoHP     string `json:"no_hp"`
	Alamat   string `json:"alamat"`
}

type UpdateDosenRequest struct {
	Nama   string `json:"nama"`
	NIDN   string `json:"nidn"`
	NoHP   string `json:"no_hp"`
	Alamat string `json:"alamat"`
}

type CreateMahasiswaRequest struct {
	Nama     string    `json:"nama" binding:"required"`
	Email    string    `json:"email" binding:"required,email"`
	Password string    `json:"password" binding:"required,min=6"`
	NIM      string    `json:"nim" binding:"required"`
	KelasID  uuid.UUID `json:"kelas_id" binding:"required"`
	NoHP     string    `json:"no_hp"`
	Alamat   string    `json:"alamat"`
}

type UpdateMahasiswaRequest struct {
	Nama        string    `json:"nama"`
	NIM         string    `json:"nim"`
	KelasID     uuid.UUID `json:"kelas_id"`
	NoHP        string    `json:"no_hp"`
	Alamat      string    `json:"alamat"`
	StatusAktif *bool     `json:"status_aktif"`
}

type CreateKelasRequest struct {
	NamaKelas string `json:"nama_kelas" binding:"required"`
	Jurusan   string `json:"jurusan" binding:"required"`
	Angkatan  int    `json:"angkatan" binding:"required"`
	Semester  int    `json:"semester" binding:"required"`
}

type UpdateKelasRequest struct {
	NamaKelas string `json:"nama_kelas"`
	Jurusan   string `json:"jurusan"`
	Angkatan  int    `json:"angkatan"`
	Semester  int    `json:"semester"`
}

type CreateMataKuliahRequest struct {
	KodeMK   string `json:"kode_mk" binding:"required"`
	NamaMK   string `json:"nama_mk" binding:"required"`
	SKS      int    `json:"sks" binding:"required"`
	Semester int    `json:"semester" binding:"required"`
}

type UpdateMataKuliahRequest struct {
	KodeMK   string `json:"kode_mk"`
	NamaMK   string `json:"nama_mk"`
	SKS      int    `json:"sks"`
	Semester int    `json:"semester"`
}

type CreateJadwalRequest struct {
	KelasID      uuid.UUID `json:"kelas_id" binding:"required"`
	MataKuliahID uuid.UUID `json:"mata_kuliah_id" binding:"required"`
	DosenID      uuid.UUID `json:"dosen_id" binding:"required"`
	Hari         string    `json:"hari" binding:"required"`
	JamMulai     string    `json:"jam_mulai" binding:"required"`
	JamSelesai   string    `json:"jam_selesai" binding:"required"`
	Ruang        string    `json:"ruang"`
	Semester     int       `json:"semester"`
	TahunAjar    string    `json:"tahun_ajar"`
}

type UpdateJadwalRequest struct {
	KelasID      uuid.UUID `json:"kelas_id"`
	MataKuliahID uuid.UUID `json:"mata_kuliah_id"`
	DosenID      uuid.UUID `json:"dosen_id"`
	Hari         string    `json:"hari"`
	JamMulai     string    `json:"jam_mulai"`
	JamSelesai   string    `json:"jam_selesai"`
	Ruang        string    `json:"ruang"`
	Semester     int       `json:"semester"`
	TahunAjar    string    `json:"tahun_ajar"`
}

type CreateAbsensiRequest struct {
	MahasiswaID   uuid.UUID `json:"mahasiswa_id" binding:"required"`
	JadwalID      uuid.UUID `json:"jadwal_id" binding:"required"`
	Tanggal       string    `json:"tanggal" binding:"required"` // format: YYYY-MM-DD
	PertemuanKe   int       `json:"pertemuan_ke" binding:"required"`
	StatusAbsensi string    `json:"status_absensi" binding:"required"`
	Keterangan    string    `json:"keterangan"`
}

type AdminDashboardSummary struct {
	TotalStudents   int64               `json:"totalStudents"`
	TotalCourses    int64               `json:"totalCourses"`
	TotalSchedules  int64               `json:"totalSchedules"`
	AttendanceToday float64             `json:"attendanceToday"`
	RecentHistory   []AttendanceHistory `json:"recentAttendance"`
	Warnings        []WarningInfo       `json:"warnings"`
}

type WarningInfo struct {
	ID         string `json:"id"`
	Nama       string `json:"nama"`
	NIM        string `json:"nim"`
	Kelas      string `json:"kelas"`
	AbsenCount int    `json:"absenCount"`
}

type AttendanceHistory struct {
	ID         string `json:"id"`
	Nama       string `json:"nama"`
	NIM        string `json:"nim"`
	Waktu      string `json:"waktu"`
	Status     string `json:"status"`
	MataKuliah string `json:"mataKuliah"`
}

type UpdateAbsensiRequest struct {
	StatusAbsensi string `json:"status_absensi"`
	Keterangan    string `json:"keterangan"`
	PertemuanKe   int    `json:"pertemuan_ke"`
}

// ─── Dosen ────────────────────────────────────────────────────

func (u *adminUseCase) GetAllDosen() ([]entity.Dosen, error) {
	return u.repo.GetAllDosen()
}

func (u *adminUseCase) GetDosenByID(id uuid.UUID) (*entity.Dosen, error) {
	return u.repo.GetDosenByID(id)
}

func (u *adminUseCase) CreateDosen(req CreateDosenRequest) error {
	existing, _ := u.repo.GetUserByEmail(req.Email)
	if existing != nil && existing.ID != uuid.Nil {
		return errors.New("email sudah terdaftar")
	}

	hashedPass, err := hash.HashPassword(req.Password)
	if err != nil {
		return errors.New("gagal memproses password")
	}

	user := entity.User{
		Nama:         req.Nama,
		Email:        req.Email,
		PasswordHash: hashedPass,
		Role:         "dosen",
		IsActive:     true,
	}
	if err := u.repo.CreateUser(&user); err != nil {
		return errors.New("gagal membuat user: " + err.Error())
	}

	dosen := entity.Dosen{
		UserID: user.ID,
		NIDN:   req.NIDN,
		NoHP:   req.NoHP,
		Alamat: req.Alamat,
	}
	return u.repo.CreateDosen(&dosen)
}

func (u *adminUseCase) UpdateDosen(id uuid.UUID, req UpdateDosenRequest) error {
	d, err := u.repo.GetDosenByID(id)
	if err != nil {
		return errors.New("dosen tidak ditemukan")
	}
	if req.Nama != "" {
		d.User.Nama = req.Nama
		if err := u.repo.UpdateUser(&d.User); err != nil {
			return err
		}
	}
	if req.NIDN != "" {
		d.NIDN = req.NIDN
	}
	if req.NoHP != "" {
		d.NoHP = req.NoHP
	}
	if req.Alamat != "" {
		d.Alamat = req.Alamat
	}
	return u.repo.UpdateDosen(d)
}

func (u *adminUseCase) DeleteDosen(id uuid.UUID) error {
	return u.repo.DeleteDosen(id)
}

// ─── Mahasiswa ────────────────────────────────────────────────

func (u *adminUseCase) GetAllMahasiswa() ([]entity.Mahasiswa, error) {
	return u.repo.GetAllMahasiswa()
}

func (u *adminUseCase) GetMahasiswaByID(id uuid.UUID) (*entity.Mahasiswa, error) {
	return u.repo.GetMahasiswaByID(id)
}

func (u *adminUseCase) CreateMahasiswa(req CreateMahasiswaRequest) error {
	existing, _ := u.repo.GetUserByEmail(req.Email)
	if existing != nil && existing.ID != uuid.Nil {
		return errors.New("email sudah terdaftar")
	}

	hashedPass, err := hash.HashPassword(req.Password)
	if err != nil {
		return errors.New("gagal memproses password")
	}

	user := entity.User{
		Nama:         req.Nama,
		Email:        req.Email,
		PasswordHash: hashedPass,
		Role:         "mahasiswa",
		IsActive:     true,
	}
	mhs := entity.Mahasiswa{
		NIM:         req.NIM,
		KelasID:     req.KelasID,
		NoHP:        req.NoHP,
		Alamat:      req.Alamat,
		StatusAktif: true,
	}
	return u.repo.CreateMahasiswaFull(&user, &mhs)
}

func (u *adminUseCase) UpdateMahasiswa(id uuid.UUID, req UpdateMahasiswaRequest) error {
	m, err := u.repo.GetMahasiswaByID(id)
	if err != nil {
		return errors.New("mahasiswa tidak ditemukan")
	}
	if req.Nama != "" {
		m.User.Nama = req.Nama
	}
	if req.NIM != "" {
		m.NIM = req.NIM
	}
	if req.KelasID != uuid.Nil {
		m.KelasID = req.KelasID
	}
	if req.NoHP != "" {
		m.NoHP = req.NoHP
	}
	if req.Alamat != "" {
		m.Alamat = req.Alamat
	}
	if req.StatusAktif != nil {
		m.StatusAktif = *req.StatusAktif
	}
	return u.repo.UpdateMahasiswaFull(&m.User, m)
}

func (u *adminUseCase) DeleteMahasiswa(id uuid.UUID) error {
	return u.repo.DeleteMahasiswa(id)
}

// ─── Kelas ────────────────────────────────────────────────────

func (u *adminUseCase) GetAllKelas() ([]entity.Kelas, error) {
	return u.repo.GetAllKelas()
}

func (u *adminUseCase) GetKelasByID(id uuid.UUID) (*entity.Kelas, error) {
	return u.repo.GetKelasByID(id)
}

func (u *adminUseCase) CreateKelas(req CreateKelasRequest) error {
	k := entity.Kelas{
		NamaKelas: req.NamaKelas,
		Jurusan:   req.Jurusan,
		Angkatan:  req.Angkatan,
		Semester:  req.Semester,
	}
	return u.repo.CreateKelas(&k)
}

func (u *adminUseCase) UpdateKelas(id uuid.UUID, req UpdateKelasRequest) error {
	k, err := u.repo.GetKelasByID(id)
	if err != nil {
		return errors.New("kelas tidak ditemukan")
	}
	if req.NamaKelas != "" {
		k.NamaKelas = req.NamaKelas
	}
	if req.Jurusan != "" {
		k.Jurusan = req.Jurusan
	}
	if req.Angkatan > 0 {
		k.Angkatan = req.Angkatan
	}
	if req.Semester > 0 {
		k.Semester = req.Semester
	}
	return u.repo.UpdateKelas(k)
}

func (u *adminUseCase) DeleteKelas(id uuid.UUID) error {
	return u.repo.DeleteKelas(id)
}

// ─── Mata Kuliah ──────────────────────────────────────────────

func (u *adminUseCase) GetAllMataKuliah() ([]entity.MataKuliah, error) {
	return u.repo.GetAllMataKuliah()
}

func (u *adminUseCase) GetMataKuliahByID(id uuid.UUID) (*entity.MataKuliah, error) {
	return u.repo.GetMataKuliahByID(id)
}

func (u *adminUseCase) CreateMataKuliah(req CreateMataKuliahRequest) error {
	mk := entity.MataKuliah{
		KodeMK:   req.KodeMK,
		NamaMK:   req.NamaMK,
		SKS:      req.SKS,
		Semester: req.Semester,
	}
	return u.repo.CreateMataKuliah(&mk)
}

func (u *adminUseCase) UpdateMataKuliah(id uuid.UUID, req UpdateMataKuliahRequest) error {
	mk, err := u.repo.GetMataKuliahByID(id)
	if err != nil {
		return errors.New("mata kuliah tidak ditemukan")
	}
	if req.KodeMK != "" {
		mk.KodeMK = req.KodeMK
	}
	if req.NamaMK != "" {
		mk.NamaMK = req.NamaMK
	}
	if req.SKS > 0 {
		mk.SKS = req.SKS
	}
	if req.Semester > 0 {
		mk.Semester = req.Semester
	}
	return u.repo.UpdateMataKuliah(mk)
}

func (u *adminUseCase) DeleteMataKuliah(id uuid.UUID) error {
	return u.repo.DeleteMataKuliah(id)
}

// ─── Jadwal ───────────────────────────────────────────────────

func (u *adminUseCase) GetAllJadwal() ([]entity.JadwalKuliah, error) {
	return u.repo.GetAllJadwal()
}

func (u *adminUseCase) GetJadwalByID(id uuid.UUID) (*entity.JadwalKuliah, error) {
	return u.repo.GetJadwalByID(id)
}

func (u *adminUseCase) CreateJadwal(req CreateJadwalRequest) error {
	j := entity.JadwalKuliah{
		KelasID:      req.KelasID,
		MataKuliahID: req.MataKuliahID,
		DosenID:      req.DosenID,
		Hari:         req.Hari,
		JamMulai:     req.JamMulai,
		JamSelesai:   req.JamSelesai,
		Ruang:        req.Ruang,
		Semester:     req.Semester,
		TahunAjar:    req.TahunAjar,
	}
	return u.repo.CreateJadwal(&j)
}

func (u *adminUseCase) UpdateJadwal(id uuid.UUID, req UpdateJadwalRequest) error {
	j, err := u.repo.GetJadwalByID(id)
	if err != nil {
		return errors.New("jadwal tidak ditemukan")
	}
	if req.KelasID != uuid.Nil {
		j.KelasID = req.KelasID
	}
	if req.MataKuliahID != uuid.Nil {
		j.MataKuliahID = req.MataKuliahID
	}
	if req.DosenID != uuid.Nil {
		j.DosenID = req.DosenID
	}
	if req.Hari != "" {
		j.Hari = req.Hari
	}
	if req.JamMulai != "" {
		j.JamMulai = req.JamMulai
	}
	if req.JamSelesai != "" {
		j.JamSelesai = req.JamSelesai
	}
	if req.Ruang != "" {
		j.Ruang = req.Ruang
	}
	if req.Semester > 0 {
		j.Semester = req.Semester
	}
	if req.TahunAjar != "" {
		j.TahunAjar = req.TahunAjar
	}
	return u.repo.UpdateJadwal(j)
}

func (u *adminUseCase) DeleteJadwal(id uuid.UUID) error {
	return u.repo.DeleteJadwal(id)
}

// ─── Absensi ──────────────────────────────────────────────────

func (u *adminUseCase) GetAllAbsensi() ([]entity.Attendance, error) {
	return u.repo.GetAllAbsensi()
}

func (u *adminUseCase) GetAbsensiByID(id uuid.UUID) (*entity.Attendance, error) {
	return u.repo.GetAbsensiByID(id)
}

func (u *adminUseCase) CreateAbsensi(req CreateAbsensiRequest) error {
	tanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return errors.New("format tanggal salah, gunakan YYYY-MM-DD")
	}
	a := entity.Attendance{
		MahasiswaID:   req.MahasiswaID,
		JadwalID:      req.JadwalID,
		Tanggal:       tanggal,
		PertemuanKe:   req.PertemuanKe,
		StatusAbsensi: req.StatusAbsensi,
		Keterangan:    req.Keterangan,
	}
	return u.repo.CreateAbsensi(&a)
}

func (u *adminUseCase) UpdateAbsensi(id uuid.UUID, req UpdateAbsensiRequest) error {
	a, err := u.repo.GetAbsensiByID(id)
	if err != nil {
		return errors.New("absensi tidak ditemukan")
	}
	if req.StatusAbsensi != "" {
		a.StatusAbsensi = req.StatusAbsensi
	}
	if req.Keterangan != "" {
		a.Keterangan = req.Keterangan
	}
	if req.PertemuanKe > 0 {
		a.PertemuanKe = req.PertemuanKe
	}
	return u.repo.UpdateAbsensi(a)
}

func (u *adminUseCase) DeleteAbsensi(id uuid.UUID) error {
	return u.repo.DeleteAbsensi(id)
}

func (u *adminUseCase) GetDashboardSummary() (*AdminDashboardSummary, error) {
	summary := &AdminDashboardSummary{}

	// 1. Total Students
	mhsList, err := u.repo.GetAllMahasiswa()
	if err == nil {
		summary.TotalStudents = int64(len(mhsList))
	}

	// 2. Total Courses
	mkList, err := u.repo.GetAllMataKuliah()
	if err == nil {
		summary.TotalCourses = int64(len(mkList))
	}

	// 3. Total Schedules
	jdList, err := u.repo.GetAllJadwal()
	if err == nil {
		summary.TotalSchedules = int64(len(jdList))
	}

	// 4. Attendance Today (%)
	absensiList, err := u.repo.GetAllAbsensi()
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

		// 6. Warnings (Students with >= 3 absences)
		// Logic: Group absensi by student_id where status is 'alfa'
		alfaMap := make(map[uuid.UUID]int)
		for _, a := range absensiList {
			if a.StatusAbsensi == "alfa" {
				alfaMap[a.MahasiswaID]++
			}
		}

		var warnings []WarningInfo
		for _, m := range mhsList {
			count := alfaMap[m.ID]
			if count >= 3 {
				warnings = append(warnings, WarningInfo{
					ID:         m.ID.String(),
					Nama:       m.User.Nama,
					NIM:        m.NIM,
					Kelas:      m.Kelas.NamaKelas,
					AbsenCount: count,
				})
			}
		}
		summary.Warnings = warnings
	}

	return summary, nil
}
