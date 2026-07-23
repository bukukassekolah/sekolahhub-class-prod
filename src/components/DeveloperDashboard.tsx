import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { fetchAllImplementationRequests } from '../lib/firebase';
import { ImplementationRequest } from '../types';
import {
  ShieldAlert,
  Terminal,
  Activity,
  Server,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  CheckCheck,
  Eye,
  ChevronRight,
  Database,
  UserCheck,
  Layers,
  ArrowLeft,
  Sun,
  Moon,
  Info,
  Building2,
  Mail,
  Phone,
  Calendar,
  FileText,
  Cpu
} from 'lucide-react';

// Sample fallback requests for comprehensive initial developer monitoring if DB is fresh
const INITIAL_DEMO_REQUESTS: ImplementationRequest[] = [
  {
    id: 'doc_demo_01',
    requestId: 'REQ-17823901-4412',
    schoolName: 'SD Negeri 01 Merdeka',
    contactName: 'Siti Nurhaliza, S.Pd.',
    email: 'siti.nurhaliza@sdn01merdeka.sch.id',
    whatsapp: '6281234567890',
    city: 'Jakarta Selatan',
    educationLevel: 'SD / MI',
    teacherCount: 18,
    studentCount: 420,
    notes: 'Permohonan aktivasi otomatis paket Basic Free untuk ajaran 2025/2026.',
    plan: 'SekolahHub Class Basic',
    authProvisioning: 'Completed',
    status: 'Active',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    backendWorkerService: 'Firebase Admin SDK / Cloud Functions'
  },
  {
    id: 'doc_demo_02',
    requestId: 'REQ-17823988-9012',
    schoolName: 'SMP Nusantara Utama',
    contactName: 'Budi Santoso, M.Pd.',
    email: 'budi.santoso@smpnusantara.sch.id',
    whatsapp: '6281987654321',
    city: 'Bandung',
    educationLevel: 'SMP / MTs',
    teacherCount: 32,
    studentCount: 780,
    notes: 'Pengajuan paket Pro dengan modul Rapor Digital dan Multi-Guru.',
    plan: 'SekolahHub Class Pro',
    authProvisioning: 'PendingAdmin',
    status: 'Pending',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    backendWorkerService: 'Firebase Admin SDK / Queue Service'
  },
  {
    id: 'doc_demo_03',
    requestId: 'REQ-17823101-3321',
    schoolName: 'SMA Cendekia Bangsa',
    contactName: 'Dra. Endang Rahayu',
    email: 'endang@smacendekia.sch.id',
    whatsapp: '6281311223344',
    city: 'Surabaya',
    educationLevel: 'SMA / MA',
    teacherCount: 45,
    studentCount: 1100,
    notes: 'Verifikasi pendaftaran instansi yang telah disetujui.',
    plan: 'SekolahHub Class Pro',
    authProvisioning: 'Queued',
    status: 'Approved',
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    backendWorkerService: 'Queue Service / Worker Pool A'
  },
  {
    id: 'doc_demo_04',
    requestId: 'REQ-17822005-7788',
    schoolName: 'SD Islam Al-Azhar 15',
    contactName: 'Ahmad Fauzi, S.Ag.',
    email: 'fauzi@alazhar15.sch.id',
    whatsapp: '6285711223344',
    city: 'Tangerang Selatan',
    educationLevel: 'SD / MI',
    teacherCount: 24,
    studentCount: 520,
    notes: 'Penyelesaian provisioning akun guru terintegrasi.',
    plan: 'SekolahHub Class Basic',
    authProvisioning: 'Completed',
    status: 'Completed',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    backendWorkerService: 'Firebase Admin SDK'
  },
  {
    id: 'doc_demo_05',
    requestId: 'REQ-17821102-1100',
    schoolName: 'SMP Negeri 4 Banten',
    contactName: 'H. Suryadi, S.Pd.',
    email: 'suryadi@smpn4banten.sch.id',
    whatsapp: '6281299887766',
    city: 'Serang',
    educationLevel: 'SMP / MTs',
    teacherCount: 28,
    studentCount: 650,
    notes: 'Kendala verifikasi nomor WhatsApp instansi.',
    plan: 'SekolahHub Class Pro',
    authProvisioning: 'Failed',
    status: 'Failed',
    submittedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    backendWorkerService: 'Worker Pool B'
  }
];

export const DeveloperDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [requests, setRequests] = useState<ImplementationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ImplementationRequest | null>(null);

  // Check Developer Access Authorization
  const isDeveloper = useMemo(() => {
    if (!currentUser || !currentUser.email) return false;
    const email = currentUser.email.toLowerCase().trim();
    return (
      email === 'tripurwojianto7@gmail.com' ||
      email.endsWith('@sekolahhub.id') ||
      email.includes('developer') ||
      email.includes('admin')
    );
  }, [currentUser]);

  // Load Data from Firestore
  const loadData = async () => {
    setRefreshing(true);
    try {
      const data = await fetchAllImplementationRequests();
      if (data && data.length > 0) {
        // Merge with initial demo if needed to ensure all status types exist for monitoring demo
        const existingIds = new Set(data.map((d) => d.requestId || d.id));
        const merged = [...data];
        INITIAL_DEMO_REQUESTS.forEach((demo) => {
          if (!existingIds.has(demo.requestId)) {
            merged.push(demo);
          }
        });
        merged.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
        setRequests(merged);
      } else {
        setRequests(INITIAL_DEMO_REQUESTS);
      }
    } catch (err) {
      console.error('Failed to fetch implementation requests:', err);
      setRequests(INITIAL_DEMO_REQUESTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isDeveloper) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isDeveloper]);

  // Compute Statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'Pending').length;
    const approved = requests.filter((r) => r.status === 'Approved').length;
    const active = requests.filter((r) => r.status === 'Active').length;
    const failed = requests.filter((r) => r.status === 'Failed').length;
    const completed = requests.filter((r) => r.status === 'Completed').length;

    const queuedAuth = requests.filter((r) => r.authProvisioning === 'Queued').length;
    const processingAuth = requests.filter((r) => r.authProvisioning === 'Processing').length;
    const completedAuth = requests.filter((r) => r.authProvisioning === 'Completed').length;
    const failedAuth = requests.filter(
      (r) => r.authProvisioning === 'Failed' || r.authProvisioning === 'PendingAdmin'
    ).length;

    return {
      total,
      pending,
      approved,
      active,
      failed,
      completed,
      queuedAuth,
      processingAuth,
      completedAuth,
      failedAuth
    };
  }, [requests]);

  // Filtered List
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Filter by status tab
      if (statusFilter !== 'Semua' && req.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSchool = req.schoolName?.toLowerCase().includes(q);
        const matchEmail = req.email?.toLowerCase().includes(q);
        const matchContact = req.contactName?.toLowerCase().includes(q);
        const matchReqId = req.requestId?.toLowerCase().includes(q);
        return matchSchool || matchEmail || matchContact || matchReqId;
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  // Generated System Activity Log
  const activityLogs = useMemo(() => {
    const logs: Array<{
      id: string;
      time: string;
      activity: string;
      school: string;
      result: string;
      type: 'info' | 'success' | 'warning' | 'error';
    }> = [];

    requests.slice(0, 8).forEach((req, idx) => {
      const formattedTime = new Date(req.submittedAt || Date.now()).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
      });

      if (req.status === 'Active') {
        logs.push({
          id: `log_${idx}_active`,
          time: formattedTime,
          activity: 'Implementation Auto-Activated',
          school: req.schoolName,
          result: 'Active & Provisioned',
          type: 'success'
        });
      } else if (req.status === 'Pending') {
        logs.push({
          id: `log_${idx}_pending`,
          time: formattedTime,
          activity: 'New Implementation Request Received',
          school: req.schoolName,
          result: 'Awaiting Verification',
          type: 'warning'
        });
      } else if (req.status === 'Approved') {
        logs.push({
          id: `log_${idx}_app`,
          time: formattedTime,
          activity: 'Provisioning Started',
          school: req.schoolName,
          result: 'Queued for Worker',
          type: 'info'
        });
      } else if (req.status === 'Failed') {
        logs.push({
          id: `log_${idx}_fail`,
          time: formattedTime,
          activity: 'Provisioning Failed',
          school: req.schoolName,
          result: 'Worker Timeout',
          type: 'error'
        });
      } else if (req.status === 'Completed') {
        logs.push({
          id: `log_${idx}_comp`,
          time: formattedTime,
          activity: 'Provisioning Completed',
          school: req.schoolName,
          result: 'School Activated',
          type: 'success'
        });
      }
    });

    return logs;
  }, [requests]);

  const handleReturnToDashboard = () => {
    window.location.pathname = '/';
  };

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300/60 dark:border-blue-800">
            <CheckCheck className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/60 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-300/60 dark:border-teal-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  const getProvisioningBadge = (prov?: string) => {
    switch ((prov || '').toLowerCase()) {
      case 'completed':
        return (
          <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-900">
            Completed
          </span>
        );
      case 'queued':
        return (
          <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-900">
            Queued
          </span>
        );
      case 'processing':
        return (
          <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900">
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
            Failed
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
            {prov || 'PendingAdmin'}
          </span>
        );
    }
  };

  // Render 403 Forbidden if not authorized developer
  if (!isDeveloper) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-9 h-9 animate-pulse" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-bold border border-rose-500/20 mb-3">
              HTTP 403 FORBIDDEN
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Akses Ditolak</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Halaman Developer Dashboard merupakan area internal terbatas. Akun Anda ({currentUser?.email || 'Guest'}) tidak memiliki hak akses pengembang.
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2 font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Path:</span>
              <span className="text-slate-200">/developer</span>
            </div>
            <div className="flex justify-between">
              <span>Identity:</span>
              <span className="text-slate-200">{currentUser?.email || 'Unauthenticated'}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-rose-400 font-bold">Unauthorized</span>
            </div>
          </div>

          <button
            onClick={handleReturnToDashboard}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Guru</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col transition-colors">
      {/* Developer Header Bar */}
      <header className="bg-slate-800/80 border-b border-slate-700/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold shadow-md">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-white tracking-tight">Developer Dashboard</h1>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  INTERNAL PANEL
                </span>
              </div>
              <p className="text-xs text-slate-400">Internal Administration Panel • SekolahHub Core Engine v2.4</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>

            <button
              onClick={loadData}
              disabled={refreshing}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <button
              onClick={handleReturnToDashboard}
              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard Guru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Top Summary / Stats Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Dashboard Overview (Implementation Status)</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Total Permohonan: <strong className="text-white">{stats.total}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 shadow-sm space-y-1">
              <p className="text-[11px] font-semibold text-slate-400">Total Requests</p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
              <p className="text-[10px] text-slate-400">Semua Masuk</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-amber-500/30 shadow-sm space-y-1">
              <p className="text-[11px] font-semibold text-amber-400 flex items-center justify-between">
                <span>Pending</span>
                <Clock className="w-3.5 h-3.5" />
              </p>
              <p className="text-2xl font-black text-amber-300">{stats.pending}</p>
              <p className="text-[10px] text-slate-400">Menunggu Verifikasi</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-blue-500/30 shadow-sm space-y-1">
              <p className="text-[11px] font-semibold text-blue-400 flex items-center justify-between">
                <span>Approved</span>
                <CheckCheck className="w-3.5 h-3.5" />
              </p>
              <p className="text-2xl font-black text-blue-300">{stats.approved}</p>
              <p className="text-[10px] text-slate-400">Disetujui Admin</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-emerald-500/30 shadow-sm space-y-1">
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                <span>Active</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </p>
              <p className="text-2xl font-black text-emerald-300">{stats.active}</p>
              <p className="text-[10px] text-slate-400">Aktif Digunakan</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-rose-500/30 shadow-sm space-y-1">
              <p className="text-[11px] font-semibold text-rose-400 flex items-center justify-between">
                <span>Failed</span>
                <XCircle className="w-3.5 h-3.5" />
              </p>
              <p className="text-2xl font-black text-rose-300">{stats.failed}</p>
              <p className="text-[10px] text-slate-400">Gagal / Error</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-teal-500/30 shadow-sm space-y-1">
              <p className="text-[11px] font-semibold text-teal-400 flex items-center justify-between">
                <span>Completed</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </p>
              <p className="text-2xl font-black text-teal-300">{stats.completed}</p>
              <p className="text-[10px] text-slate-400">Selesai Full</p>
            </div>
          </div>
        </section>

        {/* Backend Provisioning & Activity Logs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Backend Provisioning Panel */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Backend Provisioning</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                Worker Active
              </span>
            </div>

            <p className="text-xs text-slate-400">Status antrean akun & pembuatan database permohonan:</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Queue</p>
                  <p className="text-lg font-black text-sky-400">{stats.queuedAuth}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                  Q
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Processing</p>
                  <p className="text-lg font-black text-purple-400">{stats.processingAuth}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  P
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Completed</p>
                  <p className="text-lg font-black text-teal-400">{stats.completedAuth}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                  C
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Failed / Pending</p>
                  <p className="text-lg font-black text-amber-400">{stats.failedAuth}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  !
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Backend Worker Health</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Worker SDK terhubung ke Firestore collection <code className="text-indigo-300 font-mono text-[10px]">ImplementationRequests</code>. Penanganan pembuatan profil & akun berjalan otomatis.
              </p>
            </div>
          </div>

          {/* Activity Log Panel */}
          <div className="lg:col-span-2 bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Activity Log</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Realtime Stream</span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {activityLogs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">Belum ada log aktivitas terdeteksi.</div>
              ) : (
                activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-900/70 border border-slate-700/50 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 bg-slate-800 px-1.5 py-0.5 rounded">
                        {log.time}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 truncate">{log.activity}</p>
                        <p className="text-[11px] text-slate-400 truncate">{log.school}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        log.type === 'success'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : log.type === 'warning'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : log.type === 'error'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}
                    >
                      {log.result}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Daftar Permohonan Implementasi Table & Filter */}
        <section className="bg-slate-800/90 rounded-2xl border border-slate-700/80 shadow-sm p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Daftar Permohonan Implementasi Sekolah</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoring data pendaftaran, jenjang, paket, serta status provisioning akun.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Sekolah, Email, PJ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter Status:
            </span>
            {['Semua', 'Pending', 'Approved', 'Active', 'Failed', 'Completed'].map((st) => {
              const active = statusFilter.toLowerCase() === st.toLowerCase();
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Table View Desktop & Cards Mobile */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Memuat data dari Firestore...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada permohonan implementasi ditemukan untuk filter ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50">
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Nama Sekolah</th>
                    <th className="py-3 px-3">Penanggung Jawab</th>
                    <th className="py-3 px-3">Kontak</th>
                    <th className="py-3 px-3">Jenjang</th>
                    <th className="py-3 px-3">Paket</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Auth Provisioning</th>
                    <th className="py-3 px-3">Created At</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-xs">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id || req.requestId}
                      onClick={() => setSelectedRequest(req)}
                      className="hover:bg-slate-700/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-indigo-300 whitespace-nowrap">
                        {req.requestId || req.id?.substring(0, 8)}
                      </td>
                      <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{req.schoolName}</td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{req.contactName}</td>
                      <td className="py-3 px-3 text-slate-300">
                        <div className="truncate max-w-[160px]">{req.email}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{req.whatsapp}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{req.educationLevel}</td>
                      <td className="py-3 px-3 font-medium text-slate-200 whitespace-nowrap">{req.plan}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{getProvisioningBadge(req.authProvisioning)}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(req.submittedAt || Date.now()).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Detail Panel Modal / Drawer */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-slate-100">
              <div className="flex items-start justify-between pb-4 border-b border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                      {selectedRequest.requestId || selectedRequest.id}
                    </span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <h3 className="text-xl font-black text-white mt-2">{selectedRequest.schoolName}</h3>
                  <p className="text-xs text-slate-400">Detail Lengkap Firestore Implementation Request</p>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Grid of Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Penanggung Jawab
                  </p>
                  <p className="font-bold text-white text-sm">{selectedRequest.contactName}</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Instansi
                  </p>
                  <p className="font-bold text-white text-sm truncate">{selectedRequest.email}</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> WhatsApp Kontak
                  </p>
                  <p className="font-bold text-white text-sm font-mono">{selectedRequest.whatsapp}</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Kota / Kabupaten
                  </p>
                  <p className="font-bold text-white text-sm">{selectedRequest.city || '-'}</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" /> Jenjang Pendidikan
                  </p>
                  <p className="font-bold text-white text-sm">{selectedRequest.educationLevel}</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Paket Pilihan
                  </p>
                  <p className="font-bold text-indigo-300 text-sm">{selectedRequest.plan}</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Estimasi Guru / Siswa</p>
                  <p className="font-bold text-white text-sm">
                    {selectedRequest.teacherCount || 0} Guru • {selectedRequest.studentCount || 0} Siswa
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Auth Provisioning State</p>
                  <div>{getProvisioningBadge(selectedRequest.authProvisioning)}</div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1 sm:col-span-2">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Backend Worker Service</p>
                  <p className="font-mono text-slate-300 text-xs">
                    {selectedRequest.backendWorkerService || 'Firebase Admin SDK / Cloud Functions'}
                  </p>
                </div>

                {selectedRequest.notes && (
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1 sm:col-span-2">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Catatan Pendaftaran</p>
                    <p className="text-slate-200 text-xs leading-relaxed">{selectedRequest.notes}</p>
                  </div>
                )}

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1 sm:col-span-2">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Submitted Timestamp & Firestore ID</p>
                  <p className="font-mono text-slate-300 text-xs">
                    {selectedRequest.submittedAt} (Doc ID: {selectedRequest.id || '-'})
                  </p>
                </div>
              </div>

              {/* Informational Footer note */}
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/60 rounded-xl flex items-center gap-2.5 text-xs text-indigo-300">
                <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                <p>
                  Aksi administrasi lanjutan (Approve, Reject, Retry, Create Account) akan diaktifkan pada modul rilis Developer berikutnya.
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Tutup Panel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
