import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getTodayFormatted } from '../lib/demoData';
import { 
  Users, 
  CalendarCheck, 
  Wallet,
  BookOpen, 
  Bell, 
  UserPlus, 
  FilePlus, 
  Megaphone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string, action?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { teacherProfile, students, attendance, notes, announcements } = useAuth();

  const todayStr = getTodayFormatted();

  const activeStudents = students.filter(s => s.isActive);
  const totalActive = activeStudents.length;

  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const totalTodayRecorded = todayAttendance.length;

  const hadirCount = todayAttendance.filter(a => a.status === 'Hadir').length;
  const izinCount = todayAttendance.filter(a => a.status === 'Izin').length;
  const sakitCount = todayAttendance.filter(a => a.status === 'Sakit').length;
  const alfaCount = todayAttendance.filter(a => a.status === 'Alfa').length;

  const hadirPercentage = totalActive > 0 ? Math.round((hadirCount / totalActive) * 100) : 0;

  const latestNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  const publishedAnnouncements = announcements.filter(a => a.status === 'Publikasikan');
  const latestAnnouncements = [...publishedAnnouncements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/15 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SekolahHub Class Basic Edition</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {teacherProfile.teacherName || 'Bapak/Ibu Guru'}!
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Administrasi kelas untuk <strong className="text-white">{teacherProfile.className || 'Kelas 1-A'}</strong> ({teacherProfile.schoolName || 'SD Negeri'}) — Tahun Ajaran {teacherProfile.academicYear}.
            </p>
          </div>

          <button
            onClick={() => onNavigate('attendance')}
            className="self-start md:self-auto px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 group shrink-0"
          >
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Presensi Hari Ini</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah Siswa</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalActive}</span>
            <span className="text-xs text-slate-500 ml-1">Siswa Aktif</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-2 flex items-center gap-1">
            <span>Kelola Daftar Siswa</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kehadiran Hari Ini</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{hadirPercentage}%</span>
            <span className="text-xs text-slate-500 ml-1">({hadirCount}/{totalActive} Hadir)</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <span>{sakitCount > 0 ? `${sakitCount} Sakit` : ''} {izinCount > 0 ? `${izinCount} Izin` : ''} {alfaCount > 0 ? `${alfaCount} Alfa` : ''} {totalTodayRecorded === 0 ? 'Belum Presensi' : ''}</span>
          </p>
        </div>

        <div 
          onClick={() => onNavigate('announcements')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengumuman</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{publishedAnnouncements.length}</span>
            <span className="text-xs text-slate-500 ml-1">Publikasi</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-2 flex items-center gap-1">
            <span>Siap Bagikan ke WhatsApp</span>
          </p>
        </div>

        <div 
          onClick={() => onNavigate('notes')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catatan & Jurnal</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{notes.length}</span>
            <span className="text-xs text-slate-500 ml-1">Jurnal Entri</span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-2 flex items-center gap-1">
            <span>Catatan Perkembangan Siswa</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Aksi Cepat (Quick Action)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('attendance')}
            className="p-3.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all text-left group flex flex-col justify-between"
          >
            <CalendarCheck className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-blue-900">Presensi Hari Ini</p>
              <p className="text-[10px] text-blue-700">Isi / Edit Kehadiran</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('savings')}
            className="p-3.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all text-left group flex flex-col justify-between"
          >
            <Wallet className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-teal-900">Tabungan Siswa</p>
              <p className="text-[10px] text-teal-700">Setor & Tarik Saldo</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('students', 'add')}
            className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all text-left group flex flex-col justify-between"
          >
            <UserPlus className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Tambah Siswa</p>
              <p className="text-[10px] text-emerald-700">Siswa Baru Kelas</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('notes', 'add')}
            className="p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all text-left group flex flex-col justify-between"
          >
            <FilePlus className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-amber-900">Tambah Catatan</p>
              <p className="text-[10px] text-amber-700">Jurnal & Perkembangan</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('announcements', 'add')}
            className="p-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all text-left group flex flex-col justify-between"
          >
            <Megaphone className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-purple-900">Buat Pengumuman</p>
              <p className="text-[10px] text-purple-700">Informasi Orang Tua</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Pengumuman & Agenda Terbaru</h3>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {latestAnnouncements.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Belum ada pengumuman yang dipublikasikan.
            </div>
          ) : (
            <div className="space-y-3">
              {latestAnnouncements.map(an => (
                <div key={an.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{an.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{an.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{an.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Catatan Guru Terbaru</h3>
            </div>
            <button
              onClick={() => onNavigate('notes')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Lihat Jurnal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {latestNotes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Belum ada catatan jurnal guru tersimpan.
            </div>
          ) : (
            <div className="space-y-3">
              {latestNotes.map(n => (
                <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{n.title}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
