import { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Plus, Pencil, Trash2, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const EMPTY_FORM = { nama_kelas: '', jurusan: '', angkatan: '', semester: '' };

export default function AdminKelas() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/kelas');
      setList(res.data.data || []);
    } catch { setList([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal({ type: 'create' }); };
  const openEdit = (k) => { setForm({ nama_kelas: k.nama_kelas, jurusan: k.jurusan, angkatan: k.angkatan, semester: k.semester }); setError(''); setModal({ type: 'edit', data: k }); };
  const openDelete = (k) => setModal({ type: 'delete', data: k });
  const closeModal = () => { setModal({ type: null }); setError(''); };

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/admin/kelas', { ...form, angkatan: parseInt(form.angkatan), semester: parseInt(form.semester) });
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menambahkan kelas'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.put(`/admin/kelas/${modal.data.id}`, { ...form, angkatan: parseInt(form.angkatan), semester: parseInt(form.semester) });
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal memperbarui kelas'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/admin/kelas/${modal.data.id}`);
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menghapus kelas'); }
    finally { setSaving(false); }
  };

  const filtered = list.filter(k =>
    k.nama_kelas?.toLowerCase().includes(search.toLowerCase()) ||
    k.jurusan?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid className="text-blue-600" size={26} /> Manajemen Kelas
          </h1>
          <p className="text-slate-500 text-sm mt-1">Total {list.length} kelas terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
          <Plus size={18} /> Tambah Kelas
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari berdasarkan nama kelas / jurusan..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm font-medium">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Nama Kelas</th>
                <th className="px-6 py-3 text-left">Jurusan</th>
                <th className="px-6 py-3 text-center">Angkatan</th>
                <th className="px-6 py-3 text-center">Semester</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="py-16 text-center text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="py-16 text-center text-slate-400">Tidak ada data kelas.</td></tr>
              ) : filtered.map(k => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{k.nama_kelas}</td>
                  <td className="px-6 py-3.5 text-slate-600">{k.jurusan}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">{k.angkatan}</span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Semester {k.semester}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(k)} title="Edit Kelas" className="p-2 rounded-lg text-amber-600 hover:bg-amber-50">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => openDelete(k)} title="Hapus Kelas" className="p-2 rounded-lg text-rose-600 hover:bg-rose-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal.type === 'create'} onClose={closeModal} title="Tambah Kelas">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kelas</label>
            <input required value={form.nama_kelas} onChange={e => setForm(p => ({ ...p, nama_kelas: e.target.value }))}
              placeholder="e.g. TI-3A" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jurusan</label>
            <input required value={form.jurusan} onChange={e => setForm(p => ({ ...p, jurusan: e.target.value }))}
              placeholder="e.g. Teknik Informatika" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Angkatan</label>
              <input required type="number" min="2000" max="2100" value={form.angkatan} onChange={e => setForm(p => ({ ...p, angkatan: e.target.value }))}
                placeholder="2023" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <select required value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih --</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal.type === 'edit'} onClose={closeModal} title="Edit Kelas">
        <form onSubmit={handleEdit} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kelas</label>
            <input required value={form.nama_kelas} onChange={e => setForm(p => ({ ...p, nama_kelas: e.target.value }))}
              placeholder="e.g. TI-3A" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jurusan</label>
            <input required value={form.jurusan} onChange={e => setForm(p => ({ ...p, jurusan: e.target.value }))}
              placeholder="e.g. Teknik Informatika" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Angkatan</label>
              <input required type="number" min="2000" max="2100" value={form.angkatan} onChange={e => setForm(p => ({ ...p, angkatan: e.target.value }))}
                placeholder="2023" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <select required value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih --</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
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
          <p className="text-slate-700 mb-1 font-medium">Hapus kelas ini?</p>
          <p className="text-slate-500 text-sm mb-6"><strong>{modal.data?.nama_kelas}</strong></p>
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
