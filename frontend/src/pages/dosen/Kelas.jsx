import { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export default function Kelas() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dosen/kelas');
        setList(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch dosen classes:', err);
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
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Memuat daftar kelas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <AlertCircle size={48} className="text-rose-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Gagal Memuat Kelas</h2>
        <p className="text-slate-500 text-center mt-2 max-w-sm">Terdapat kendala saat mengambil data kelas Anda.</p>
        <button onClick={() => window.location.reload()} className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Kelas Saya</h1>
          <p className="text-slate-500 mt-1">Kelola kelas dan mahasiswa yang Anda ajar semester ini.</p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Anda belum mengampu kelas mana pun semester ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(k => (
            <div key={k.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors duration-500" />
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <BookOpen className="text-emerald-600" size={24} />
                </div>
                <span className="font-extrabold text-2xl text-slate-800">{k.kelas}</span>
              </div>
              <div className="relative z-10 mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1">{k.mataKuliah}</h3>
                <div className="flex items-center text-sm text-slate-500 gap-1.5 mb-1">
                  <Clock size={14} className="text-emerald-500" /> Rata-rata Kehadiran: {k.rataKehadiran}%
                </div>
                <div className="flex items-center text-sm text-slate-500 gap-1.5">
                  <Users size={14} className="text-emerald-500" /> {k.totalMhs} Mahasiswa Terdaftar
                </div>
              </div>
              <div className="relative z-10 border-t border-slate-100 pt-4 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors text-sm">
                  Kelola Absensi <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
