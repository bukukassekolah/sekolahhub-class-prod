import React, { useState } from 'react';
import { 
  School, 
  Users, 
  ClipboardCheck, 
  BookOpen, 
  Megaphone, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo, onOpenAuth }) => {
  const steps = [
    { num: '01', title: 'Registrasi Gratis', desc: 'Buat akun guru hanya dengan email & kata sandi.' },
    { num: '02', title: 'Lengkapi Profil', desc: 'Isi nama sekolah, nama kelas, & tahun pelajaran.' },
    { num: '03', title: 'Tambah Data Siswa', desc: 'Input nomor induk, nama, & nomor WhatsApp orang tua.' },
    { num: '04', title: 'Isi Presensi Harian', desc: 'Tandai kehadiran murid setiap hari dengan 1-klik.' },
    { num: '05', title: 'Tulis Catatan & Pengumuman', desc: 'Catat jurnal harian & kirim pesan broadcast ke WA.' },
    { num: '06', title: 'Unduh Laporan PDF', desc: 'Cetak rekap presensi & daftar siswa kapan saja.' },
  ];

  const features = [
    { icon: ClipboardCheck, title: 'Presensi Murid Harian', desc: 'Otomatis hitung persentase kehadiran Hadir, Izin, Sakit, & Alfa.' },
    { icon: Users, title: 'Kelola Data Siswa', desc: 'Lengkap dengan kontak WA orang tua untuk komunikasi langsung.' },
    { icon: BookOpen, title: 'Jurnal & Catatan Guru', desc: 'Dokumentasikan perkembangan murid & jurnal mengajar harian.' },
    { icon: Megaphone, title: 'Pengumuman Kelas', desc: 'Siapkan draft pesan & salin format pesan WhatsApp Broadcast.' },
    { icon: FileCheck2, title: 'Laporan Format PDF', desc: 'Cetak rekap kehadiran bulanan lengkap dengan KOP Sekolah resmi.' },
    { icon: Zap, title: 'Ringan & Tanpa Install', desc: 'Akses dari HP, tablet, maupun laptop guru secara responsif.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* Top Banner Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                SekolahHub <span className="text-blue-600">Basic</span>
              </span>
              <p className="text-xs text-slate-500">Single Teacher Class Edition</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartDemo}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors hidden sm:flex items-center gap-1.5"
            >
              <PlayCircle className="w-4 h-4 text-blue-600" />
              Coba Mode Demo
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              Mulai Gratis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Aplikasi Administrasi Kelas 100% Gratis untuk Guru
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Kelola Presensi, Siswa & Catatan Kelas Secara Digital Tanpa Ribet
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Dirancang khusus untuk <strong className="text-slate-800">1 Guru mengelola 1 Kelas</strong>. Sangat cocok untuk Guru TK, Guru SD/MI, Guru Inklusi, dan Wali Kelas.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
          >
            Mulai Sekarang - Gratis
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4 text-blue-600" />
            Lihat Contoh Demo Kelas
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tanpa Instalasi
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Data Tersimpan Aman di Cloud
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" /> Siap Cetak PDF Resmi
          </span>
        </div>
      </section>

      {/* Target Audience Bar */}
      <section className="bg-blue-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
            Target Pengguna Utama
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {['Guru TK / PAUD', 'Guru SD / MI', 'Guru Kelas Inklusi', 'Wali Kelas'].map((role, i) => (
              <div key={i} className="p-3 bg-white/10 rounded-xl backdrop-blur-xs font-semibold text-sm">
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fitur Utama SekolahHub Class Basic
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Segala hal yang Anda butuhkan untuk efisiensi administrasi kelas harian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Onboarding Flow Steps */}
      <section className="py-16 px-4 sm:px-6 bg-slate-100/70 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700">
              Alur Penggunaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              6 Langkah Mudah Memulai Digitalisasi Kelas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 relative">
                <span className="text-2xl font-black text-blue-600 mb-2 block">{step.num}</span>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 mb-1">
          SekolahHub Class Basic Edition &bull; Free Community Edition
        </p>
        <p>Solusi administrasi kelas mandiri untuk 1 guru 1 kelas.</p>
      </footer>
    </div>
  );
};
