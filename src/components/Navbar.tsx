import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Cloud,
  CloudOff,
  Sparkles,
  UserCheck,
  RefreshCw,
  Home,
  LogOut,
  Settings,
  CheckCircle2,
  ChevronDown,
  Menu
} from 'lucide-react';
import { ClassInfo, SyncQueueItem, GoogleUserProfile } from '../types';

interface NavbarProps {
  classInfo: ClassInfo;
  syncQueue: SyncQueueItem[];
  isDemoMode?: boolean;
  googleUser?: GoogleUserProfile | null;
  onOpenAksaAi: () => void;
  onOpenOnboarding: () => void;
  onManualSync: () => void;
  onGoToLanding?: () => void;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
  isSyncing: boolean;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  classInfo,
  syncQueue,
  isDemoMode = false,
  googleUser,
  onOpenAksaAi,
  onOpenOnboarding,
  onManualSync,
  onGoToLanding,
  onLogout,
  onToggleMobileMenu,
  isSyncing,
}) => {
  const hasQueue = syncQueue.length > 0;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const teacherName = googleUser?.name || classInfo.teacherName || (isDemoMode ? 'Ibu Maria (Demo)' : 'Guru Sekolah');
  const teacherEmail = googleUser?.email || classInfo.teacherEmail || (isDemoMode ? 'guru.demo@sekolahhub.id' : 'Belum Login');

  return (
    <header className="bg-[#5A5A40] border-b border-[#464632] text-[#FDFCF9] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Class Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Hamburger Menu Toggle Button (Mobile & Tablet < 1024px) */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              id="btn-hamburger-menu"
              className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-[#464632]/80 hover:bg-[#464632] text-[#FDFCF9] border border-[#6E6E51]/70 transition-all shadow-sm active:scale-95"
              aria-label="Buka Menu Utama Guru"
              title="Buka Menu Utama Guru"
            >
              <Menu className="w-5 h-5 text-[#A4AC86]" />
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-[#A4AC86] text-[#2D302A] flex items-center justify-center shadow-sm font-bold shrink-0">
            <GraduationCap className="w-6 h-6 text-[#2D302A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg text-[#FDFCF9] tracking-tight">
                SekolahHub
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#DDBEA9]/30 text-[#FFE8D6] border border-[#DDBEA9]/40 rounded-full tracking-wider uppercase">
                {isDemoMode ? 'Demo' : 'Basic'}
              </span>
            </div>
            <p className="text-xs text-[#E9E5D9]/80 truncate max-w-[140px] sm:max-w-xs">
              {classInfo.className || 'Kelas Belum Diatur'} • {classInfo.schoolName || 'Sekolah'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Landing Page Button */}
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              id="btn-navbar-landing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#464632]/70 hover:bg-[#464632] text-[#E9E5D9] text-xs font-semibold border border-[#6E6E51]/60 transition-all"
              title="Kembali ke Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-[#A4AC86]" />
              <span className="hidden lg:inline">Landing Page</span>
            </button>
          )}

          {/* Sync Status Badge */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            id="btn-sync-status"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              hasQueue
                ? 'bg-[#DDBEA9]/30 text-[#FFE8D6] border border-[#DDBEA9]/50 hover:bg-[#DDBEA9]/40 animate-pulse'
                : 'bg-[#464632]/60 text-[#E9E5D9] border border-[#6E6E51]/60 hover:bg-[#464632]'
            }`}
            title={hasQueue ? `${syncQueue.length} perubahan belum tersimpan ke Google Sheets` : 'Tersinkron dengan Google Sheets'}
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFE8D6]" />
            ) : hasQueue ? (
              <CloudOff className="w-3.5 h-3.5 text-[#FFE8D6]" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-[#A4AC86]" />
            )}
            <span className="hidden sm:inline">
              {isSyncing ? 'Menyinkron...' : hasQueue ? `${syncQueue.length} Antrean` : 'Cloud Sync'}
            </span>
          </button>

          {/* Aksa AI Assistant Button */}
          <button
            onClick={onOpenAksaAi}
            id="btn-navbar-aksa"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A4AC86] hover:bg-[#939b77] text-[#2D302A] font-bold text-xs shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2D302A]" />
            <span className="hidden md:inline">Aksa AI</span>
          </button>

          {/* User Profile Button with Popover */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              id="btn-user-profile"
              className="flex items-center gap-2 bg-[#464632]/60 hover:bg-[#464632] border border-[#6E6E51]/70 px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
              title="Menu Profil & Sesi Guru"
            >
              {googleUser?.picture ? (
                <img
                  src={googleUser.picture}
                  alt={teacherName}
                  className="w-7 h-7 rounded-full object-cover border border-[#A4AC86]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#A4AC86] flex items-center justify-center text-xs font-bold text-[#2D302A]">
                  <UserCheck className="w-4 h-4 text-[#2D302A]" />
                </div>
              )}
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-[#FDFCF9] leading-tight truncate max-w-[130px]">
                  {teacherName}
                </div>
                <div className="text-[10px] text-[#E9E5D9]/80 leading-none truncate max-w-[130px]">
                  {googleUser ? 'Google Connected' : isDemoMode ? 'Mode Demo' : 'Belum Login'}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#A4AC86] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Popover Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-[#2D302A] rounded-2xl shadow-2xl border border-[#D8D3C5] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Popover Header */}
                <div className="flex items-start gap-3 pb-3 border-b border-[#E9E5D9]">
                  {googleUser?.picture ? (
                    <img
                      src={googleUser.picture}
                      alt={teacherName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-[#A4AC86] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-[#FDFCF9] flex items-center justify-center text-lg font-bold shrink-0">
                      {teacherName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-[#2D302A] truncate">
                      {teacherName}
                    </div>
                    <div className="text-xs text-[#5A5A40] truncate">
                      {teacherEmail}
                    </div>

                    {googleUser ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 mt-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        Terhubung Google OAuth
                      </span>
                    ) : isDemoMode ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 mt-2">
                        Mode Demo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium border border-stone-200 mt-2">
                        Belum Login Google
                      </span>
                    )}
                  </div>
                </div>

                {/* Popover Actions */}
                <div className="pt-3 space-y-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenOnboarding();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#5A5A40] hover:bg-[#F5F2EB] transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-[#5A5A40]" />
                    <span>Pengaturan Profil & Kelas</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onLogout) {
                        onLogout();
                      }
                    }}
                    id="btn-popover-logout"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors shadow-sm"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Keluar / Logout Sesi</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
