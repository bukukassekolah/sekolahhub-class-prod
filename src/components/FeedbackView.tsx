import React, { useState } from 'react';
import { Send, CheckCircle2, HeartHandshake } from 'lucide-react';
import { FeedbackType } from '../types';
import { sendUserFeedback } from '../lib/firebase';

interface FeedbackViewProps {
  currentUserEmail?: string | null;
  showToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  currentUserEmail,
  showToast,
}) => {
  const [type, setType] = useState<FeedbackType>('Saran');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState(currentUserEmail || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await sendUserFeedback({
        type,
        content,
        userEmail: email || 'anonim@sekolahhub.id',
      });
      setSubmitted(true);
      showToast('success', 'Umpan balik Anda telah berhasil terkirim!');
    } catch (err) {
      showToast('error', 'Gagal mengirim umpan balik.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Umpan Balik & Masukan Guru</h2>
            <p className="text-xs text-slate-500">
              Bantu kami mengembangankan SekolahHub Class Basic agar semakin mempermudah tugas guru di seluruh Indonesia.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Terima Kasih Atas Masukan Anda!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Setiap masukan dari Bapak/Ibu Guru sangat berharga bagi peningkatan platform SekolahHub.
            </p>
            <button
              onClick={() => { setSubmitted(false); setContent(''); }}
              className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100"
            >
              Kirim Masukan Lainnya
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenis Umpan Balik</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Saran', 'Bug', 'Pertanyaan', 'Permintaan Fitur'] as FeedbackType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      type === t
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email kontak Anda (Opsional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guru@sekolah.sch.id"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pesan / Masukan *</label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan pengalaman, kendala, atau saran fitur baru yang Anda butuhkan..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Mengirim...' : 'Kirim Umpan Balik'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
