import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Announcement, AnnouncementStatus } from '../types';
import { getTodayFormatted } from '../lib/demoData';
import { 
  Bell, 
  Megaphone, 
  Plus, 
  Search, 
  Trash2, 
  X, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  Eye 
} from 'lucide-react';

interface PengumumanProps {
  initialOpenAdd?: boolean;
}

export const Pengumuman: React.FC<PengumumanProps> = ({ initialOpenAdd = false }) => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, teacherProfile } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Publikasikan' | 'Draft'>('Semua');

  const [isModalOpen, setIsModalOpen] = useState(initialOpenAdd);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<AnnouncementStatus>('Publikasikan');
  const [date, setDate] = useState(getTodayFormatted());
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => {
    setTitle('');
    setContent('');
    setStatus('Publikasikan');
    setDate(getTodayFormatted());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addAnnouncement({
        title,
        content,
        status,
        date
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (ann: Announcement) => {
    const newStatus: AnnouncementStatus = ann.status === 'Publikasikan' ? 'Draft' : 'Publikasikan';
    await updateAnnouncement(ann.id, { status: newStatus });
  };

  const handleDelete = async (id: string, annTitle: string) => {
    if (window.confirm(`Hapus pengumuman "${annTitle}"?`)) {
      await deleteAnnouncement(id);
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                        a.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const generateWAFormat = (a: Announcement) => {
    let msg = `📢 *PENGUMUMAN KELAS ${teacherProfile.className.toUpperCase()}*\n`;
    msg += `${teacherProfile.schoolName}\n`;
    msg += `Tanggal: ${a.date}\n\n`;
    msg += `📌 *${a.title}*\n\n`;
    msg += `${a.content}\n\n`;
    msg += `Hormat kami,\n`;
    msg += `Wali Kelas: ${teacherProfile.teacherName}\n`;
    msg += `_SekolahHub Class Basic_`;
    return encodeURIComponent(msg);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <span>Pengumuman & Agenda Kelas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat informasi, surat pemberitahuan, dan pesan siaran WhatsApp untuk Orang Tua/Wali Murid.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata kunci pengumuman..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:bg-white w-full md:w-auto"
        >
          <option value="Semua">Status: Semua</option>
          <option value="Publikasikan">Dipublikasikan</option>
          <option value="Draft">Draft (Belum Dipublikasi)</option>
        </select>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold text-sm">Belum Ada Pengumuman</p>
          <p className="text-slate-400 text-xs mt-1">
            {search ? 'Tidak ada pengumuman yang sesuai pencarian.' : 'Klik tombol "Buat Pengumuman Baru" untuk membuat pemberitahuan.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map(a => (
            <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${a.status === 'Publikasikan' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {a.status === 'Publikasikan' ? 'Terpublikasi' : 'Draft'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{a.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(a)}
                    className="text-xs text-slate-600 hover:text-purple-600 font-semibold underline"
                  >
                    Ubah ke {a.status === 'Publikasikan' ? 'Draft' : 'Publikasikan'}
                  </button>
                  <button
                    onClick={() => handleDelete(a.id, a.title)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                <p className="text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                  {a.content}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={`https://wa.me/?text=${generateWAFormat(a)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Siarkan ke WhatsApp Group Kelas</span>
                </a>
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
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span>Buat Pengumuman Baru</span>
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as AnnouncementStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-900 font-semibold"
                  >
                    <option value="Publikasikan">Publikasikan Langsung</option>
                    <option value="Draft">Simpan Sebagai Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemberitahuan Libur Nasioanl & Pertemuan Orang Tua"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Pesan Pengumuman *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tuliskan detail informasi, jam, lokasi, dan instruksi penting untuk orang tua murid..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-900"
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
