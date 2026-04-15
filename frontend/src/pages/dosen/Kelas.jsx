import React from 'react';
import { Users, BookOpen, Clock, ChevronRight } from 'lucide-react';

const mockKelas = [
  { id: 1, nama: 'TI-3A', mk: 'Pemrograman Web', mhs: 32, pertemuan: 7, jadwal: 'Senin, 08:00 - 10:30' },
  { id: 2, nama: 'TI-4B', mk: 'Basis Data Lanjut', mhs: 28, pertemuan: 6, jadwal: 'Selasa, 13:00 - 15:30' },
  { id: 3, nama: 'TI-2C', mk: 'Algoritma & Pemrograman', mhs: 35, pertemuan: 7, jadwal: 'Rabu, 09:00 - 11:30' },
];

export default function Kelas() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Kelas Saya</h1>
          <p className="text-slate-500 mt-1">Kelola kelas dan mahasiswa yang Anda ajar semester ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockKelas.map(k => (
          <div key={k.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors duration-500" />
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <BookOpen className="text-emerald-600" size={24} />
              </div>
              <span className="font-extrabold text-2xl text-slate-800">{k.nama}</span>
            </div>
            <div className="relative z-10 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{k.mk}</h3>
              <div className="flex items-center text-sm text-slate-500 gap-1.5 mb-1">
                <Clock size={14} className="text-emerald-500" /> {k.jadwal}
              </div>
              <div className="flex items-center text-sm text-slate-500 gap-1.5">
                <Users size={14} className="text-emerald-500" /> {k.mhs} Mahasiswa · {k.pertemuan}/14 Pertemuan
              </div>
            </div>
            <div className="relative z-10 border-t border-slate-100 pt-4 mt-auto">
              <button className="w-full flex items-center justify-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors">
                Lihat Mahasiswa <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
