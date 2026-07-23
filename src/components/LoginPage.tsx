import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  School, 
  Mail, 
  Lock, 
  UserCheck, 
  Building2, 
  MapPin, 
  Phone, 
  Users, 
  GraduationCap, 
  AlertCircle, 
  ClipboardCheck, 
  Wallet, 
  BookOpen, 
  Megaphone, 
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  FileText,
  X,
  Send,
  Info,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { sendPasswordResetEmail, auth, saveImplementationRequest, getLatestImplementationRequestByEmail } from '../lib/firebase';
import { ImplementationRequest } from '../types';

export const LoginPage: React.FC = () => {
  const { loginWithEmail } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Auth form state
  const [authTab, setAuthTab] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Implementation Request Modal / Form state
  const [showImplModal, setShowImplModal] = useState(false);
  const [implSubmitting, setImplSubmitting] = useState(false);
  const [implSuccess, setImplSuccess] = useState(false);
  const [implError, setImplError] = useState('');
  const [existingRequest, setExistingRequest] = useState<ImplementationRequest | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    status: 'Active' | 'Pending';
    plan: string;
    authProvisioning: 'Queued' | 'PendingAdmin';
  } | null>(null);

  const [implForm, setImplForm] = useState({
    schoolName: '',
    contactName: '',
    email: '',
    whatsapp: '',
    city: '',
    educationLevel: 'SD/MI',
    teacherCount: 1,
    studentCount: 30,
    notes: '',
    plan: 'SekolahHub Class Basic' as 'SekolahHub Class Basic' | 'SekolahHub Class Pro',
  });

  const checkExistingRequest = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.trim() || !emailToCheck.includes('@')) {
      setExistingRequest(null);
      return;
    }
    setCheckingExisting(true);
    try {
      const prev = await getLatestImplementationRequestByEmail(emailToCheck);
      setExistingRequest(prev);
    } catch (err) {
      console.error('Error checking existing request:', err);
    } finally {
      setCheckingExisting(false);
    }
  };

  const openImplModal = (prefillEmail?: string) => {
    setShowImplModal(true);
    setImplSuccess(false);
    setImplError('');
    const targetEmail = prefillEmail || email || implForm.email;
    if (targetEmail) {
      setImplForm((prev) => ({ ...prev, email: targetEmail }));
      checkExistingRequest(targetEmail);
    } else {
      setExistingRequest(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setError('Metode Login Email/Password belum diaktifkan di Firebase Console.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email atau kata sandi tidak sesuai. Silakan periksa kembali kredensial Anda.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.');
      } else {
        setError(err.message || 'Gagal masuk. Periksa koneksi internet dan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Tautan atur ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk/spam Anda.');
      setAuthTab('login');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setError('Metode Email/Password belum diaktifkan di Firebase Console.');
      } else {
        setError('Gagal mengirim tautan reset password. Pastikan email Anda sudah terdaftar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImplSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImplError('');
    setImplSubmitting(true);
    try {
      const res = await saveImplementationRequest({
        schoolName: implForm.schoolName,
        contactName: implForm.contactName,
        email: implForm.email,
        whatsapp: implForm.whatsapp,
        city: implForm.city,
        educationLevel: implForm.educationLevel,
        teacherCount: Number(implForm.teacherCount) || 1,
        studentCount: Number(implForm.studentCount) || 1,
        notes: implForm.notes,
        plan: implForm.plan,
      });
      setSubmittedResult({
        status: res.status,
        plan: res.plan,
        authProvisioning: res.authProvisioning,
      });
      setImplSuccess(true);
      checkExistingRequest(implForm.email);
    } catch (err: any) {
      console.error(err);
      setImplError('Gagal mengirim permohonan. Silakan coba beberapa saat lagi.');
    } finally {
      setImplSubmitting(false);
    }
  };

  const resetImplForm = () => {
    setImplForm({
      schoolName: '',
      contactName: '',
      email: '',
      whatsapp: '',
      city: '',
      educationLevel: 'SD/MI',
      teacherCount: 1,
      studentCount: 30,
      notes: '',
      plan: 'SekolahHub Class Basic',
    });
    setSubmittedResult(null);
    setImplSuccess(false);
    setImplError('');
    setExistingRequest(null);
    setCheckingExisting(false);
  };

  const features = [
    { icon: ClipboardCheck, title: 'Presensi Kehadiran', desc: 'Otomatis rekap Hadir, Izin, Sakit, & Alfa.' },
    { icon: Users, title: 'Data Siswa Digital', desc: 'Lengkap dengan data kontak WhatsApp orang tua.' },
    { icon: Wallet, title: 'Tabungan Siswa', desc: 'Catat setor & tarik saldo simpanan murid.' },
    { icon: BookOpen, title: 'Jurnal & Catatan Guru', desc: 'Dokumentasikan perkembangan & kegiatan belajar.' },
    { icon: Megaphone, title: 'Pengumuman Kelas', desc: 'Draft pesan broadcast untuk orang tua murid.' },
    { icon: FileCheck2, title: 'Cetak Laporan PDF', desc: 'Cetak rekap kehadiran resmi siap tanda tangan.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors">
      {/* Top Navbar Header */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-lg">
                SekolahHub <span className="text-blue-600 dark:text-blue-400">Basic</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sistem Administrasi Guru Kelas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:px-3 sm:py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title={isDarkMode ? "Alihkan ke Mode Terang" : "Alihkan ke Mode Gelap"}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-amber-300">Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline text-slate-700">Mode Gelap</span>
                </>
              )}
            </button>

            <button
              onClick={() => openImplModal()}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Implementasi SekolahHub</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Value proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Sistem Produksi Resmi SekolahHub &bull; Cloud Database Firebase
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Kelola Kehadiran, Siswa & Jurnal Mengajar Secara Digital
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Selamat datang di <strong className="text-slate-800">SekolahHub Class Basic</strong>. Masuk menggunakan akun terverifikasi Anda untuk mulai mengelola data presensi, catatan siswa, tabungan, dan mencetak rekap laporan PDF.
            </p>

            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold text-amber-950">Informasi Pendaftaran Akun Guru</p>
                <p className="leading-relaxed">
                  Aplikasi ini disiapkan untuk lingkungan produksi resmi sekolah. Akun dibuat dan diaktifkan oleh Administrator setelah sekolah Anda mengajukan implementasi.
                </p>
                <button
                  onClick={() => openImplModal()}
                  className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline pt-0.5"
                >
                  Belum terdaftar? Ajukan Implementasi SekolahHub di sini &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Data Tersimpan Aman di Cloud Firebase
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Laporan PDF Resmi Siap Cetak
              </span>
            </div>
          </div>

          {/* Right Column: Auth Form Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 text-center">
                <h3 className="font-extrabold text-slate-900 text-lg">Akses Masuk Guru</h3>
                <p className="text-xs text-slate-500 mt-0.5">Masukkan email & kata sandi terdaftar Anda</p>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {authTab === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Guru</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="guru@sekolah.sch.id"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-slate-700">Kata Sandi</label>
                        <button
                          type="button"
                          onClick={() => { setAuthTab('forgot'); setError(''); setSuccessMessage(''); }}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Lupa Kata Sandi?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                      <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-3 border-t border-slate-100 text-center">
                      <p className="text-[11px] text-slate-500 mb-2">
                        Belum punya akun SekolahHub di sekolah Anda?
                      </p>
                      <button
                        type="button"
                        onClick={() => openImplModal(email)}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ajukan Implementasi SekolahHub</span>
                      </button>
                    </div>
                  </form>
                )}

                {authTab === 'forgot' && (
                  <form onSubmit={handleForgot} className="space-y-4 text-xs">
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-slate-700 leading-relaxed">
                      Layanan Atur Ulang Kata Sandi resmi via <strong>Firebase Authentication</strong>. Masukkan email Anda untuk menerima link pembuatan kata sandi baru.
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Terdaftar</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="guru@sekolah.sch.id"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setAuthTab('login'); setError(''); }}
                        className="w-1/3 py-2.5 text-slate-600 bg-slate-100 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                      >
                        {loading ? 'Mengirim...' : 'Kirim Tautan Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Implementasi SekolahHub */}
      {showImplModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Formulir Implementasi SekolahHub</h3>
                  <p className="text-xs text-blue-100">Permohonan digitalisasi administrasi sekolah &amp; kelas</p>
                </div>
              </div>
              <button
                onClick={() => setShowImplModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              {implSuccess ? (
                <div className="text-center py-4 space-y-4">
                  {submittedResult?.status === 'Active' ? (
                    <>
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
                          Status: Active (Tersimpan di Firestore)
                        </span>
                        <h4 className="text-lg font-extrabold text-slate-900 mt-2">Permohonan SekolahHub Class Basic Berhasil!</h4>
                      </div>
                      <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-2xl text-left space-y-2.5 text-xs text-emerald-950">
                        <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Antrean Backend Siap (Secure Backend Provisioning)
                        </p>
                        <p className="leading-relaxed">
                          Permohonan Anda telah tersimpan di Firestore dengan status <strong className="text-emerald-900">Active</strong> dan antrean provisioning <strong className="text-emerald-900">Queued</strong>.
                        </p>
                        <p className="leading-relaxed text-[11px] text-emerald-900">
                          Layanan backend aman (<strong>Firebase Admin SDK / Cloud Functions</strong>) akan memproses antrean pembuatan akun <strong>Firebase Authentication</strong> dan mengirimkan email resmi pembuatan kata sandi ke:
                        </p>
                        <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-mono text-center font-bold text-slate-900">
                          {implForm.email}
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-snug pt-0.5">
                          &bull; <strong>Alur Aman Backend:</strong> Frontend tidak melakukan registrasi/reset password langsung di browser demi menjaga integritas &amp; keamanan data.<br />
                          &bull; Periksa Kotak Masuk atau Folder Spam email Anda untuk menerima tautan buat password dari backend.<br />
                          &bull; Setelah membuat kata sandi, kembali ke halaman ini untuk masuk.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                        <p><strong>Sekolah:</strong> {implForm.schoolName}</p>
                        <p><strong>Penanggung Jawab:</strong> {implForm.contactName} ({implForm.whatsapp})</p>
                        <p><strong>Paket Terpilih:</strong> <span className="font-bold text-emerald-700">SekolahHub Class Basic</span></p>
                        <p><strong>Status Auth Worker:</strong> <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded text-[10px]">Queued for Secure Backend</span></p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <FileText className="w-10 h-10" />
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
                          Status: Pending Verification
                        </span>
                        <h4 className="text-lg font-extrabold text-slate-900 mt-2">Permohonan Paket {submittedResult?.plan} Tersimpan</h4>
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl text-left space-y-2 text-xs text-amber-950">
                        <p className="font-bold flex items-center gap-1.5 text-amber-900">
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" /> Memerlukan Verifikasi Pembayaran &amp; Persetujuan Admin
                        </p>
                        <p className="leading-relaxed">
                          Permohonan paket <strong>{submittedResult?.plan}</strong> Anda telah disimpan di Firestore dengan status <strong>Pending</strong>. Aktivasi akun akan dilakukan oleh Administrator setelah memverifikasi pembayaran dan menyetujui permohonan sekolah Anda.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                        <p><strong>Sekolah:</strong> {implForm.schoolName}</p>
                        <p><strong>Penanggung Jawab:</strong> {implForm.contactName} ({implForm.whatsapp})</p>
                        <p><strong>Email:</strong> {implForm.email}</p>
                        <p><strong>Paket Terpilih:</strong> <span className="font-bold text-slate-900">{submittedResult?.plan}</span></p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                    <button
                      onClick={() => setShowImplModal(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      Tutup &amp; Kembali
                    </button>
                    <button
                      onClick={() => {
                        setImplSuccess(false);
                        setSubmittedResult(null);
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ajukan Permohonan Baru / Ubah Paket</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleImplSubmit} className="space-y-4 text-xs">
                  {implError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{implError}</span>
                    </div>
                  )}

                  {/* Informational Banner if existing request in Firestore */}
                  {checkingExisting && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Memeriksa status permohonan dari Firestore...</span>
                    </div>
                  )}

                  {existingRequest && !checkingExisting && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 rounded-2xl space-y-2.5 text-xs text-slate-800 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                            <Info className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-extrabold text-blue-950 text-xs">
                            Permohonan Sebelumnya Ditemukan di Firestore
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${
                          existingRequest.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          Status: {existingRequest.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-700 font-sans">
                        <p><strong>Sekolah:</strong> {existingRequest.schoolName}</p>
                        <p><strong>Penanggung Jawab:</strong> {existingRequest.contactName}</p>
                        <p><strong>Paket Terdaftar:</strong> <span className="font-bold text-blue-700">{existingRequest.plan}</span></p>
                        <p><strong>Tanggal Pengajuan:</strong> {new Date(existingRequest.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        {existingRequest.authProvisioning && (
                          <p className="md:col-span-2"><strong>Status Worker Auth:</strong> <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{existingRequest.authProvisioning}</span></p>
                        )}
                      </div>

                      <div className="p-2.5 bg-white/80 rounded-xl border border-blue-200 text-[11px] text-blue-900 leading-relaxed flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Informasi Pilihan Paket:</strong> Pilihan paket di bawah ini tetap terbuka. Anda dapat mengajukan permohonan baru atau mengganti paket kapan saja.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Field Choice Paket - ALWAYS DISPLAYED */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-bold text-slate-800">
                        Pilih Paket Implementasi SekolahHub Class *
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        (Selalu dapat dipilih)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* SekolahHub Class Basic */}
                      <div
                        onClick={() => setImplForm({ ...implForm, plan: 'SekolahHub Class Basic' })}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          implForm.plan === 'SekolahHub Class Basic'
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <span className="font-extrabold text-slate-900 text-xs">SekolahHub Class Basic</span>
                            <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[9px] rounded-full uppercase shrink-0">
                              Otomatis (Active)
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800 font-bold mb-1">Gratis (1 Guru / 1 Kelas)</p>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            Akun otomatis diaktifkan (Status: <strong>Active</strong>). Email resmi Firebase disiapkan agar Anda membuat password secara mandiri.
                          </p>
                        </div>
                      </div>

                      {/* SekolahHub Class Pro */}
                      <div
                        onClick={() => setImplForm({ ...implForm, plan: 'SekolahHub Class Pro' })}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          implForm.plan === 'SekolahHub Class Pro'
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <span className="font-extrabold text-slate-900 text-xs">SekolahHub Class Pro</span>
                            <span className="px-2 py-0.5 bg-amber-500 text-white font-bold text-[9px] rounded-full uppercase shrink-0">
                              Pending
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-800 font-bold mb-1">Berbayar (1 Guru / 1 Kelas Fitur Lanjutan)</p>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            Status = <strong>Pending</strong>. Diaktifkan setelah verifikasi pembayaran &amp; persetujuan administrator.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p>
                        <strong>Catatan Arsitektur:</strong> SekolahHub Class khusus didesain untuk 1 guru mengelola 1 kelas. Jika sekolah Anda membutuhkan pengelolaan multi-guru, multi-kelas, atau administrasi sekolah secara menyeluruh, gunakan produk <strong>SekolahHub Space</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Sekolah *</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={implForm.schoolName}
                          onChange={(e) => setImplForm({ ...implForm, schoolName: e.target.value })}
                          placeholder="SD Negeri 01 Jakarta"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Penanggung Jawab *</label>
                      <div className="relative">
                        <UserCheck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={implForm.contactName}
                          onChange={(e) => setImplForm({ ...implForm, contactName: e.target.value })}
                          placeholder="Kepala Sekolah / Tim IT"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-slate-700">Email Penanggung Jawab *</label>
                        {implForm.email && (
                          <button
                            type="button"
                            onClick={() => checkExistingRequest(implForm.email)}
                            className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" /> Cek Firestore
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={implForm.email}
                          onChange={(e) => setImplForm({ ...implForm, email: e.target.value })}
                          onBlur={() => {
                            if (implForm.email) {
                              checkExistingRequest(implForm.email);
                            }
                          }}
                          placeholder="sekolah@kemdikbud.go.id"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={implForm.whatsapp}
                          onChange={(e) => setImplForm({ ...implForm, whatsapp: e.target.value })}
                          placeholder="081234567890"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten *</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={implForm.city}
                          onChange={(e) => setImplForm({ ...implForm, city: e.target.value })}
                          placeholder="Kota Surabaya"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jenjang Pendidikan *</label>
                      <select
                        value={implForm.educationLevel}
                        onChange={(e) => setImplForm({ ...implForm, educationLevel: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                      >
                        <option value="SD/MI">SD / MI</option>
                        <option value="SMP/MTs">SMP / MTs</option>
                        <option value="SMA/SMK/MA">SMA / SMK / MA</option>
                        <option value="PAUD/TK">PAUD / TK</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jumlah Guru *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={implForm.teacherCount}
                        onChange={(e) => setImplForm({ ...implForm, teacherCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Estimasi Jumlah Siswa *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={implForm.studentCount}
                        onChange={(e) => setImplForm({ ...implForm, studentCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                    <textarea
                      rows={2}
                      value={implForm.notes}
                      onChange={(e) => setImplForm({ ...implForm, notes: e.target.value })}
                      placeholder="Misal: Kebutuhan khusus integrasi kurikulum atau jadwal pelatihan guru..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImplModal(false)}
                      className="px-4 py-2.5 text-slate-600 bg-slate-100 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={implSubmitting}
                      className="px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {implSubmitting
                          ? 'Mengirim...'
                          : existingRequest
                          ? 'Ajukan Permohonan Baru / Perbarui'
                          : 'Kirim Permohonan'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 mb-1">
          SekolahHub Class Basic &bull; Production Onboarding System
        </p>
        <p>Sistem Administrasi Guru & Sekolah Terintegrasi.</p>
      </footer>
    </div>
  );
};
