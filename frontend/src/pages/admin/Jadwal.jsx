import { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Pencil, Trash2, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const EMPTY_FORM = { kelas_id: '', mata_kuliah_id: '', dosen_id: '', hari: '', jam_mulai: '', jam_selesai: '', ruang: '', semester: '', tahun_ajar: '' };

export default function AdminJadwal() {
  const [list, setList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [mkList, setMkList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [jRes, kRes, mkRes, dRes] = await Promise.all([
        api.get('/admin/jadwal'),
        api.get('/admin/kelas'),
        api.get('/admin/matakuliah'),
        api.get('/admin/dosen'),
      ]);
      setList(jRes.data.data || []);
      setKelasList(kRes.data.data || []);
      setMkList(mkRes.data.data || []);
      setDosenList(dRes.data.data || []);
    } catch { setList([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal({ type: 'create' }); };
  const openEdit = (j) => {
    setForm({ kelas_id: j.kelas_id, mata_kuliah_id: j.mata_kuliah_id, dosen_id: j.dosen_id, hari: j.hari, jam_mulai: j.jam_mulai, jam_selesai: j.jam_selesai, ruang: j.ruang || '', semester: j.semester || '', tahun_ajar: j.tahun_ajar || '' });
    setError(''); setModal({ type: 'edit', data: j });
  };
  const openDelete = (j) => setModal({ type: 'delete', data: j });
  const closeModal = () => { setModal({ type: null }); setError(''); };

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/admin/jadwal', { ...form, semester: parseInt(form.semester) || 0 });
      fetchAll(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menambahkan jadwal'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.put(`/admin/jadwal/${modal.data.id}`, { ...form, semester: parseInt(form.semester) || 0 });
      fetchAll(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal memperbarui jadwal'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await api.delete(`/admin/jadwal/${modal.data.id}`); fetchAll(); closeModal(); }
    catch (err) { setError(err.response?.data?.message || 'Gagal menghapus jadwal'); }
    finally { setSaving(false); }
  };

  const filtered = list.filter(j =>
    (j.mata_kuliah?.nama_mk || '').toLowerCase().includes(search.toLowerCase()) ||
    (j.kelas?.nama_kelas || '').toLowerCase().includes(search.toLowerCase()) ||
    (j.hari || '').toLowerCase().includes(search.toLowerCase())
  );

  const hariColors = { Senin: 'bg-blue-100 text-blue-700', Selasa: 'bg-indigo-100 text-indigo-700', Rabu: 'bg-violet-100 text-violet-700', Kamis: 'bg-purple-100 text-purple-700', Jumat: 'bg-emerald-100 text-emerald-700', Sabtu: 'bg-orange-100 text-orange-700' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Calendar className="text-blue-600" size={26} /> Manajemen Jadwal Kuliah</h1>
          <p className="text-slate-500 text-sm mt-1">Total {list.length} jadwal terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
          <Plus size={18} /> Tambah Jadwal
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari mata kuliah / kelas / hari..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={fetchAll} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm font-medium">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Mata Kuliah</th>
                <th className="px-6 py-3 text-left">Kelas</th>
                <th className="px-6 py-3 text-left">Dosen</th>
                <th className="px-6 py-3 text-center">Hari</th>
                <th className="px-6 py-3 text-center">Waktu</th>
                <th className="px-6 py-3 text-center">Ruang</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="py-16 text-center text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="py-16 text-center text-slate-400">Tidak ada jadwal.</td></tr>
              ) : filtered.map(j => (
                <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{j.mata_kuliah?.nama_mk}</td>
                  <td className="px-6 py-3.5 text-slate-600">{j.kelas?.nama_kelas}</td>
                  <td className="px-6 py-3.5 text-slate-600">{j.dosen?.user?.nama}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${hariColors[j.hari] || 'bg-slate-100 text-slate-700'}`}>{j.hari}</span>
                  </td>
                  <td className="px-6 py-3.5 text-center text-slate-600 font-mono">{j.jam_mulai} – {j.jam_selesai}</td>
                  <td className="px-6 py-3.5 text-center text-slate-500">{j.ruang || '-'}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(j)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"><Pencil size={16} /></button>
                      <button onClick={() => openDelete(j)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal.type === 'create'} onClose={closeModal} title="Tambah Jadwal Kuliah" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
              <select required value={form.kelas_id} onChange={e => setForm(p => ({ ...p, kelas_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Kelas --</option>
                {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mata Kuliah</label>
              <select required value={form.mata_kuliah_id} onChange={e => setForm(p => ({ ...p, mata_kuliah_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih MK --</option>
                {mkList.map(mk => <option key={mk.id} value={mk.id}>{mk.nama_mk}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosen Pengampu</label>
              <select required value={form.dosen_id} onChange={e => setForm(p => ({ ...p, dosen_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Dosen --</option>
                {dosenList.map(d => <option key={d.id} value={d.id}>{d.user?.nama} ({d.nidn})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hari</label>
              <select required value={form.hari} onChange={e => setForm(p => ({ ...p, hari: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Hari --</option>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ruang</label>
              <input value={form.ruang} onChange={e => setForm(p => ({ ...p, ruang: e.target.value }))} placeholder="Lab 2 / R.101"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
              <input required type="time" value={form.jam_mulai} onChange={e => setForm(p => ({ ...p, jam_mulai: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
              <input required type="time" value={form.jam_selesai} onChange={e => setForm(p => ({ ...p, jam_selesai: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih --</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Ajar</label>
              <input value={form.tahun_ajar} onChange={e => setForm(p => ({ ...p, tahun_ajar: e.target.value }))} placeholder="2024/2025"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal.type === 'edit'} onClose={closeModal} title="Edit Jadwal Kuliah" size="lg">
        <form onSubmit={handleEdit} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
              <select required value={form.kelas_id} onChange={e => setForm(p => ({ ...p, kelas_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Kelas --</option>
                {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mata Kuliah</label>
              <select required value={form.mata_kuliah_id} onChange={e => setForm(p => ({ ...p, mata_kuliah_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih MK --</option>
                {mkList.map(mk => <option key={mk.id} value={mk.id}>{mk.nama_mk}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosen Pengampu</label>
              <select required value={form.dosen_id} onChange={e => setForm(p => ({ ...p, dosen_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Dosen --</option>
                {dosenList.map(d => <option key={d.id} value={d.id}>{d.user?.nama} ({d.nidn})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hari</label>
              <select required value={form.hari} onChange={e => setForm(p => ({ ...p, hari: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Hari --</option>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ruang</label>
              <input value={form.ruang} onChange={e => setForm(p => ({ ...p, ruang: e.target.value }))} placeholder="Lab 2 / R.101"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
              <input required type="time" value={form.jam_mulai} onChange={e => setForm(p => ({ ...p, jam_mulai: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
              <input required type="time" value={form.jam_selesai} onChange={e => setForm(p => ({ ...p, jam_selesai: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih --</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Ajar</label>
              <input value={form.tahun_ajar} onChange={e => setForm(p => ({ ...p, tahun_ajar: e.target.value }))} placeholder="2024/2025"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menyimpan...' : 'Perbarui'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal.type === 'delete'} onClose={closeModal} title="Konfirmasi Hapus" size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-rose-500" size={28} /></div>
          <p className="text-slate-700 mb-1 font-medium">Hapus jadwal ini?</p>
          <p className="text-slate-500 text-sm mb-6"><strong>{modal.data?.mata_kuliah?.nama_mk}</strong> — {modal.data?.hari} {modal.data?.jam_mulai}</p>
          {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
          <div className="flex gap-3 w-full">
            <button onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menghapus...' : 'Ya, Hapus'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
