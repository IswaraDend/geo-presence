import { BookOpen, Home, Users, ClipboardList, LogOut, Menu, X, GraduationCap, Bell } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function DosenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dosen', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/dosen/kelas', icon: <Users size={20} />, label: 'Kelas Saya' },
    { to: '/dosen/absensi', icon: <ClipboardList size={20} />, label: 'Input Absensi' },
    { to: '/dosen/matakuliah', icon: <BookOpen size={20} />, label: 'Mata Kuliah' },
    { to: '/dosen/pengumuman', icon: <Bell size={20} />, label: 'Pengumuman' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-emerald-900 to-emerald-950 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>

        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-emerald-800">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-wide">Dosen Panel</span>
          </div>
          <button className="lg:hidden text-emerald-300 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-base shrink-0">
              {(user?.nama || user?.name || 'D')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{user?.nama || user?.name || 'Dosen'}</div>
              <div className="text-xs text-emerald-300 truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              end={item.to === '/dosen'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                    : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-emerald-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-emerald-200 hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:hidden border-b border-gray-200">
          <div className="flex items-center space-x-2 font-bold text-gray-800">
            <GraduationCap className="text-emerald-600" size={22} />
            <span>GeoPresence</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-emerald-600 p-2 rounded-lg">
            <Menu size={22} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
