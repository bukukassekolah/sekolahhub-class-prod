import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CalendarCheck, 
  Wallet,
  BookOpen, 
  Bell, 
  FileText, 
  MessageSquare, 
  School, 
  Sparkles,
  X
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'profile' 
  | 'students' 
  | 'attendance' 
  | 'savings'
  | 'notes' 
  | 'announcements' 
  | 'reports' 
  | 'feedback';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenUpgradeModal: () => void;
  onOpenFeedbackModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
  onOpenUpgradeModal,
  onOpenFeedbackModal
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil Kelas', icon: Building2 },
    { id: 'students', label: 'Data Siswa', icon: Users },
    { id: 'attendance', label: 'Presensi Harian', icon: CalendarCheck },
    { id: 'savings', label: 'Tabungan Siswa', icon: Wallet },
    { id: 'notes', label: 'Catatan & Jurnal', icon: BookOpen },
    { id: 'announcements', label: 'Pengumuman Kelas', icon: Bell },
    { id: 'reports', label: 'Laporan PDF', icon: FileText },
    { id: 'feedback', label: 'Kirim Feedback', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Drawer Container */}
      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Header Mobile Close & Branding */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <School className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                Menu Administrasi
              </span>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'feedback') {
                      onOpenFeedbackModal();
                    } else {
                      setActiveTab(item.id);
                    }
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Pro Banner */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div 
            onClick={onOpenUpgradeModal}
            className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200/80 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-300 dark:hover:border-slate-600 transition-all group"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
              <span>SekolahHub Class Pro</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Jalur upgrade ke fitur Penilaian & Rapor Digital kapan saja.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
