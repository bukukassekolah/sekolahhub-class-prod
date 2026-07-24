import React, { useState } from 'react';
import {
  Settings,
  Cloud,
  CloudOff,
  RefreshCw,
  Download,
  RotateCcw,
  MessageSquare,
  Send,
  CheckCircle2,
  Database,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Palette,
  Check
} from 'lucide-react';
import { ClassInfo, SyncQueueItem, FeedbackType } from '../../types';
import { saveFeedback, ThemeMode } from '../../lib/storageManager';

interface SettingsViewProps {
  classInfo: ClassInfo;
  syncQueue: SyncQueueItem[];
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  onManualSync: () => void;
  onResetData: () => void;
  onResetDatabase?: () => void;
  onOpenImportModal?: () => void;
  isSyncing: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  classInfo,
  syncQueue,
  currentTheme = 'default',
  onThemeChange,
  onManualSync,
  onResetData,
  onResetDatabase,
  onOpenImportModal,
  isSyncing,
}) => {
  // Feedback Form State
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('Saran');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState(classInfo.teacherEmail);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSendingFeedback(true);
    try {
      saveFeedback({
        type: feedbackType,
        message: feedbackMessage,
        email: feedbackEmail
      });

      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: feedbackType, message: feedbackMessage, email: feedbackEmail })
      });

      setFeedbackSent(true);
      setFeedbackMessage('');
      setTimeout(() => setFeedbackSent(false), 4000);
    } catch {
      alert('Feedback tersimpan secara lokal dan akan disinkronkan.');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        classInfo,
        exportedAt: new Date().toISOString()
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SekolahHub_Backup_${classInfo.className.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-800" />
          <span>Pengaturan & Sinkronisasi Database</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Status koneksi Google Spreadsheet, pilihan tema dashboard, dan pengelolaan data cadangan
        </p>
      </div>

      {/* Pengaturan Tampilan -> Tema Dashboard */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-800" />
            <span>Tema Dashboard</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Pilih skema warna antarmuka aplikasi. Tema pilihan Anda akan tersimpan secara otomatis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Default Theme Card */}
          <div
            onClick={() => onThemeChange && onThemeChange('default')}
            id="theme-card-default"
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              (currentTheme || 'default') === 'default'
                ? 'bg-emerald-50/50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">1. Default</span>
                {(currentTheme || 'default') === 'default' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Skema bawaan khas SekolahHub dengan nuansa Olive, Sand, dan Cream yang tenang.
              </p>
            </div>

            {/* Theme Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-6 h-6 rounded-lg bg-[#5A5A40] border border-stone-300 shadow-xs" title="Primary Olive" />
              <div className="w-6 h-6 rounded-lg bg-[#464632] border border-stone-300 shadow-xs" title="Dark AppBar" />
              <div className="w-6 h-6 rounded-lg bg-[#A4AC86] border border-stone-300 shadow-xs" title="Accent Sage" />
              <div className="w-6 h-6 rounded-lg bg-[#F5F2EB] border border-stone-300 shadow-xs" title="Cream Surface" />
            </div>
          </div>

          {/* Umum Theme Card */}
          <div
            onClick={() => onThemeChange && onThemeChange('general')}
            id="theme-card-general"
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              currentTheme === 'general'
                ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">2. Umum</span>
                {currentTheme === 'general' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-700 text-white text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tema modern untuk TK, SD Negeri, & SD Swasta dengan warna Biru dan Hijau segar.
              </p>
            </div>

            {/* Theme Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-6 h-6 rounded-lg bg-[#1E40AF] border border-stone-300 shadow-xs" title="Primary Blue" />
              <div className="w-6 h-6 rounded-lg bg-[#1E293B] border border-stone-300 shadow-xs" title="Dark Slate AppBar" />
              <div className="w-6 h-6 rounded-lg bg-[#10B981] border border-stone-300 shadow-xs" title="Emerald Accent" />
              <div className="w-6 h-6 rounded-lg bg-[#F1F5F9] border border-stone-300 shadow-xs" title="White Slate Surface" />
            </div>
          </div>

          {/* Islami Theme Card */}
          <div
            onClick={() => onThemeChange && onThemeChange('islamic')}
            id="theme-card-islamic"
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              currentTheme === 'islamic'
                ? 'bg-emerald-50/50 border-emerald-700 ring-2 ring-emerald-700/20 shadow-sm'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">3. Islami</span>
                {currentTheme === 'islamic' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tema bernuansa islami dengan warna Hijau Zamrud, AppBar Hijau Tua, & Emas Lembut.
              </p>
            </div>

            {/* Theme Swatch Preview */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-6 h-6 rounded-lg bg-[#047857] border border-stone-300 shadow-xs" title="Primary Emerald" />
              <div className="w-6 h-6 rounded-lg bg-[#022C22] border border-stone-300 shadow-xs" title="Deep Green AppBar" />
              <div className="w-6 h-6 rounded-lg bg-[#D97706] border border-stone-300 shadow-xs" title="Soft Gold Accent" />
              <div className="w-6 h-6 rounded-lg bg-[#F3F0E6] border border-stone-300 shadow-xs" title="Ivory Surface" />
            </div>
          </div>
        </div>
      </div>

      {/* Google Sheets Connection Panel */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Google Spreadsheet Database</h3>
              <p className="text-xs text-stone-500">
                Nama Spreadsheet: {classInfo.googleSheetName || `SekolahHub Class Database - ${classInfo.className}`}
              </p>
            </div>
          </div>

          {classInfo.googleSheetId && classInfo.googleSheetConnected ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terhubung (Spreadsheet Nyata)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Belum Dihubungkan</span>
            </span>
          )}
        </div>

        {classInfo.lastSyncError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block">Gagal Sinkronisasi Google Sheets:</span>
              <span>{classInfo.lastSyncError}</span>
            </div>
          </div>
        )}

        <div className="bg-stone-50 p-4 rounded-xl text-xs space-y-2 text-stone-700">
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Spreadsheet ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-stone-900 font-semibold bg-white px-2 py-0.5 rounded border border-stone-200">
                {classInfo.googleSheetId || 'Belum dibuat'}
              </span>
              {classInfo.googleSheetId && (
                <a
                  href={`https://docs.google.com/spreadsheets/d/${classInfo.googleSheetId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-800 hover:text-emerald-900 font-bold underline flex items-center gap-1"
                >
                  <span>Buka di Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Antrean Perubahan Offline:</span>
            <span className={`font-bold ${syncQueue.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {syncQueue.length > 0 ? `${syncQueue.length} Perubahan Menunggu Sync` : 'Semua Data Tersinkron'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Terakhir Dibarui:</span>
            <span className="text-stone-600">{new Date(classInfo.lastSyncedAt || Date.now()).toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-stone-500 max-w-sm">
            Skema lembar kerja: <b>StudentProfile, Attendance, Grades, ClassSavings, TeachingJournal, ClassInfo, Feedback</b>.
          </p>

          <button
            onClick={onManualSync}
            disabled={isSyncing}
            id="btn-force-sync"
            className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Paksa Sinkronisasi Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Manajemen Data & Database Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Import Data Siswa */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Import Data Siswa (Excel)</span>
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Unggah file .xlsx untuk menambahkan atau memperbarui data siswa secara masal dengan Auto Mapping.
          </p>
          <button
            onClick={onOpenImportModal}
            className="w-full bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Buka Menu Import Excel</span>
          </button>
        </div>

        {/* Reset Database (Fitur Baru 2) */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-700" />
            <span>Reset Database</span>
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Kosongkan seluruh data operasional (siswa, presensi, nilai, jurnal, tabungan, feedback) tanpa menghapus spreadsheet & struktur kelas.
          </p>
          <button
            onClick={() => {
              if (
                confirm(
                  'Seluruh data siswa, presensi, nilai, jurnal, tabungan, dan feedback akan dihapus. Struktur database tetap dipertahankan.'
                )
              ) {
                if (onResetDatabase) {
                  onResetDatabase();
                }
              }
            }}
            id="btn-reset-database"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Seluruh Data Operasional</span>
          </button>
        </div>

        {/* Export JSON */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Ekspor Cadangan Data (JSON)</span>
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Unduh seluruh arsip data kelas dalam format JSON untuk cadangan pribadi.
          </p>
          <button
            onClick={handleExportJson}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-stone-300 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File Cadangan JSON</span>
          </button>
        </div>

        {/* Reset Demo Data */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-stone-700" />
            <span>Muat Ulang Contoh Data Demo</span>
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Mengembalikan seluruh data kelas ke data contoh simulasi awal (TK B Ceria).
          </p>
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin memuat kembali data contoh simulasi awal?')) {
                onResetData();
              }
            }}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-stone-300 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-stone-600" />
            <span>Muat Data Demo</span>
          </button>
        </div>
      </div>

      {/* Feedback Form for Developer */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <MessageSquare className="w-5 h-5 text-emerald-800" />
          <div>
            <h3 className="font-bold text-sm text-stone-900">Kirim Feedback ke Pengembang SekolahHub</h3>
            <p className="text-xs text-stone-500">Saran, laporan kendala (bug), pertanyaan, atau permintaan fitur baru</p>
          </div>
        </div>

        {feedbackSent && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Feedback Anda telah berhasil dikirim! Terima kasih atas dukungan Anda.</span>
          </div>
        )}

        <form onSubmit={handleSendFeedback} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Kategori Feedback</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="Saran">Saran & Masukan</option>
                <option value="Bug">Laporan Bug / Kendala</option>
                <option value="Pertanyaan">Pertanyaan Penggunaan</option>
                <option value="Fitur">Permintaan Fitur Baru</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Anda</label>
              <input
                type="email"
                required
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Pesan Feedback *</label>
            <textarea
              required
              rows={3}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Tuliskan masukan atau kendala Anda di sini..."
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSendingFeedback}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Feedback</span>
          </button>
        </form>
      </div>
    </div>
  );
};
