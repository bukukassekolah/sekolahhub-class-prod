import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';
import { StudentSavingsSummary, SavingsTransaction } from '../types';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  Printer, 
  Trash2, 
  X, 
  AlertCircle, 
  Filter,
  Users,
  CheckCircle2,
  Calendar,
  FileText
} from 'lucide-react';

export const TabunganSiswa: React.FC = () => {
  const { 
    students, 
    savingsTransactions, 
    addSavingsTransaction, 
    deleteSavingsTransaction, 
    teacherProfile 
  } = useAuth();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Semua' | 'deposit' | 'withdrawal'>('Semua');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amountInput, setAmountInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notesInput, setNotesInput] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Currency Formatter
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // 1. Calculate Per-Student Savings Summaries
  const studentSummaries: StudentSavingsSummary[] = useMemo(() => {
    return students.map(student => {
      const studentTxList = savingsTransactions.filter(t => t.studentId === student.id);
      
      const totalDeposit = studentTxList
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawal = studentTxList
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);

      const currentBalance = totalDeposit - totalWithdrawal;

      return {
        student,
        totalDeposit,
        totalWithdrawal,
        currentBalance,
        lastTransactionDate: studentTxList[0]?.date
      };
    });
  }, [students, savingsTransactions]);

  // 2. Class Level Dashboard Calculations
  const classTotalBalance = useMemo(() => {
    return studentSummaries.reduce((sum, s) => sum + s.currentBalance, 0);
  }, [studentSummaries]);

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

  const monthlyDepositTotal = useMemo(() => {
    return savingsTransactions
      .filter(t => t.type === 'deposit' && t.date.startsWith(currentMonthStr))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [savingsTransactions, currentMonthStr]);

  const monthlyWithdrawalTotal = useMemo(() => {
    return savingsTransactions
      .filter(t => t.type === 'withdrawal' && t.date.startsWith(currentMonthStr))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [savingsTransactions, currentMonthStr]);

  // 3. Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return savingsTransactions.filter(t => {
      const matchesSearch = 
        t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'Semua' || t.type === typeFilter;
      const matchesStudent = selectedStudentFilter === 'Semua' || t.studentId === selectedStudentFilter;

      return matchesSearch && matchesType && matchesStudent;
    });
  }, [savingsTransactions, searchQuery, typeFilter, selectedStudentFilter]);

  // Open Modal Helpers
  const handleOpenAddModal = (studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    } else if (students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
    setTransactionType('deposit');
    setAmountInput('');
    setDateInput(new Date().toISOString().split('T')[0]);
    setNotesInput('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Check student balance on withdrawal
  const currentSelectedStudentBalance = useMemo(() => {
    if (!selectedStudentId) return 0;
    const summary = studentSummaries.find(s => s.student.id === selectedStudentId);
    return summary ? summary.currentBalance : 0;
  }, [selectedStudentId, studentSummaries]);

  // Handle Submit Transaction
  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const amount = parseFloat(amountInput.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      setFormError('Nominal transaksi harus lebih dari Rp 0.');
      return;
    }

    if (!selectedStudentId) {
      setFormError('Silakan pilih siswa terlebih dahulu.');
      return;
    }

    const studentObj = students.find(s => s.id === selectedStudentId);
    if (!studentObj) {
      setFormError('Siswa tidak ditemukan.');
      return;
    }

    if (transactionType === 'withdrawal' && amount > currentSelectedStudentBalance) {
      setFormError(`Saldo tabungan ${studentObj.name} (${formatRupiah(currentSelectedStudentBalance)}) tidak mencukupi untuk penarikan sebesar ${formatRupiah(amount)}.`);
      return;
    }

    setSubmitting(true);
    try {
      await addSavingsTransaction({
        studentId: studentObj.id,
        studentName: studentObj.name,
        type: transactionType,
        amount,
        date: dateInput,
        notes: notesInput.trim() || undefined
      });

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setFormError('Gagal menyimpan transaksi. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Transaction
  const handleDeleteTx = async (tx: SavingsTransaction) => {
    if (window.confirm(`Hapus transaksi ${tx.type === 'deposit' ? 'Setoran' : 'Penarikan'} ${formatRupiah(tx.amount)} milik "${tx.studentName}"?`)) {
      await deleteSavingsTransaction(tx.id);
    }
  };

  // Export PDF Report for Tabungan
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`LAPORAN REKAPITULASI TABUNGAN SISWA`, 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Sekolah: ${teacherProfile.schoolName || 'SekolahHub'}`, 14, 25);
    doc.text(`Kelas: ${teacherProfile.className || 'Kelas Basic'} | Wali Kelas: ${teacherProfile.teacherName || 'Guru'}`, 14, 30);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 35);

    // Summary Box
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 40, 182, 20, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Saldo Tabungan Kelas: ${formatRupiah(classTotalBalance)}`, 20, 48);
    doc.text(`Setoran Bulan Ini: ${formatRupiah(monthlyDepositTotal)}`, 20, 54);
    doc.text(`Penarikan Bulan Ini: ${formatRupiah(monthlyWithdrawalTotal)}`, 110, 54);

    // Table 1: Student Balances
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DAFTAR SALDO TABUNGAN PER SISWA', 14, 68);

    const studentRows = studentSummaries.map((s, idx) => [
      idx + 1,
      s.student.nis || '-',
      s.student.name,
      formatRupiah(s.totalDeposit),
      formatRupiah(s.totalWithdrawal),
      formatRupiah(s.currentBalance)
    ]);

    autoTable(doc, {
      startY: 72,
      head: [['No', 'NIS', 'Nama Siswa', 'Total Setoran', 'Total Penarikan', 'Saldo Akhir']],
      body: studentRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8.5 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 55 },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
        5: { cellWidth: 32, halign: 'right', fontStyle: 'bold' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;

    // Table 2: Recent Transactions Log
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RIWAYAT TRANSAKSI TABUNGAN TERAKHIR', 14, finalY + 12);

    const txRows = savingsTransactions.slice(0, 20).map((t, idx) => [
      idx + 1,
      t.date,
      t.studentName,
      t.type === 'deposit' ? 'SETOR' : 'TARIK',
      formatRupiah(t.amount),
      t.notes || '-'
    ]);

    autoTable(doc, {
      startY: finalY + 16,
      head: [['No', 'Tanggal', 'Nama Siswa', 'Jenis', 'Jumlah', 'Keterangan']],
      body: txRows,
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 50 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 32, halign: 'right' },
        5: { cellWidth: 45 }
      }
    });

    // Save
    doc.save(`Laporan_Tabungan_${teacherProfile.className || 'Kelas'}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <span>Tabungan Siswa Kelas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pencatatan setoran & penarikan tabungan siswa secara transparan dan terstruktur.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-2 border border-slate-300"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak PDF Tabungan</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Saldo */}
        <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md border border-blue-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-100">Total Saldo Tabungan</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black tracking-tight">{formatRupiah(classTotalBalance)}</h3>
            <p className="text-[11px] text-blue-100/80 mt-1">
              Dari {studentSummaries.filter(s => s.currentBalance > 0).length} siswa dengan saldo aktif
            </p>
          </div>
        </div>

        {/* Card 2: Setoran Bulan Ini */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Setoran Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-700">{formatRupiah(monthlyDepositTotal)}</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Pemasukan saldo bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Card 3: Penarikan Bulan Ini */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Penarikan Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-rose-600">{formatRupiah(monthlyWithdrawalTotal)}</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Pengeluaran tabungan bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Student Balances Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Ringkasan Saldo Tabungan per Siswa</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">
            {studentSummaries.length} Siswa Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 text-right">Total Setoran</th>
                <th className="py-3 px-4 text-right">Total Penarikan</th>
                <th className="py-3 px-4 text-right">Saldo Saat Ini</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentSummaries.map(summary => (
                <tr key={summary.student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                    {summary.student.nis || '-'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {summary.student.name}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-700">
                    {formatRupiah(summary.totalDeposit)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-rose-600">
                    {formatRupiah(summary.totalWithdrawal)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {formatRupiah(summary.currentBalance)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenAddModal(summary.student.id)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition-colors border border-blue-200"
                      >
                        + Transaksi
                      </button>
                      <button
                        onClick={() => setSelectedStudentFilter(summary.student.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] transition-colors"
                      >
                        Riwayat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History & Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Riwayat Transaksi Tabungan</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Daftar selengkapnya seluruh mutasi transaksi setor & tarik.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama / ket..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
              />
            </div>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700"
            >
              <option value="Semua">Jenis: Semua</option>
              <option value="deposit">Setor (+)</option>
              <option value="withdrawal">Tarik (-)</option>
            </select>

            <select
              value={selectedStudentFilter}
              onChange={e => setSelectedStudentFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 max-w-[180px] truncate"
            >
              <option value="Semua">Siswa: Semua</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {(searchQuery || typeFilter !== 'Semua' || selectedStudentFilter !== 'Semua') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('Semua');
                  setSelectedStudentFilter('Semua');
                }}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-[11px]"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10">
              <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-600 text-xs">Belum Ada Transaksi Tabungan</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {searchQuery || typeFilter !== 'Semua' || selectedStudentFilter !== 'Semua'
                  ? 'Tidak ada transaksi yang cocok dengan filter.'
                  : 'Klik "+ Transaksi Baru" untuk mencatat setoran tabungan siswa pertama.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4 text-right">Jumlah (Rp)</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {tx.studentName}
                    </td>
                    <td className="py-3 px-4">
                      {tx.type === 'deposit' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                          <span>Setor (+)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <ArrowDownRight className="w-3 h-3 text-rose-600" />
                          <span>Tarik (-)</span>
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-right font-black ${tx.type === 'deposit' ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {tx.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTx(tx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-8">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-xs text-white">Catat Transaksi Tabungan Siswa</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitTransaction} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Student Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  {students.map(s => {
                    const summary = studentSummaries.find(st => st.student.id === s.id);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} (Saldo: {formatRupiah(summary?.currentBalance || 0)})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Current Student Balance Badge */}
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-900">Saldo Saat Ini:</span>
                <span className="text-xs font-black text-blue-900">
                  {formatRupiah(currentSelectedStudentBalance)}
                </span>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Transaksi *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransactionType('deposit')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      transactionType === 'deposit'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Setor (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransactionType('withdrawal')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      transactionType === 'withdrawal'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Tarik (-)</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominal Transaksi (Rp) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    placeholder="Contoh: 10000"
                    value={amountInput}
                    onChange={e => setAmountInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-extrabold text-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Transaksi *</label>
                <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={e => setDateInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                />
              </div>

              {/* Notes Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Setoran tabungan mingguan"
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
