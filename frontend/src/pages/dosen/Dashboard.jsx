import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen, Users, ClipboardList, Calendar,
  TrendingUp, CheckCircle, AlertCircle, Clock
} from 'lucide-react';

// Mock data — ganti dengan API call ke /dosen/dashboard
const mockData = {
  jadwalHariIni: [
    { id: 1, mataKuliah: 'Pemrograman Web', kelas: 'TI-3A', ruang: 'Lab 2', jamMulai: '08:00', jamSelesai: '09:40' },
    { id: 2, mataKuliah: 'Basis Data Lanjut', kelas: 'TI-4B', ruang: 'R.101', jamMulai: '13:00', jamSelesai: '14:40' },
  ],
  statsKelas: [
    { id: 1, kelas: 'TI-3A', mataKuliah: 'Pemrograman Web', totalMhs: 32, rataKehadiran: 87 },
    { id: 2, kelas: 'TI-4B', mataKuliah: 'Basis Data Lanjut', totalMhs: 28, rataKehadiran: 78 },
    { id: 3, kelas: 'TI-2C', mataKuliah: 'Algoritma & Pemrograman', totalMhs: 35, rataKehadiran: 91 },
  ],
  perigatanMhs: [
    { id: 1, nama: 'Budi Santoso', nim: '2023011', kelas: 'TI-3A', kehadiran: 58 },
    { id: 2, nama: 'Sari Dewi', nim: '2023045', kelas: 'TI-4B', kehadiran: 65 },
  ],
};

const StatCard = ({ title, value, sub, icon, gradient }) => (
  <div className={`relative rounded-2xl p-6 overflow-hidden text-white ${gradient}`}>
    <div className="absolute -right-4 -bottom-4 opacity-10">
      {React.cloneElement(icon, { size: 100 })}
    </div>
    <div className="relative z-10">
      <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-4xl font-extrabold mb-1">{value}</p>
      <p className="font-semibold text-white/90">{title}</p>
      {sub && <p className="text-xs text-white/70 mt-1">{sub}</p>}
    </div>
  </div>
);

export default function DosenDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // TODO: ganti dengan real API call: api.get('/dosen/dashboard')
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Memuat dashboard dosen...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dosenName = user?.nama || user?.name || 'Dosen';

  return (
    <div className="space-y-8">

      {/* Header greeting */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-emerald-200 text-sm font-medium mb-1">{today}</p>
            <h1 className="text-2xl md:text-3xl font-bold">Selamat Datang, {dosenName}! 👋</h1>
            <p className="text-emerald-100 mt-1 text-sm">Anda memiliki {data.jadwalHariIni.length} kelas hari ini.</p>
          </div>
          <div className="bg-white/15 rounded-xl px-5 py-3 text-center shrink-0">
            <p className="text-3xl font-extrabold">{data.statsKelas.length}</p>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">Kelas Aktif</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Kelas"
          value={data.statsKelas.length}
          sub="Semester ini"
          icon={<Users size={24} />}
          gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
        />
        <StatCard
          title="Total Mahasiswa"
          value={data.statsKelas.reduce((a, k) => a + k.totalMhs, 0)}
          sub="Seluruh kelas"
          icon={<TrendingUp size={24} />}
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
        />
        <StatCard
          title="Rata Kehadiran"
          value={`${Math.round(data.statsKelas.reduce((a, k) => a + k.rataKehadiran, 0) / data.statsKelas.length)}%`}
          sub="Semua kelas"
          icon={<CheckCircle size={24} />}
          gradient="bg-gradient-to-br from-violet-600 to-violet-800"
        />
        <StatCard
          title="Perlu Perhatian"
          value={data.perigatanMhs.length}
          sub="Kehadiran < 75%"
          icon={<AlertCircle size={24} />}
          gradient="bg-gradient-to-br from-rose-600 to-rose-800"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Jadwal hari ini */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Calendar className="text-emerald-600" size={18} />
            </div>
            <h2 className="font-bold text-slate-800">Jadwal Mengajar Hari Ini</h2>
          </div>

          {data.jadwalHariIni.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.jadwalHariIni.map((j) => (
                <div key={j.id} className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-center shrink-0 w-24">
                    <p className="text-sm font-bold text-emerald-700">{j.jamMulai}</p>
                    <p className="text-xs text-slate-400">{j.jamSelesai}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{j.mataKuliah}</p>
                    <p className="text-sm text-slate-500">{j.kelas} · Ruang {j.ruang}</p>
                  </div>
                  <button className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                    Input Absensi
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Clock size={40} className="mb-3 opacity-40" />
              <p className="font-medium">Tidak ada jadwal mengajar hari ini</p>
            </div>
          )}
        </div>

        {/* Peringatan kehadiran */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-rose-100 bg-rose-50 flex items-center space-x-3">
            <AlertCircle className="text-rose-500" size={18} />
            <h2 className="font-bold text-rose-800">Mahasiswa Perlu Perhatian</h2>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-500 px-2 pb-1">Kehadiran di bawah batas 75%</p>
            {data.perigatanMhs.length > 0 ? data.perigatanMhs.map(m => (
              <div key={m.id} className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{m.nama}</p>
                  <p className="text-xs text-slate-500">{m.nim} · {m.kelas}</p>
                </div>
                <div className="text-right">
                  <p className="text-rose-600 font-extrabold text-lg leading-none">{m.kehadiran}%</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Hadir</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <CheckCircle size={32} className="mb-2 text-emerald-400" />
                <p className="text-sm font-medium text-slate-500">Semua mahasiswa aman</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel kelas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BookOpen className="text-blue-600" size={18} />
          </div>
          <h2 className="font-bold text-slate-800">Ringkasan Semua Kelas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Kelas</th>
                <th className="px-6 py-3 text-left">Mata Kuliah</th>
                <th className="px-6 py-3 text-center">Mahasiswa</th>
                <th className="px-6 py-3 text-center">Rata-rata Kehadiran</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.statsKelas.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{k.kelas}</td>
                  <td className="px-6 py-4 text-slate-600">{k.mataKuliah}</td>
                  <td className="px-6 py-4 text-center font-semibold">{k.totalMhs}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      k.rataKehadiran >= 80 ? 'bg-emerald-100 text-emerald-700' :
                      k.rataKehadiran >= 70 ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {k.rataKehadiran}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs hover:underline">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
