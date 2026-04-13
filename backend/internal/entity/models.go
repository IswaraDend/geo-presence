package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Admin struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name      string         `gorm:"type:varchar(100);not null" json:"name"`
	Email     string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"type:varchar(255);not null" json:"-"`
	Role      string         `gorm:"type:varchar(20);default:'admin'" json:"role"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Student struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	NIM       string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"nim"`
	Name      string         `gorm:"type:varchar(100);not null" json:"name"`
	Email     string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"type:varchar(255);not null" json:"-"`
	Major     string         `gorm:"type:varchar(50)" json:"major"`
	Batch     int            `json:"batch"`
	Class     string         `gorm:"type:varchar(20)" json:"class"`
	Role      string         `gorm:"type:varchar(20);default:'student'" json:"role"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Course struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Code      string         `gorm:"type:varchar(20);uniqueIndex;not null" json:"code"`
	Name      string         `gorm:"type:varchar(100);not null" json:"name"`
	Credits   int            `json:"credits"`
	Semester  int            `json:"semester"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Schedule struct {
	ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CourseID  uuid.UUID      `gorm:"type:uuid;not null" json:"course_id"`
	Course    Course         `gorm:"foreignKey:CourseID" json:"course"`
	Day       string         `gorm:"type:varchar(20);not null" json:"day"`
	StartTime string         `gorm:"type:varchar(10);not null" json:"start_time"`
	EndTime   string         `gorm:"type:varchar(10);not null" json:"end_time"`
	Room      string         `gorm:"type:varchar(50)" json:"room"`
	Lecturer  string         `gorm:"type:varchar(100)" json:"lecturer"`
	Semester  int            `json:"semester"`
	Class     string         `gorm:"type:varchar(20)" json:"class"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Attendance struct {
	ID            uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	StudentID     uuid.UUID      `gorm:"type:uuid;not null" json:"student_id"`
	Student       Student        `gorm:"foreignKey:StudentID" json:"student"`
	CourseID      uuid.UUID      `gorm:"type:uuid;not null" json:"course_id"`
	Course        Course         `gorm:"foreignKey:CourseID" json:"course"`
	ScheduleID    uuid.UUID      `gorm:"type:uuid;not null" json:"schedule_id"`
	Schedule      Schedule       `gorm:"foreignKey:ScheduleID" json:"schedule"`
	Date          time.Time      `gorm:"type:date;not null" json:"date"`
	Status        string         `gorm:"type:varchar(20);not null" json:"status"` // hadir, izin, sakit, alfa
	Notes         string         `gorm:"type:text" json:"notes"`
	MeetingNumber int            `json:"meeting_number"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

type Announcement struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Content     string         `gorm:"type:text;not null" json:"content"`
	PublishDate time.Time      `gorm:"type:date;not null" json:"publish_date"`
	TargetRole  string         `gorm:"type:varchar(20);not null" json:"target_role"` // admin, student, all
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
