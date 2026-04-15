import React, { useState } from 'react';
import { QrCode, MapPin, CheckCircle, Save } from 'lucide-react';

const mockStudents = [
  { id: 1, nim: '2023001', nama: 'Budi Santoso', status: 'Hadir' },
  { id: 2, nim: '2023002', nama: 'Sari Dewi', status: 'Hadir' },
  { id: 3, nim: '2023003', nama: 'Agus Pratama', status: 'Alfa' },
  { id: 4, nim: '2023004', nama: 'Dina Lestari', status: 'Izin' },
];

export default function InputAbsensi() {
  const [selectedKelas, setSelectedKelas] = useState('');
  const [students, setStudents] = useState(mockStudents);

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-1">Input Absensi Manual</h1>
        <p className="text-teal-100 text-sm">Pilih kelas lalu presensi secara manual atau pantau hasil absensi GPS/QR Code.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Kelas</label>
            <select
              value={selectedKelas}
              onChange={e => setSelectedKelas(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="">-- Pilih Kelas Aktif --</option>
              <option value="ti3a">TI-3A - Pemrograman Web</option>
              <option value="ti4b">TI-4B - Basis Data Lanjut</option>
            </select>

            <div className="mt-8 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors">
                <QrCode size={18} /> Tampilkan QR Code
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold py-3 rounded-xl transition-colors">
                <MapPin size={18} /> Kunci Lokasi GPS
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          {selectedKelas ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-lg">Daftar Mahasiswa</h2>
                <div className="flex gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold">H: {students.filter(s=>s.status==='Hadir').length}</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-bold">I/S: {students.filter(s=>s.status==='Izin' || s.status==='Sakit').length}</span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg font-bold">A: {students.filter(s=>s.status==='Alfa').length}</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {students.map(s => (
                  <div key={s.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800">{s.nama}</h4>
                      <p className="text-sm font-mono text-slate-500">{s.nim}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {['Hadir', 'Izin', 'Sakit', 'Alfa'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(s.id, status)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                            s.status === status
                              ? status === 'Hadir' ? 'bg-emerald-500 text-white border-emerald-600'
                              : status === 'Alfa' ? 'bg-rose-500 text-white border-rose-600'
                              : 'bg-amber-500 text-white border-amber-600'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                  <Save size={18} /> Simpan Presensi
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50/50">
              <div className="text-center text-slate-400 p-8">
                <CheckCircle size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-lg text-slate-500">Pilih kelas terlebih dahulu</p>
                <p className="text-sm mt-1">Data mahasiswa akan muncul di sini</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
