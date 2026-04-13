package repository

import (
	"absensi-backend/internal/entity"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StudentDashboardRepository interface {
	GetAttendancesByStudent(studentID uuid.UUID) ([]entity.Attendance, error)
	GetTodaySchedules(studentID uuid.UUID) ([]entity.Schedule, error)
}

type studentDashboardRepository struct {
	db *gorm.DB
}

func NewStudentDashboardRepository(db *gorm.DB) StudentDashboardRepository {
	return &studentDashboardRepository{db}
}

func (r *studentDashboardRepository) GetAttendancesByStudent(studentID uuid.UUID) ([]entity.Attendance, error) {
	var attendances []entity.Attendance
	err := r.db.Preload("Course").Preload("Schedule").Where("student_id = ?", studentID).Order("date desc").Find(&attendances).Error
	return attendances, err
}

func (r *studentDashboardRepository) GetTodaySchedules(studentID uuid.UUID) ([]entity.Schedule, error) {
	// Simplified: In a real app we'd map today's weekday to the 'day' column (e.g. "Senin", "Selasa")
	// For demonstration, we just return upcoming schedules
	// Assuming day string is simple like "Senin"
	currentTime := time.Now()
	weekdays := map[time.Weekday]string{
		time.Sunday:    "Minggu",
		time.Monday:    "Senin",
		time.Tuesday:   "Selasa",
		time.Wednesday: "Rabu",
		time.Thursday:  "Kamis",
		time.Friday:    "Jumat",
		time.Saturday:  "Sabtu",
	}
	today := weekdays[currentTime.Weekday()]

	var schedules []entity.Schedule
	// A real production query would join Student -> Class -> Schedule, etc.
	// We'll just fetch by day
	err := r.db.Preload("Course").Where("day = ?", today).Find(&schedules).Error
	return schedules, err
}
