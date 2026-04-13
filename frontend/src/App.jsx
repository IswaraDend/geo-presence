import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import Login from './pages/auth/Login';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Placeholder for other routes
const Placeholder = ({title}) => <div className="card p-8 text-center text-gray-500 font-medium">Halaman {title} sedang dalam pengembangan.</div>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Student Routes */}
      <Route path="/" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="jadwal" element={<Placeholder title="Jadwal Kuliah" />} />
        <Route path="riwayat" element={<Placeholder title="Riwayat Absensi" />} />
        <Route path="pengumuman" element={<Placeholder title="Pengumuman" />} />
      </Route>

      {/* Admin route placeholder */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><div className="p-8">Admin Dashboard - Coming Soon</div></ProtectedRoute>} />

      <Route path="*" element={<div className="p-20 text-center text-3xl font-bold text-gray-400">404 NOT FOUND</div>} />
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
