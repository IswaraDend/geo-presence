package main

import (
	"log"

	"absensi-backend/config"
	"absensi-backend/internal/delivery/http/handler"
	"absensi-backend/internal/delivery/http/route"
	"absensi-backend/internal/entity"
	"absensi-backend/internal/repository"
	"absensi-backend/internal/usecase"
	"absensi-backend/pkg/database"
	"absensi-backend/pkg/hash"
)

func main() {
	cfg := config.LoadConfig()
	db := database.InitDB(cfg)

	// AutoMigrate
	err := db.AutoMigrate(
		&entity.User{},
		&entity.Admin{},
		&entity.Dosen{},
		&entity.Kelas{},
		&entity.Mahasiswa{},
		&entity.MataKuliah{},
		&entity.KelasMataKuliah{},
		&entity.JadwalKuliah{},
		&entity.Attendance{},
		&entity.Announcement{},
	)
	if err != nil {
		log.Fatalf("AutoMigrate gagal: %v", err)
	}

	// Composite unique index
	db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique ON attendances(mahasiswa_id, jadwal_id, pertemuan_ke) WHERE deleted_at IS NULL")

	// Seed Admin default
	var count int64
	db.Model(&entity.User{}).Where("role = ?", "admin").Count(&count)
	if count == 0 {
		hashedPass, _ := hash.HashPassword("admin123")
		user := entity.User{
			Nama:         "Super Admin",
			Email:        "admin@kampus.ac.id",
			PasswordHash: hashedPass,
			Role:         "admin",
			IsActive:     true,
		}
		db.Create(&user)
		db.Create(&entity.Admin{UserID: user.ID, KodeAdmin: "ADM001"})
		log.Println("Seeded: admin@kampus.ac.id / admin123")
	}

	// Init Repositories
	authRepo := repository.NewAuthRepository(db)
	adminRepo := repository.NewAdminRepository(db)

	// Init UseCases
	authUseCase := usecase.NewAuthUseCase(authRepo, cfg)
	studentUseCase := usecase.NewStudentDashboardUseCase(
		repository.NewStudentDashboardRepository(db),
		authRepo,
	)
	adminUseCase := usecase.NewAdminUseCase(adminRepo)
	dosenUseCase := usecase.NewDosenDashboardUseCase(repository.NewDosenDashboardRepository(db))

	// Init Handlers
	authHandler := handler.NewAuthHandler(authUseCase)
	studentHandler := handler.NewStudentHandler(studentUseCase)
	adminHandler := handler.NewAdminHandler(adminUseCase)
	dosenHandler := handler.NewDosenHandler(dosenUseCase)

	// Start
	r := route.SetupRouter(cfg, authHandler, studentHandler, adminHandler, dosenHandler)
	log.Printf("Server berjalan di port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Server gagal: %v", err)
	}
}
