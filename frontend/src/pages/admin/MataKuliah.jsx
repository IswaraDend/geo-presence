import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const EMPTY_FORM = { kode_mk: '', nama_mk: '', sks: '', semester: '' };

export default function AdminMataKuliah() {
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
      const res = await api.get('/admin/matakuliah');
      setList(res.data.data || []);
    } catch { setList([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal({ type: 'create' }); };
  const openEdit = (mk) => { setForm({ kode_mk: mk.kode_mk, nama_mk: mk.nama_mk, sks: mk.sks, semester: mk.semester }); setError(''); setModal({ type: 'edit', data: mk }); };
  const openDelete = (mk) => setModal({ type: 'delete', data: mk });
  const closeModal = () => { setModal({ type: null }); setError(''); };

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/admin/matakuliah', { ...form, sks: parseInt(form.sks), semester: parseInt(form.semester) });
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menambahkan mata kuliah'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.put(`/admin/matakuliah/${modal.data.id}`, { ...form, sks: parseInt(form.sks), semester: parseInt(form.semester) });
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal memperbarui'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/admin/matakuliah/${modal.data.id}`);
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menghapus'); }
    finally { setSaving(false); }
  };

  const filtered = list.filter(mk =>
    mk.nama_mk?.toLowerCase().includes(search.toLowerCase()) ||
    mk.kode_mk?.toLowerCase().includes(search.toLowerCase())
  );

  const semesterColors = ['', 'bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700', 'bg-violet-100 text-violet-700', 'bg-purple-100 text-purple-700', 'bg-pink-100 text-pink-700', 'bg-rose-100 text-rose-700', 'bg-orange-100 text-orange-700', 'bg-amber-100 text-amber-700'];

  const FormFields = () => (
    <>
      {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kode Mata Kuliah</label>
        <input required value={form.kode_mk} onChange={e => setForm(p => ({ ...p, kode_mk: e.target.value }))}
          placeholder="MK001" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Mata Kuliah</label>
        <input required value={form.nama_mk} onChange={e => setForm(p => ({ ...p, nama_mk: e.target.value }))}
          placeholder="Pemrograman Web" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SKS</label>
          <input required type="number" min="1" max="6" value={form.sks} onChange={e => setForm(p => ({ ...p, sks: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={26} /> Manajemen Mata Kuliah
          </h1>
          <p className="text-slate-500 text-sm mt-1">Total {list.length} mata kuliah terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
          <Plus size={18} /> Tambah Mata Kuliah
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / kode MK..."
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
                <th className="px-6 py-3 text-left">Kode MK</th>
                <th className="px-6 py-3 text-left">Nama Mata Kuliah</th>
                <th className="px-6 py-3 text-center">SKS</th>
                <th className="px-6 py-3 text-center">Semester</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="py-16 text-center text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="py-16 text-center text-slate-400">Tidak ada mata kuliah.</td></tr>
              ) : filtered.map(mk => (
                <tr key={mk.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-mono font-semibold text-blue-700">{mk.kode_mk}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-800">{mk.nama_mk}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">{mk.sks} SKS</span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${semesterColors[mk.semester] || 'bg-slate-100 text-slate-700'}`}>
                      Sem. {mk.semester}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(mk)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"><Pencil size={16} /></button>
                      <button onClick={() => openDelete(mk)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal.type === 'create'} onClose={closeModal} title="Tambah Mata Kuliah">
        <form onSubmit={handleCreate} className="space-y-4"><FormFields />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal.type === 'edit'} onClose={closeModal} title="Edit Mata Kuliah">
        <form onSubmit={handleEdit} className="space-y-4"><FormFields />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menyimpan...' : 'Perbarui'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={modal.type === 'delete'} onClose={closeModal} title="Konfirmasi Hapus" size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-rose-500" size={28} /></div>
          <p className="text-slate-700 mb-1 font-medium">Hapus mata kuliah ini?</p>
          <p className="text-slate-500 text-sm mb-6"><strong>{modal.data?.nama_mk}</strong> ({modal.data?.kode_mk})</p>
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
