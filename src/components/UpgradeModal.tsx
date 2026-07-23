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
            <span>Paket & Fitur SekolahHub</span>
          </div>
          <h3 className="text-xl font-extrabold">SekolahHub Class Product Plans</h3>
          <p className="text-xs text-blue-100 mt-1 max-w-lg">
            Anda saat ini menggunakan <strong>SekolahHub Class Basic</strong>. Aplikasi ini dirancang khusus untuk 1 guru mengelola 1 kelas secara fokus dan responsif.
          </p>
        </div>

        <div className="p-6 space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SekolahHub Class Basic */}
            <div className="p-4.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 space-y-3 relative">
              <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                Aktif (Gratis)
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">SekolahHub Class Basic</h4>
              <p className="text-xs font-bold text-emerald-700">1 Guru / 1 Kelas (Versi Standar)</p>
              <ul className="space-y-2 text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Presensi & Roster Data Siswa</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Buku Catatan Guru & Pengumuman</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tabungan Siswa & Export PDF Rekap</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Aksa AI Asisten Kelas Dasar</span>
                </li>
              </ul>
            </div>

            {/* SekolahHub Class Pro */}
            <div className="p-4.5 rounded-xl border border-blue-200 bg-white space-y-3 hover:border-blue-400 transition-all shadow-xs">
              <h4 className="font-extrabold text-slate-900 text-sm">SekolahHub Class Pro</h4>
              <p className="text-xs font-bold text-blue-700">1 Guru / 1 Kelas (Fitur Lanjutan)</p>
              <ul className="space-y-2 text-slate-600 pt-1">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Semua Fitur Class Basic</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Analisis Grafik Kehadiran & AI Mendalam</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Notifikasi WhatsApp Otomatis Orang Tua</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Prioritas Dukungan Teknis Administrator</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Product Scope Clarification Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <p className="font-extrabold text-slate-900 text-xs">Arsitektur Produk SekolahHub</p>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>SekolahHub Class</strong> (Basic & Pro) difokuskan khusus untuk pengelolaan 1 kelas oleh 1 guru secara mandiri. Apabila sekolah Anda memerlukan manajemen multi-guru, multi-kelas, portal admin sekolah, dan sinkronisasi kurikulum tingkat sekolah, silakan gunakan produk terpisah: <strong>SekolahHub Space</strong>.
            </p>
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
