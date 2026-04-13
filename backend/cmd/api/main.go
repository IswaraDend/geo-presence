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
	// Load config
	cfg := config.LoadConfig()

	// Init DB
	db := database.InitDB(cfg)

	// Migrate DB
	err := db.AutoMigrate(
		&entity.Admin{},
		&entity.Student{},
		&entity.Course{},
		&entity.Schedule{},
		&entity.Attendance{},
		&entity.Announcement{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Seed Admin
	var count int64
	db.Model(&entity.Admin{}).Count(&count)
	if count == 0 {
		hashedPass, _ := hash.HashPassword("admin123")
		admin := entity.Admin{
			Name:     "Super Admin",
			Email:    "admin@kampus.ac.id",
			Password: hashedPass,
			Role:     "admin",
		}
		db.Create(&admin)
		log.Println("Seeded default admin (admin@kampus.ac.id / admin123)")
	}

	// Init Repo
	authRepo := repository.NewAuthRepository(db)

	// Init UseCase
	authUseCase := usecase.NewAuthUseCase(authRepo, cfg)

	// Init Handler
	authHandler := handler.NewAuthHandler(authUseCase)

	studentRepo := repository.NewStudentDashboardRepository(db)
	studentUseCase := usecase.NewStudentDashboardUseCase(studentRepo)
	studentHandler := handler.NewStudentHandler(studentUseCase)

	// Setup Router
	r := route.SetupRouter(cfg, authHandler, studentHandler)

	// Run
	log.Printf("Starting server on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
