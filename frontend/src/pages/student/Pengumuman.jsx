import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function Pengumuman() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
        setError('Gagal memuat pengumuman');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const announcements = data?.announcements || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-blue-600" /> Pengumuman
          </h1>
          <p className="text-slate-500 text-sm mt-1">Informasi terbaru seputar akademik dan kampus.</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? announcements.map(p => (
          <div key={p.id} className="p-6 rounded-2xl border flex gap-4 transition-shadow hover:shadow-md bg-white border-slate-100 shadow-sm">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Info size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {p.judul}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {new Date(p.tanggal_publish).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold border bg-slate-100 text-slate-600 border-slate-200">
                  {p.target_role === 'all' ? 'Umum' : 'Akademik'}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{p.isi}</p>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
             <Bell size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-medium">Belum ada pengumuman untuk Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
