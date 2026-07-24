import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Minus,
  Search,
  FileText,
  Printer,
  X,
  Receipt
} from 'lucide-react';
import { StudentProfile, ClassSavingTransaction, SavingTransactionType } from '../../types';

interface ClassSavingsViewProps {
  students: StudentProfile[];
  savings: ClassSavingTransaction[];
  onAddTransaction: (trans: Omit<ClassSavingTransaction, 'id' | 'runningBalance'>) => void;
}

export const ClassSavingsView: React.FC<ClassSavingsViewProps> = ({
  students,
  savings,
  onAddTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'log' | 'balance'>('log');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transType, setTransType] = useState<SavingTransactionType>('Setoran');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState<number>(10000);
  const [description, setDescription] = useState('');

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<ClassSavingTransaction | null>(null);

  const openTransactionModal = (type: SavingTransactionType) => {
    setTransType(type);
    setSelectedStudentId(students[0]?.id || '');
    setAmount(10000);
    setDescription(type === 'Setoran' ? 'Setoran tabungan kelas' : 'Penarikan tabungan');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || amount <= 0) return;

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const dateStr = `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

    onAddTransaction({
      date: dateStr,
      studentId: student.id,
      studentName: student.fullName,
      type: transType,
      amount,
      description: description || (transType === 'Setoran' ? 'Setoran tabungan' : 'Penarikan tabungan')
    });

    setIsModalOpen(false);
  };

  // Calculations
  const totalMasuk = savings.filter(s => s.type === 'Setoran').reduce((sum, s) => sum + s.amount, 0);
  const totalKeluar = savings.filter(s => s.type === 'Penarikan').reduce((sum, s) => sum + s.amount, 0);
  const saldoKasAkhir = totalMasuk - totalKeluar;

  // Student Balance Matrix
  const studentBalances = students.map(st => {
    const stSavings = savings.filter(s => s.studentId === st.id);
    const masuk = stSavings.filter(s => s.type === 'Setoran').reduce((sum, s) => sum + s.amount, 0);
    const keluar = stSavings.filter(s => s.type === 'Penarikan').reduce((sum, s) => sum + s.amount, 0);
    const saldo = masuk - keluar;
    return {
      student: st,
      masuk,
      keluar,
      saldo,
      lastTrans: stSavings[0]?.date || '-'
    };
  });

  const filteredSavings = savings.filter(s =>
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-amber-700" />
            <span>Tabungan & Kas Kelas</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pencatatan mutasi setoran dan penarikan tabungan harian siswa
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => openTransactionModal('Setoran')}
            id="btn-deposit-savings"
            className="flex-1 sm:flex-none text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Setor Tabungan</span>
          </button>

          <button
            onClick={() => openTransactionModal('Penarikan')}
            id="btn-withdraw-savings"
            className="flex-1 sm:flex-none text-xs bg-rose-700 hover:bg-rose-600 text-white font-bold py-2.5 px-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Minus className="w-4 h-4" />
            <span>- Tarik Tabungan</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-800">Total Masuk (Setoran)</span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">
            {formatRupiah(totalMasuk)}
          </div>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-rose-800">Total Keluar (Penarikan)</span>
            <ArrowUpRight className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-950">
            {formatRupiah(totalKeluar)}
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-amber-800">Saldo Kas Akhir</span>
            <Wallet className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-950">
            {formatRupiah(saldoKasAkhir)}
          </div>
        </div>
      </div>

      {/* View Switch Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-sm">
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'log' ? 'bg-amber-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Riwayat Transaksi
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'balance' ? 'bg-amber-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saldo Per Siswa
          </button>
        </div>

        {activeTab === 'log' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-stone-300 outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>
        )}
      </div>

      {/* Content Tabs */}
      {activeTab === 'log' ? (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5 pl-5">Tanggal & Waktu</th>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5 text-center">Jenis Mutasi</th>
                  <th className="p-3.5 text-right">Nominal</th>
                  <th className="p-3.5 text-right">Saldo Berjalan</th>
                  <th className="p-3.5">Keterangan</th>
                  <th className="p-3.5 pr-5 text-center">Kwitansi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSavings.map((st) => (
                  <tr key={st.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3.5 pl-5 text-stone-500 font-mono text-[11px]">{st.date}</td>
                    <td className="p-3.5 font-bold text-stone-900">{st.studentName}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        st.type === 'Setoran'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {st.type}
                      </span>
                    </td>
                    <td className={`p-3.5 text-right font-extrabold ${
                      st.type === 'Setoran' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {st.type === 'Setoran' ? '+' : '-'}{formatRupiah(st.amount)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-stone-800">
                      {formatRupiah(st.runningBalance)}
                    </td>
                    <td className="p-3.5 text-stone-600">{st.description}</td>
                    <td className="p-3.5 pr-5 text-center">
                      <button
                        onClick={() => setSelectedReceipt(st)}
                        className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Cetak Kwitansi"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Per Student Savings Balance Matrix */
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5 pl-5">#</th>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5 text-right text-emerald-700">Total Setoran</th>
                  <th className="p-3.5 text-right text-rose-700">Total Penarikan</th>
                  <th className="p-3.5 text-right font-bold">Saldo Akhir Siswa</th>
                  <th className="p-3.5 pr-5 text-right">Transaksi Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {studentBalances.map((sb, idx) => (
                  <tr key={sb.student.id} className="hover:bg-stone-50/80">
                    <td className="p-3.5 pl-5 text-stone-400 font-mono">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-stone-900">{sb.student.fullName}</td>
                    <td className="p-3.5 text-right font-semibold text-emerald-700">{formatRupiah(sb.masuk)}</td>
                    <td className="p-3.5 text-right font-semibold text-rose-700">{formatRupiah(sb.keluar)}</td>
                    <td className="p-3.5 text-right font-extrabold text-amber-900">{formatRupiah(sb.saldo)}</td>
                    <td className="p-3.5 pr-5 text-right text-stone-400 font-mono text-[11px]">{sb.lastTrans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deposit / Withdraw Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className={`p-4 text-white flex items-center justify-between ${
              transType === 'Setoran' ? 'bg-emerald-900' : 'bg-rose-900'
            }`}>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <span>{transType === 'Setoran' ? 'Setor Tabungan Siswa' : 'Penarikan Tabungan Siswa'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Pilih Siswa *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-600 outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.nickname})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nominal (Rp) *</label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-sm font-bold text-stone-900 p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Keterangan Transaksi</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Setoran rutin celengan / Beli buku gambar"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-600 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm ${
                    transType === 'Setoran' ? 'bg-emerald-800 hover:bg-emerald-700' : 'bg-rose-800 hover:bg-rose-700'
                  }`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-stone-200 overflow-hidden p-5 space-y-4">
            <div className="text-center border-b border-stone-200 pb-3">
              <div className="text-xs font-bold uppercase text-amber-700 tracking-wider">SekolahHub Basic</div>
              <h3 className="font-extrabold text-base text-stone-900">KWITANSI TABUNGAN KELAS</h3>
              <p className="text-[10px] text-stone-400">{selectedReceipt.date}</p>
            </div>

            <div className="space-y-2 text-xs text-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-500">Nama Siswa:</span>
                <span className="font-bold">{selectedReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Jenis Mutasi:</span>
                <span className="font-bold text-amber-800">{selectedReceipt.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Jumlah Nominal:</span>
                <span className="font-extrabold text-stone-900">{formatRupiah(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Saldo Berjalan:</span>
                <span className="font-bold">{formatRupiah(selectedReceipt.runningBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Keterangan:</span>
                <span>{selectedReceipt.description}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-stone-300 text-center text-[10px] text-stone-400">
              Terima kasih. Catatan ini tercatat resmi di database SekolahHub Class.
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-amber-800 hover:bg-amber-700 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
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
