import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, GraduationCap, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { role } = await login(email, password);
      // Redirect berdasarkan role dari response backend
      if (role === 'admin') navigate('/admin');
      else if (role === 'dosen') navigate('/dosen');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-600 opacity-10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-indigo-500 opacity-10 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-xl">
            <GraduationCap className="text-white" size={28} />
          </div>
          <span className="text-white text-2xl font-bold tracking-wide">GeoPresence</span>
        </div>

        {/* Center text */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Sistem Absensi<br />
            <span className="text-blue-400">Berbasis Lokasi</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Platform terpadu untuk memantau kehadiran mahasiswa secara real-time dengan verifikasi geolokasi yang akurat dan aman.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            {['Verifikasi GPS', 'Dashboard Real-time', 'Multi-peran', 'Laporan Otomatis'].map(f => (
              <span key={f} className="bg-white/10 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full border border-white/10">
                ✓ {f}
              </span>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-slate-500 text-sm">© 2026 GeoPresence · Sistem Absensi Digital</p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center space-x-3 mb-8">
            <div className="bg-blue-500 p-2 rounded-xl">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-white text-xl font-bold">GeoPresence</span>
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang</h2>
              <p className="text-slate-400">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm flex items-center space-x-3">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="email@kampus.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk</span>
                )}
              </button>
            </form>

            {/* Info roles */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-xs text-slate-500">
                Sistem akan mendeteksi hak akses Anda secara otomatis
              </p>
              <div className="flex justify-center gap-4 mt-3">
                {[
                  { label: 'Admin', color: 'bg-red-500' },
                  { label: 'Dosen', color: 'bg-emerald-500' },
                  { label: 'Mahasiswa', color: 'bg-blue-500' },
                ].map(r => (
                  <div key={r.label} className="flex items-center space-x-1.5">
                    <div className={`w-2 h-2 rounded-full ${r.color}`} />
                    <span className="text-xs text-slate-400">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
