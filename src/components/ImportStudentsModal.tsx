import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  ArrowRight,
  RefreshCw,
  Info,
  ShieldAlert,
  Users
} from 'lucide-react';
import { StudentProfile } from '../types';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (
    students: StudentProfile[],
    options: { mode: 'append' | 'replace'; duplicateAction: 'skip' | 'update' | 'cancel' }
  ) => Promise<void>;
  existingStudentsCount: number;
}

interface ColumnMapping {
  fullName: string;
  nickname: string;
  gender: string;
  birthDate: string;
  parentName: string;
  parentWhatsapp: string;
  address: string;
  specialNotes: string;
  studentId: string;
}

interface ParsedStudentPreview {
  rowIndex: number;
  raw: Record<string, any>;
  student: StudentProfile;
  errors: string[];
  warnings: string[];
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  existingStudentsCount
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Mapping & Preview, 3: Confirmation/Options
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawDataRows, setRawDataRows] = useState<Record<string, any>[]>([]);

  // Mapping state
  const [mapping, setMapping] = useState<ColumnMapping>({
    fullName: '',
    nickname: '',
    gender: '',
    birthDate: '',
    parentName: '',
    parentWhatsapp: '',
    address: '',
    specialNotes: '',
    studentId: ''
  });

  // Import options
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update' | 'cancel'>('skip');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Auto-mapping logic
  const detectAutoMapping = (columnHeaders: string[]): ColumnMapping => {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const findMatch = (aliases: string[]) => {
      const match = columnHeaders.find(h => {
        const normH = normalize(h);
        return aliases.some(a => normH === normalize(a) || normH.includes(normalize(a)));
      });
      return match || '';
    };

    return {
      fullName: findMatch(['nama lengkap', 'nama siswa', 'nama', 'full name', 'siswa']),
      nickname: findMatch(['nama panggilan', 'panggilan', 'nickname']),
      gender: findMatch(['jenis kelamin', 'gender', 'jk', 'kelamin', 'sex']),
      birthDate: findMatch(['tanggal lahir', 'tgl lahir', 'birth date', 'dob', 'tgl_lahir']),
      parentName: findMatch(['nama orang tua', 'orang tua', 'nama wali', 'wali', 'parent name', 'orangtua']),
      parentWhatsapp: findMatch(['whatsapp orang tua', 'no hp orang tua', 'no wa', 'wa orang tua', 'no hp', 'nomor hp', 'whatsapp', 'phone']),
      address: findMatch(['alamat rumah', 'alamat', 'address']),
      specialNotes: findMatch(['catatan khusus', 'catatan', 'notes', 'keterangan']),
      studentId: findMatch(['student id', 'id siswa', 'id', 'studentid'])
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

        if (!jsonRows || jsonRows.length === 0) {
          alert('File Excel kosong atau tidak berisi baris data.');
          return;
        }

        // Extract header names
        const extractedHeaders = Object.keys(jsonRows[0] || {});
        setHeaders(extractedHeaders);
        setRawDataRows(jsonRows);

        // Auto mapping
        const autoMapped = detectAutoMapping(extractedHeaders);
        setMapping(autoMapped);

        setStep(2);
      } catch (err: any) {
        console.error('Error reading Excel file:', err);
        alert('Gagal membaca file Excel. Pastikan format file adalah .xlsx atau .xls.');
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // Convert raw rows using current mapping
  const parsedPreviews: ParsedStudentPreview[] = rawDataRows.map((row, idx) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const fullNameVal = String(row[mapping.fullName] || '').trim();
    if (!fullNameVal) {
      errors.push('Nama lengkap belum diisi');
    }

    const rawGender = String(row[mapping.gender] || '').trim().toLowerCase();
    let genderVal: 'L' | 'P' = 'L';
    if (['p', 'perempuan', 'wanita', 'female', '2'].includes(rawGender)) {
      genderVal = 'P';
    } else if (['l', 'laki-laki', 'pria', 'male', '1'].includes(rawGender)) {
      genderVal = 'L';
    } else if (rawGender) {
      warnings.push(`Jenis kelamin '${rawGender}' disesuaikan menjadi Laki-laki (L)`);
    } else {
      warnings.push('Jenis kelamin kosong (default: Laki-laki)');
    }

    let birthDateVal = String(row[mapping.birthDate] || '').trim();
    if (!birthDateVal) {
      warnings.push('Tanggal lahir kosong (default: 2020-01-01)');
      birthDateVal = '2020-01-01';
    } else {
      // If date is JS Date string or Excel date
      const d = new Date(birthDateVal);
      if (!isNaN(d.getTime())) {
        birthDateVal = d.toISOString().split('T')[0];
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDateVal)) {
        warnings.push('Format tanggal lahir tidak standar');
      }
    }

    const providedId = String(row[mapping.studentId] || '').trim();
    // Unique ID generation format: std_${Date.now()}_${idx}
    const studentIdVal = providedId || `std_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`;

    const nicknameVal = String(row[mapping.nickname] || '').trim() || fullNameVal.split(' ')[0] || 'Siswa';
    const parentNameVal = String(row[mapping.parentName] || '').trim();
    const parentWhatsappVal = String(row[mapping.parentWhatsapp] || '').trim();
    const addressVal = String(row[mapping.address] || '').trim();
    const specialNotesVal = String(row[mapping.specialNotes] || '').trim();

    const student: StudentProfile = {
      id: studentIdVal,
      fullName: fullNameVal,
      nickname: nicknameVal,
      gender: genderVal,
      birthDate: birthDateVal,
      parentName: parentNameVal,
      parentWhatsapp: parentWhatsappVal,
      address: addressVal,
      specialNotes: specialNotesVal,
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    return {
      rowIndex: idx + 2, // 1-indexed plus header row
      raw: row,
      student,
      errors,
      warnings
    };
  });

  const validParsedStudents = parsedPreviews
    .filter(p => p.errors.length === 0)
    .map(p => p.student);

  const totalRows = parsedPreviews.length;
  const invalidRowsCount = parsedPreviews.filter(p => p.errors.length > 0).length;
  const warningsRowsCount = parsedPreviews.filter(p => p.warnings.length > 0 && p.errors.length === 0).length;

  const handleConfirmImport = async () => {
    if (validParsedStudents.length === 0) {
      alert('Tidak ada data siswa valid untuk diimpor. Harap periksa kembali mapping kolom dan isi file Excel Anda.');
      return;
    }

    setIsProcessing(true);
    try {
      await onImportSuccess(validParsedStudents, {
        mode: importMode,
        duplicateAction
      });
      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      console.error('Error importing students:', err);
      alert(err?.message || 'Gagal mengimpor data siswa.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FDFCF9] rounded-2xl shadow-2xl border border-[#D8D3C5] w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#5A5A40] text-[#FDFCF9] px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#464632] rounded-xl">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-wide">Import Data Siswa dari Excel</h2>
              <p className="text-xs text-[#D8D3C5]">
                Unggah file .xlsx untuk memasukkan data siswa secara cepat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#464632] rounded-lg transition-colors text-[#D8D3C5] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Progress Indicator */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold border-b border-[#E9E5D9] pb-4">
            <div className={`p-2 rounded-xl flex items-center justify-center gap-2 ${step === 1 ? 'bg-[#5A5A40] text-[#FDFCF9]' : 'bg-[#E9E5D9] text-[#5A5A40]'}`}>
              <span>1. Upload File</span>
            </div>
            <div className={`p-2 rounded-xl flex items-center justify-center gap-2 ${step === 2 ? 'bg-[#5A5A40] text-[#FDFCF9]' : 'bg-[#E9E5D9] text-[#5A5A40]'}`}>
              <span>2. Mapping & Preview</span>
            </div>
            <div className={`p-2 rounded-xl flex items-center justify-center gap-2 ${step === 3 ? 'bg-[#5A5A40] text-[#FDFCF9]' : 'bg-[#E9E5D9] text-[#5A5A40]'}`}>
              <span>3. Opsi & Simpan</span>
            </div>
          </div>

          {/* STEP 1: Upload File */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="border-2 border-dashed border-[#C5C0B0] hover:border-[#5A5A40] rounded-2xl p-8 bg-[#F5F2EB] transition-all relative">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-16 h-16 bg-[#E9E5D9] rounded-2xl flex items-center justify-center mx-auto text-[#5A5A40] mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-[#2D302A] text-base mb-1">
                  Pilih atau Tarik File Excel Ke Sini
                </h3>
                <p className="text-xs text-[#5A5A40]">
                  Format yang didukung: <b>.xlsx, .xls, .csv</b>
                </p>
              </div>

              <div className="bg-[#E9E5D9]/60 p-4 rounded-xl text-left text-xs space-y-2 border border-[#D8D3C5] text-[#2D302A]">
                <div className="flex items-center gap-2 font-bold text-[#5A5A40]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Petunjuk Format Kolom Excel:</span>
                </div>
                <p className="text-[#5A5A40] leading-relaxed">
                  Sistem mendukung <b>Auto Mapping</b>. Pastikan baris pertama Excel Anda berisi nama header seperti:
                  <code className="block bg-[#FDFCF9] p-2 rounded mt-1 font-mono text-[11px] text-stone-800 border border-[#D8D3C5]">
                    Nama Lengkap | Jenis Kelamin | Tanggal Lahir | Nama Orang Tua | WhatsApp Orang Tua | Alamat
                  </code>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Mapping & Preview */}
          {step === 2 && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-3.5 bg-[#F5F2EB] rounded-xl border border-[#D8D3C5] text-xs">
                <div className="flex items-center gap-2 text-[#2D302A] font-bold">
                  <FileText className="w-4 h-4 text-[#5A5A40]" />
                  <span>{file?.name}</span>
                  <span className="text-stone-500 font-normal">({rawDataRows.length} baris data ditemukan)</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
                >
                  Ganti File
                </button>
              </div>

              {/* Column Mapping Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#2D302A] flex items-center gap-2">
                    <span>Penyesuaian Mapping Kolom (Auto Mapping)</span>
                  </h4>
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    ✓ Terdeteksi Otomatis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">
                      Nama Lengkap <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={mapping.fullName}
                      onChange={(e) => setMapping({ ...mapping, fullName: e.target.value })}
                      className="w-full bg-white border border-[#C5C0B0] rounded-lg p-2 font-medium"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Jenis Kelamin</label>
                    <select
                      value={mapping.gender}
                      onChange={(e) => setMapping({ ...mapping, gender: e.target.value })}
                      className="w-full bg-white border border-[#C5C0B0] rounded-lg p-2 font-medium"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Tanggal Lahir</label>
                    <select
                      value={mapping.birthDate}
                      onChange={(e) => setMapping({ ...mapping, birthDate: e.target.value })}
                      className="w-full bg-white border border-[#C5C0B0] rounded-lg p-2 font-medium"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Nama Orang Tua</label>
                    <select
                      value={mapping.parentName}
                      onChange={(e) => setMapping({ ...mapping, parentName: e.target.value })}
                      className="w-full bg-white border border-[#C5C0B0] rounded-lg p-2 font-medium"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">WhatsApp Orang Tua</label>
                    <select
                      value={mapping.parentWhatsapp}
                      onChange={(e) => setMapping({ ...mapping, parentWhatsapp: e.target.value })}
                      className="w-full bg-white border border-[#C5C0B0] rounded-lg p-2 font-medium"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-semibold mb-1">Alamat Rumah</label>
                    <select
                      value={mapping.address}
                      onChange={(e) => setMapping({ ...mapping, address: e.target.value })}
                      className="w-full bg-white border border-[#C5C0B0] rounded-lg p-2 font-medium"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Validation Summary Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{validParsedStudents.length} Siap Diimpor</span>
                </div>
                {warningsRowsCount > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{warningsRowsCount} Catatan Kecil</span>
                  </div>
                )}
                {invalidRowsCount > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>{invalidRowsCount} Tidak Valid (Lewati)</span>
                  </div>
                )}
              </div>

              {/* Preview Table */}
              <div className="border border-[#D8D3C5] rounded-xl overflow-hidden bg-white max-h-60 overflow-y-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F5F2EB] text-[#5A5A40] uppercase font-bold text-[10px] sticky top-0">
                    <tr>
                      <th className="p-2.5 border-b">Baris</th>
                      <th className="p-2.5 border-b">Student ID</th>
                      <th className="p-2.5 border-b">Nama Lengkap</th>
                      <th className="p-2.5 border-b">JK</th>
                      <th className="p-2.5 border-b">Orang Tua / WA</th>
                      <th className="p-2.5 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {parsedPreviews.map((p) => {
                      const isValid = p.errors.length === 0;
                      return (
                        <tr key={p.rowIndex} className={isValid ? 'hover:bg-stone-50' : 'bg-rose-50/50'}>
                          <td className="p-2.5 text-stone-500 font-mono text-[11px]">{p.rowIndex}</td>
                          <td className="p-2.5 font-mono text-[11px] text-stone-600">{p.student.id}</td>
                          <td className="p-2.5 font-bold text-stone-900">{p.student.fullName || <span className="text-rose-500 italic">(Kosong)</span>}</td>
                          <td className="p-2.5 text-stone-700">{p.student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                          <td className="p-2.5 text-stone-600">
                            {p.student.parentName || '-'} {p.student.parentWhatsapp ? `(${p.student.parentWhatsapp})` : ''}
                          </td>
                          <td className="p-2.5">
                            {isValid ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                Valid
                              </span>
                            ) : (
                              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold" title={p.errors.join(', ')}>
                                {p.errors[0]}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={validParsedStudents.length === 0}
                  onClick={() => setStep(3)}
                  className="bg-[#5A5A40] hover:bg-[#464632] disabled:opacity-50 text-[#FDFCF9] font-bold text-xs py-2.5 px-6 rounded-xl shadow-sm flex items-center gap-2"
                >
                  <span>Lanjut ke Opsi Import ({validParsedStudents.length} siswa)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Options & Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#D8D3C5] space-y-4 text-xs text-[#2D302A]">
                <h4 className="font-extrabold text-sm text-[#2D302A] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#5A5A40]" />
                  <span>Atur Mode Import Data Siswa</span>
                </h4>

                {/* Option 1: Mode (Append / Replace) */}
                <div className="space-y-2">
                  <label className="font-bold text-stone-800 block">1. Mode Penggabungan Data:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setImportMode('append')}
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${importMode === 'append' ? 'bg-white border-[#5A5A40] ring-2 ring-[#5A5A40]/20' : 'bg-[#FDFCF9] border-stone-200'}`}
                    >
                      <input type="radio" checked={importMode === 'append'} onChange={() => setImportMode('append')} className="mt-0.5 accent-[#5A5A40]" />
                      <div>
                        <span className="font-bold block text-stone-900">Tambahkan Data Baru (Append)</span>
                        <span className="text-stone-500 text-[11px]">Mempertahankan {existingStudentsCount} siswa yang sudah ada.</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setImportMode('replace')}
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${importMode === 'replace' ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300' : 'bg-[#FDFCF9] border-stone-200'}`}
                    >
                      <input type="radio" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} className="mt-0.5 accent-rose-600" />
                      <div>
                        <span className="font-bold block text-rose-900">Ganti Seluruh Data Siswa</span>
                        <span className="text-rose-700 text-[11px]">Menghapus data siswa lama dan mengganti sepenuhnya.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Option 2: Duplicate Handling */}
                {importMode === 'append' && (
                  <div className="space-y-2 pt-2 border-t border-[#D8D3C5]">
                    <label className="font-bold text-stone-800 block">2. Penanganan Jika Ditemukan Siswa Ganda (Nama/ID Sama):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${duplicateAction === 'skip' ? 'bg-white border-[#5A5A40] font-bold' : 'bg-[#FDFCF9] border-stone-200'}`}>
                        <input type="radio" checked={duplicateAction === 'skip'} onChange={() => setDuplicateAction('skip')} className="accent-[#5A5A40]" />
                        <span>Lewati Data Ganda</span>
                      </label>

                      <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${duplicateAction === 'update' ? 'bg-white border-[#5A5A40] font-bold' : 'bg-[#FDFCF9] border-stone-200'}`}>
                        <input type="radio" checked={duplicateAction === 'update'} onChange={() => setDuplicateAction('update')} className="accent-[#5A5A40]" />
                        <span>Perbarui Data Lama</span>
                      </label>

                      <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${duplicateAction === 'cancel' ? 'bg-white border-[#5A5A40] font-bold' : 'bg-[#FDFCF9] border-stone-200'}`}>
                        <input type="radio" checked={duplicateAction === 'cancel'} onChange={() => setDuplicateAction('cancel')} className="accent-[#5A5A40]" />
                        <span>Batalkan Jika Ada Ganda</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  ← Kembali ke Preview
                </button>

                <button
                  disabled={isProcessing}
                  onClick={handleConfirmImport}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengimpor Data Ke Database & Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Proses Import {validParsedStudents.length} Siswa Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
