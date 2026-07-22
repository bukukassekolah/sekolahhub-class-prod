import React from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Upgrade Path</span>
          </div>
          <h3 className="text-xl font-extrabold">SekolahHub Class Upgrade Plan</h3>
          <p className="text-xs text-blue-100 mt-1 max-w-lg">
            Anda saat ini menggunakan <strong>SekolahHub Class Basic (Community Edition)</strong>. Data kelas Anda aman dan dapat ditransfer saat melakukan upgrade ke edisi Pro atau Premium.
          </p>
        </div>

        <div className="p-6 space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic */}
            <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/50 space-y-3 relative">
              <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                Aktif
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Class Basic</h4>
              <p className="text-xl font-black text-blue-700">Gratis</p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>1 Guru / 1 Kelas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Presensi & Data Siswa</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Catatan & Pengumuman</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Export PDF Rekap</span>
                </li>
              </ul>
            </div>

            {/* Pro */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:border-blue-300 transition-all">
              <h4 className="font-bold text-slate-900 text-sm">Class Pro</h4>
              <p className="text-xl font-black text-slate-900">Multi-Kelas</p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Semua Fitur Basic</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Kelola Banyak Kelas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Auto Kirim WA Orang Tua</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Rekap Grafik Otomatis</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 hover:border-blue-300 transition-all">
              <h4 className="font-bold text-slate-900 text-sm">Class Premium</h4>
              <p className="text-xl font-black text-slate-900">Multi-Sekolah</p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>Portal Admin Sekolah</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>Rapor Digital & Kurikulum</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>Sinkronisasi Antar Guru</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>Domain Khusus Sekolah</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900 text-xs">Jaminan Tanpa Kehilangan Data</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Filosofi SekolahHub menjamin bahwa guru dapat meningkatkan edisi aplikasi kapan saja tanpa perlu mengubah alur kerja atau kehilangan satu pun data siswa & presensi.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
};
