import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  UserCheck,
  Lightbulb,
  Copy,
  Check,
  Send,
  Loader2,
  X
} from 'lucide-react';
import { AssessmentAspect, StudentProfile, ClassInfo } from '../types';
import { getSubjectsByLevel } from '../lib/subjectConfig';

interface AksaAiWidgetProps {
  classInfo?: ClassInfo;
  students: StudentProfile[];
  onInsertToGradebook?: (studentId: string, aspect: AssessmentAspect, narrative: string) => void;
  onInsertToJournal?: (topic: string, content: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AksaAiWidget: React.FC<AksaAiWidgetProps> = ({
  classInfo,
  students,
  onInsertToGradebook,
  onInsertToJournal,
  onClose,
  isModal = false
}) => {
  const levelSubjects = getSubjectsByLevel(classInfo?.level);
  const [activeTab, setActiveTab] = useState<'narrative' | 'journal' | 'activity'>('narrative');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State - Narrative
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [aspect, setAspect] = useState<string>(levelSubjects[0] || 'Kognitif');
  const [observations, setObservations] = useState<string>('');

  // Form State - Journal
  const [journalTopic, setJournalTopic] = useState<string>('');
  const [learningGoal, setLearningGoal] = useState<string>('');
  const [media, setMedia] = useState<string>('');

  // Form State - Activity
  const [activityTopic, setActivityTopic] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('TK B (Usia 5-6 Tahun)');

  // Generated Result
  const [aiResult, setAiResult] = useState<string>('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleGenerate = async () => {
    setIsLoading(true);
    setAiResult('');
    setCopied(false);

    try {
      const payload = {
        mode: activeTab,
        studentName: selectedStudent?.fullName || 'Siswa',
        aspect,
        observations,
        topic: activeTab === 'journal' ? journalTopic : activityTopic,
        learningGoal,
        ageGroup,
        media
      };

      const res = await fetch('/api/aksa-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setAiResult(data.result);
      } else {
        setAiResult('Gagal terhubung ke Aksa AI: ' + (data.error || 'Terjadi kesalahan sistem.'));
      }
    } catch (err: any) {
      setAiResult('Gagal memproses permintaan AI. Pastikan jaringan server aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToGradebook = () => {
    if (selectedStudentId && aspect && aiResult && onInsertToGradebook) {
      onInsertToGradebook(selectedStudentId, aspect, aiResult);
    }
  };

  const handleApplyToJournal = () => {
    if (journalTopic && aiResult && onInsertToJournal) {
      onInsertToJournal(journalTopic, aiResult);
    }
  };

  return (
    <div id="aksa-ai-container" className={`bg-white rounded-2xl border border-[#D8D3C5] shadow-xl overflow-hidden ${isModal ? 'max-w-2xl w-full mx-auto' : ''}`}>
      {/* Header */}
      <div className="bg-[#5A5A40] text-[#FDFCF9] p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A4AC86] text-[#2D302A] flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-6 h-6 text-[#2D302A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              Aksa AI Assistant
              <span className="text-[10px] bg-[#DDBEA9]/30 text-[#FFE8D6] border border-[#DDBEA9]/40 px-2 py-0.5 rounded-full font-semibold">
                Gemini 3.6 Flash
              </span>
            </h3>
            <p className="text-xs text-[#E9E5D9]">
              Asisten Asli Guru TK & SD — Penulisan Narasi Raport & Jurnal Mengajar
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[#E9E5D9] hover:text-white p-1 rounded-lg hover:bg-[#464632] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D8D3C5] bg-[#F5F2EB] p-1.5 gap-1 text-xs font-medium">
        <button
          onClick={() => { setActiveTab('narrative'); setAiResult(''); }}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'narrative'
              ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm font-semibold'
              : 'text-[#2D302A] hover:bg-[#E9E5D9]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Narasi Raport Siswa</span>
        </button>

        <button
          onClick={() => { setActiveTab('journal'); setAiResult(''); }}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'journal'
              ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm font-semibold'
              : 'text-[#2D302A] hover:bg-[#E9E5D9]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Draf Jurnal Mengajar</span>
        </button>

        <button
          onClick={() => { setActiveTab('activity'); setAiResult(''); }}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'activity'
              ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm font-semibold'
              : 'text-[#2D302A] hover:bg-[#E9E5D9]'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Ide Aktivitas Kelas</span>
        </button>
      </div>

      {/* Content Form */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Tab 1: Narrative */}
        {activeTab === 'narrative' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2D302A] mb-1">Pilih Siswa</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.nickname})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D302A] mb-1">Kategori / Mata Pelajaran</label>
                <select
                  value={aspect}
                  onChange={(e) => setAspect(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
                >
                  {levelSubjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D302A] mb-1">Catatan Pengamatan Guru</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Contoh: Kirin sangat tekun mewarnai tetapi masih agak malu saat bercerita di depan teman-teman..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Journal */}
        {activeTab === 'journal' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D302A] mb-1">Tema / Topik Pembelajaran</label>
              <input
                type="text"
                value={journalTopic}
                onChange={(e) => setJournalTopic(e.target.value)}
                placeholder="Contoh: Tema Diriku / Profesi Pemadam Kebakaran"
                className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2D302A] mb-1">Tujuan Pembelajaran</label>
                <input
                  type="text"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="Contoh: Anak paham tugas pemadam kebakaran"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D302A] mb-1">Media / Alat Perat</label>
                <input
                  type="text"
                  value={media}
                  onChange={(e) => setMedia(e.target.value)}
                  placeholder="Contoh: Video miniatur, baju pemadam"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Activity */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D302A] mb-1">Topik Pembelajaran</label>
              <input
                type="text"
                value={activityTopic}
                onChange={(e) => setActivityTopic(e.target.value)}
                placeholder="Contoh: Mengenal Warna & Eksperimen Pencampuran Warna"
                className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D302A] mb-1">Jenjang / kelompok Usia</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D8D3C5] focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] outline-none"
              >
                <option value="PAUD / KB (Usia 2-4 Tahun)">PAUD / Kelompok Bermain (2-4 Tahun)</option>
                <option value="TK A (Usia 4-5 Tahun)">TK A (4-5 Tahun)</option>
                <option value="TK B (Usia 5-6 Tahun)">TK B (5-6 Tahun)</option>
                <option value="SD Kelas 1-2 (Usia 6-8 Tahun)">SD Kelas 1-2 (6-8 Tahun)</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          id="btn-generate-aksa"
          className="w-full bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FFE8D6]" />
              <span>Aksa AI sedang menyusun narasi...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#A4AC86]" />
              <span>Hasilkan Narasi / Draf dengan Aksa AI</span>
            </>
          )}
        </button>

        {/* Output Result */}
        {aiResult && (
          <div className="mt-4 p-4 rounded-xl bg-[#F5F2EB] border border-[#D8D3C5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2D302A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                Hasil Rekomendasi Aksa AI
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs bg-white text-[#2D302A] hover:bg-[#E9E5D9] border border-[#D8D3C5] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  title="Salin Teks"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5A5A40]" />
                      <span className="text-[#5A5A40] font-medium">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#5A5A40]" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                {activeTab === 'narrative' && onInsertToGradebook && (
                  <button
                    onClick={handleApplyToGradebook}
                    className="text-xs bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] px-2.5 py-1 rounded-lg font-medium transition-all"
                  >
                    Simpan ke Buku Nilai
                  </button>
                )}

                {activeTab === 'journal' && onInsertToJournal && (
                  <button
                    onClick={handleApplyToJournal}
                    className="text-xs bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] px-2.5 py-1 rounded-lg font-medium transition-all"
                  >
                    Simpan ke Jurnal
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs text-[#2D302A] leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-lg border border-[#D8D3C5] max-h-60 overflow-y-auto">
              {aiResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
