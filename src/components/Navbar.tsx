import React from 'react';
import { Menu } from 'lucide-react';
import { ClassInfo, SyncQueueItem, GoogleUserProfile } from '../types';

interface NavbarProps {
  classInfo: ClassInfo;
  syncQueue?: SyncQueueItem[];
  isDemoMode?: boolean;
  googleUser?: GoogleUserProfile | null;
  onOpenAksaAi?: () => void;
  onOpenOnboarding?: () => void;
  onManualSync?: () => void;
  onGoToLanding?: () => void;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
  isSyncing?: boolean;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  classInfo,
  onToggleMobileMenu,
}) => {
  const schoolName = classInfo.schoolName || 'SDI Al Hasan';
  const rawClass = classInfo.className || '6A';
  const subtitle = rawClass.toLowerCase().includes('kelas') || rawClass.toLowerCase().includes('murid')
    ? rawClass
    : `Murid Kelas ${rawClass}`;

  return (
    <header className="bg-[#464632] border-b border-[#5A5A40] text-[#FDFCF9] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left Side: School Name & Subtitle */}
        <div className="min-w-0 flex-1">
          <h1 className="font-extrabold text-base sm:text-lg md:text-xl text-[#FDFCF9] tracking-tight truncate leading-tight">
            {schoolName}
          </h1>
          <p className="text-xs text-[#E9E5D9]/80 truncate leading-tight mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Right Side ONLY: Hamburger Menu Button */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onToggleMobileMenu}
            id="btn-hamburger-menu"
            className="flex items-center justify-center p-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#6E6E51] text-[#FDFCF9] border border-[#6E6E51] transition-all shadow-sm active:scale-95"
            aria-label="Buka Menu Navigation"
            title="Buka Menu Navigation"
          >
            <Menu className="w-5 h-5 text-[#FDFCF9]" />
          </button>
        </div>
      </div>
    </header>
  );
};

