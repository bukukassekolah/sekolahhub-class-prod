import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPageView } from './components/views/LandingPageView';
import { DashboardView } from './components/views/DashboardView';
import { StudentProfileView } from './components/views/StudentProfileView';
import { AttendanceView } from './components/views/AttendanceView';
import { GradebookView } from './components/views/GradebookView';
import { ClassSavingsView } from './components/views/ClassSavingsView';
import { TeachingJournalView } from './components/views/TeachingJournalView';
import { ClassIdentityView } from './components/views/ClassIdentityView';
import { SettingsView } from './components/views/SettingsView';
import { ProFeaturePreviewView } from './components/views/ProFeaturePreviewView';
import { AksaAiWidget } from './components/AksaAiWidget';
import { QuickActionModal } from './components/QuickActionModal';
import { OnboardingModal } from './components/OnboardingModal';
import { Sparkles, ArrowRight } from 'lucide-react';

import {
  getStoredClassInfo,
  getStoredStudents,
  getStoredAttendance,
  getStoredGrades,
  getStoredSavings,
  getStoredJournals,
  getStoredFeedback,
  getSyncQueue,
  saveClassInfo,
  saveStudent,
  deleteStudent,
  saveAttendanceBatch,
  saveGrade,
  addSavingTransaction,
  saveJournalEntry,
  clearSyncQueue,
  resetAllDataToDefault,
  clearOperationalData,
  saveStudentsBatch,
  getStoredGoogleUser,
  saveGoogleUser,
  clearUserSession,
  getStoredTheme,
  saveTheme,
  ThemeMode
} from './lib/storageManager';
import { triggerGoogleOAuthPopup } from './lib/googleAuth';

import { AssessmentAspect, GradeRecord, TeachingJournalEntry, ClassInfo, GoogleUserProfile, StudentProfile } from './types';

export default function App() {
  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(getStoredGoogleUser());
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    return getStoredGoogleUser() ? 'app' : 'landing';
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Stored State
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getStoredTheme());
  const [classInfo, setClassInfo] = useState(getStoredClassInfo());
  const [students, setStudents] = useState(getStoredStudents());
  const [attendance, setAttendance] = useState(getStoredAttendance());
  const [grades, setGrades] = useState(getStoredGrades());
  const [savings, setSavings] = useState(getStoredSavings());
  const [journals, setJournals] = useState(getStoredJournals());
  const [syncQueue, setSyncQueue] = useState(getSyncQueue());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  // UI Modals & Navigation
  const [isAksaModalOpen, setIsAksaModalOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state subscriber
  const refreshState = () => {
    setClassInfo(getStoredClassInfo());
    setStudents(getStoredStudents());
    setAttendance(getStoredAttendance());
    setGrades(getStoredGrades());
    setSavings(getStoredSavings());
    setJournals(getStoredJournals());
    setSyncQueue(getSyncQueue());
    setGoogleUser(getStoredGoogleUser());
  };

  useEffect(() => {
    const handleDataChange = () => refreshState();
    window.addEventListener('sekolahhub_data_changed', handleDataChange);
    return () => window.removeEventListener('sekolahhub_data_changed', handleDataChange);
  }, []);

  // Google OAuth Login Success handler
  const handleLoginSuccess = (userProfile: GoogleUserProfile) => {
    saveGoogleUser(userProfile);
    setGoogleUser(userProfile);
    setIsDemoMode(false);
    setViewMode('app');

    // Automatically assign teacher name and email in classInfo if empty
    const currentInfo = getStoredClassInfo();
    const updatedInfo: ClassInfo = {
      ...currentInfo,
      teacherName: userProfile.name,
      teacherEmail: userProfile.email,
      googleSheetConnected: true
    };
    saveClassInfo(updatedInfo);
    setClassInfo(updatedInfo);
  };

  // Google Logout handler
  const handleLogout = () => {
    clearUserSession();
    setGoogleUser(null);
    setIsDemoMode(false);
    setViewMode('landing');
    setIsOnboardingOpen(false);
  };

  // Sync to Google Sheets
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      let currentUser = googleUser || getStoredGoogleUser();
      if (!currentUser?.accessToken) {
        // Prompt re-auth if token is missing
        currentUser = await triggerGoogleOAuthPopup();
        saveGoogleUser(currentUser);
        setGoogleUser(currentUser);
      }

      if (!classInfo.googleSheetId) {
        alert('Spreadsheet ID belum dikonfigurasi. Harap buat Spreadsheet Google di menu Pengaturan atau jalankan Onboarding terlebih dahulu.');
        return;
      }

      const allData = {
        classInfo,
        students,
        attendance,
        grades,
        savings,
        journals,
        feedback: getStoredFeedback()
      };

      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: currentUser.accessToken,
          spreadsheetId: classInfo.googleSheetId,
          allData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyinkronkan data ke Google Sheets.');
      }

      clearSyncQueue();
      const updatedInfo: ClassInfo = {
        ...classInfo,
        googleSheetConnected: true,
        lastSyncedAt: data.syncedAt || new Date().toISOString(),
        lastSyncError: undefined
      };
      saveClassInfo(updatedInfo);
      setClassInfo(updatedInfo);
      alert('Berhasil menyinkronkan seluruh data ke Google Spreadsheet!');
    } catch (err: any) {
      console.error('Manual sync error:', err);
      const errMsg = err?.message || 'Gagal menyinkronkan data ke Google Sheets.';
      const updatedInfo: ClassInfo = {
        ...classInfo,
        lastSyncError: errMsg
      };
      saveClassInfo(updatedInfo);
      setClassInfo(updatedInfo);
      alert(`Gagal Sinkronisasi: ${errMsg}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset Database (Fitur Baru 2)
  const handleResetDatabase = async () => {
    setIsSyncing(true);
    try {
      // 1. Clear operational local data
      clearOperationalData();

      // Update React State
      setStudents([]);
      setAttendance([]);
      setGrades([]);
      setSavings([]);
      setJournals([]);

      // 2. Clear Google Sheets operational rows if connected
      let currentUser = googleUser || getStoredGoogleUser();
      if (!currentUser?.accessToken) {
        currentUser = await triggerGoogleOAuthPopup();
        saveGoogleUser(currentUser);
        setGoogleUser(currentUser);
      }

      if (currentUser?.accessToken && classInfo.googleSheetId) {
        const allData = {
          classInfo,
          students: [],
          attendance: [],
          grades: [],
          savings: [],
          journals: [],
          feedback: []
        };

        const res = await fetch('/api/sheets/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: currentUser.accessToken,
            spreadsheetId: classInfo.googleSheetId,
            allData
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal mengosongkan worksheet di Google Sheets.');
        }
      }

      alert('Database operasional berhasil dikosongkan. Struktur database & identitas kelas tetap dipertahankan.');
    } catch (err: any) {
      console.error('Error resetting database:', err);
      alert(`Berhasil mengosongkan data lokal. Catatan Google Sheets: ${err?.message || ''}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Import Students Batch Handler (Fitur Baru 3-8)
  const handleImportStudentsBatch = async (
    importedStudentsList: StudentProfile[],
    options: { mode: 'append' | 'replace'; duplicateAction: 'skip' | 'update' | 'cancel' }
  ) => {
    setIsSyncing(true);
    try {
      const result = saveStudentsBatch(importedStudentsList, options);

      if (!result.success) {
        alert('Proses import dibatalkan karena ditemukan data ganda.');
        return;
      }

      // Refresh state
      const updatedStudents = getStoredStudents();
      setStudents(updatedStudents);

      const info = getStoredClassInfo();
      setClassInfo(info);

      // Trigger sync to Google Sheets if connected
      let currentUser = googleUser || getStoredGoogleUser();
      if (currentUser?.accessToken && classInfo.googleSheetId) {
        const allData = {
          classInfo: info,
          students: updatedStudents,
          attendance,
          grades,
          savings,
          journals,
          feedback: getStoredFeedback()
        };

        await fetch('/api/sheets/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: currentUser.accessToken,
            spreadsheetId: classInfo.googleSheetId,
            allData
          })
        });
      }

      alert(
        `Berhasil mengimpor data siswa!\n• Ditambahkan: ${result.countAdded} siswa\n• Diperbarui: ${result.countUpdated} siswa\n• Dilewati: ${result.countSkipped} siswa`
      );
    } catch (err: any) {
      console.error('Error batch importing students:', err);
      alert(`Gagal mengimpor data siswa ke Google Sheets: ${err?.message || 'Terjadi kesalahan.'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Demo mode launcher
  const handleStartDemo = () => {
    setIsDemoMode(true);
    setViewMode('app');
    if (!classInfo.teacherName) {
      const demoClassInfo: ClassInfo = {
        ...classInfo,
        teacherName: 'Ibu Maria, S.Pd. (Demo)',
        teacherEmail: 'guru.demo@sekolahhub.id',
        schoolName: 'TK Pembina Ceria Melati',
        className: 'Kelas B2 - Bintang Kecil',
        googleSheetConnected: true
      };
      saveClassInfo(demoClassInfo);
      setClassInfo(demoClassInfo);
    }
  };

  // Onboarding save handler
  const handleSaveClassInfoFromOnboarding = (updatedInfo: ClassInfo) => {
    saveClassInfo(updatedInfo);
    setClassInfo(updatedInfo);
    setIsDemoMode(false);
    setViewMode('app');
    setIsOnboardingOpen(false);
  };

  // Insertion handlers for Aksa AI outputs
  const handleInsertToGradebook = (studentId: string, aspect: AssessmentAspect, narrative: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newGrade: GradeRecord = {
      id: `grd_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      studentId: student.id,
      studentName: student.fullName,
      aspect,
      rating: 'BSB',
      description: narrative,
      teacherNote: 'Dihasilkan bersama Aksa AI Assistant'
    };

    saveGrade(newGrade);
    setIsAksaModalOpen(false);
    setActiveTab('gradebook');
    alert(`Narasi hasil belajar berhasil disimpan ke Buku Nilai untuk ${student.fullName}!`);
  };

  const handleInsertToJournal = (topic: string, content: string) => {
    const newEntry: TeachingJournalEntry = {
      id: `jrn_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      topic,
      activities: content,
      mediaUsed: 'Disusun bersama Aksa AI',
      reflection: 'Proses pembelajaran terencana dengan bantuan AI Assistant.'
    };

    saveJournalEntry(newEntry);
    setIsAksaModalOpen(false);
    setActiveTab('journal');
    alert('Draf jurnal mengajar berhasil disimpan ke Jurnal Harian!');
  };

  const handleQuickActionSelect = (actionId: 'attendance' | 'gradebook' | 'journal' | 'savings') => {
    setActiveTab(actionId);
  };

  // If viewing Landing Page as initial entry point
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPageView
          onStartUse={() => setIsOnboardingOpen(true)}
          onStartDemo={handleStartDemo}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          classInfo={classInfo}
          onSaveClassInfo={handleSaveClassInfoFromOnboarding}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D302A] font-sans flex flex-col">
      {/* Demo Mode Top Banner */}
      {isDemoMode && (
        <div className="bg-[#FFE8D6] border-b border-[#DDBEA9] px-4 py-2 text-xs text-[#2D302A] flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner z-40">
          <div className="flex items-center gap-2 font-medium">
            <span className="px-2 py-0.5 bg-[#DDBEA9] text-[#2D302A] font-extrabold rounded-md text-[10px] uppercase tracking-wider">
              MODE DEMO
            </span>
            <span>Anda sedang mencoba SekolahHub Class dengan data sampel sekolah.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="bg-[#5A5A40] hover:bg-[#464632] text-[#FDFCF9] px-3.5 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A4AC86]" />
              <span>Mulai Gunakan (Hubungkan Google)</span>
            </button>
            <button
              onClick={() => setViewMode('landing')}
              className="text-[#5A5A40] hover:underline font-bold text-xs"
            >
              Ke Landing Page
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        classInfo={classInfo}
        syncQueue={syncQueue}
        isDemoMode={isDemoMode}
        googleUser={googleUser}
        onOpenAksaAi={() => setIsAksaModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onManualSync={handleManualSync}
        onGoToLanding={() => setViewMode('landing')}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isSyncing={isSyncing}
        activeTab={activeTab}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 gap-4">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentCount={students.length}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          googleUser={googleUser}
          classInfo={classInfo}
          isDemoMode={isDemoMode}
          onLogout={handleLogout}
        />

        {/* View Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {activeTab === 'dashboard' && (
              <DashboardView
                classInfo={classInfo}
                students={students}
                attendance={attendance}
                savings={savings}
                journals={journals}
                syncQueue={syncQueue}
                googleUser={googleUser}
                onNavigateTab={setActiveTab}
                onOpenQuickAction={() => setIsQuickActionOpen(true)}
                onInsertToGradebook={handleInsertToGradebook}
                onInsertToJournal={handleInsertToJournal}
              />
            )}

            {activeTab === 'students' && (
              <StudentProfileView
                students={students}
                attendance={attendance}
                grades={grades}
                savings={savings}
                onSaveStudent={saveStudent}
                onDeleteStudent={deleteStudent}
                onImportStudentsBatch={handleImportStudentsBatch}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView
                students={students}
                attendance={attendance}
                onSaveAttendance={saveAttendanceBatch}
              />
            )}

            {activeTab === 'gradebook' && (
              <GradebookView
                students={students}
                grades={grades}
                onSaveGrade={saveGrade}
                onOpenAksaAi={() => setIsAksaModalOpen(true)}
              />
            )}

            {activeTab === 'savings' && (
              <ClassSavingsView
                students={students}
                savings={savings}
                onAddTransaction={addSavingTransaction}
              />
            )}

            {activeTab === 'journal' && (
              <TeachingJournalView
                journals={journals}
                onSaveJournal={saveJournalEntry}
                onOpenAksaAi={() => setIsAksaModalOpen(true)}
              />
            )}

            {activeTab === 'classInfo' && (
              <ClassIdentityView
                classInfo={classInfo}
                onSaveClassInfo={saveClassInfo}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                classInfo={classInfo}
                syncQueue={syncQueue}
                currentTheme={currentTheme}
                onThemeChange={handleThemeChange}
                onManualSync={handleManualSync}
                onResetData={resetAllDataToDefault}
                onResetDatabase={handleResetDatabase}
                onOpenImportModal={() => setActiveTab('students')}
                isSyncing={isSyncing}
              />
            )}

            {activeTab === 'aksaAi' && (
              <div className="max-w-3xl mx-auto">
                <AksaAiWidget
                  students={students}
                  onInsertToGradebook={handleInsertToGradebook}
                  onInsertToJournal={handleInsertToJournal}
                />
              </div>
            )}

            {activeTab.startsWith('pro-') && (
              <ProFeaturePreviewView tabId={activeTab} />
            )}
          </div>

          {/* Simple School Footer */}
          <footer className="mt-10 pt-6 pb-2 border-t border-stone-200/80 text-center text-xs text-stone-500 space-y-1">
            <p>© 2026 {classInfo.schoolName || 'SDI Al Hasan'}</p>
            <p>
              Powered by <span className="font-semibold text-stone-700">KUKAS Platform</span>
            </p>
            <p>
              <a
                href="https://www.kukas.biz.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-medium transition-colors"
              >
                www.kukas.biz.id
              </a>
            </p>
          </footer>
        </main>
      </div>

      {/* Aksa AI Modal */}
      {isAksaModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <AksaAiWidget
            students={students}
            onInsertToGradebook={handleInsertToGradebook}
            onInsertToJournal={handleInsertToJournal}
            onClose={() => setIsAksaModalOpen(false)}
            isModal={true}
          />
        </div>
      )}

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onSelectAction={handleQuickActionSelect}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        classInfo={classInfo}
        onSaveClassInfo={handleSaveClassInfoFromOnboarding}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
