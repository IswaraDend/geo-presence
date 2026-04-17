import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';

const mockRiwayat = [
  { id: 1, mk: 'Pemrograman Web', tanggal: '2026-04-15', status: 'Hadir', waktu: '08:15', pertemuan: 7 },
  { id: 2, mk: 'Basis Data Lanjut', tanggal: '2026-04-14', status: 'Hadir', waktu: '13:05', pertemuan: 6 },
  { id: 3, mk: 'Kecerdasan Buatan', tanggal: '2026-04-13', status: 'Alfa', waktu: '-', pertemuan: 6 },
  { id: 4, mk: 'Jaringan Komputer', tanggal: '2026-04-12', status: 'Izin', waktu: '-', pertemuan: 5 },
  { id: 5, mk: 'Pemrograman Web', tanggal: '2026-04-08', status: 'Hadir', waktu: '08:10', pertemuan: 6 },
];

export default function Riwayat() {
  const [filter, setFilter] = useState('Semua');

  const filtered = filter === 'Semua' ? mockRiwayat : mockRiwayat.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Absensi</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau seluruh catatan kehadiran Anda.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
          {['Semua', 'Hadir', 'Izin', 'Alfa'].map(f => (
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
                <th className="px-6 py-4 text-left">Waktu Absen</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{r.mk}</td>
                  <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    {new Date(r.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-slate-600">Ke-{r.pertemuan}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{r.waktu}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        r.status === 'Hadir' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        r.status === 'Izin' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        {r.status === 'Hadir' && <CheckCircle size={12} />}
                        {r.status === 'Izin' && <AlertCircle size={12} />}
                        {r.status === 'Alfa' && <XCircle size={12} />}
                        {r.status}
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
