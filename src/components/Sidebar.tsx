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
  LogOut,
  Globe,
  Newspaper,
  FlaskConical,
  Mic,
  Code,
  Share2,
  Crown,
  FolderHeart,
  X
} from 'lucide-react';
import { ClassInfo, GoogleUserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  googleUser?: GoogleUserProfile | null;
  classInfo?: ClassInfo;
  isDemoMode?: boolean;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  studentCount,
  isOpenMobile = false,
  onCloseMobile,
  googleUser,
  classInfo,
  isDemoMode = false,
  onLogout,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan Kelas', icon: LayoutDashboard },
    { id: 'students', label: 'Profil Siswa', icon: Users, badge: studentCount },
    { id: 'attendance', label: 'Presensi Harian', icon: CalendarCheck },
    { id: 'gradebook', label: 'Buku Nilai', icon: Award },
    { id: 'savings', label: 'Tabungan Kelas', icon: Wallet },
    { id: 'journal', label: 'Jurnal Mengajar', icon: BookOpen },
    { id: 'classInfo', label: 'Identitas Kelas', icon: School },
    { id: 'aksaAi', label: 'Aksa AI Assistant', icon: Sparkles, highlight: true },
  ];

  const proMenuItems = [
    { id: 'pro-portofolio', label: 'Portofolio Siswa', icon: FolderHeart, star: true },
    { id: 'pro-website', label: 'Website Kelas', icon: Globe },
    { id: 'pro-mading', label: 'Mading Digital', icon: Newspaper },
    { id: 'pro-aksa-lab', label: 'Laboratorium Aksa AI', icon: FlaskConical },
    { id: 'pro-voice-to-text', label: 'Voice to Text', icon: Mic },
    { id: 'pro-html-pro', label: 'HTML Professional', icon: Code },
    { id: 'pro-publish-center', label: 'Publish Center', icon: Share2 },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const teacherName = googleUser?.name || classInfo?.teacherName || (isDemoMode ? 'Ibu Maria (Demo)' : 'Guru Sekolah');
  const className = classInfo?.className || '6A';

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
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Header in Drawer (Mobile/Tablet only) */}
          <div className="flex items-center justify-between px-4 pb-3 mb-2 border-b border-[#5A5A40] lg:hidden shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#FDFCF9]">Menu Utama</span>
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
          <div className="hidden lg:block px-6 pb-2 text-[11px] font-bold tracking-wider text-[#DDBEA9] uppercase shrink-0">
            Menu Utama
          </div>

          {/* Nav List */}
          <nav className="px-3 space-y-1 flex-1">
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

            {/* Pro Section Header */}
            <div className="pt-4 pb-1.5 px-3 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-amber-300/90 uppercase flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>SekolahHub Pro</span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-widest">
                PREVIEW
              </span>
            </div>

            {/* Pro Menu Items */}
            {proMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  id={`sidebar-item-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md'
                      : 'text-amber-100/90 hover:bg-[#5A5A40] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-amber-400">{item.star ? '⭐' : '👑'}</span>
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-300'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase ${
                      isActive
                        ? 'bg-stone-950 text-amber-400'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    PRO
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Section at Very Bottom */}
        <div className="pt-4 px-3 border-t border-[#5A5A40] mt-auto shrink-0 space-y-2.5">
          <div className="p-3 rounded-xl bg-[#5A5A40]/80 border border-[#6E6E51]/60 flex items-center gap-3">
            {googleUser?.picture ? (
              <img
                src={googleUser.picture}
                alt={teacherName}
                className="w-9 h-9 rounded-full object-cover border border-[#A4AC86] shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#A4AC86] text-[#2D302A] flex items-center justify-center font-bold text-sm shrink-0">
                {teacherName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-[#FDFCF9] truncate">
                {teacherName}
              </div>
              <div className="text-[11px] text-[#E9E5D9]/80 truncate">
                Wali Kelas {className}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[10px] font-semibold text-emerald-300">Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectTab('settings')}
              id="btn-sidebar-settings"
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                activeTab === 'settings'
                  ? 'bg-[#A4AC86] text-[#2D302A] font-bold border-[#A4AC86] shadow-sm'
                  : 'bg-[#5A5A40] hover:bg-[#6E6E51] text-[#E9E5D9] border-[#6E6E51]/60'
              }`}
            >
              <Settings className={`w-3.5 h-3.5 ${activeTab === 'settings' ? 'text-[#2D302A]' : 'text-[#A4AC86]'}`} />
              <span>Pengaturan</span>
            </button>

            <button
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                if (onLogout) onLogout();
              }}
              id="btn-sidebar-logout"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 text-xs font-semibold transition-colors border border-rose-800/50"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


