import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function Riwayat() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
        setError('Gagal memuat riwayat absensi');
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
          <p className="text-slate-500 text-sm font-medium">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  const history = data?.history || [];
  const filtered = filter === 'Semua' 
    ? history 
    : history.filter(r => r.status_absensi.toLowerCase() === filter.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Absensi</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau seluruh catatan kehadiran Anda.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
          {['Semua', 'Hadir', 'Izin', 'Sakit', 'Alfa'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                filter === f ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wide">
                <th className="px-6 py-4 text-left">Mata Kuliah</th>
                <th className="px-6 py-4 text-left">Tanggal</th>
                <th className="px-6 py-4 text-left">Pertemuan</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{r.jadwal?.mata_kuliah?.nama_mk}</td>
                  <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    {new Date(r.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-slate-600">Ke-{r.pertemuan_ke}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                        r.status_absensi === 'hadir' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        r.status_absensi === 'alfa' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                        'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {r.status_absensi === 'hadir' && <CheckCircle size={12} />}
                        {(r.status_absensi === 'izin' || r.status_absensi === 'sakit') && <AlertCircle size={12} />}
                        {r.status_absensi === 'alfa' && <XCircle size={12} />}
                        {r.status_absensi}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    Tidak ada data riwayat absensi untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
