import React from 'react';
import { School, Sparkles, LogOut, Menu } from 'lucide-react';
import { TeacherProfile } from '../types';

interface NavbarProps {
  profile: TeacherProfile;
  isDemoMode: boolean;
  currentUserEmail?: string | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onOpenUpgrade: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  isDemoMode,
  currentUserEmail,
  onOpenAuth,
  onLogout,
  onToggleSidebar,
  onOpenUpgrade,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">
                  SekolahHub Class
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                  Basic Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {profile.className} &bull; {profile.schoolName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {isDemoMode ? (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Mode Demo
              </span>
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
              >
                Login / Register
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-bold text-slate-800">{profile.teacherName}</span>
                <span className="text-[10px] text-slate-400">{currentUserEmail}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={onOpenUpgrade}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Upgrade Pro
          </button>
        </div>
      </div>
    </header>
  );
};
