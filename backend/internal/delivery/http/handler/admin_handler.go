package handler

import (
	"absensi-backend/internal/usecase"
	"absensi-backend/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AdminHandler struct {
	useCase usecase.AdminUseCase
}

func NewAdminHandler(useCase usecase.AdminUseCase) *AdminHandler {
	return &AdminHandler{useCase}
}

func parseUUID(c *gin.Context, param string) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param(param))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "ID tidak valid")
		return uuid.Nil, false
	}
	return id, true
}

// ─── Dosen ───────────────────────────────────────────────────

func (h *AdminHandler) GetAllDosen(c *gin.Context) {
	list, err := h.useCase.GetAllDosen()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Data dosen berhasil diambil", list)
}

func (h *AdminHandler) GetDosenByID(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	d, err := h.useCase.GetDosenByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Dosen tidak ditemukan")
		return
	}
	response.Success(c, http.StatusOK, "Detail dosen", d)
}

func (h *AdminHandler) CreateDosen(c *gin.Context) {
	var req usecase.CreateDosenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.CreateDosen(req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Dosen berhasil ditambahkan", nil)
}

func (h *AdminHandler) UpdateDosen(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	var req usecase.UpdateDosenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.UpdateDosen(id, req); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Dosen berhasil diperbarui", nil)
}

func (h *AdminHandler) DeleteDosen(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	if err := h.useCase.DeleteDosen(id); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Dosen berhasil dihapus", nil)
}

// ─── Mahasiswa ────────────────────────────────────────────────

func (h *AdminHandler) GetAllMahasiswa(c *gin.Context) {
	list, err := h.useCase.GetAllMahasiswa()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Data mahasiswa berhasil diambil", list)
}

func (h *AdminHandler) GetMahasiswaByID(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	m, err := h.useCase.GetMahasiswaByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Mahasiswa tidak ditemukan")
		return
	}
	response.Success(c, http.StatusOK, "Detail mahasiswa", m)
}

func (h *AdminHandler) CreateMahasiswa(c *gin.Context) {
	var req usecase.CreateMahasiswaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.CreateMahasiswa(req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Mahasiswa berhasil ditambahkan", nil)
}

func (h *AdminHandler) UpdateMahasiswa(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	var req usecase.UpdateMahasiswaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.UpdateMahasiswa(id, req); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Mahasiswa berhasil diperbarui", nil)
}

func (h *AdminHandler) DeleteMahasiswa(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	if err := h.useCase.DeleteMahasiswa(id); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Mahasiswa berhasil dihapus", nil)
}

// ─── Kelas ────────────────────────────────────────────────────

func (h *AdminHandler) GetAllKelas(c *gin.Context) {
	list, err := h.useCase.GetAllKelas()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Data kelas berhasil diambil", list)
}

func (h *AdminHandler) GetKelasByID(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	k, err := h.useCase.GetKelasByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Kelas tidak ditemukan")
		return
	}
	response.Success(c, http.StatusOK, "Detail kelas", k)
}

func (h *AdminHandler) CreateKelas(c *gin.Context) {
	var req usecase.CreateKelasRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.CreateKelas(req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Kelas berhasil ditambahkan", nil)
}

func (h *AdminHandler) UpdateKelas(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	var req usecase.UpdateKelasRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.UpdateKelas(id, req); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Kelas berhasil diperbarui", nil)
}

func (h *AdminHandler) DeleteKelas(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	if err := h.useCase.DeleteKelas(id); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Kelas berhasil dihapus", nil)
}

// ─── Mata Kuliah ──────────────────────────────────────────────

func (h *AdminHandler) GetAllMataKuliah(c *gin.Context) {
	list, err := h.useCase.GetAllMataKuliah()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Data mata kuliah berhasil diambil", list)
}

func (h *AdminHandler) GetMataKuliahByID(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	mk, err := h.useCase.GetMataKuliahByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Mata kuliah tidak ditemukan")
		return
	}
	response.Success(c, http.StatusOK, "Detail mata kuliah", mk)
}

func (h *AdminHandler) CreateMataKuliah(c *gin.Context) {
	var req usecase.CreateMataKuliahRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.CreateMataKuliah(req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Mata kuliah berhasil ditambahkan", nil)
}

func (h *AdminHandler) UpdateMataKuliah(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	var req usecase.UpdateMataKuliahRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.UpdateMataKuliah(id, req); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Mata kuliah berhasil diperbarui", nil)
}

func (h *AdminHandler) DeleteMataKuliah(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	if err := h.useCase.DeleteMataKuliah(id); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Mata kuliah berhasil dihapus", nil)
}

// ─── Jadwal ───────────────────────────────────────────────────

func (h *AdminHandler) GetAllJadwal(c *gin.Context) {
	list, err := h.useCase.GetAllJadwal()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Data jadwal berhasil diambil", list)
}

func (h *AdminHandler) GetJadwalByID(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	j, err := h.useCase.GetJadwalByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Jadwal tidak ditemukan")
		return
	}
	response.Success(c, http.StatusOK, "Detail jadwal", j)
}

func (h *AdminHandler) CreateJadwal(c *gin.Context) {
	var req usecase.CreateJadwalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.CreateJadwal(req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Jadwal berhasil ditambahkan", nil)
}

func (h *AdminHandler) UpdateJadwal(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	var req usecase.UpdateJadwalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.UpdateJadwal(id, req); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Jadwal berhasil diperbarui", nil)
}

func (h *AdminHandler) DeleteJadwal(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	if err := h.useCase.DeleteJadwal(id); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Jadwal berhasil dihapus", nil)
}

// ─── Absensi ──────────────────────────────────────────────────

func (h *AdminHandler) GetAllAbsensi(c *gin.Context) {
	list, err := h.useCase.GetAllAbsensi()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Data absensi berhasil diambil", list)
}

func (h *AdminHandler) GetAbsensiByID(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	a, err := h.useCase.GetAbsensiByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Absensi tidak ditemukan")
		return
	}
	response.Success(c, http.StatusOK, "Detail absensi", a)
}

func (h *AdminHandler) CreateAbsensi(c *gin.Context) {
	var req usecase.CreateAbsensiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.CreateAbsensi(req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Absensi berhasil ditambahkan", nil)
}

func (h *AdminHandler) UpdateAbsensi(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	var req usecase.UpdateAbsensiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.useCase.UpdateAbsensi(id, req); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Absensi berhasil diperbarui", nil)
}

func (h *AdminHandler) DeleteAbsensi(c *gin.Context) {
	id, ok := parseUUID(c, "id")
	if !ok {
		return
	}
	if err := h.useCase.DeleteAbsensi(id); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Absensi berhasil dihapus", nil)
}

// ─── Dashboard ────────────────────────────────────────────────

func (h *AdminHandler) GetDashboard(c *gin.Context) {
	summary, err := h.useCase.GetDashboardSummary()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal memuat data dashboard")
		return
	}
	response.Success(c, http.StatusOK, "Data dashboard admin", summary)
}
