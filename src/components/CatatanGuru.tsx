import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TeacherNote, NoteCategory } from '../types';
import { getTodayFormatted } from '../lib/demoData';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  X, 
  Calendar, 
  FileText, 
  Share2 
} from 'lucide-react';

interface CatatanGuruProps {
  initialOpenAdd?: boolean;
}

export const CatatanGuru: React.FC<CatatanGuruProps> = ({ initialOpenAdd = false }) => {
  const { notes, addNote, deleteNote } = useAuth();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');

  const [isModalOpen, setIsModalOpen] = useState(initialOpenAdd);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('Jurnal Harian');
  const [date, setDate] = useState(getTodayFormatted());
  const [submitting, setSubmitting] = useState(false);

  const categories: NoteCategory[] = [
    'Jurnal Harian', 
    'Perkembangan Siswa', 
    'Pelanggaran', 
    'Prestasi', 
    'Catatan Khusus'
  ];

  const handleOpenModal = () => {
    setTitle('');
    setContent('');
    setCategory('Jurnal Harian');
    setDate(getTodayFormatted());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addNote({
        title,
        content,
        category,
        date
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, noteTitle: string) => {
    if (window.confirm(`Hapus catatan "${noteTitle}"?`)) {
      await deleteNote(id);
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                        n.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'Semua' || n.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>Catatan & Jurnal Guru</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi jurnal harian, perkembangan, prestasi, serta jurnal kejadian khusus siswa.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Catatan Baru</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul atau isi catatan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:bg-white w-full md:w-auto"
        >
          <option value="Semua">Kategori: Semua</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold text-sm">Belum Ada Catatan</p>
          <p className="text-slate-400 text-xs mt-1">
            {search ? 'Tidak ada catatan sesuai pencarian.' : 'Klik tombol "Tambah Catatan Baru" untuk membuat entri jurnal.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(n => (
            <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 relative group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold">
                    {n.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{n.date}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                  {n.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`*${n.title}* (${n.date})\nKategori: ${n.category}\n\n${n.content}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Kirim WA</span>
                </a>

                <button
                  onClick={() => handleDelete(n.id, n.title)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Buat Catatan Jurnal Guru</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Catatan</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as NoteCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Catatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Evaluasi Diskusi Kelompok Bahasa Indonesia"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Catatan / Catatan Kejadian *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tuliskan catatan kejadian, jurnal pembelajaran, atau catatan perilaku siswa secara terperinci..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
