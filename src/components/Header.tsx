import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, 
  LogOut, 
  Sparkles, 
  ArrowUpRight,
  Sun,
  Moon
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
  const { isDarkMode, toggleDarkMode } = useTheme();

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
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {getPageTitle(activeTab)}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-2">
              <span>{teacherProfile.schoolName || 'SD Negeri'}</span>
              <span>•</span>
              <span className="font-semibold text-blue-700 dark:text-blue-400">{teacherProfile.className || 'Kelas 1-A'}</span>
              <span>•</span>
              <span>{teacherProfile.academicYear} ({teacherProfile.semester})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 sm:px-3 sm:py-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
            title={isDarkMode ? "Alihkan ke Mode Terang" : "Alihkan ke Mode Gelap"}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-amber-300">Mode Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline text-slate-700">Mode Gelap</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenUpgradeModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-200 dark:border-amber-800/80 rounded-lg transition-all"
            title="Info Upgrade Ke Pro / Premium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Basic Edition</span>
            <ArrowUpRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          </button>

          <button
            onClick={onOpenFeedbackModal}
            className="hidden sm:block px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Kirim Feedback
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {teacherProfile.teacherName ? teacherProfile.teacherName.charAt(0) : 'G'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {teacherProfile.teacherName || 'Guru Kelas'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {currentUser?.email || 'Single Teacher'}
              </p>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
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

