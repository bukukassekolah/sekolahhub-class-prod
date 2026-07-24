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
  getSyncQueue,
  saveClassInfo,
  saveStudent,
  deleteStudent,
  saveAttendanceBatch,
  saveGrade,
  addSavingTransaction,
  saveJournalEntry,
  clearSyncQueue,
  resetAllDataToDefault
} from './lib/storageManager';

import { AssessmentAspect, GradeRecord, TeachingJournalEntry, ClassInfo } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Stored State
  const [classInfo, setClassInfo] = useState(getStoredClassInfo());
  const [students, setStudents] = useState(getStoredStudents());
  const [attendance, setAttendance] = useState(getStoredAttendance());
  const [grades, setGrades] = useState(getStoredGrades());
  const [savings, setSavings] = useState(getStoredSavings());
  const [journals, setJournals] = useState(getStoredJournals());
  const [syncQueue, setSyncQueue] = useState(getSyncQueue());

  // UI Modals
  const [isAksaModalOpen, setIsAksaModalOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state subscriber
  const refreshState = () => {
    setClassInfo(getStoredClassInfo());
    setStudents(getStoredStudents());
    setAttendance(getStoredAttendance());
    setGrades(getStoredGrades());
    setSavings(getStoredSavings());
    setJournals(getStoredJournals());
    setSyncQueue(getSyncQueue());
  };

  useEffect(() => {
    const handleDataChange = () => refreshState();
    window.addEventListener('sekolahhub_data_changed', handleDataChange);
    return () => window.removeEventListener('sekolahhub_data_changed', handleDataChange);
  }, []);

  // Sync to Google Sheets
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const queue = getSyncQueue();
      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queue, sheetId: classInfo.googleSheetId })
      });
      const data = await res.json();
      if (data.success) {
        clearSyncQueue();
        const updatedInfo = { ...classInfo, lastSyncedAt: data.syncedAt };
        saveClassInfo(updatedInfo);
      }
    } catch {
      alert('Gagal menyinkronkan ke server Google Sheets. Data tetap tersimpan aman secara lokal.');
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
        onOpenAksaAi={() => setIsAksaModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onManualSync={handleManualSync}
        onGoToLanding={() => setViewMode('landing')}
        isSyncing={isSyncing}
        activeTab={activeTab}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 gap-4">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentCount={students.length}
        />

        {/* View Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              classInfo={classInfo}
              students={students}
              attendance={attendance}
              savings={savings}
              journals={journals}
              syncQueue={syncQueue}
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
              onManualSync={handleManualSync}
              onResetData={resetAllDataToDefault}
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
      />
    </div>
  );
}
