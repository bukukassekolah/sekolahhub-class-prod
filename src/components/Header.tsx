import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  LogOut, 
  Sparkles, 
  ArrowUpRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onToggleSidebar: () => void;
  onOpenUpgradeModal: () => void;
  onOpenFeedbackModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onToggleSidebar, 
  onOpenUpgradeModal,
  onOpenFeedbackModal 
}) => {
  const { teacherProfile, currentUser, logout } = useAuth();

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Kelas';
      case 'profile': return 'Profil Kelas & Guru';
      case 'students': return 'Data Siswa';
      case 'attendance': return 'Presensi Kehadiran Siswa';
      case 'notes': return 'Catatan & Jurnal Guru';
      case 'announcements': return 'Pengumuman Kelas';
      case 'reports': return 'Laporan & Export Rekap PDF';
      default: return 'SekolahHub Class Basic';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {getPageTitle(activeTab)}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:flex items-center gap-2">
              <span>{teacherProfile.schoolName || 'SD Negeri'}</span>
              <span>•</span>
              <span className="font-semibold text-blue-700">{teacherProfile.className || 'Kelas 1-A'}</span>
              <span>•</span>
              <span>{teacherProfile.academicYear} ({teacherProfile.semester})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenUpgradeModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all"
            title="Info Upgrade Ke Pro / Premium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Basic Edition</span>
            <ArrowUpRight className="w-3 h-3 text-amber-600" />
          </button>

          <button
            onClick={onOpenFeedbackModal}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Kirim Feedback
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {teacherProfile.teacherName ? teacherProfile.teacherName.charAt(0) : 'G'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {teacherProfile.teacherName || 'Guru Kelas'}
              </p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {currentUser?.email || 'Single Teacher'}
              </p>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
