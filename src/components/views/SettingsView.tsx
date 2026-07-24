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
  UserCheck
} from 'lucide-react';
import { ClassInfo, SyncQueueItem, FeedbackType } from '../../types';
import { saveFeedback } from '../../lib/storageManager';

interface SettingsViewProps {
  classInfo: ClassInfo;
  syncQueue: SyncQueueItem[];
  onManualSync: () => void;
  onResetData: () => void;
  isSyncing: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  classInfo,
  syncQueue,
  onManualSync,
  onResetData,
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
          Status koneksi Google Spreadsheet, pengelolaan data cadangan, dan masukan pengembang
        </p>
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
                Nama Spreadsheet: {classInfo.googleSheetName || 'SekolahHub Class Database'}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terhubung</span>
          </span>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl text-xs space-y-2 text-stone-700">
          <div className="flex justify-between">
            <span className="text-stone-500">Spreadsheet ID:</span>
            <span className="font-mono text-stone-900 font-semibold">{classInfo.googleSheetId}</span>
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

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-stone-500 max-w-sm">
            Semua lembar kerja (StudentProfile, Attendance, Grades, ClassSavings, TeachingJournal, ClassInfo, Feedback) diperbarui secara real-time.
          </p>

          <button
            onClick={onManualSync}
            disabled={isSyncing}
            id="btn-force-sync"
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Paksa Sinkronisasi Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Backup & Reset Data Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-700" />
            <span>Reset Data ke Contoh Awal</span>
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Mengembalikan seluruh data kelas ke data simulasi awal (TK B Ceria).
          </p>
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke contoh awal?')) {
                onResetData();
              }
            }}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-rose-300 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Data Demo</span>
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
