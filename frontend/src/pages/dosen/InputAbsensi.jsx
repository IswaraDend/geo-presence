import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QrCode, MapPin, CheckCircle, Save, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function InputAbsensi() {
  const [searchParams] = useSearchParams();
  const initialJadwalId = searchParams.get('jadwal_id') || '';
  
  const [kelasList, setKelasList] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState(initialJadwalId);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMhs, setFetchingMhs] = useState(false);
  const [error, setError] = useState(null);
  
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [pertemuanKe, setPertemuanKe] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load kelas list
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await api.get('/dosen/kelas');
        setKelasList(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch kelas:', err);
        setError('Gagal memuat daftar kelas');
      }
    };
    fetchKelas();
  }, []);

  // Load students when jadwal selected
  useEffect(() => {
    if (!selectedJadwal) {
      setStudents([]);
      return;
    }

    const fetchMhs = async () => {
      setFetchingMhs(true);
      setSuccess(false);
      try {
        const res = await api.get(`/dosen/mahasiswa?jadwal_id=${selectedJadwal}`);
        const mhsData = (res.data.data || []).map(m => ({
          ...m,
          status: 'hadir' // default
        }));
        setStudents(mhsData);
      } catch (err) {
        console.error('Failed to fetch mahasiswa:', err);
        setError('Gagal memuat data mahasiswa');
      } finally {
        setFetchingMhs(false);
      }
    };
    fetchMhs();
  }, [selectedJadwal]);

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleSave = async () => {
    if (!selectedJadwal) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        jadwalId: selectedJadwal,
        tanggal: tanggal,
        pertemuanKe: parseInt(pertemuanKe),
        data: students.map(s => ({
          mahasiswaId: s.id,
          status: s.status,
          keterangan: ""
        }))
      };
      await api.post('/dosen/absensi', payload);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to save attendance:', err);
      setError('Gagal menyimpan absensi. Pastikan data terisi dengan benar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-1">Input Absensi Manual</h1>
        <p className="text-teal-100 text-sm">Pilih kelas lalu presensi secara manual atau pantau hasil absensi GPS/QR Code.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={20} />
          <p className="font-semibold">Absensi berhasil disimpan ke database!</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Kelas</label>
                <select
                  value={selectedJadwal}
                  onChange={e => setSelectedJadwal(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {kelasList.map(k => (
                    <option key={k.id} value={k.id}>{k.kelas} - {k.mataKuliah}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal</label>
                  <input 
                    type="date" 
                    value={tanggal}
                    onChange={e => setTanggal(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pertemuan</label>
                  <input 
                    type="number" 
                    min="1" max="16"
                    value={pertemuanKe}
                    onChange={e => setPertemuanKe(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
            </div>

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
          {fetchingMhs ? (
            <div className="bg-white rounded-2xl h-64 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-emerald-600 mb-2" size={32} />
              <p className="text-slate-500 font-medium">Memuat daftar mahasiswa...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-lg">Daftar Mahasiswa</h2>
                <div className="flex gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold uppercase">H: {students.filter(s=>s.status==='hadir').length}</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-bold uppercase">I/S: {students.filter(s=>s.status==='izin' || s.status==='sakit').length}</span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg font-bold uppercase">A: {students.filter(s=>s.status==='alfa').length}</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {students.map(s => (
                  <div key={s.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{s.nama}</h4>
                      <p className="text-xs font-mono text-slate-400">{s.nim}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {['hadir', 'izin', 'sakit', 'alfa'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(s.id, status)}
                          className={`px-3 py-1.5 text-[10px] uppercase tracking-tighter font-extrabold rounded-lg border transition-all duration-200 ${
                            s.status === status
                              ? status === 'hadir' ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-sm'
                              : status === 'alfa' ? 'bg-rose-500 text-white border-rose-600 scale-105 shadow-sm'
                              : 'bg-amber-500 text-white border-amber-600 scale-105 shadow-sm'
                              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
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
                <button 
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Simpan Presensi
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50/50 py-20">
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
