import { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const EMPTY_FORM = { nama: '', email: '', password: '', nidn: '', no_hp: '', alamat: '' };
const EMPTY_EDIT = { nama: '', nidn: '', no_hp: '', alamat: '' };

export default function AdminDosen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ type: null, data: null }); // type: create|edit|delete
  const [form, setForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dosen');
      setList(res.data.data || []);
    } catch { setList([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal({ type: 'create' }); };
  const openEdit = (d) => {
    setEditForm({ nama: d.user?.nama || '', nidn: d.nidn || '', no_hp: d.no_hp || '', alamat: d.alamat || '' });
    setError(''); setModal({ type: 'edit', data: d });
  };
  const openDelete = (d) => setModal({ type: 'delete', data: d });
  const closeModal = () => { setModal({ type: null }); setError(''); };

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/admin/dosen', form);
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menambahkan dosen'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.put(`/admin/dosen/${modal.data.id}`, editForm);
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal memperbarui dosen'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/admin/dosen/${modal.data.id}`);
      fetchData(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menghapus dosen'); }
    finally { setSaving(false); }
  };

  const filtered = list.filter(d =>
    (d.user?.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.nidn || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={26} /> Manajemen Dosen
          </h1>
          <p className="text-slate-500 text-sm mt-1">Total {list.length} dosen terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
          <Plus size={18} /> Tambah Dosen
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama / NIDN..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">NIDN</th>
                <th className="px-6 py-3 text-left">No. HP</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="py-16 text-center text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-16 text-center text-slate-400">Tidak ada data dosen.</td></tr>
              ) : filtered.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
                        {(d.user?.nama || 'D')[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{d.user?.nama}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">{d.user?.email}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-700">{d.nidn}</td>
                  <td className="px-6 py-3.5 text-slate-500">{d.no_hp || '-'}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${d.user?.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {d.user?.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(d)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => openDelete(d)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus">
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

      {/* Modal Create */}
      <Modal open={modal.type === 'create'} onClose={closeModal} title="Tambah Dosen Baru">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          {[
            { label: 'Nama Lengkap', key: 'nama', type: 'text', placeholder: 'Dr. Budi Santoso, M.Kom' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'dosen@kampus.ac.id' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 karakter' },
            { label: 'NIDN', key: 'nidn', type: 'text', placeholder: '0123456789' },
            { label: 'No. HP', key: 'no_hp', type: 'text', placeholder: '08xxxxxxxxxx' },
            { label: 'Alamat', key: 'alamat', type: 'text', placeholder: 'Jl. ...' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
              <input type={f.type} required={['nama','email','password','nidn'].includes(f.key)}
                value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit */}
      <Modal open={modal.type === 'edit'} onClose={closeModal} title="Edit Data Dosen">
        <form onSubmit={handleEdit} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          {[
            { label: 'Nama Lengkap', key: 'nama', type: 'text' },
            { label: 'NIDN', key: 'nidn', type: 'text' },
            { label: 'No. HP', key: 'no_hp', type: 'text' },
            { label: 'Alamat', key: 'alamat', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
              <input type={f.type}
                value={editForm[f.key]} onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
              {saving ? 'Menyimpan...' : 'Perbarui'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Delete */}
      <Modal open={modal.type === 'delete'} onClose={closeModal} title="Konfirmasi Hapus" size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-rose-500" size={28} />
          </div>
          <p className="text-slate-700 mb-1 font-medium">Hapus dosen ini?</p>
          <p className="text-slate-500 text-sm mb-6"><strong>{modal.data?.user?.nama}</strong> akan dihapus permanen beserta akun user-nya.</p>
          {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
          <div className="flex gap-3 w-full">
            <button onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium">Batal</button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
              {saving ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
