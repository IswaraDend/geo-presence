import { LogOut, User, Home, Calendar, ClipboardList, Bell } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">Dashboard Absensi Mahasiswa</h1>
          <div className="flex flex-row items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-700 py-1 px-3 rounded-full">
              <div className="bg-white text-blue-600 p-1 rounded-full">
                <User size={18} />
              </div>
              <span className="font-medium text-sm">{user?.name || "Student"}</span>
            </div>
            <button onClick={handleLogout} className="text-blue-100 hover:text-white hover:bg-blue-700 p-2 rounded-full transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 flex space-x-1 overflow-x-auto">
          <NavLink to="/" className={({isActive}) => `flex items-center space-x-2 py-3 px-4 outline-none border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
            <Home size={18} /> <span>Beranda</span>
          </NavLink>
          <NavLink to="/jadwal" className={({isActive}) => `flex items-center space-x-2 py-3 px-4 outline-none border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
            <Calendar size={18} /> <span>Jadwal Kuliah</span>
          </NavLink>
          <NavLink to="/riwayat" className={({isActive}) => `flex items-center space-x-2 py-3 px-4 outline-none border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
            <ClipboardList size={18} /> <span>Riwayat Absensi</span>
          </NavLink>
          <NavLink to="/pengumuman" className={({isActive}) => `flex items-center space-x-2 py-3 px-4 outline-none border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
            <Bell size={18} /> <span>Pengumuman</span>
          </NavLink>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
