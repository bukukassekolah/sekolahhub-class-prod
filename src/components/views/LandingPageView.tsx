import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CalendarCheck,
  Award,
  Wallet,
  BookOpen,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Play,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  School,
  FileSpreadsheet
} from 'lucide-react';

interface LandingPageViewProps {
  onStartUse: () => void;
  onStartDemo: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onStartUse,
  onStartDemo,
}) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'attendance' | 'aksa' | 'savings' | 'journal' | 'sync'>('aksa');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Apakah SekolahHub Class benar-benar gratis?',
      a: 'Ya, SekolahHub Class Basic disediakaan 100% gratis tanpa biaya tersembunyi. Database tersimpan langsung di Google Spreadsheet milik akun Google pribadi Anda.'
    },
    {
      q: 'Bagaimana Aksa AI membantu guru kelas?',
      a: 'Aksa AI ditenagai Google Gemini 3.6 Flash yang siap membantu menyusun narasi deskripsi raport perkembangan anak (Kognitif, Motorik, Bahasa, Seni) serta draf jurnal mengajar berdasarkan catatan singkat guru.'
    },
    {
      q: 'Apakah data siswa aman?',
      a: 'Sangat aman. Aplikasi tidak menyimpan data sensitif siswa di server Pihak Ketiga. Seluruh data disimpan lokal di browser Anda dan disinkronkan langsung ke Google Spreadsheet pribadi milik akun Google Anda.'
    },
    {
      q: 'Apakah dapat digunakan secara offline?',
      a: 'Ya! Anda tetap dapat menginput presensi, nilai, dan tabungan saat tidak ada jaringan internet. Data akan disimpan dalam antrean otomatis dan dikirim saat koneksi terhubung kembali.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D302A] font-sans selection:bg-[#A4AC86]/30">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 bg-[#FDFCF9]/90 backdrop-blur-md border-b border-[#D8D3C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-[#FDFCF9] flex items-center justify-center font-bold shadow-sm">
              <GraduationCap className="w-6 h-6 text-[#A4AC86]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[#2D302A]">SekolahHub</span>
                <span className="text-[10px] bg-[#5A5A40] text-[#FDFCF9] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Class Basic
                </span>
              </div>
              <p className="text-[10px] text-[#5A5A40]">Aplikasi Guru Kelas PAUD & SD</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#5A5A40]">
            <a href="#fitur" className="hover:text-[#2D302A] transition-colors">Fitur Utama</a>
            <a href="#aksa" className="hover:text-[#2D302A] transition-colors">Aksa AI Assistant</a>
            <a href="#keunggulan" className="hover:text-[#2D302A] transition-colors">Keunggulan</a>
            <a href="#faq" className="hover:text-[#2D302A] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onStartDemo}
              id="btn-landing-demo"
              className="text-xs font-bold text-[#5A5A40] hover:text-[#2D302A] bg-[#F5F2EB] hover:bg-[#E9E5D9] border border-[#D8D3C5] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-[#5A5A40]" />
              <span>Coba Demo</span>
            </button>

            <button
              onClick={onStartUse}
              id="btn-landing-start"
              className="text-xs font-bold text-[#FDFCF9] bg-[#5A5A40] hover:bg-[#464632] px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A4AC86]" />
              <span>Mulai Gunakan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-[#D8D3C5] text-xs font-bold text-[#5A5A40] mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#5A5A40]" />
          <span>Edisi Khusus Guru Kelas PAUD, TK, RA, MI, & SD (1 Class)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2D302A] max-w-4xl mx-auto leading-tight sm:leading-tight">
          Digitalisasi Administrasi Kelas Guru Tanpa Ribet & Serba Otomatis
        </h1>

        <p className="mt-5 text-sm sm:text-base text-[#5A5A40] max-w-2xl mx-auto leading-relaxed">
          Kelola presensi harian, nilai deskripsi perkembangan anak, kas tabungan kelas, dan jurnal mengajar dalam 1 platform. Otomatis tersinkronisasi ke Google Spreadsheet milik Anda.
        </p>

        {/* Hero CTA Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onStartUse}
            id="hero-btn-start"
            className="w-full sm:w-auto bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] font-extrabold text-sm py-3.5 px-7 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#A4AC86]" />
            <span>Mulai Gunakan (Login Google)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStartDemo}
            id="hero-btn-demo"
            className="w-full sm:w-auto bg-[#F5F2EB] hover:bg-[#E9E5D9] text-[#2D302A] border border-[#D8D3C5] font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-[#5A5A40] fill-[#5A5A40]" />
            <span>Lihat Mode Demo</span>
          </button>
        </div>

        {/* Key USPs */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#D8D3C5] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A5A40] text-[#FDFCF9] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-[#2D302A]">Google Sheets</div>
              <div className="text-[11px] text-[#5A5A40]">Auto-Sync Realtime</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#D8D3C5] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A5A40] text-[#FDFCF9] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#A4AC86]" />
            </div>
            <div>
              <div className="font-bold text-xs text-[#2D302A]">Aksa AI Assistant</div>
              <div className="text-[11px] text-[#5A5A40]">Ditenagai Gemini 3.6</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#D8D3C5] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A5A40] text-[#FDFCF9] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-[#2D302A]">100% Gratis</div>
              <div className="text-[11px] text-[#5A5A40]">Bebas Biaya Rutin</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#D8D3C5] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A5A40] text-[#FDFCF9] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-[#2D302A]">Dukungan Offline</div>
              <div className="text-[11px] text-[#5A5A40]">Auto Sync saat online</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section id="fitur" className="py-16 bg-[#F5F2EB] border-y border-[#D8D3C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D302A] tracking-tight">
              Fitur Lengkap Administrasi Guru Kelas
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#5A5A40]">
              Semua kebutuhan harian guru kelas dari presensi hingga penyusunan laporan perkembangan terintegrasi secara praktis.
            </p>
          </div>

          {/* Tabs header */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveFeatureTab('aksa')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'aksa'
                  ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm'
                  : 'bg-[#FDFCF9] text-[#5A5A40] border border-[#D8D3C5] hover:bg-[#E9E5D9]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#A4AC86]" />
              <span>Aksa AI (Gemini)</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('attendance')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'attendance'
                  ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm'
                  : 'bg-[#FDFCF9] text-[#5A5A40] border border-[#D8D3C5] hover:bg-[#E9E5D9]'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Presensi Harian</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('savings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'savings'
                  ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm'
                  : 'bg-[#FDFCF9] text-[#5A5A40] border border-[#D8D3C5] hover:bg-[#E9E5D9]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Tabungan Kelas</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('journal')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'journal'
                  ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm'
                  : 'bg-[#FDFCF9] text-[#5A5A40] border border-[#D8D3C5] hover:bg-[#E9E5D9]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Jurnal Mengajar</span>
            </button>

            <button
              onClick={() => setActiveFeatureTab('sync')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'sync'
                  ? 'bg-[#5A5A40] text-[#FDFCF9] shadow-sm'
                  : 'bg-[#FDFCF9] text-[#5A5A40] border border-[#D8D3C5] hover:bg-[#E9E5D9]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Google Sheets Sync</span>
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="bg-[#FDFCF9] border border-[#D8D3C5] rounded-3xl p-6 sm:p-8 shadow-sm">
            {activeFeatureTab === 'aksa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE8D6] text-[#2D302A] text-xs font-bold border border-[#DDBEA9]">
                    <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Ditenagai Gemini 3.6 Flash</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D302A]">
                    Asisten Aksa AI: Penulis Narasi Raport & Draf Jurnal
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A40] leading-relaxed">
                    Menyusun deskripsi narasi perkembangan anak (Kognitif, Motorik, Bahasa, Seni, dan Nilai Agama) secara otomatis berdasarkan poin pengamatan singkat guru. Tidak perlu pusing merangkai kata raport!
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-[#2D302A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                      <span>Rekomendasi narasi raport perkembangan anak yang santun & konstruktif</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                      <span>Draf jurnal mengajar harian & inspirasi media pembelajaran kelas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                      <span>Langsung dapat disalin atau disimpan ke Buku Nilai Kelas</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl p-4 text-xs space-y-3 font-mono shadow-inner">
                  <div className="bg-[#5A5A40] text-[#FDFCF9] p-2.5 rounded-xl font-sans font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#A4AC86]" />
                      Aksa AI — Output Contoh Narasi
                    </span>
                    <span className="text-[10px] bg-[#A4AC86] text-[#2D302A] px-2 py-0.5 rounded-md">Raport TK</span>
                  </div>
                  <div className="p-3 bg-[#FDFCF9] rounded-xl border border-[#D8D3C5] font-sans text-[#2D302A] leading-relaxed">
                    <p className="font-bold mb-1 text-[#5A5A40]">Aspek Kognitif & Berhitung:</p>
                    "Ananda Anisa menunjukkan perkembangan kognitif yang sangat baik (BSB). Anisa mampu mengelompokkan benda berdasarkan warna dan menghitung jumlah mainan hingga angka 10 secara mandiri dengan ceria."
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'attendance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D302A]">
                    Rekam Presensi Kelas Harian Cepat & Akurat
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A40] leading-relaxed">
                    Catat status kehadiran anak (Hadir, Izin, Sakit, Alpa) cukup dengan satu sentuhan jari. Sistem langsung menghitung rekapitulasi persentase harian dan bulanan secara otomatis.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-[#2D302A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                      <span>Mode Rekam Massal (Mark All Hadir) dalam 1 detik</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                      <span>Catatan alasan izin / sakit terlampir rapi</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl p-4 text-xs space-y-2">
                  <div className="font-bold text-[#2D302A] mb-2 flex items-center justify-between">
                    <span>Presensi Hari Ini — Kelas B2</span>
                    <span className="text-[10px] bg-[#5A5A40] text-white px-2 py-0.5 rounded">100% Hadir</span>
                  </div>
                  <div className="p-2 bg-[#FDFCF9] rounded-lg border border-[#D8D3C5] flex items-center justify-between">
                    <span className="font-semibold text-[#2D302A]">Anisa Rahma</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#5A5A40] text-white font-bold">Hadir</span>
                  </div>
                  <div className="p-2 bg-[#FDFCF9] rounded-lg border border-[#D8D3C5] flex items-center justify-between">
                    <span className="font-semibold text-[#2D302A]">Bagas Pratama</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#5A5A40] text-white font-bold">Hadir</span>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'savings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D302A]">
                    Pencatatan Kas & Tabungan Kelas Transparan
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A40] leading-relaxed">
                    Kelola uang tabungan harian/mingguan anak dengan pencatatan setoran dan penarikan yang tercatat rapi beserta saldo berjalan real-time.
                  </p>
                </div>

                <div className="bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl p-4 text-xs space-y-2">
                  <div className="p-3 bg-[#5A5A40] text-[#FDFCF9] rounded-xl flex items-center justify-between font-bold">
                    <span>Total Kas Tabungan Kelas:</span>
                    <span className="text-base text-[#A4AC86]">Rp 850.000</span>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'journal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D302A]">
                    Jurnal Mengajar Harian Terstruktur
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A40] leading-relaxed">
                    Dokumentasikan topik materi ajar, media peraga yang digunakan, dan refleksi suasana kelas setiap hari sebagai bukti administrasi pengajaran.
                  </p>
                </div>

                <div className="bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl p-4 text-xs space-y-2">
                  <div className="font-bold text-[#2D302A]">Topik Hari Ini: Mengenal Hewan Peliharaan</div>
                  <div className="text-[#5A5A40] text-[11px]">Media: Gambar Miniatur & Lagu Anak</div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'sync' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D302A]">
                    Otomatis Sinkron ke Google Sheets Milik Anda
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A5A40] leading-relaxed">
                    Seluruh data presensi, nilai, tabungan, dan jurnal otomatis disinkronkan ke Google Spreadsheet pribadi milik akun Google Anda. Terintegrasi penuh tanpa biaya server.
                  </p>
                </div>

                <div className="bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl p-4 text-xs text-center space-y-2">
                  <FileSpreadsheet className="w-12 h-12 text-[#5A5A40] mx-auto" />
                  <div className="font-bold text-[#2D302A]">SekolahHub Class Database - Google Sheets</div>
                  <div className="text-[10px] text-[#5A5A40]">100% Milik Akun Google Anda sendiri</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D302A] tracking-tight">
            Alur Penggunaan Sangat Sederhana
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5A5A40]">
            Hanya butuh 3 langkah singkat untuk memulai digitalisasi kelas Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-[#FDFCF9] font-extrabold flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-bold text-base text-[#2D302A]">Login Akun Google Guru</h3>
            <p className="text-xs text-[#5A5A40] leading-relaxed">
              Masuk menggunakan akun Google pribadi/sekolah Anda melalui popup autentikasi terverifikasi Google.
            </p>
          </div>

          <div className="p-6 bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-[#FDFCF9] font-extrabold flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-bold text-base text-[#2D302A]">Isi Identitas Kelas</h3>
            <p className="text-xs text-[#5A5A40] leading-relaxed">
              Masukkan nama sekolah, nama kelas, jenjang (PAUD/TK/SD), dan buat Spreadsheet database otomatis.
            </p>
          </div>

          <div className="p-6 bg-[#F5F2EB] border border-[#D8D3C5] rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-[#FDFCF9] font-extrabold flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-bold text-base text-[#2D302A]">Siap Dikelola Setiap Hari</h3>
            <p className="text-xs text-[#5A5A40] leading-relaxed">
              Gunakan lembar kerja ringkas untuk presensi, tabungan, jurnal, dan asisten Aksa AI kapan saja.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-[#F5F2EB] border-t border-[#D8D3C5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D302A]">
              Pertanyaan Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#FDFCF9] border border-[#D8D3C5] rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#2D302A]"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#5A5A40] shrink-0" />
                    {faq.q}
                  </span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#5A5A40]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5A5A40]" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#5A5A40] leading-relaxed border-t border-[#D8D3C5]/60 pt-3 bg-[#FDFCF9]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-[#5A5A40] text-[#FDFCF9] text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#A4AC86] text-[#2D302A] flex items-center justify-center font-bold mx-auto">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Mulai Pengelolaan Administrasi Kelas Sekarang
          </h2>
          <p className="text-xs sm:text-sm text-[#E9E5D9] max-w-xl mx-auto leading-relaxed">
            Tanpa perlu instalasi software. Terhubung langsung dengan akun Google Anda dalam beberapa klik.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartUse}
              id="cta-bottom-start"
              className="w-full sm:w-auto bg-[#FDFCF9] hover:bg-[#E9E5D9] text-[#2D302A] font-extrabold text-xs py-3.5 px-8 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#5A5A40]" />
              <span>Mulai Gunakan SekolahHub</span>
            </button>

            <button
              onClick={onStartDemo}
              id="cta-bottom-demo"
              className="w-full sm:w-auto bg-[#464632] hover:bg-[#363626] text-[#FDFCF9] border border-[#A4AC86]/40 font-bold text-xs py-3.5 px-6 rounded-2xl transition-all"
            >
              Atau Coba Mode Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#2D302A] text-[#E9E5D9] text-xs text-center border-t border-[#464632]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#FDFCF9]">SekolahHub Class Basic</span>
            <span>— Platform Administrasi Guru PAUD, TK & SD</span>
          </div>
          <div className="text-[11px] text-[#A4AC86]">
            Terintegrasi dengan Google Workspace & Gemini 3.6 Flash AI
          </div>
        </div>
      </footer>
    </div>
  );
};
