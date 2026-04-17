package route

import (
	"absensi-backend/config"
	"absensi-backend/internal/delivery/http/handler"
	"absensi-backend/internal/delivery/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(
	cfg *config.Config,
	authHandler *handler.AuthHandler,
	studentHandler *handler.StudentHandler,
	adminHandler *handler.AdminHandler,
) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")

	// ─── Auth ──────────────────────────────────────────────────────
	auth := api.Group("/auth")
	{
		auth.POST("/login", authHandler.Login)
		auth.GET("/me", middleware.AuthMiddleware(cfg), authHandler.GetMe)
	}

	// ─── Mahasiswa (role: mahasiswa) ──────────────────────────────
	student := api.Group("/student")
	student.Use(middleware.AuthMiddleware(cfg), middleware.RoleMiddleware("mahasiswa"))
	{
		student.GET("/dashboard", studentHandler.GetDashboard)
	}

	// ─── Dosen (role: dosen) ──────────────────────────────────────
	dosenGroup := api.Group("/dosen")
	dosenGroup.Use(middleware.AuthMiddleware(cfg), middleware.RoleMiddleware("dosen"))
	{
		_ = dosenGroup // placeholder
	}

	// ─── Admin (role: admin) ──────────────────────────────────────
	admin := api.Group("/admin")
	admin.Use(middleware.AuthMiddleware(cfg), middleware.RoleMiddleware("admin"))
	{
		// Dosen CRUD
		admin.GET("/dosen", adminHandler.GetAllDosen)
		admin.GET("/dosen/:id", adminHandler.GetDosenByID)
		admin.POST("/dosen", adminHandler.CreateDosen)
		admin.PUT("/dosen/:id", adminHandler.UpdateDosen)
		admin.DELETE("/dosen/:id", adminHandler.DeleteDosen)

		// Mahasiswa CRUD
		admin.GET("/mahasiswa", adminHandler.GetAllMahasiswa)
		admin.GET("/mahasiswa/:id", adminHandler.GetMahasiswaByID)
		admin.POST("/mahasiswa", adminHandler.CreateMahasiswa)
		admin.PUT("/mahasiswa/:id", adminHandler.UpdateMahasiswa)
		admin.DELETE("/mahasiswa/:id", adminHandler.DeleteMahasiswa)

		// Kelas CRUD
		admin.GET("/kelas", adminHandler.GetAllKelas)
		admin.GET("/kelas/:id", adminHandler.GetKelasByID)
		admin.POST("/kelas", adminHandler.CreateKelas)
		admin.PUT("/kelas/:id", adminHandler.UpdateKelas)
		admin.DELETE("/kelas/:id", adminHandler.DeleteKelas)

		// Mata Kuliah CRUD
		admin.GET("/matakuliah", adminHandler.GetAllMataKuliah)
		admin.GET("/matakuliah/:id", adminHandler.GetMataKuliahByID)
		admin.POST("/matakuliah", adminHandler.CreateMataKuliah)
		admin.PUT("/matakuliah/:id", adminHandler.UpdateMataKuliah)
		admin.DELETE("/matakuliah/:id", adminHandler.DeleteMataKuliah)

		// Jadwal CRUD
		admin.GET("/jadwal", adminHandler.GetAllJadwal)
		admin.GET("/jadwal/:id", adminHandler.GetJadwalByID)
		admin.POST("/jadwal", adminHandler.CreateJadwal)
		admin.PUT("/jadwal/:id", adminHandler.UpdateJadwal)
		admin.DELETE("/jadwal/:id", adminHandler.DeleteJadwal)

		// Absensi CRUD
		admin.GET("/absensi", adminHandler.GetAllAbsensi)
		admin.GET("/absensi/:id", adminHandler.GetAbsensiByID)
		admin.POST("/absensi", adminHandler.CreateAbsensi)
		admin.PUT("/absensi/:id", adminHandler.UpdateAbsensi)
		admin.DELETE("/absensi/:id", adminHandler.DeleteAbsensi)
	}

	return r
}
