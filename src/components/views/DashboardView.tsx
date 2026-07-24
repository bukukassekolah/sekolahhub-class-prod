import React from 'react';
import { TeacherClock } from '../TeacherClock';
import {
  Users,
  CalendarCheck,
  Wallet,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  CloudOff,
  ChevronRight
} from 'lucide-react';
import {
  ClassInfo,
  StudentProfile,
  AttendanceRecord,
  ClassSavingTransaction,
  TeachingJournalEntry,
  SyncQueueItem,
  AssessmentAspect,
  GoogleUserProfile
} from '../../types';
import { AksaAiWidget } from '../AksaAiWidget';

interface DashboardViewProps {
  classInfo: ClassInfo;
  students: StudentProfile[];
  attendance: AttendanceRecord[];
  savings: ClassSavingTransaction[];
  journals: TeachingJournalEntry[];
  syncQueue: SyncQueueItem[];
  googleUser?: GoogleUserProfile | null;
  onNavigateTab: (tab: string) => void;
  onOpenQuickAction: () => void;
  onInsertToGradebook: (studentId: string, aspect: AssessmentAspect, narrative: string) => void;
  onInsertToJournal: (topic: string, content: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  classInfo,
  students,
  attendance,
  savings,
  journals,
  syncQueue,
  googleUser,
  onNavigateTab,
  onOpenQuickAction,
  onInsertToGradebook,
  onInsertToJournal,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's attendance calculation
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const totalStudents = students.length;
  const hadirCount = todayAttendance.filter(a => a.status === 'Hadir').length;
  const attendancePercentage = totalStudents > 0
    ? Math.round((hadirCount / totalStudents) * 100)
    : 0;

  // Savings calculation
  const totalMasuk = savings
    .filter(s => s.type === 'Setoran')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalKeluar = savings
    .filter(s => s.type === 'Penarikan')
    .reduce((sum, s) => sum + s.amount, 0);

  const saldoAkhir = totalMasuk - totalKeluar;

  // Latest Journal
  const latestJournal = journals[0];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Clock with Personalized Greeting */}
      <TeacherClock
        teacherName={googleUser?.name || classInfo.teacherName}
        userPicture={googleUser?.picture}
      />

      {/* Offline Queue Sync Bar */}
      {syncQueue.length > 0 && (
        <div className="bg-[#FFE8D6] border border-[#DDBEA9] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#2D302A]">
          <div className="flex items-center gap-2.5">
            <CloudOff className="w-5 h-5 text-[#5A5A40] shrink-0 animate-bounce" />
            <div>
              <span className="font-bold">Antrean Offline ({syncQueue.length} Perubahan)</span>
              <p className="text-[#2D302A]/80 text-[11px]">
                Data tersimpan aman di browser Anda dan akan disinkronkan ke Google Spreadsheet saat tombol Cloud Sync diklik.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('settings')}
            className="bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
          >
            Lihat Status Sync
          </button>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-2xl border border-[#D8D3C5] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5A5A40] uppercase tracking-wider">
              Daftar Siswa
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#E9E5D9] text-[#5A5A40] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-[#2D302A]">
              {totalStudents} <span className="text-sm font-normal text-[#5A5A40]">Anak</span>
            </div>
            <span className="text-xs text-[#5A5A40] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Lihat <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5A5A40]">
            {students.filter(s => s.gender === 'L').length} Laki-laki • {students.filter(s => s.gender === 'P').length} Perempuan
          </div>
        </div>

        {/* Metric 2: Attendance */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-[#D8D3C5] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5A5A40] uppercase tracking-wider">
              Presensi Hari Ini
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#A4AC86]/30 text-[#2D302A] flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5 text-[#5A5A40]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-[#2D302A]">
              {attendancePercentage}%
            </div>
            <span className="text-xs text-[#5A5A40] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Rekap <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5A5A40]">
            {hadirCount} dari {totalStudents} anak hadir hari ini
          </div>
        </div>

        {/* Metric 3: Savings */}
        <div
          onClick={() => onNavigateTab('savings')}
          className="bg-white p-5 rounded-2xl border border-[#D8D3C5] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5A5A40] uppercase tracking-wider">
              Saldo Kas Kelas
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#DDBEA9]/40 text-[#2D302A] flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5 text-[#5A5A40]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-xl sm:text-2xl font-extrabold text-[#2D302A] truncate">
              {formatRupiah(saldoAkhir)}
            </div>
            <span className="text-xs text-[#5A5A40] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Detail <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5A5A40] font-medium">
            Setoran: {formatRupiah(totalMasuk)}
          </div>
        </div>

        {/* Metric 4: Latest Journal */}
        <div
          onClick={() => onNavigateTab('journal')}
          className="bg-white p-5 rounded-2xl border border-[#D8D3C5] shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5A5A40] uppercase tracking-wider">
              Jurnal Terakhir
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#E9E5D9] text-[#2D302A] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-[#5A5A40]" />
            </div>
          </div>
          <div className="font-bold text-sm text-[#2D302A] line-clamp-2 mb-1">
            {latestJournal ? latestJournal.topic : 'Belum ada jurnal'}
          </div>
          <div className="text-[11px] text-[#5A5A40]">
            {latestJournal ? latestJournal.date : 'Tulis jurnal mengajar baru'}
          </div>
        </div>
      </div>

      {/* Quick Actions & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action Launcher Card */}
        <div className="bg-[#5A5A40] text-[#FDFCF9] p-5 sm:p-6 rounded-2xl shadow-md border border-[#464632] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#FFE8D6] font-bold text-xs uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-[#DDBEA9]" />
              <span>Lembar Kerja Ringkas Guru</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Aksi Cepat Administrasi</h3>
            <p className="text-xs text-[#E9E5D9] leading-relaxed mb-4">
              Rekam kehadiran, input nilai perkembangan, mutasi kas tabungan, dan jurnal mengajar dalam 1 klik sederhana.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onOpenQuickAction}
              className="w-full bg-[#A4AC86] hover:bg-[#939b77] text-[#2D302A] font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-[#2D302A]" />
              <span>Buka Menu Aksi Cepat</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#E9E5D9]">
              <button
                onClick={() => onNavigateTab('attendance')}
                className="p-2 rounded-lg bg-[#464632]/60 hover:bg-[#464632] text-left transition-colors truncate border border-[#6E6E51]/40"
              >
                + Presensi Hari Ini
              </button>
              <button
                onClick={() => onNavigateTab('savings')}
                className="p-2 rounded-lg bg-[#464632]/60 hover:bg-[#464632] text-left transition-colors truncate border border-[#6E6E51]/40"
              >
                + Setor Tabungan
              </button>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D8D3C5] shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#2D302A]">
                Ringkasan Keuangan Tabungan Kelas
              </h3>
              <p className="text-xs text-[#5A5A40]">
                Rincian penerimaan setoran dan penarikan kas tabungan siswa
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('savings')}
              className="text-xs text-[#5A5A40] hover:text-[#2D302A] font-bold"
            >
              Kelola Tabungan →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-[#F5F2EB] border border-[#A4AC86]/50">
              <div className="flex items-center gap-1.5 text-xs text-[#5A5A40] font-medium mb-1">
                <ArrowDownLeft className="w-4 h-4 text-[#5A5A40]" />
                <span>Total Masuk (Setoran)</span>
              </div>
              <div className="text-lg font-bold text-[#2D302A]">
                {formatRupiah(totalMasuk)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFE8D6]/40 border border-[#DDBEA9]">
              <div className="flex items-center gap-1.5 text-xs text-[#2D302A] font-medium mb-1">
                <ArrowUpRight className="w-4 h-4 text-[#5A5A40]" />
                <span>Total Keluar (Penarikan)</span>
              </div>
              <div className="text-lg font-bold text-[#2D302A]">
                {formatRupiah(totalKeluar)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#E9E5D9]/60 border border-[#D8D3C5]">
              <div className="flex items-center gap-1.5 text-xs text-[#5A5A40] font-medium mb-1">
                <Wallet className="w-4 h-4 text-[#5A5A40]" />
                <span>Saldo Kas Akhir</span>
              </div>
              <div className="text-lg font-bold text-[#2D302A]">
                {formatRupiah(saldoAkhir)}
              </div>
            </div>
          </div>

          {/* Recent 3 savings transactions */}
          <div className="border-t border-[#D8D3C5]/60 pt-3">
            <div className="text-xs font-semibold text-[#5A5A40] mb-2">Transaksi Terbaru:</div>
            <div className="space-y-2">
              {savings.slice(0, 3).map((st) => (
                <div key={st.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#E9E5D9] last:border-none">
                  <div>
                    <span className="font-semibold text-[#2D302A]">{st.studentName}</span>
                    <span className="text-[#5A5A40]/70 ml-2">({st.date})</span>
                  </div>
                  <div className={`font-bold ${st.type === 'Setoran' ? 'text-[#5A5A40]' : 'text-[#8C5E47]'}`}>
                    {st.type === 'Setoran' ? '+' : '-'}{formatRupiah(st.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Aksa AI Assistant */}
      <div className="pt-2">
        <AksaAiWidget
          classInfo={classInfo}
          students={students}
          onInsertToGradebook={onInsertToGradebook}
          onInsertToJournal={onInsertToJournal}
        />
      </div>
    </div>
  );
};
