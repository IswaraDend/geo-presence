import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, Calendar, MapPin, TrendingUp, AlertCircle, Plus, CheckSquare, XSquare, Clock } from 'lucide-react';

// Mock data — ganti dengan API call ke /admin/dashboard
const mockStats = {
  totalStudents: 145,
  totalCourses: 12,
  totalSchedules: 28,
  attendanceToday: 89,
};

const mockWarnings = [
  { id: 1, nama: 'Budi Setiawan', nim: '2024001', kelas: 'TI-3A', absenCount: 4 },
  { id: 2, nama: 'Citra Kirana', nim: '2024045', kelas: 'TI-2B', absenCount: 3 },
  { id: 3, nama: 'Rian Hidayat', nim: '2024088', kelas: 'TI-4C', absenCount: 5 },
];

const mockRecent = [
  { id: 1, nama: 'Andi Saputra', nim: '2024002', waktu: '08:15', status: 'hadir', mataKuliah: 'Matematika Diskrit' },
  { id: 2, nama: 'Budi Setiawan', nim: '2024001', waktu: '08:20', status: 'alfa', mataKuliah: 'Matematika Diskrit' },
  { id: 3, nama: 'Desy Ratna', nim: '2024010', waktu: '10:05', status: 'hadir', mataKuliah: 'Pemrograman Web' },
  { id: 4, nama: 'Eko Pratama', nim: '2024021', waktu: '10:11', status: 'izin', mataKuliah: 'Pemrograman Web' },
  { id: 5, nama: 'Fitri Handayani', nim: '2024033', waktu: '13:00', status: 'sakit', mataKuliah: 'Basis Data' },
];

const statusConfig = {
  hadir: { label: 'Hadir', class: 'bg-emerald-100 text-emerald-700', icon: <CheckSquare size={13} /> },
  alfa: { label: 'Alfa', class: 'bg-rose-100 text-rose-700', icon: <XSquare size={13} /> },
  izin: { label: 'Izin', class: 'bg-amber-100 text-amber-700', icon: <Clock size={13} /> },
  sakit: { label: 'Sakit', class: 'bg-blue-100 text-blue-700', icon: <Clock size={13} /> },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // TODO: ganti dengan real API call: api.get('/admin/dashboard')
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Memuat panel administrator...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const statCards = [
    { title: 'Total Mahasiswa', value: stats.totalStudents, icon: <Users size={22} />, gradient: 'from-blue-600 to-blue-800', trend: '+12' },
    { title: 'Mata Kuliah Aktif', value: stats.totalCourses, icon: <BookOpen size={22} />, gradient: 'from-emerald-600 to-emerald-800' },
    { title: 'Jadwal Kelas', value: stats.totalSchedules, icon: <Calendar size={22} />, gradient: 'from-violet-600 to-violet-800' },
    { title: 'Kehadiran Hari Ini', value: `${stats.attendanceToday}%`, icon: <MapPin size={22} />, gradient: 'from-amber-500 to-orange-600', trend: '+5%' },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">{today}</p>
            <h1 className="text-2xl md:text-3xl font-bold">Panel Administrator</h1>
            <p className="text-slate-300 text-sm mt-1">Selamat datang, {user?.nama || user?.name || 'Admin'}</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 transition-colors px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-900/30">
            <Plus size={18} />
            <span>Tambah Mahasiswa</span>
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div key={i} className={`relative bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white overflow-hidden shadow-sm`}>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              {React.cloneElement(card.icon, { size: 90 })}
            </div>
            <div className="relative z-10">
              <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-extrabold mb-1">{card.value}</p>
                  <p className="text-sm font-medium text-white/80">{card.title}</p>
                </div>
                {card.trend && (
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={11} /> {card.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Attendance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Absensi Terbaru</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Lihat Semua →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Mahasiswa</th>
                  <th className="px-6 py-3 text-left">Waktu</th>
                  <th className="px-6 py-3 text-left">Mata Kuliah</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRecent.map((item) => {
                  const s = statusConfig[item.status] || statusConfig.alfa;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-slate-800">{item.nama}</div>
                        <div className="text-xs text-slate-400">{item.nim}</div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{item.waktu} WIB</td>
                      <td className="px-6 py-3.5 text-slate-600">{item.mataKuliah}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.class}`}>
                          {s.icon} {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warning List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-rose-100 bg-rose-50 flex items-center space-x-2">
            <AlertCircle className="text-rose-500" size={18} />
            <h2 className="font-bold text-rose-800">Perhatian Khusus</h2>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-500 px-1 pb-2 border-b border-slate-100">
              Mahasiswa mendekati / melebihi batas ketidakhadiran.
            </p>
            {mockWarnings.map((w) => (
              <div key={w.id} className="flex justify-between items-center p-3 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{w.nama}</p>
                  <p className="text-xs text-slate-500">{w.nim} · {w.kelas}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-rose-600 font-extrabold text-xl leading-none">{w.absenCount}×</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Alfa</p>
                </div>
              </div>
            ))}
            <button className="w-full mt-1 py-2.5 text-sm text-center font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-100">
              Lihat Detail & Surat Peringatan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
