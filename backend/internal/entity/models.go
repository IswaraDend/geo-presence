package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// =====================
// USERS (tabel utama auth)
// =====================
type User struct {
	ID           uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Nama         string         `gorm:"type:varchar(100);not null" json:"nama"`
	Email        string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	PasswordHash string         `gorm:"type:varchar(255);not null" json:"-"`
	Role         string         `gorm:"type:varchar(20);not null" json:"role"` // admin | dosen | mahasiswa
	IsActive     bool           `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// ADMINS (profil admin)
// =====================
type Admin struct {
	ID         uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID     uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"user_id"`
	User       User           `gorm:"foreignKey:UserID" json:"user"`
	KodeAdmin  string         `gorm:"type:varchar(50)" json:"kode_admin"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// DOSENS (profil dosen)
// =====================
type Dosen struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID    uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"user"`
	NIDN      string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"nidn"`
	NoHP      string         `gorm:"type:varchar(20)" json:"no_hp"`
	Alamat    string         `gorm:"type:text" json:"alamat"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// KELAS
// =====================
type Kelas struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	NamaKelas string         `gorm:"type:varchar(50);not null" json:"nama_kelas"`
	Jurusan   string         `gorm:"type:varchar(100);not null" json:"jurusan"`
	Angkatan  int            `json:"angkatan"`
	Semester  int            `json:"semester"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// MAHASISWAS (profil mahasiswa)
// =====================
type Mahasiswa struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID      uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"user_id"`
	User        User           `gorm:"foreignKey:UserID" json:"user"`
	NIM         string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"nim"`
	KelasID     uuid.UUID      `gorm:"type:uuid;not null" json:"kelas_id"`
	Kelas       Kelas          `gorm:"foreignKey:KelasID" json:"kelas"`
	NoHP        string         `gorm:"type:varchar(20)" json:"no_hp"`
	Alamat      string         `gorm:"type:text" json:"alamat"`
	StatusAktif bool           `gorm:"default:true" json:"status_aktif"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// MATA_KULIAH
// =====================
type MataKuliah struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	KodeMK    string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"kode_mk"`
	NamaMK    string         `gorm:"type:varchar(100);not null" json:"nama_mk"`
	SKS       int            `json:"sks"`
	Semester  int            `json:"semester"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// KELAS_MATAKULIAH (many-to-many bridge)
// =====================
type KelasMataKuliah struct {
	ID           uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	KelasID      uuid.UUID  `gorm:"type:uuid;not null" json:"kelas_id"`
	Kelas        Kelas      `gorm:"foreignKey:KelasID" json:"kelas"`
	MataKuliahID uuid.UUID  `gorm:"type:uuid;not null" json:"mata_kuliah_id"`
	MataKuliah   MataKuliah `gorm:"foreignKey:MataKuliahID" json:"mata_kuliah"`
	TahunAjar    string     `gorm:"type:varchar(20)" json:"tahun_ajar"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// =====================
// JADWAL_KULIAH
// =====================
type JadwalKuliah struct {
	ID           uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	KelasID      uuid.UUID      `gorm:"type:uuid;not null" json:"kelas_id"`
	Kelas        Kelas          `gorm:"foreignKey:KelasID" json:"kelas"`
	MataKuliahID uuid.UUID      `gorm:"type:uuid;not null" json:"mata_kuliah_id"`
	MataKuliah   MataKuliah     `gorm:"foreignKey:MataKuliahID" json:"mata_kuliah"`
	DosenID      uuid.UUID      `gorm:"type:uuid;not null" json:"dosen_id"`
	Dosen        Dosen          `gorm:"foreignKey:DosenID" json:"dosen"`
	Hari         string         `gorm:"type:varchar(20);not null" json:"hari"`
	JamMulai     string         `gorm:"type:varchar(10);not null" json:"jam_mulai"`
	JamSelesai   string         `gorm:"type:varchar(10);not null" json:"jam_selesai"`
	Ruang        string         `gorm:"type:varchar(50)" json:"ruang"`
	Semester     int            `json:"semester"`
	TahunAjar    string         `gorm:"type:varchar(20)" json:"tahun_ajar"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// ATTENDANCES
// =====================
type Attendance struct {
	ID              uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	MahasiswaID     uuid.UUID      `gorm:"type:uuid;not null" json:"mahasiswa_id"`
	Mahasiswa       Mahasiswa      `gorm:"foreignKey:MahasiswaID" json:"mahasiswa"`
	JadwalID        uuid.UUID      `gorm:"type:uuid;not null" json:"jadwal_id"`
	Jadwal          JadwalKuliah   `gorm:"foreignKey:JadwalID" json:"jadwal"`
	Tanggal         time.Time      `gorm:"type:date;not null" json:"tanggal"`
	PertemuanKe     int            `json:"pertemuan_ke"`
	StatusAbsensi   string         `gorm:"type:varchar(20);not null" json:"status_absensi"` // hadir | izin | sakit | alfa
	Keterangan      string         `gorm:"type:text" json:"keterangan"`
	InputByDosenID  *uuid.UUID     `gorm:"type:uuid" json:"input_by_dosen_id"`
	InputByDosen    *Dosen         `gorm:"foreignKey:InputByDosenID" json:"input_by_dosen,omitempty"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

// =====================
// ANNOUNCEMENTS
// =====================
type Announcement struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Judul       string         `gorm:"type:varchar(255);not null" json:"judul"`
	Isi         string         `gorm:"type:text;not null" json:"isi"`
	TglPublish  time.Time      `gorm:"type:date;not null" json:"tanggal_publish"`
	TargetRole  string         `gorm:"type:varchar(20);not null" json:"target_role"` // admin | dosen | mahasiswa | all
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
