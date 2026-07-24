import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Search,
  X,
  Send
} from 'lucide-react';
import { TeachingJournalEntry } from '../../types';

interface TeachingJournalViewProps {
  journals: TeachingJournalEntry[];
  onSaveJournal: (journal: TeachingJournalEntry) => void;
  onOpenAksaAi: () => void;
}

export const TeachingJournalView: React.FC<TeachingJournalViewProps> = ({
  journals,
  onSaveJournal,
  onOpenAksaAi,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [activities, setActivities] = useState('');
  const [mediaUsed, setMediaUsed] = useState('');
  const [reflection, setReflection] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const openAddModal = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setTopic('');
    setActivities('');
    setMediaUsed('');
    setReflection('');
    setPhotoUrl('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !activities.trim()) return;

    const newEntry: TeachingJournalEntry = {
      id: `jrn_${Date.now()}`,
      date,
      topic,
      activities,
      mediaUsed,
      reflection,
      photoUrl: photoUrl || undefined
    };

    onSaveJournal(newEntry);
    setIsModalOpen(false);
  };

  const filteredJournals = journals.filter(j =>
    j.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.activities.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-800" />
            <span>Jurnal Mengajar Harian Guru</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Dokumentasi tema materi, aktivitas siswa, media pembelajaran, dan refleksi guru
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenAksaAi}
            className="flex-1 sm:flex-none text-xs bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-2.5 px-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Aksa AI Draf Jurnal</span>
          </button>

          <button
            onClick={openAddModal}
            id="btn-add-journal"
            className="flex-1 sm:flex-none text-xs bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Jurnal Baru</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari tema materi, aktivitas, atau catatan refleksi..."
          className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none shadow-sm"
        />
      </div>

      {/* Journals Timeline List */}
      <div className="space-y-4">
        {filteredJournals.map((j) => (
          <div
            key={j.id}
            className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden p-5 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{j.date}</span>
              </div>

              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full w-fit">
                Dokumentasi Pembelajaran
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-stone-900 mb-2">{j.topic}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3 text-xs text-stone-800">
                <div>
                  <div className="font-bold text-stone-600 mb-1">Aktivitas Pembelajaran:</div>
                  <p className="bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed whitespace-pre-wrap">
                    {j.activities}
                  </p>
                </div>

                {j.mediaUsed && (
                  <div>
                    <div className="font-bold text-stone-600 mb-1">Media / Alat Peraga:</div>
                    <p className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-stone-700">
                      {j.mediaUsed}
                    </p>
                  </div>
                )}

                {j.reflection && (
                  <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl">
                    <div className="font-bold text-teal-900 mb-0.5">Refleksi Guru:</div>
                    <p className="text-teal-950 italic leading-relaxed">{j.reflection}</p>
                  </div>
                )}
              </div>

              {j.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-stone-200 max-h-48">
                  <img
                    src={j.photoUrl}
                    alt={j.topic}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredJournals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
            Belum ada jurnal mengajar untuk pencarian ini. Klik "Tulis Jurnal Baru" untuk menambahkan.
          </div>
        )}
      </div>

      {/* Add Journal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Tulis Jurnal Mengajar Baru</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-300 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal Mengajar *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tema / Materi Ajar *</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Tema Alam Semesta: Mengenal Benda Langit"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Aktivitas Pembelajaran (Awal, Inti, Penutup) *</label>
                <textarea
                  required
                  rows={4}
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="1. Berdoa & bernyanyi. 2. Diskusi interaktif. 3. Praktek menggambar..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Media / Alat Peraga yang Digunakan</label>
                <input
                  type="text"
                  value={mediaUsed}
                  onChange={(e) => setMediaUsed(e.target.value)}
                  placeholder="Contoh: Proyektor, kertas gambar A4, krayon..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Refleksi Guru</label>
                <textarea
                  rows={2}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Contoh: Anak-anak sangat antusias saat simulasi ruang angkasa..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">URL Foto Dokumentasi (Opsional)</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
