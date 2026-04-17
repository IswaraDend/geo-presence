import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function Jadwal() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch schedules:', err);
        setError('Gagal memuat jadwal kuliah');
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
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Memuat jadwal kuliah...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <AlertCircle size={48} className="text-rose-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Gagal Memuat Jadwal</h2>
        <p className="text-slate-500 text-center mt-2 max-w-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold">Coba Lagi</button>
      </div>
    );
  }

  const hariIni = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());
  const allSchedules = data.all_schedules || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Calendar size={120} />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 relative z-10">Jadwal Kuliah</h1>
        <p className="text-blue-100 relative z-10">Lihat jadwal perkuliahan Anda untuk semester ini.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(hari => {
          const jadwalHariIni = allSchedules.filter(j => j.hari === hari);
          if (jadwalHariIni.length === 0) return null;

          return (
            <div key={hari} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className={`px-6 py-4 flex items-center justify-between border-b ${hari === hariIni ? 'bg-blue-50 border-blue-100' : 'border-slate-100'}`}>
                <h2 className={`text-lg font-bold ${hari === hariIni ? 'text-blue-700' : 'text-slate-800'}`}>{hari}</h2>
                {hari === hariIni && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Hari Ini</span>
                )}
              </div>
              <div className="divide-y divide-slate-100">
                {jadwalHariIni.map(j => (
                  <div key={j.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-slate-50 transition-colors">
                    <div className="bg-slate-100/50 border border-slate-200 rounded-xl px-5 py-4 flex flex-col items-center justify-center min-w-[120px]">
                      <span className="text-lg font-extrabold text-slate-800">{j.jam_mulai}</span>
                      <span className="text-xs font-semibold text-slate-400 mt-1">s/d {j.jam_selesai}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-slate-800">{j.mata_kuliah?.nama_mk}</h3>
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                          <User size={14} className="text-blue-500"/> {j.dosen?.user?.nama}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                          <MapPin size={14} className="text-rose-500"/> Ruang {j.ruang}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
