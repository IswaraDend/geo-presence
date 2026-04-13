package route

import (
	"absensi-backend/config"
	"absensi-backend/internal/delivery/http/handler"
	"absensi-backend/internal/delivery/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config, authHandler *handler.AuthHandler, studentHandler *handler.StudentHandler) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	api := r.Group("/api")
	
	auth := api.Group("/auth")
	{
		auth.POST("/admin/login", authHandler.AdminLogin)
		auth.POST("/student/login", authHandler.StudentLogin)
		
		// Protected
		auth.GET("/me", middleware.AuthMiddleware(cfg), authHandler.GetMe)
	}

	// Student routes
	student := api.Group("/student")
	student.Use(middleware.AuthMiddleware(cfg), middleware.RoleMiddleware("student"))
	{
		student.GET("/dashboard", studentHandler.GetDashboard)
	}

	// // Admin routes
	// admin := api.Group("/admin")
	// admin.Use(middleware.AuthMiddleware(cfg), middleware.RoleMiddleware("admin"))
	// {
	// 	// Register routes for users, courses, schedules, etc.
	// }

	return r
}
