import React from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';

const mockJadwal = [
  { id: 1, hari: 'Senin', mk: 'Pemrograman Web', dosen: 'Dr. Budi Santoso', ruang: 'Lab Komputer 1', mulai: '08:00', selesai: '10:30', status: 'Selesai' },
  { id: 2, hari: 'Senin', mk: 'Basis Data Lanjut', dosen: 'Sari Dewi, M.Kom', ruang: 'Ruang 302', mulai: '13:00', selesai: '15:30', status: 'Berlangsung' },
  { id: 3, hari: 'Selasa', mk: 'Kecerdasan Buatan', dosen: 'Dr. Andi', ruang: 'Lab Komputer 2', mulai: '09:00', selesai: '11:00', status: 'Belum Mulai' },
  { id: 4, hari: 'Rabu', mk: 'Jaringan Komputer', dosen: 'Bpk. Ahmad', ruang: 'Ruang 105', mulai: '10:00', selesai: '12:30', status: 'Belum Mulai' },
];

export default function Jadwal() {
  const hariIni = 'Senin'; // Mock current day

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
        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(hari => {
          const jadwalHariIni = mockJadwal.filter(j => j.hari === hari);
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
                      <span className="text-lg font-extrabold text-slate-800">{j.mulai}</span>
                      <span className="text-xs font-semibold text-slate-400 mt-1">s/d {j.selesai}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-slate-800">{j.mk}</h3>
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-1.5"><User size={16} className="text-blue-500"/> {j.dosen}</div>
                        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-rose-500"/> {j.ruang}</div>
                      </div>
                    </div>
                    <div className="w-full md:w-auto flex items-center justify-end">
                      <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                        j.status === 'Berlangsung' ? 'bg-emerald-100 text-emerald-700' : 
                        j.status === 'Selesai' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {j.status === 'Berlangsung' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                        {j.status}
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
