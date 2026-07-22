import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProfilKelas } from './components/ProfilKelas';
import { DataSiswa } from './components/DataSiswa';
import { Presensi } from './components/Presensi';
import { TabunganSiswa } from './components/TabunganSiswa';
import { CatatanGuru } from './components/CatatanGuru';
import { Pengumuman } from './components/Pengumuman';
import { Laporan } from './components/Laporan';
import { AksaAIFloating } from './components/AksaAIFloating';
import { FeedbackModal } from './components/FeedbackModal';
import { UpgradeModal } from './components/UpgradeModal';
import { GraduationCap } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [subAction, setSubAction] = useState<string | undefined>(undefined);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const handleNavigate = (tab: string, action?: string) => {
    let targetTab: ActiveTab = 'dashboard';
    if (tab === 'profile' || tab === 'profil') targetTab = 'profile';
    else if (tab === 'students' || tab === 'siswa') targetTab = 'students';
    else if (tab === 'attendance' || tab === 'presensi') targetTab = 'attendance';
    else if (tab === 'savings' || tab === 'tabungan') targetTab = 'savings';
    else if (tab === 'notes' || tab === 'catatan') targetTab = 'notes';
    else if (tab === 'announcements' || tab === 'pengumuman') targetTab = 'announcements';
    else if (tab === 'reports' || tab === 'laporan') targetTab = 'reports';
    else if (tab === 'feedback') {
      setIsFeedbackOpen(true);
      return;
    }

    setActiveTab(targetTab);
    setSubAction(action);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center animate-bounce shadow-lg shadow-blue-500/30 mb-4">
          <GraduationCap className="w-7 h-7" />
        </div>
        <p className="text-sm font-bold text-slate-800 tracking-tight">SekolahHub Class Basic</p>
        <p className="text-xs text-slate-500 mt-1">Memuat data kelas Anda...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col text-slate-900 font-sans">
      <Header
        activeTab={activeTab}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenUpgradeModal={() => setIsUpgradeOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => handleNavigate(tab)}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onOpenUpgradeModal={() => setIsUpgradeOpen(true)}
          onOpenFeedbackModal={() => setIsFeedbackOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard onNavigate={handleNavigate} />
          )}

          {activeTab === 'profile' && (
            <ProfilKelas />
          )}

          {activeTab === 'students' && (
            <DataSiswa initialOpenAdd={subAction === 'add'} />
          )}

          {activeTab === 'attendance' && (
            <Presensi />
          )}

          {activeTab === 'savings' && (
            <TabunganSiswa />
          )}

          {activeTab === 'notes' && (
            <CatatanGuru initialOpenAdd={subAction === 'add'} />
          )}

          {activeTab === 'announcements' && (
            <Pengumuman initialOpenAdd={subAction === 'add'} />
          )}

          {activeTab === 'reports' && (
            <Laporan />
          )}
        </main>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      <AksaAIFloating />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
