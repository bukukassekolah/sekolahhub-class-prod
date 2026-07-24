import React from 'react';
import {
  X,
  CalendarCheck,
  Award,
  BookOpen,
  Wallet
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: 'attendance' | 'gradebook' | 'journal' | 'savings') => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'attendance' as const,
      title: 'Rekam Presensi Hari Ini',
      desc: 'Input kehadiran siswa (Hadir, Izin, Sakit, Alpa) dengan cepat',
      icon: CalendarCheck,
      color: 'bg-[#F5F2EB] text-[#2D302A] border-[#D8D3C5] hover:bg-[#E9E5D9]',
      iconBg: 'bg-[#5A5A40] text-[#FDFCF9]'
    },
    {
      id: 'gradebook' as const,
      title: 'Catat Hasil Belajar (Nilai)',
      desc: 'Input deskripsi perkembangan kognitif, motorik, bahasa, seni',
      icon: Award,
      color: 'bg-[#F5F2EB] text-[#2D302A] border-[#D8D3C5] hover:bg-[#E9E5D9]',
      iconBg: 'bg-[#5A5A40] text-[#FDFCF9]'
    },
    {
      id: 'savings' as const,
      title: 'Mutasi Tabungan Kas Kelas',
      desc: 'Catat setoran atau penarikan uang tabungan siswa',
      icon: Wallet,
      color: 'bg-[#FFE8D6]/50 text-[#2D302A] border-[#DDBEA9] hover:bg-[#FFE8D6]',
      iconBg: 'bg-[#DDBEA9] text-[#2D302A]'
    },
    {
      id: 'journal' as const,
      title: 'Tulis Jurnal Mengajar Baru',
      desc: 'Dokumentasikan aktivitas materi ajar, media & refleksi kelas',
      icon: BookOpen,
      color: 'bg-[#F5F2EB] text-[#2D302A] border-[#D8D3C5] hover:bg-[#E9E5D9]',
      iconBg: 'bg-[#464632] text-[#FDFCF9]'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#2D302A]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFCF9] rounded-2xl max-w-md w-full shadow-2xl border border-[#D8D3C5] overflow-hidden">
        <div className="bg-[#5A5A40] text-[#FDFCF9] p-4 flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2">
            <span>Lembar Kerja Ringkas</span>
            <span className="text-[10px] bg-[#464632] text-[#E9E5D9] px-2 py-0.5 rounded-full font-medium">
              Quick Action
            </span>
          </h3>
          <button
            onClick={onClose}
            className="text-[#E9E5D9] hover:text-white p-1 rounded-lg hover:bg-[#464632]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-[#5A5A40] mb-2">
            Pilih tindakan cepat untuk memperbarui data administrasi kelas hari ini:
          </p>

          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onSelectAction(act.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3.5 group ${act.color}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${act.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-0.5 group-hover:underline">
                    {act.title}
                  </div>
                  <div className="text-xs opacity-80 leading-snug">
                    {act.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
