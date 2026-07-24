import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  Wallet,
  BookOpen,
  School,
  Settings,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  studentCount,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan Kelas', icon: LayoutDashboard },
    { id: 'students', label: 'Profil Siswa', icon: Users, badge: studentCount },
    { id: 'attendance', label: 'Presensi Harian', icon: CalendarCheck },
    { id: 'gradebook', label: 'Buku Nilai', icon: Award },
    { id: 'savings', label: 'Tabungan Kelas', icon: Wallet },
    { id: 'journal', label: 'Jurnal Mengajar', icon: BookOpen },
    { id: 'classInfo', label: 'Identitas Kelas', icon: School },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
    { id: 'aksaAi', label: 'Aksa AI Assistant', icon: Sparkles, highlight: true },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile & Tablet Backdrop Overlay (< 1024px) */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-sidebar"
        className={`
          bg-[#464632] text-[#FDFCF9] shrink-0 py-4 shadow-xl lg:shadow-sm flex flex-col justify-between
          /* Desktop (lg >= 1024px): Permanent Left Sidebar */
          lg:static lg:z-auto lg:w-64 lg:rounded-2xl lg:border lg:border-[#5A5A40] lg:translate-x-0
          /* Mobile/Tablet (< 1024px): Fixed Slide-over Drawer */
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transition-transform duration-300 ease-in-out
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div>
          {/* Header in Drawer (Mobile/Tablet only) */}
          <div className="flex items-center justify-between px-4 pb-3 mb-2 border-b border-[#5A5A40] lg:hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#FDFCF9]">Menu Utama Guru</span>
            </div>
            <button
              onClick={onCloseMobile}
              id="btn-close-mobile-menu"
              className="p-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#6E6E51] text-[#E9E5D9] transition-colors"
              aria-label="Tutup Menu"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Section Label */}
          <div className="hidden lg:block px-6 pb-2 text-[11px] font-bold tracking-wider text-[#DDBEA9] uppercase">
            Menu Utama Guru
          </div>

          {/* Nav List */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  id={`sidebar-item-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-[#DDBEA9] text-[#2D302A] shadow-md font-bold'
                        : 'bg-[#A4AC86] text-[#2D302A] font-bold shadow-sm'
                      : item.highlight
                      ? 'bg-[#DDBEA9]/20 text-[#FFE8D6] hover:bg-[#DDBEA9]/30 border border-[#DDBEA9]/40'
                      : 'text-[#E9E5D9] hover:bg-[#5A5A40] hover:text-[#FDFCF9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-[#2D302A]'
                          : item.highlight
                          ? 'text-[#FFE8D6]'
                          : 'text-[#A4AC86]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#2D302A] text-[#FDFCF9]'
                          : 'bg-[#5A5A40] text-[#E9E5D9]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#FFE8D6] animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Banner - Single Class Notice */}
        <div className="px-3 mt-6">
          <div className="p-3 rounded-xl bg-[#5A5A40]/80 border border-[#6E6E51]/60 text-xs text-[#E9E5D9]">
            <div className="font-semibold text-[#A4AC86] mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A4AC86]" />
              Edisi Basic (Single Guru)
            </div>
            <p className="leading-relaxed text-[11px] text-[#FDFCF9]/90">
              Khusus pengelolaan 1 kelas TK/SD. Sinkronisasi otomatis ke Google Spreadsheet Anda.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

