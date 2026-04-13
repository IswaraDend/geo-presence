import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertTriangle, X } from 'lucide-react';
import api from '../../api/axios';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setData(res.data.data);
        if (res.data.data.has_warning) {
          setShowWarning(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;
  if (!data) return <div className="text-center py-20 text-red-500">Gagal memuat data dashboard.</div>;

  const k = data.kehadiran;
  const percentage = Math.round(k.persentase);

  // Determine colors based on status in history
  const getStatusColor = (status) => {
    switch (status) {
      case 'hadir': return 'text-green-600';
      case 'izin': return 'text-yellow-600';
      case 'sakit': return 'text-blue-500';
      default: return 'text-red-500'; // alfa/tidak hadir
    }
  };

  return (
    <div className="relative">
      
      {/* Dim Overlay and Modal Warning */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-pulse">
            <button onClick={() => setShowWarning(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <AlertTriangle size={64} className="text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-2">PERINGATAN!</h2>
              <p className="text-gray-700 font-medium mb-6">
                Anda telah tidak hadir sebanyak <span className="text-red-600 font-bold">{k.absen_count} kali</span>. 
                Segera perbaiki kehadiran Anda agar tidak melebihi batas maksimal.
              </p>
              <button 
                onClick={() => setShowWarning(false)}
                className="btn-primary w-full max-w-[200px]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout Top Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Attendance Circle Panel */}
        <div className="card p-6 flex flex-col h-full items-center text-center">
           <h3 className="w-full text-left text-lg font-bold text-gray-700 mb-4 border-b pb-2">Kehadiran Anda</h3>
           <div className="w-48 h-48 my-auto">
             <CircularProgressbar 
                value={percentage} 
                text={`${percentage}%`}
                styles={buildStyles({
                  pathColor: percentage >= 75 ? '#10B981' : '#F59E0B',
                  textColor: '#1F2937',
                  trailColor: '#F3F4F6',
                  textSize: '22px'
                })}
              />
           </div>
           
           <div className="w-full mt-6 space-y-2 text-left text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Hadir: <strong>{k.hadir_count}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Tidak Hadir: <strong>{k.absen_count}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Total Pertemuan: <strong>{k.total_pertemuan}</strong></span>
              </div>
           </div>
        </div>

        {/* Hero Banner / Illustration simulation */}
        <div className="card col-span-1 lg:col-span-2 relative overflow-hidden flex flex-col justify-end min-h-[250px]">
          <div className="absolute inset-0 bg-blue-100 opacity-60"></div>
          {/* Add a nice abstract shape or image here */}
          <div className="z-10 p-8 w-full">
             <h2 className="text-3xl font-bold text-blue-900 mb-2">Selamat Datang di Portal Absensi</h2>
             <p className="text-blue-800 opacity-80 max-w-md">Perhatikan tingkat persentase kehadiran Anda agar dapat mengikuti Ujian Akhir Semester.</p>
          </div>
        </div>
      </div>

      {/* Grid Layout Bottom Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Jadwal Kuliah & Summary Cards */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="card p-0 overflow-hidden">
            <h3 className="p-4 border-b border-gray-100 text-lg font-bold text-gray-700 bg-gray-50">Jadwal Kuliah Hari Ini</h3>
            
            {data.today_schedules && data.today_schedules.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {data.today_schedules.map((sched, idx) => (
                   <li key={idx} className="flex px-4 py-3 hover:bg-gray-50 transition-colors">
                     <span className="w-32 font-medium text-blue-600">{sched.start_time} - {sched.end_time}</span>
                     <span className="flex-1 font-medium text-gray-700">{sched.course?.name} - Ruang {sched.room}</span>
                   </li>
                ))}
              </ul>
            ) : (
               <div className="p-6 text-center text-gray-500">Tidak ada jadwal kuliah hari ini.</div>
            )}
            
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="bg-green-600 rounded-xl p-4 text-white shadow-sm flex flex-col justify-center items-center h-24">
                <span className="text-3xl font-bold mb-1">{k.total_pertemuan}</span>
                <span className="text-xs font-semibold tracking-wide uppercase opacity-90">Total Pertemuan</span>
             </div>
             <div className="bg-red-500 rounded-xl p-4 text-white shadow-sm flex flex-col justify-center items-center h-24">
                <span className="text-3xl font-bold mb-1">{k.absen_count}x</span>
                <span className="text-xs font-semibold tracking-wide uppercase opacity-90">Tidak Hadir</span>
             </div>
             <div className="bg-yellow-500 rounded-xl p-4 text-white shadow-sm flex flex-col justify-center items-center h-24">
                <span className="text-3xl font-bold mb-1">75%</span>
                <span className="text-xs font-semibold tracking-wide uppercase opacity-90">Batas Minimum</span>
             </div>
          </div>
        </div>

        {/* History Table Small */}
        <div className="card p-0">
          <h3 className="p-4 border-b border-gray-100 text-lg font-bold text-gray-700 bg-gray-50">Riwayat Absensi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#5c728e] text-white">
                <tr>
                  <th className="px-4 py-2 font-medium">Mata Kuliah</th>
                  <th className="px-4 py-2 font-medium">Tanggal</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recent_history && data.recent_history.length > 0 ? (
                  data.recent_history.slice(0, 5).map((history, idx) => ( // only show latest 5
                    <tr key={idx} className="hover:bg-gray-50 text-xs">
                      <td className="px-4 py-3 font-medium text-gray-700">{history.course?.name}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(history.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                      <td className={`px-4 py-3 font-semibold ${getStatusColor(history.status)}`}>
                        {history.status.replace(/^\w/, c => c.toUpperCase())}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 text-center text-gray-500">Belum ada riwayat.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t bg-gray-50 text-center">
            <a href="/riwayat" className="text-sm font-medium text-blue-600 hover:text-blue-800">Lihat Semua</a>
          </div>
        </div>

      </div>
    </div>
  );
}
