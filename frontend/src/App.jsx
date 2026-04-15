import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';
import DosenLayout from './layouts/DosenLayout';

// Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentJadwal from './pages/student/Jadwal';
import StudentRiwayat from './pages/student/Riwayat';
import StudentPengumuman from './pages/student/Pengumuman';

import AdminDashboard from './pages/admin/Dashboard';
import AdminDosen from './pages/admin/Dosen';
import AdminMahasiswa from './pages/admin/Mahasiswa';
import AdminMataKuliah from './pages/admin/MataKuliah';
import AdminJadwal from './pages/admin/Jadwal';
import AdminAbsensi from './pages/admin/Absensi';

import DosenDashboard from './pages/dosen/Dashboard';
import DosenKelas from './pages/dosen/Kelas';
import DosenInputAbsensi from './pages/dosen/InputAbsensi';

// Protected Route: redirect ke /login jika belum auth, atau ke /unauthorized jika role salah
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    // Redirect ke dashboard yang sesuai role user
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'dosen') return <Navigate to="/dosen" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Komponen redirect dari root berdasarkan role
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'dosen') return <Navigate to="/dosen" replace />;
  return <Navigate to="/student" replace />;
};

// Placeholder
const Placeholder = ({ title }) => (
  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
    <p className="text-slate-400 font-medium text-lg">Halaman <strong>{title}</strong> sedang dalam pengembangan.</p>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Root redirect berdasarkan role */}
      <Route path="/" element={<RootRedirect />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="mahasiswa">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="jadwal" element={<StudentJadwal />} />
        <Route path="riwayat" element={<StudentRiwayat />} />
        <Route path="pengumuman" element={<StudentPengumuman />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dosen" element={<AdminDosen />} />
        <Route path="students" element={<AdminMahasiswa />} />
        <Route path="courses" element={<AdminMataKuliah />} />
        <Route path="schedules" element={<AdminJadwal />} />
        <Route path="attendances" element={<AdminAbsensi />} />
      </Route>

      {/* Dosen Routes */}
      <Route
        path="/dosen"
        element={
          <ProtectedRoute allowedRole="dosen">
            <DosenLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DosenDashboard />} />
        <Route path="kelas" element={<DosenKelas />} />
        <Route path="absensi" element={<DosenInputAbsensi />} />
        <Route path="matakuliah" element={<Placeholder title="Mata Kuliah" />} />
        <Route path="pengumuman" element={<Placeholder title="Pengumuman" />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-8xl font-extrabold text-slate-700 mb-4">404</p>
              <p className="text-slate-400 text-xl font-medium">Halaman tidak ditemukan</p>
              <a href="/login" className="mt-6 inline-block text-blue-400 hover:text-blue-300 font-semibold underline">
                Kembali ke Login
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
