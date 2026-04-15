import React from 'react';
import { Bell, Info, AlertTriangle } from 'lucide-react';

const mockPengumuman = [
  { id: 1, type: 'warning', title: 'Peringatan Kehadiran', date: '15 April 2026', desc: 'Sistem mendeteksi Anda telah tidak hadir lebih dari 3 kali pada mata kuliah Pemrograman Web. Segera hubungi Dosen bersangkutan.', tag: 'Akademik' },
  { id: 2, type: 'info', title: 'Libur Nasional', date: '10 April 2026', desc: 'Diberitahukan kepada seluruh mahasiswa bahwa pada tanggal 12 April 2026, perkuliahan diliburkan dalam rangka hari raya nasional.', tag: 'Umum' },
  { id: 3, type: 'info', title: 'Jadwal KRS Terbuka', date: '01 April 2026', desc: 'Masa pengisian Kartu Rencana Studi (KRS) untuk semester pendek telah dibuka. Silakan mengisi sebelum kuota penuh.', tag: 'Administrasi' },
];

export default function Pengumuman() {
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
        {mockPengumuman.map(p => (
          <div key={p.id} className={`p-6 rounded-2xl border flex gap-4 transition-shadow hover:shadow-md ${
            p.type === 'warning' ? 'bg-rose-50 border-rose-200/60' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="shrink-0 mt-1">
              {p.type === 'warning' ? (
                <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-rose-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info size={20} className="text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className={`text-lg font-bold ${p.type === 'warning' ? 'text-rose-800' : 'text-slate-800'}`}>
                    {p.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">{p.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  p.type === 'warning' ? 'bg-rose-100/50 text-rose-600 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {p.tag}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${p.type === 'warning' ? 'text-rose-700/80' : 'text-slate-600'}`}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
