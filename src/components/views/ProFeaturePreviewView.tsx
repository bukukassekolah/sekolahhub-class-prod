import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  X,
  Camera,
  Image as ImageIcon,
  BookOpen,
  Tag,
  Bot,
  Star,
  Globe,
  Newspaper,
  Lightbulb,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ProFeaturePreviewViewProps {
  tabId?: string;
}

interface FeatureCardItem {
  icon: string | React.ReactNode;
  title: string;
  description?: string;
  items?: string[];
  note?: string;
}

const PORTOFOLIO_CARDS: FeatureCardItem[] = [
  {
    icon: '📷',
    title: 'Ambil Foto Langsung',
    description: 'Guru dapat memotret hasil karya siswa langsung dari kamera HP.'
  },
  {
    icon: '🖼',
    title: 'Upload dari Galeri',
    description: 'Pilih foto hasil belajar yang sudah ada di galeri perangkat.'
  },
  {
    icon: '📚',
    title: 'Dokumentasi Hasil Belajar',
    description: 'Simpan perkembangan siswa berdasarkan tanggal sehingga mudah ditelusuri kembali.'
  },
  {
    icon: '🏷',
    title: 'Kategori Portofolio',
    description: 'Kelompokkan dokumentasi menjadi:',
    items: [
      'Buku Tulis',
      'Lembar Kerja',
      'Gambar',
      'Kerajinan',
      'Praktik',
      'Dokumentasi Kegiatan'
    ]
  },
  {
    icon: '🤖',
    title: 'Analisis dengan Aksa AI',
    description: 'Aksa AI membantu membuat draft:',
    items: [
      'Catatan Guru',
      'Deskripsi Portofolio',
      'Ringkasan Perkembangan',
      'Narasi Rapor'
    ],
    note: 'Guru tetap menjadi penentu akhir.'
  },
  {
    icon: '⭐',
    title: 'Tandai Karya Terbaik',
    description: 'Pilih hasil karya terbaik siswa sebagai dokumentasi semester.'
  },
  {
    icon: '🌐',
    title: 'Publish ke Website Kelas',
    description: 'Publikasikan karya pilihan ke Website Kelas apabila guru mengizinkan.'
  },
  {
    icon: '📰',
    title: 'Tampilkan di Mading Digital',
    description: 'Hasil karya dapat dipublikasikan ke Mading Digital sekolah.'
  }
];

const DEFAULT_PRO_CARDS = [
  {
    icon: '🎨',
    title: 'Konten Visual Profesional',
    items: [
      'Poster Pembelajaran',
      'Flashcard',
      'Lembar Mewarnai',
      'Banner Kegiatan',
      'Sertifikat Siswa',
      'Jadwal Pelajaran',
      'Jadwal Piket'
    ]
  },
  {
    icon: '📄',
    title: 'Dokumen Pembelajaran',
    items: ['Modul Ajar', 'RPP', 'LKPD', 'Kisi-kisi Soal', 'Rubrik Penilaian']
  },
  {
    icon: '🎤',
    title: 'Voice to Text',
    items: [
      'Bicara tanpa mengetik',
      'Otomatis menjadi Jurnal Mengajar',
      'Otomatis menjadi Narasi Rapor'
    ]
  },
  {
    icon: '🌐',
    title: 'HTML Professional',
    items: [
      'Website Kelas',
      'Mading Digital',
      'Halaman Pengumuman',
      'Berita Kelas siap publish'
    ]
  },
  {
    icon: '🚀',
    title: 'Publish Center',
    items: [
      'Publish Website Kelas',
      'Publish Mading Digital',
      'Simpan Draft',
      'Riwayat Publish'
    ]
  }
];

export const ProFeaturePreviewView: React.FC<ProFeaturePreviewViewProps> = ({ tabId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPortofolio = tabId === 'pro-portofolio';

  if (isPortofolio) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-amber-900/90 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 rounded-3xl border border-amber-700/40 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-8 top-8 opacity-10 pointer-events-none">
            <Crown className="w-48 h-48 text-amber-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Eksklusif di SekolahHub Pro</span>
            </div>

            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 shadow-inner text-2xl">
                ⭐
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5 flex-wrap">
                  <span>⭐ Portofolio Digital Siswa</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-400 text-stone-950 font-black uppercase tracking-wider">
                    PRO
                  </span>
                </h2>
                <p className="text-amber-200/90 text-xs sm:text-sm mt-1 leading-relaxed max-w-2xl">
                  Dokumentasikan perkembangan setiap siswa melalui foto hasil karya, buku tulis, lembar kerja, dan aktivitas kelas dalam satu portofolio digital yang rapi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Fitur Portofolio Digital</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Kemampuan Utama Portofolio Siswa (PRO)
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Pratinjau fitur yang akan membantu guru mendokumentasikan karya dan perkembangan belajar siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTOFOLIO_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200/90 transition-all space-y-3 flex flex-col justify-between shadow-2xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-white border border-stone-200 shadow-2xs shrink-0">
                      {card.icon}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 leading-tight">
                      {card.title}
                    </h4>
                  </div>

                  {card.description && (
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {card.description}
                    </p>
                  )}

                  {card.items && card.items.length > 0 && (
                    <ul className="space-y-1.5 pt-1 pl-1">
                      {card.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-xs text-stone-700 flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {card.note && (
                    <p className="text-[11px] font-medium text-stone-500 italic pt-1 border-t border-stone-200/60">
                      * {card.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info Box: Mengapa menggunakan Portofolio Digital? */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3 text-stone-800">
            <div className="flex items-center gap-2.5 font-extrabold text-amber-950 text-base">
              <span className="text-xl">💡</span>
              <h4>Mengapa menggunakan Portofolio Digital?</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                'Tidak perlu menyimpan foto secara acak di WhatsApp.',
                'Dokumentasi perkembangan siswa tersusun rapi.',
                'Mudah mencari karya berdasarkan tanggal.',
                'Memudahkan penyusunan narasi rapor.',
                'Menjadi bukti perkembangan belajar siswa.',
                'Orang tua dapat melihat perkembangan yang dipublikasikan guru.'
              ].map((point, index) => (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-stone-700">
                  <span className="text-amber-700 font-bold shrink-0">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
              <Crown className="w-4 h-4 text-amber-600 shrink-0" />
              <span>👑 Fitur Eksklusif SekolahHub Pro</span>
            </div>

            <a
              href="https://daftar.sekolahhub.web.id"
              target="_blank"
              rel="noopener noreferrer"
              id="btn-pelajari-pro-portofolio"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Pelajari SekolahHub Class Pro</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Modal Dialog */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 border border-stone-200 shadow-2xl relative text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 mx-auto flex items-center justify-center shadow-xs text-2xl">
                ⭐
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-stone-900">
                  SekolahHub Class Pro
                </h3>
                <p className="text-sm font-semibold text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  Fitur Pro akan segera tersedia.
                </p>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Terima kasih atas minat Anda. Tim pengembang KUKAS Platform sedang mempersiapkan fitur Portofolio Digital Pro secara bertahap.
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="https://daftar.sekolahhub.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
                >
                  <span>Pelajari SekolahHub Class Pro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback for other pro tabs
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-900/90 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 rounded-3xl border border-amber-700/40 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-8 top-8 opacity-10 pointer-events-none">
          <Crown className="w-48 h-48 text-amber-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>SekolahHub Class Pro</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 shadow-inner text-2xl">
              👑
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>Fitur SekolahHub Pro</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 font-black uppercase tracking-wider">
                  PRO
                </span>
              </h2>
              <p className="text-amber-200/80 text-xs sm:text-sm mt-0.5">
                Menu ini merupakan pratinjau kemampuan edisi Pro.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pratinjau Kemampuan Pro</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Keunggulan SekolahHub Pro
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Saat ini Anda menggunakan edisi Basic. Nikmati kemudahan lengkap pengelolaan kelas saat fitur Pro aktif.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_PRO_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-white border border-stone-200 shadow-2xs shrink-0">
                    {card.icon}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 leading-tight">
                    {card.title}
                  </h4>
                </div>

                <ul className="space-y-1.5 pt-1">
                  {card.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Big CTA Button */}
        <div className="pt-2 text-center">
          <a
            href="https://daftar.sekolahhub.web.id"
            target="_blank"
            rel="noopener noreferrer"
            id="btn-pelajari-pro"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2.5"
          >
            <span className="text-lg">👑</span>
            <span>Pelajari SekolahHub Class Pro</span>
          </a>
        </div>
      </div>

      {/* Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 border border-stone-200 shadow-2xl relative text-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 mx-auto flex items-center justify-center shadow-xs text-2xl">
              👑
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-stone-900">
                SekolahHub Class Pro
              </h3>
              <p className="text-sm font-semibold text-stone-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                Fitur Pro akan segera tersedia.
              </p>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Terima kasih atas minat Anda. Tim pengembang KUKAS Platform sedang mempersiapkan fitur Pro secara bertahap.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://daftar.sekolahhub.web.id"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
              >
                <span>Pelajari SekolahHub Class Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
