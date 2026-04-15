import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Plus, Pencil, Trash2, Search, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const STATUS_LIST = ['hadir', 'izin', 'sakit', 'alfa'];
const STATUS_CONFIG = {
  hadir:  { label: 'Hadir',  class: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={13} /> },
  izin:   { label: 'Izin',   class: 'bg-amber-100 text-amber-700',    icon: <Clock size={13} /> },
  sakit:  { label: 'Sakit',  class: 'bg-blue-100 text-blue-700',      icon: <Clock size={13} /> },
  alfa:   { label: 'Alfa',   class: 'bg-rose-100 text-rose-700',      icon: <XCircle size={13} /> },
};
const EMPTY_FORM = { mahasiswa_id: '', jadwal_id: '', tanggal: '', pertemuan_ke: '', status_absensi: 'hadir', keterangan: '' };

export default function AdminAbsensi() {
  const [list, setList] = useState([]);
  const [mhsList, setMhsList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, mRes, jRes] = await Promise.all([
        api.get('/admin/absensi'),
        api.get('/admin/mahasiswa'),
        api.get('/admin/jadwal'),
      ]);
      setList(aRes.data.data || []);
      setMhsList(mRes.data.data || []);
      setJadwalList(jRes.data.data || []);
    } catch { setList([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setForm(EMPTY_FORM); setError(''); setModal({ type: 'create' }); };
  const openEdit = (a) => {
    setEditForm({ status_absensi: a.status_absensi, keterangan: a.keterangan || '', pertemuan_ke: a.pertemuan_ke });
    setError(''); setModal({ type: 'edit', data: a });
  };
  const openDelete = (a) => setModal({ type: 'delete', data: a });
  const closeModal = () => { setModal({ type: null }); setError(''); };

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/admin/absensi', { ...form, pertemuan_ke: parseInt(form.pertemuan_ke) });
      fetchAll(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menambahkan absensi'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.put(`/admin/absensi/${modal.data.id}`, { ...editForm, pertemuan_ke: parseInt(editForm.pertemuan_ke) || 0 });
      fetchAll(); closeModal();
    } catch (err) { setError(err.response?.data?.message || 'Gagal memperbarui absensi'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await api.delete(`/admin/absensi/${modal.data.id}`); fetchAll(); closeModal(); }
    catch (err) { setError(err.response?.data?.message || 'Gagal menghapus absensi'); }
    finally { setSaving(false); }
  };

  const filtered = list.filter(a => {
    const nama = (a.mahasiswa?.user?.nama || '').toLowerCase();
    const mk = (a.jadwal?.mata_kuliah?.nama_mk || '').toLowerCase();
    const matchSearch = nama.includes(search.toLowerCase()) || mk.includes(search.toLowerCase());
    const matchStatus = filterStatus === '' || a.status_absensi === filterStatus;
    return matchSearch && matchStatus;
  });

  const countByStatus = (s) => list.filter(a => a.status_absensi === s).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="text-blue-600" size={26} /> Manajemen Absensi</h1>
          <p className="text-slate-500 text-sm mt-1">Total {list.length} record absensi</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
          <Plus size={18} /> Tambah Absensi
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {STATUS_LIST.map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${filterStatus === s ? `${cfg.class} border-current` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {cfg.icon} {cfg.label}: {countByStatus(s)}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama mahasiswa / mata kuliah..."
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
                <th className="px-6 py-3 text-left">Mahasiswa</th>
                <th className="px-6 py-3 text-left">Mata Kuliah</th>
                <th className="px-6 py-3 text-center">Tanggal</th>
                <th className="px-6 py-3 text-center">Pertemuan</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-left">Keterangan</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="py-16 text-center text-slate-400">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="py-16 text-center text-slate-400">Tidak ada data absensi.</td></tr>
              ) : filtered.map(a => {
                const cfg = STATUS_CONFIG[a.status_absensi] || STATUS_CONFIG.alfa;
                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800">{a.mahasiswa?.user?.nama}</div>
                      <div className="text-xs text-slate-400">{a.mahasiswa?.nim}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{a.jadwal?.mata_kuliah?.nama_mk || '-'}</td>
                    <td className="px-6 py-3.5 text-center text-slate-600">
                      {new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">Ke-{a.pertemuan_ke}</span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.class}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 max-w-[140px] truncate">{a.keterangan || '-'}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"><Pencil size={16} /></button>
                        <button onClick={() => openDelete(a)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create */}
      <Modal open={modal.type === 'create'} onClose={closeModal} title="Tambah Data Absensi" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Mahasiswa</label>
              <select required value={form.mahasiswa_id} onChange={e => setForm(p => ({ ...p, mahasiswa_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Mahasiswa --</option>
                {mhsList.map(m => <option key={m.id} value={m.id}>{m.user?.nama} ({m.nim})</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Jadwal Kuliah</label>
              <select required value={form.jadwal_id} onChange={e => setForm(p => ({ ...p, jadwal_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Pilih Jadwal --</option>
                {jadwalList.map(j => <option key={j.id} value={j.id}>{j.mata_kuliah?.nama_mk} – {j.kelas?.nama_kelas} ({j.hari} {j.jam_mulai})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
              <input required type="date" value={form.tanggal} onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pertemuan Ke</label>
              <input required type="number" min="1" value={form.pertemuan_ke} onChange={e => setForm(p => ({ ...p, pertemuan_ke: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select required value={form.status_absensi} onChange={e => setForm(p => ({ ...p, status_absensi: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {STATUS_LIST.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
              <input value={form.keterangan} onChange={e => setForm(p => ({ ...p, keterangan: e.target.value }))} placeholder="Opsional"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit */}
      <Modal open={modal.type === 'edit'} onClose={closeModal} title="Edit Data Absensi">
        <form onSubmit={handleEdit} className="space-y-4">
          {error && <p className="bg-rose-50 text-rose-600 text-sm px-4 py-2 rounded-lg border border-rose-200">{error}</p>}
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-1">
            <p><span className="font-medium">Mahasiswa:</span> {modal.data?.mahasiswa?.user?.nama}</p>
            <p><span className="font-medium">MK:</span> {modal.data?.jadwal?.mata_kuliah?.nama_mk}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={editForm.status_absensi || ''} onChange={e => setEditForm(p => ({ ...p, status_absensi: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {STATUS_LIST.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
            <input value={editForm.keterangan || ''} onChange={e => setEditForm(p => ({ ...p, keterangan: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-semibold">{saving ? 'Menyimpan...' : 'Perbarui'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal Delete */}
      <Modal open={modal.type === 'delete'} onClose={closeModal} title="Konfirmasi Hapus" size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="text-rose-500" size={28} /></div>
          <p className="text-slate-700 mb-1 font-medium">Hapus record absensi ini?</p>
          <p className="text-slate-500 text-sm mb-6"><strong>{modal.data?.mahasiswa?.user?.nama}</strong> — {modal.data?.jadwal?.mata_kuliah?.nama_mk}</p>
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
