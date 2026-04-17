import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, BookOpen, Calendar, MapPin, TrendingUp, AlertCircle, Plus, CheckSquare, XSquare, Clock } from 'lucide-react';
import api from '../../api/axios';

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
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <AlertCircle size={48} className="text-rose-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Gagal Memuat Data</h2>
        <p className="text-slate-500 text-center mt-2 max-w-sm">
          Terjadi kesalahan saat mengambil data dari server. Pastikan API backend berjalan dengan benar.
        </p>
        <button onClick={() => window.location.reload()} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Coba Lagi
        </button>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const statCards = [
    { title: 'Total Mahasiswa', value: stats.totalStudents, icon: Users, gradient: 'from-blue-600 to-blue-800' },
    { title: 'Mata Kuliah Aktif', value: stats.totalCourses, icon: BookOpen, gradient: 'from-emerald-600 to-emerald-800' },
    { title: 'Jadwal Kelas', value: stats.totalSchedules, icon: Calendar, gradient: 'from-violet-600 to-violet-800' },
    { title: 'Kehadiran Hari Ini', value: `${Math.round(stats.attendanceToday)}%`, icon: MapPin, gradient: 'from-amber-500 to-orange-600' },
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
          <div className="flex items-center gap-2">
             <div className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
               Server Online
             </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`relative bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white overflow-hidden shadow-sm hover:scale-[1.02] transition-transform duration-300`}>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                {Icon && <Icon size={90} />}
              </div>
              <div className="relative z-10">
                <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  {Icon && <Icon size={22} />}
                </div>
                <div>
                  <p className="text-4xl font-extrabold mb-1">{card.value}</p>
                  <p className="text-sm font-medium text-white/80">{card.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Absensi Terbaru</h2>
            <p className="text-xs text-slate-400">Data waktu nyata</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Mahasiswa</th>
                  <th className="px-6 py-3 text-left">Waktu Absen</th>
                  <th className="px-6 py-3 text-left">Mata Kuliah</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(!stats.recentAttendance || stats.recentAttendance.length === 0) ? (
                  <tr><td colSpan="4" className="py-12 text-center text-slate-400">Belum ada absensi hari ini.</td></tr>
                ) : stats.recentAttendance.map((item) => {
                  const s = statusConfig[item.status] || statusConfig.alfa;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-slate-800">{item.nama}</div>
                        <div className="text-xs text-slate-400">{item.nim}</div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">{item.waktu}</td>
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
              Mahasiswa dengan ketidakhadiran (Alfa) ≥ 3 kali.
            </p>
            {(!stats.warnings || stats.warnings.length === 0) ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400 italic">Tidak ada mahasiswa yang perlu diperingatkan.</p>
              </div>
            ) : stats.warnings.map((w) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
