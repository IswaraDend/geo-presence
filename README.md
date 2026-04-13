# Dashboard Absensi Mahasiswa Fullstack

Project ini adalah implementasi dari Dashboard Absensi Mahasiswa berbasis web dengan teknologi Golang (Gin + GORM) di sisi backend, dan React (Vite + Tailwind CSS) di sisi frontend.

## Fitur Utama

- **Authentication:** JWT (Login Mahasiswa & Login Admin)
- **Role-based Access:** Middleware untuk memproteksi routes.
- **Dashboard Mahasiswa:** Indikator progress kehadiran (Circular Progress), jadwal kuliah, dan riwayat absensi.
- **Auto Data Seed:** Migrasi otomatis dan seeding Admin default.

## Struktur Project

- `backend/`: Golang service.
  - Arsitektur: Clean Architecture (Entity -> Repo -> Usecase -> Handler).
  - Framework: Gin Web Framework.
  - Database: PostgreSQL (via GORM).
- `frontend/`: React Vite app.
  - Styling: Tailwind CSS & Lucide React.
  - State: Context API & React Hooks.
- `docker-compose.yml`: Script instalasi docker untuk menjalankan semuanya dengan 1 perintah.

## Cara Menjalankan Project

### 1. Menggunakan Docker (Rekomendasi)

Jalankan perintah berikut di root folder project:
```bash
docker-compose up --build -d
```
- Backend API akan tersedia di: `http://localhost:8080/api`
- Frontend Web akan tersedia di: `http://localhost:5173`

*(Catatan khusus untuk frontend pada nginx docker: saat ini port expose adalah 5173, dan dikonfigurasi untuk mapping 5173:5173)*

### 2. Menjalankan Manual (Tanpa Docker)

**Persyaratan Dasar:** 
- PostgreSQL berjalan di sistem Anda dengan database bernama `geo_presence` dan password `postgres`.
- Go 1.22+ terinstall.
- Node.js 18+ terinstall.

**Menjalankan Backend:**
```bash
cd backend
go mod download
go run ./cmd/api/main.go
```

**Menjalankan Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Akun Default

Saat backend pertama kali dijalankan, sistem akan otomatis membuat tabel dan mengisi akun Admin sebagai berikut:
- **Email:** `admin@kampus.ac.id`
- **Password:** `admin123`

*(Anda bisa menambah Mahasiswa melalui API POST atau langsung di DB)*

---

## Dokumentasi API Dasar

### 1. Auth Login Admin
- **Endpoint:** `POST /api/auth/admin/login`
- **Body:** `{ "email": "admin@kampus.ac.id", "password": "..." }`
- **Response:** `{ "status": "success", "data": { "token": "jwt_token..." } }`

### 2. Auth Login Mahasiswa
- **Endpoint:** `POST /api/auth/student/login`
- **Body:** `{ "email": "mahasiswa1@kampus.ac.id", "password": "..." }`
- **Response:** `{ "status": "success", "data": { "token": "jwt_token..." } }`

### 3. Get Dashboard Mahasiswa
- **Endpoint:** `GET /api/student/dashboard`
- **Header:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "status": "success",
  "data": {
    "kehadiran": {
      "persentase": 85.5,
      "hadir_count": 9,
      "absen_count": 3,
      "total_pertemuan": 12
    },
    "has_warning": false,
    "today_schedules": [],
    "recent_history": []
  }
}
```

## Saran Pengembangan Lanjutan
1. **Manajemen Data Master Frontend:** Buat halaman CRUD untuk Tabel Mahasiswa, Mata Kuliah, Jadwal menggunakan state/props.
2. **Ekspor Laporan:** Tambah fitur Download PDF/Excel di dashboard Admin untuk rekapitulasi data kehadiran.
3. **Notifikasi Realtime:** Gunakan WebSockets jika ada pengumuman mendadak agar mahasiswa mendapat pop-up seketika di dashboard.
