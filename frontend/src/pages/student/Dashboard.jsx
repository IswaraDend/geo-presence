import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertTriangle, X, Calendar, Clock, BookOpen, CheckCircle2, XCircle, AlertCircle, Timer } from 'lucide-react';
import api from '../../api/axios';

const statusConfig = {
  hadir:  { label: 'Hadir',  class: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  izin:   { label: 'Izin',   class: 'bg-amber-100 text-amber-700 border-amber-200',    dot: 'bg-amber-500' },
  sakit:  { label: 'Sakit',  class: 'bg-blue-100 text-blue-700 border-blue-200',      dot: 'bg-blue-500' },
  alfa:   { label: 'Alfa',   class: 'bg-rose-100 text-rose-700 border-rose-200',      dot: 'bg-rose-500' },
};

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setData(res.data.data);
        if (res.data.data.has_warning) setShowWarning(true);
      } catch (err) {
        console.error(err);
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
          <p className="text-slate-500 text-sm font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle size={48} className="text-rose-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Gagal memuat data dashboard.</p>
        </div>
      </div>
    );
  }

  const k = data.kehadiran;
  const percentage = Math.round(k?.persentase ?? 0);
  const isKritis = percentage < 75;

  return (
    <div className="space-y-6 relative">

      {/* Modal Peringatan */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowWarning(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={36} className="text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-rose-600 mb-2">Peringatan Kehadiran!</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Persentase kehadiran Anda{' '}
                <span className="text-rose-600 font-bold">{percentage}%</span> berada di bawah batas minimum.
                Segera perbaiki agar dapat mengikuti Ujian Akhir Semester.
              </p>
              <button
                onClick={() => setShowWarning(false)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className={`rounded-2xl p-6 text-white shadow-lg ${isKritis ? 'bg-gradient-to-r from-rose-600 to-orange-600' : 'bg-gradient-to-r from-blue-700 to-blue-600'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-medium mb-1 ${isKritis ? 'text-rose-200' : 'text-blue-200'}`}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl font-bold">
              {data.mahasiswa?.user?.nama || 'Selamat Datang'} 👋
            </h1>
            <p className={`text-sm mt-1 ${isKritis ? 'text-rose-100' : 'text-blue-100'}`}>
              {isKritis ? '⚠️ Kehadiran Anda di bawah batas minimum 75%' : 'Pantau kehadiran Anda di sini'}
            </p>
          </div>
          <div className={`rounded-xl px-5 py-3 text-center bg-white/15 shrink-0`}>
            <p className="text-3xl font-extrabold">{percentage}%</p>
            <p className="text-xs font-medium opacity-80 mt-0.5">Kehadiran</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Pertemuan', value: k?.total_pertemuan ?? 0, color: 'text-slate-700', bg: 'bg-white', border: 'border-slate-200' },
          { label: 'Hadir', value: k?.hadir_count ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Izin / Sakit', value: (k?.izin_count ?? 0) + (k?.sakit_count ?? 0), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Alfa', value: k?.alfa_count ?? 0, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm`}>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Donut Chart Kehadiran */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center">
          <h3 className="w-full text-left font-bold text-slate-800 mb-5 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-blue-500" /> Ringkasan Kehadiran
          </h3>
          <div className="w-44 h-44 mb-6">
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                pathColor: isKritis ? '#e11d48' : '#2563eb',
                textColor: '#1e293b',
                trailColor: '#f1f5f9',
                textSize: '20px',
              })}
            />
          </div>
          <div className="w-full space-y-2">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-slate-600 capitalize">{cfg.label}</span>
                </div>
                <span className="font-bold text-slate-800">
                  {k?.[`${key}_count`] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal hari ini + riwayat */}
        <div className="lg:col-span-2 space-y-5">

          {/* Jadwal hari ini */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              <h3 className="font-bold text-slate-800">Jadwal Kuliah Hari Ini</h3>
            </div>
            {data.today_schedules && data.today_schedules.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.today_schedules.map((sched, idx) => (
                  <div key={idx} className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-center shrink-0 w-24">
                      <p className="text-sm font-bold text-blue-700">{sched.jam_mulai}</p>
                      <p className="text-xs text-slate-400">{sched.jam_selesai}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {sched.mata_kuliah?.nama_mk || sched.course?.name || 'Mata Kuliah'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {sched.dosen?.user?.nama || 'Dosen'} · Ruang {sched.ruang || '—'}
                      </p>
                    </div>
                    <span className="shrink-0 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                      {sched.hari}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Clock size={36} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">Tidak ada jadwal kuliah hari ini</p>
              </div>
            )}
          </div>

          {/* Riwayat Absensi */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-500" />
                <h3 className="font-bold text-slate-800">Riwayat Absensi Terkini</h3>
              </div>
              <a href="/student/riwayat" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Lihat Semua →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Mata Kuliah</th>
                    <th className="px-6 py-3 text-left">Tanggal</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recent_history && data.recent_history.length > 0 ? (
                    data.recent_history.slice(0, 5).map((h, idx) => {
                      const s = statusConfig[h.status_absensi] || statusConfig[h.status] || statusConfig.alfa;
                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3.5 font-medium text-slate-800">
                            {h.jadwal?.mata_kuliah?.nama_mk || h.course?.name || '—'}
                          </td>
                          <td className="px-6 py-3.5 text-slate-500">
                            {new Date(h.tanggal || h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.class}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-slate-400">
                        <AlertCircle size={28} className="mx-auto mb-2 opacity-40" />
                        Belum ada riwayat absensi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
