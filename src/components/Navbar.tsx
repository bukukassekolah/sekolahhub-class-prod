import React from 'react';
import {
  GraduationCap,
  Cloud,
  CloudOff,
  Sparkles,
  UserCheck,
  RefreshCw,
  Info,
  Home
} from 'lucide-react';
import { ClassInfo, SyncQueueItem } from '../types';

interface NavbarProps {
  classInfo: ClassInfo;
  syncQueue: SyncQueueItem[];
  isDemoMode?: boolean;
  onOpenAksaAi: () => void;
  onOpenOnboarding: () => void;
  onManualSync: () => void;
  onGoToLanding?: () => void;
  isSyncing: boolean;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  classInfo,
  syncQueue,
  isDemoMode = false,
  onOpenAksaAi,
  onOpenOnboarding,
  onManualSync,
  onGoToLanding,
  isSyncing,
}) => {
  const hasQueue = syncQueue.length > 0;

  return (
    <header className="bg-[#5A5A40] border-b border-[#464632] text-[#FDFCF9] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Class Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A4AC86] text-[#2D302A] flex items-center justify-center shadow-sm font-bold">
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
            <p className="text-xs text-[#E9E5D9]/80 truncate max-w-[200px] sm:max-w-xs">
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

          {/* User Info / Info Modal */}
          <button
            onClick={onOpenOnboarding}
            id="btn-user-profile"
            className="flex items-center gap-2 bg-[#464632]/50 hover:bg-[#464632]/80 border border-[#6E6E51]/60 px-2.5 py-1.5 rounded-xl transition-all"
            title="Profil Guru & Info Kelas"
          >
            <div className="w-7 h-7 rounded-full bg-[#A4AC86] flex items-center justify-center text-xs font-bold text-[#2D302A]">
              <UserCheck className="w-4 h-4 text-[#2D302A]" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-[#FDFCF9] leading-tight">
                {classInfo.teacherName || (isDemoMode ? 'Ibu Maria (Demo)' : 'Login Google')}
              </div>
              <div className="text-[10px] text-[#E9E5D9]/80 leading-none">
                {isDemoMode ? 'Mode Demo' : classInfo.teacherEmail ? 'Google Connected' : 'Belum Login'}
              </div>
            </div>
            <Info className="w-3.5 h-3.5 text-[#A4AC86] ml-1 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};
