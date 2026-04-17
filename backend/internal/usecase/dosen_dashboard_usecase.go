package usecase

import (
	"absensi-backend/internal/entity"
	"absensi-backend/internal/repository"
	"time"

	"github.com/google/uuid"
)

type DosenDashboardSummary struct {
	JadwalHariIni []JadwalDosenInfo `json:"jadwalHariIni"`
	StatsKelas    []StatsKelasInfo  `json:"statsKelas"`
	PeringatanMhs []WarningInfo     `json:"perigatanMhs"`
}

type BulkAbsensiRequest struct {
	JadwalID    uuid.UUID      `json:"jadwalId"`
	Tanggal     string         `json:"tanggal"` // YYYY-MM-DD
	PertemuanKe int            `json:"pertemuanKe"`
	Data        []StudentAbsen `json:"data"`
}

type StudentAbsen struct {
	MahasiswaID uuid.UUID `json:"mahasiswaId"`
	Status      string    `json:"status"` // hadir, alfa, izin, sakit
	Keterangan  string    `json:"keterangan"`
}

type MhsInfo struct {
	ID   uuid.UUID `json:"id"`
	NIM  string    `json:"nim"`
	Nama string    `json:"nama"`
}

type JadwalDosenInfo struct {
	ID         string `json:"id"`
	MataKuliah string `json:"mataKuliah"`
	Kelas      string `json:"kelas"`
	Ruang      string `json:"ruang"`
	JamMulai   string `json:"jamMulai"`
	JamSelesai string `json:"jamSelesai"`
}

type StatsKelasInfo struct {
	ID            string `json:"id"`
	Kelas         string `json:"kelas"`
	MataKuliah    string `json:"mataKuliah"`
	TotalMhs      int    `json:"totalMhs"`
	RataKehadiran int    `json:"rataKehadiran"`
}

type DosenDashboardUseCase interface {
	GetDashboardSummary(userID uuid.UUID) (*DosenDashboardSummary, error)
	GetKelasList(userID uuid.UUID) ([]StatsKelasInfo, error)
	GetMahasiswaByJadwal(jadwalID uuid.UUID) ([]MhsInfo, error)
	SubmitBulkAbsensi(req BulkAbsensiRequest) error
}

type dosenDashboardUseCase struct {
	repo repository.DosenDashboardRepository
}

func NewDosenDashboardUseCase(repo repository.DosenDashboardRepository) DosenDashboardUseCase {
	return &dosenDashboardUseCase{repo}
}

func (u *dosenDashboardUseCase) GetDashboardSummary(userID uuid.UUID) (*DosenDashboardSummary, error) {
	dosen, err := u.repo.GetDosenByUserID(userID)
	if err != nil {
		return nil, err
	}

	jadwalList, err := u.repo.GetJadwalByDosenID(dosen.ID)
	if err != nil {
		return nil, err
	}

	var jadwalIDs []uuid.UUID
	var kelasIDs []uuid.UUID
	for _, j := range jadwalList {
		jadwalIDs = append(jadwalIDs, j.ID)
		kelasIDs = append(kelasIDs, j.KelasID)
	}

	absensiList, err := u.repo.GetAbsensiByJadwalIDs(jadwalIDs)
	if err != nil {
		absensiList = []entity.Attendance{} // empty is ok
	}

	mhsList, err := u.repo.GetMahasiswaByKelasIDs(kelasIDs)
	if err != nil {
		mhsList = []entity.Mahasiswa{}
	}

	summary := &DosenDashboardSummary{
		JadwalHariIni: []JadwalDosenInfo{},
		StatsKelas:    []StatsKelasInfo{},
		PeringatanMhs: []WarningInfo{},
	}

	// 1. Jadwal Hari Ini
	days := map[string]string{
		"Monday": "Senin", "Tuesday": "Selasa", "Wednesday": "Rabu",
		"Thursday": "Kamis", "Friday": "Jumat", "Saturday": "Sabtu", "Sunday": "Minggu",
	}
	today := days[time.Now().Format("Monday")]

	for _, j := range jadwalList {
		if j.Hari == today {
			summary.JadwalHariIni = append(summary.JadwalHariIni, JadwalDosenInfo{
				ID:         j.ID.String(),
				MataKuliah: j.MataKuliah.NamaMK,
				Kelas:      j.Kelas.NamaKelas,
				Ruang:      j.Ruang,
				JamMulai:   j.JamMulai,
				JamSelesai: j.JamSelesai,
			})
		}
	}

	// 2. Stats Kelas & 3. Warnings
	// Map absensi ke jadwal
	absensiByJadwal := make(map[uuid.UUID][]entity.Attendance)
	for _, a := range absensiList {
		absensiByJadwal[a.JadwalID] = append(absensiByJadwal[a.JadwalID], a)
	}

	// Map mahasiswa ke kelas
	mhsByKelas := make(map[uuid.UUID][]entity.Mahasiswa)
	for _, m := range mhsList {
		mhsByKelas[m.KelasID] = append(mhsByKelas[m.KelasID], m)
	}

	for _, j := range jadwalList {
		relevantMhs := mhsByKelas[j.KelasID]
		if len(relevantMhs) == 0 {
			continue
		}

		// Hitung rata kehadiran untuk jadwal ini
		// (Asumsi 1 jadwal = 1 MK di kelas itu)
		relevantAbs := absensiByJadwal[j.ID]

		totalHadir := 0
		totalRecord := len(relevantAbs)

		if totalRecord > 0 {
			for _, a := range relevantAbs {
				if a.StatusAbsensi == "hadir" {
					totalHadir++
				}
			}
			rata := (totalHadir * 100) / totalRecord
			summary.StatsKelas = append(summary.StatsKelas, StatsKelasInfo{
				ID:            j.ID.String(),
				Kelas:         j.Kelas.NamaKelas,
				MataKuliah:    j.MataKuliah.NamaMK,
				TotalMhs:      len(relevantMhs),
				RataKehadiran: rata,
			})
		} else {
			summary.StatsKelas = append(summary.StatsKelas, StatsKelasInfo{
				ID:            j.ID.String(),
				Kelas:         j.Kelas.NamaKelas,
				MataKuliah:    j.MataKuliah.NamaMK,
				TotalMhs:      len(relevantMhs),
				RataKehadiran: 100, // Default 100 if no records yet
			})
		}
	}

	// 3. Warnings (Mahasiswa dengan kehadiran < 75% di kelas tersebut)
	// Kita butuh hitung per mahasiswa per jadwal
	for _, j := range jadwalList {
		relevantAbsByMhs := make(map[uuid.UUID][]string)
		for _, a := range absensiByJadwal[j.ID] {
			relevantAbsByMhs[a.MahasiswaID] = append(relevantAbsByMhs[a.MahasiswaID], a.StatusAbsensi)
		}

		for _, m := range mhsByKelas[j.KelasID] {
			statuses := relevantAbsByMhs[m.ID]
			if len(statuses) < 4 {
				continue
			} // Minimal 4 pertemuan baru kena warning jika rendah

			hadir := 0
			for _, s := range statuses {
				if s == "hadir" {
					hadir++
				}
			}
			perc := (hadir * 100) / len(statuses)
			if perc < 75 {
				summary.PeringatanMhs = append(summary.PeringatanMhs, WarningInfo{
					ID:         m.ID.String(),
					Nama:       m.User.Nama,
					NIM:        m.NIM,
					Kelas:      j.Kelas.NamaKelas,
					AbsenCount: perc, // Kita simpan persentase di sini (Frontend baca % di bagian Dosen)
				})
			}
		}
	}

	return summary, nil
}

func (u *dosenDashboardUseCase) GetKelasList(userID uuid.UUID) ([]StatsKelasInfo, error) {
	summary, err := u.GetDashboardSummary(userID)
	if err != nil {
		return nil, err
	}
	return summary.StatsKelas, nil
}

func (u *dosenDashboardUseCase) GetMahasiswaByJadwal(jadwalID uuid.UUID) ([]MhsInfo, error) {
	jadwal, err := u.repo.GetJadwalByID(jadwalID)
	if err != nil {
		return nil, err
	}

	mhsList, err := u.repo.GetMahasiswaByKelasIDs([]uuid.UUID{jadwal.KelasID})
	if err != nil {
		return nil, err
	}

	var res []MhsInfo
	for _, m := range mhsList {
		res = append(res, MhsInfo{
			ID:   m.ID,
			NIM:  m.NIM,
			Nama: m.User.Nama,
		})
	}
	return res, nil
}

func (u *dosenDashboardUseCase) SubmitBulkAbsensi(req BulkAbsensiRequest) error {
	tanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return err
	}

	var absensi []entity.Attendance
	for _, d := range req.Data {
		absensi = append(absensi, entity.Attendance{
			ID:            uuid.New(),
			MahasiswaID:   d.MahasiswaID,
			JadwalID:      req.JadwalID,
			Tanggal:       tanggal,
			PertemuanKe:   req.PertemuanKe,
			StatusAbsensi: d.Status,
			Keterangan:    d.Keterangan,
		})
	}

	return u.repo.BulkCreateAbsensi(absensi)
}
