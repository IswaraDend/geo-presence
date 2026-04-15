import { LogOut, User, Home, Calendar, ClipboardList, Bell, GraduationCap, Menu, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/student', icon: <Home size={18} />, label: 'Beranda', end: true },
    { to: '/student/jadwal', icon: <Calendar size={18} />, label: 'Jadwal Kuliah' },
    { to: '/student/riwayat', icon: <ClipboardList size={18} />, label: 'Riwayat Absensi' },
    { to: '/student/pengumuman', icon: <Bell size={18} />, label: 'Pengumuman' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide">GeoPresence</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-blue-100 hover:bg-white/15 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-white/15 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-white max-w-[120px] truncate">
                {user?.nama || user?.name || 'Mahasiswa'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="bg-white/15 hover:bg-red-500 p-2 rounded-lg transition-colors"
            >
              <LogOut size={18} className="text-white" />
            </button>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg bg-white/15"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 bg-blue-700 px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'text-blue-100 hover:bg-white/15'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
