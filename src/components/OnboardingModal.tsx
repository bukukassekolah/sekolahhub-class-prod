import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Database,
  ArrowRight,
  School,
  X,
  UserCheck,
  Loader2,
  AlertCircle,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { ClassInfo, EducationLevel } from '../types';
import { triggerGoogleOAuthPopup, isGoogleOauthConfigured, GoogleUserProfile } from '../lib/googleAuth';
import {
  getStoredGoogleUser,
  saveGoogleUser,
  clearOperationalData,
  getStoredStudents,
  getStoredAttendance,
  getStoredGrades,
  getStoredSavings,
  getStoredJournals,
  getStoredFeedback
} from '../lib/storageManager';
import { createRealClassSpreadsheet, syncAllDataToRealSpreadsheet } from '../lib/googleSheets';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo;
  onSaveClassInfo: (info: ClassInfo) => void;
  onLoginSuccess?: (user: GoogleUserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  classInfo,
  onSaveClassInfo,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<number>(1); // 1: Info, 2: Google Auth, 3: Identitas Kelas, 4: Done

  const [formData, setFormData] = useState<ClassInfo>({ ...classInfo });
  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(() => {
    const stored = getStoredGoogleUser();
    if (stored) return stored;
    return classInfo.teacherEmail ? {
      id: 'google_user',
      name: classInfo.teacherName || 'Guru Sekolah',
      email: classInfo.teacherEmail
    } : null;
  });

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isCreatingSheet, setIsCreatingSheet] = useState<boolean>(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string>('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const userProfile = await triggerGoogleOAuthPopup();
      saveGoogleUser(userProfile);
      setGoogleUser(userProfile);
      setFormData(prev => ({
        ...prev,
        teacherName: userProfile.name,
        teacherEmail: userProfile.email
      }));
      if (onLoginSuccess) {
        onLoginSuccess(userProfile);
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Gagal terhubung ke akun Google. Harap coba lagi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 2 && !googleUser) {
      setLoginError('Harap login menggunakan akun Google Anda terlebih dahulu.');
      return;
    }

    if (step === 3) {
      if (!formData.schoolName.trim() || !formData.className.trim()) {
        alert('Harap isi Nama Sekolah dan Nama Kelas.');
        return;
      }

      setIsCreatingSheet(true);
      setSheetError(null);

      try {
        let userProfile = googleUser || getStoredGoogleUser();
        // If user profile or access token is missing, attempt OAuth popup
        if (!userProfile?.accessToken) {
          userProfile = await triggerGoogleOAuthPopup();
          saveGoogleUser(userProfile);
          setGoogleUser(userProfile);
        }

        const accessToken = userProfile.accessToken!;
        const sheetName = `SekolahHub Class Database - ${formData.className}`;

        // Create spreadsheet using Google Sheets API
        const { spreadsheetId, spreadsheetUrl } = await createRealClassSpreadsheet(accessToken, formData);
        setCreatedSheetUrl(spreadsheetUrl);

        // Clear demo data on onboarding so new class starts with a clean operational sheet
        clearOperationalData();

        // Run initial data sync with clean operational sheets
        const initialSyncData = {
          classInfo: {
            ...formData,
            googleSheetId: spreadsheetId,
            googleSheetName: sheetName,
            googleSheetConnected: true,
            lastSyncedAt: new Date().toISOString()
          },
          students: [],
          attendance: [],
          grades: [],
          savings: [],
          journals: [],
          feedback: []
        };

        await syncAllDataToRealSpreadsheet(accessToken, spreadsheetId, initialSyncData);

        const updatedClassInfo: ClassInfo = {
          ...formData,
          googleSheetId: spreadsheetId,
          googleSheetName: sheetName,
          googleSheetConnected: true,
          lastSyncedAt: new Date().toISOString(),
          lastSyncError: undefined
        };

        onSaveClassInfo(updatedClassInfo);
        setFormData(updatedClassInfo);
        setStep(4);
      } catch (err: any) {
        console.error('Gagal membuat Google Spreadsheet:', err);
        setSheetError(
          err?.message ||
            'Gagal membuat Google Spreadsheet di Google Drive Anda. Pastikan Anda menyetujui izin Google Sheets saat login.'
        );
      } finally {
        setIsCreatingSheet(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D302A]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFCF9] rounded-3xl max-w-xl w-full shadow-2xl border border-[#D8D3C5] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#5A5A40] text-[#FDFCF9] p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#E9E5D9] hover:text-white p-1 rounded-lg hover:bg-[#464632] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#A4AC86] text-[#2D302A] flex items-center justify-center font-bold shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">SekolahHub Class</h2>
                <span className="bg-[#DDBEA9] text-[#2D302A] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Basic Edition
                </span>
              </div>
              <p className="text-xs text-[#E9E5D9]">
                Single Teacher, Single Class — Khusus Guru PAUD, TK, RA, MI, & SD
              </p>
            </div>
          </div>

          {/* Steps Progress */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#6E6E51]/60 text-[11px] font-semibold text-[#E9E5D9]">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#FFE8D6]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#A4AC86] text-[#2D302A] font-bold' : 'bg-[#464632]'}`}>1</span>
              <span>Info</span>
            </div>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#FFE8D6]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#A4AC86] text-[#2D302A] font-bold' : 'bg-[#464632]'}`}>2</span>
              <span>Google OAuth</span>
            </div>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#FFE8D6]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#A4AC86] text-[#2D302A] font-bold' : 'bg-[#464632]'}`}>3</span>
              <span>Identitas Kelas</span>
            </div>
            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-[#FFE8D6]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-[#A4AC86] text-[#2D302A] font-bold' : 'bg-[#464632]'}`}>4</span>
              <span>Selesai</span>
            </div>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4 text-[#2D302A]">
              <h3 className="font-extrabold text-lg text-[#2D302A]">
                Selamat Datang di Digitalisasi Administrasi Kelas
              </h3>
              <p className="text-xs text-[#5A5A40] leading-relaxed">
                SekolahHub Class Basic dirancang khusus untuk guru kelas TK/SD agar mudah mencatat presensi, nilai perkembangan anak, tabungan kelas, dan jurnal mengajar tanpa instalasi yang rumit.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D8D3C5] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#2D302A]">Gratis & Bebas Kuota untuk 1 Kelas</div>
                    <p className="text-[#5A5A40] text-[11px]">Database langsung terhubung ke Google Spreadsheet milik Anda sendiri.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FFE8D6]/40 rounded-xl border border-[#DDBEA9] flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#2D302A]">Dilengkapi Aksa AI Assistant</div>
                    <p className="text-[#5A5A40] text-[11px]">Bantuan penulisan narasi raport perkembangan siswa & draf jurnal mengajar.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNextStep}
                  id="btn-onboarding-step1-next"
                  className="bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] font-bold text-xs py-3 px-6 rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <span>Lanjutkan ke Login Google</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E9E5D9] text-[#5A5A40] flex items-center justify-center mx-auto shadow-sm">
                <UserCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#2D302A]">
                  Login Akun Google Guru
                </h3>
                <p className="text-xs text-[#5A5A40] max-w-md mx-auto mt-1 leading-relaxed">
                  Pilih akun Google Anda di window resmi <b>accounts.google.com</b> untuk mengamankan data dan menghubungkan Google Sheets.
                </p>
              </div>

              {!isGoogleOauthConfigured() && !googleUser && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs text-left space-y-2 max-w-md mx-auto shadow-sm">
                  <div className="font-extrabold flex items-center gap-1.5 text-amber-800 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Konfigurasi Google Client ID Diperlukan</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900/90">
                    Environment variable <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px] text-amber-900">VITE_GOOGLE_CLIENT_ID</code> belum diset di lingkungan aplikasi ini.
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Harap ikuti panduan pada file <span className="font-bold">README.md</span> untuk membuat OAuth 2.0 Client ID di Google Cloud Console dan mendaftarkan Authorized JavaScript Origin.
                  </p>
                </div>
              )}

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left flex items-start gap-2 max-w-md mx-auto shadow-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{loginError}</span>
                </div>
              )}

              {googleUser ? (
                <div className="bg-[#F5F2EB] border border-[#A4AC86] p-4.5 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-[#A4AC86] text-[#2D302A] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#2D302A]" />
                      Terautentikasi via Google OAuth
                    </span>

                    <button
                      onClick={() => { setGoogleUser(null); setLoginError(null); }}
                      className="text-[10px] text-[#5A5A40] hover:text-rose-700 underline font-semibold flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      Ganti Akun
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {googleUser.picture ? (
                      <img
                        src={googleUser.picture}
                        alt={googleUser.name}
                        className="w-12 h-12 rounded-full border-2 border-[#5A5A40] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#5A5A40] text-[#FDFCF9] font-extrabold flex items-center justify-center text-lg shrink-0">
                        {googleUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-[#2D302A] text-sm truncate">{googleUser.name}</div>
                      <div className="text-[#5A5A40] text-xs truncate">{googleUser.email}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn}
                    id="btn-google-oauth-trigger"
                    className="w-full sm:w-auto bg-white border-2 border-[#D8D3C5] hover:border-[#5A5A40] hover:bg-[#F5F2EB] text-[#2D302A] font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-3"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#5A5A40]" />
                        <span>Membuka Google OAuth Popup...</span>
                      </>
                    ) : (
                      <>
                        {/* Google G SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Pilih Akun Google (accounts.google.com)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={!googleUser}
                  id="btn-onboarding-step2-next"
                  className={`font-bold text-xs py-3 px-6 rounded-xl shadow-md flex items-center gap-2 transition-all ${
                    googleUser
                      ? 'bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9]'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>Lanjutkan ke Identitas Kelas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-[#2D302A]">
                Isi Identitas Kelas Anda
              </h3>

              {sheetError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 shadow-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{sheetError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2 p-3 bg-[#F5F2EB] rounded-xl border border-[#D8D3C5] flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-[#5A5A40] shrink-0" />
                  <div>
                    <div className="font-bold text-[#2D302A] text-xs">Akun Terhubung: {formData.teacherEmail}</div>
                    <p className="text-[10px] text-[#5A5A40]">Nama guru di bawah telah terisi otomatis dari akun Google yang Anda pilih.</p>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#2D302A] mb-1">Nama Guru / Wali Kelas *</label>
                  <input
                    type="text"
                    required
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    placeholder="Contoh: Ibu Nurhayati, S.Pd."
                    className="w-full p-2.5 rounded-xl border border-[#D8D3C5] outline-none focus:ring-2 focus:ring-[#5A5A40] font-medium"
                  />
                  <p className="text-[10px] text-[#5A5A40] mt-1">Anda dapat menambahkan gelar akademik jika diperlukan.</p>
                </div>

                <div>
                  <label className="block font-semibold text-[#2D302A] mb-1">Nama Sekolah *</label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="Contoh: TK Pembina Ceria"
                    className="w-full p-2.5 rounded-xl border border-[#D8D3C5] outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D302A] mb-1">Nama Kelas *</label>
                  <input
                    type="text"
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="Contoh: Kelas B2 - Bintang Kecil"
                    className="w-full p-2.5 rounded-xl border border-[#D8D3C5] outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D302A] mb-1">Jenjang Pendidikan *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as EducationLevel })}
                    className="w-full p-2.5 rounded-xl border border-[#D8D3C5] outline-none focus:ring-2 focus:ring-[#5A5A40] font-semibold text-[#2D302A]"
                  >
                    <option value="PAUD">PAUD</option>
                    <option value="TK">TK</option>
                    <option value="RA">RA</option>
                    <option value="SD">SD</option>
                    <option value="MI">MI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2D302A] mb-1">Tahun Ajaran *</label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2026/2027"
                    className="w-full p-2.5 rounded-xl border border-[#D8D3C5] outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={isCreatingSheet}
                  id="btn-onboarding-step3-finish"
                  className="bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] font-bold text-xs py-3 px-6 rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-75"
                >
                  {isCreatingSheet ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#FDFCF9]" />
                      <span>Membuat Google Spreadsheet di Drive...</span>
                    </>
                  ) : (
                    <>
                      <span>Buat Spreadsheet & Selesai</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-emerald-700" />
              </div>

              <h3 className="font-extrabold text-lg text-[#2D302A]">
                Spreadsheet Google Berhasil Dibuat!
              </h3>

              <p className="text-xs text-[#5A5A40] max-w-sm mx-auto leading-relaxed">
                Spreadsheet <b>"SekolahHub Class Database - {formData.className}"</b> telah resmi dibuat di Google Drive akun <b>{formData.teacherEmail}</b>.
              </p>

              <div className="p-3.5 bg-[#F5F2EB] rounded-2xl border border-[#D8D3C5] max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-[#2D302A]">
                  <span className="font-semibold text-stone-500 text-[11px]">Real Spreadsheet ID:</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-200 text-[11px] text-emerald-900">
                    {formData.googleSheetId || '1AbCdEf...'}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">Akses Langsung:</span>
                  <a
                    href={createdSheetUrl || `https://docs.google.com/spreadsheets/d/${formData.googleSheetId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-900 underline text-xs"
                  >
                    <span>Buka File di Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  id="btn-onboarding-open-dashboard"
                  className="bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] font-bold text-xs py-3.5 px-8 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Buka Dashboard Kelas Saya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
