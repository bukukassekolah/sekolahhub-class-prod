import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';
import { Student, Gender } from '../types';
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Search, 
  Edit2, 
  Trash2, 
  MessageCircle, 
  X, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface DataSiswaProps {
  initialOpenAdd?: boolean;
}

interface ParsedExcelRow {
  rowNum: number;
  nis: string;
  name: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string;
  parentName: string;
  parentWhatsapp: string;
  address: string;
  isActive: boolean;
  isValid: boolean;
  errorReason?: string;
}

export const DataSiswa: React.FC<DataSiswaProps> = ({ initialOpenAdd = false }) => {
  const { students, addStudent, importStudentsBatch, updateStudent, deleteStudent } = useAuth();

  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'Semua' | 'L' | 'P'>('Semua');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');

  // Manual Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialOpenAdd);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [nis, setNis] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  const [birthDate, setBirthDate] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // Excel Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedExcelRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const downloadExcelTemplate = () => {
    const templateData = [
      {
        'Nomor Induk': '20250109',
        'Nama Lengkap': 'Dimas Prasetyo',
        'Jenis Kelamin': 'L',
        'Tempat Lahir': 'Jakarta',
        'Tanggal Lahir': '2018-05-12',
        'Nama Orang Tua/Wali': 'Bambang Prasetyo',
        'Nomor WhatsApp Orang Tua': '081298765432',
        'Alamat': 'Jl. Melati No. 10, Kel. Merdeka',
        'Status Aktif': 'Ya'
      },
      {
        'Nomor Induk': '20250110',
        'Nama Lengkap': 'Elena Safitri',
        'Jenis Kelamin': 'P',
        'Tempat Lahir': 'Bandung',
        'Tanggal Lahir': '2018-09-20',
        'Nama Orang Tua/Wali': 'Rahmat Safitri',
        'Nomor WhatsApp Orang Tua': '081298765433',
        'Alamat': 'Jl. Mawar Indah No. 15',
        'Status Aktif': 'Ya'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // NIS
      { wch: 25 }, // Nama Lengkap
      { wch: 15 }, // Jenis Kelamin
      { wch: 15 }, // Tempat Lahir
      { wch: 15 }, // Tanggal Lahir
      { wch: 22 }, // Orang tua
      { wch: 22 }, // WhatsApp
      { wch: 30 }, // Alamat
      { wch: 12 }  // Status Aktif
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Siswa');
    XLSX.writeFile(workbook, 'Template_Import_Siswa_SekolahHub.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportNotice(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const rawData: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const parsed: ParsedExcelRow[] = rawData.map((row, idx) => {
          const rowNum = idx + 2; // header is row 1
          
          // Get values dynamically regardless of slight header variations
          const nisVal = String(row['Nomor Induk'] || row['NIS'] || row['NISN'] || '').trim();
          const nameVal = String(row['Nama Lengkap'] || row['Nama'] || row['Nama Siswa'] || '').trim();
          const genderRaw = String(row['Jenis Kelamin'] || row['JK'] || row['L/P'] || '').trim().toUpperCase();
          const birthPlaceVal = String(row['Tempat Lahir'] || '').trim();
          let birthDateVal = String(row['Tanggal Lahir'] || '').trim();
          const parentNameVal = String(row['Nama Orang Tua/Wali'] || row['Nama Orang Tua'] || row['Orang Tua'] || '').trim();
          const parentWaVal = String(row['Nomor WhatsApp Orang Tua'] || row['No WhatsApp'] || row['WhatsApp'] || row['No WA'] || '').trim();
          const addressVal = String(row['Alamat'] || '').trim();
          const activeRaw = String(row['Status Aktif'] || row['Status'] || '').trim().toLowerCase();

          // Validation logic
          let isValid = true;
          let errorReason = '';

          if (!nameVal) {
            isValid = false;
            errorReason = 'Nama Lengkap wajib diisi';
          }

          let genderVal: Gender = 'L';
          if (genderRaw.startsWith('P') || genderRaw.includes('PEREMPUAN')) {
            genderVal = 'P';
          } else if (genderRaw.startsWith('L') || genderRaw.includes('LAKI')) {
            genderVal = 'L';
          } else if (genderRaw !== '') {
            isValid = false;
            errorReason = errorReason ? `${errorReason}, Jenis kelamin harus L/P` : 'Jenis kelamin harus L atau P';
          }

          // Format birthDate if JS Date object representation or string
          if (birthDateVal && birthDateVal.includes('T')) {
            birthDateVal = birthDateVal.split('T')[0];
          }

          let isActiveVal = true;
          if (activeRaw === 'tidak' || activeRaw === 'false' || activeRaw === '0' || activeRaw === 'nonaktif') {
            isActiveVal = false;
          }

          return {
            rowNum,
            nis: nisVal,
            name: nameVal,
            gender: genderVal,
            birthPlace: birthPlaceVal,
            birthDate: birthDateVal,
            parentName: parentNameVal,
            parentWhatsapp: parentWaVal,
            address: addressVal,
            isActive: isActiveVal,
            isValid,
            errorReason
          };
        });

        setParsedRows(parsed);
      } catch (err) {
        console.error('Error parsing Excel:', err);
        alert('Gagal membaca file Excel. Pastikan format file .xlsx valid.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleExecuteImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      alert('Tidak ada data valid yang dapat diimpor.');
      return;
    }

    setIsImporting(true);
    try {
      const studentsToImport: Omit<Student, 'id'>[] = validRows.map(r => ({
        nis: r.nis,
        name: r.name,
        gender: r.gender,
        birthDate: r.birthDate,
        parentName: r.parentName,
        parentWhatsapp: r.parentWhatsapp,
        address: r.birthPlace ? `${r.address} (Lahir: ${r.birthPlace})` : r.address,
        isActive: r.isActive
      }));

      const count = await importStudentsBatch(studentsToImport);
      const invalidCount = parsedRows.length - validRows.length;

      setImportNotice(`Berhasil mengimpor ${count} data siswa ke Firestore.${invalidCount > 0 ? ` ${invalidCount} baris tidak valid diabaikan.` : ''}`);
      setParsedRows([]);
      setFileName('');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportNotice(null);
      }, 2000);
    } catch (err) {
      console.error('Error during batch import:', err);
      alert('Terjadi kesalahan saat menyimpan data ke Firestore.');
    } finally {
      setIsImporting(false);
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setNis('');
    setName('');
    setGender('L');
    setBirthDate('');
    setParentName('');
    setParentWhatsapp('');
    setAddress('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStudent(s);
    setNis(s.nis || '');
    setName(s.name);
    setGender(s.gender);
    setBirthDate(s.birthDate || '');
    setParentName(s.parentName || '');
    setParentWhatsapp(s.parentWhatsapp || '');
    setAddress(s.address || '');
    setIsActive(s.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, {
          nis,
          name,
          gender,
          birthDate,
          parentName,
          parentWhatsapp,
          address,
          isActive
        });
      } else {
        await addStudent({
          nis,
          name,
          gender,
          birthDate,
          parentName,
          parentWhatsapp,
          address,
          isActive
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Hapus data siswa "${name}" dari kelas?`)) {
      await deleteStudent(id);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                        (s.nis && s.nis.toLowerCase().includes(search.toLowerCase())) ||
                        (s.parentName && s.parentName.toLowerCase().includes(search.toLowerCase()));
    
    const matchGender = genderFilter === 'Semua' || s.gender === genderFilter;
    const matchStatus = statusFilter === 'Semua' || (statusFilter === 'Aktif' ? s.isActive : !s.isActive);

    return matchSearch && matchGender && matchStatus;
  });

  const formatWAUrl = (waNumber: string) => {
    if (!waNumber) return '#';
    let cleaned = waNumber.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Data Siswa Kelas</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredStudents.length} Siswa
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap siswa terdaftar di kelas. Hubungi orang tua via WhatsApp dengan 1-klik.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import Excel (.xlsx)</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Manual</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa, NIS, atau nama orang tua..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-300">
            <span className="text-slate-500 font-semibold px-2">Gender:</span>
            <button
              onClick={() => setGenderFilter('Semua')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${genderFilter === 'Semua' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setGenderFilter('L')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${genderFilter === 'L' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              L (Laki-laki)
            </button>
            <button
              onClick={() => setGenderFilter('P')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${genderFilter === 'P' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
            >
              P (Perempuan)
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:bg-white"
          >
            <option value="Semua">Status: Semua</option>
            <option value="Aktif">Status: Aktif</option>
            <option value="Nonaktif">Status: Non-aktif</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold text-sm">Belum Ada Data Siswa</p>
            <p className="text-slate-400 text-xs mt-1">
              {search ? 'Tidak ada siswa yang sesuai kata kunci pencarian.' : 'Klik tombol "Tambah Siswa Baru" di atas untuk menambahkan data.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">NIS</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">L/P</th>
                  <th className="py-3 px-4">Orang Tua / Wali</th>
                  <th className="py-3 px-4">WhatsApp Orang Tua</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                      {s.nis || '-'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>
                        <span>{s.name}</span>
                        {s.birthDate && (
                          <span className="block text-[10px] font-normal text-slate-400">
                            Tgl Lahir: {s.birthDate}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${s.gender === 'L' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-pink-50 text-pink-700 border border-pink-200'}`}>
                        {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <p className="font-semibold">{s.parentName || '-'}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{s.address}</p>
                    </td>
                    <td className="py-3 px-4">
                      {s.parentWhatsapp ? (
                        <a
                          href={formatWAUrl(s.parentWhatsapp)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold transition-colors border border-emerald-200"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{s.parentWhatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {s.isActive ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                        <span>{s.isActive ? 'Aktif' : 'Non-aktif'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-8">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>{editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Induk (NIS/NISN)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1001"
                    value={nis}
                    onChange={e => setNis(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-semibold"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aditya Pratama"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Keaktifan</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={e => setIsActive(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-semibold"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Non-aktif / Pindah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Pratama"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={parentWhatsapp}
                    onChange={e => setParentWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Jl. Mawar No. 12, Kel. Sukajadi"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>

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
                  {submitting ? 'Menyimpan...' : 'Simpan Data Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative my-6 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white border border-white/30 shadow-xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-white">Import Data Siswa dari Excel (.xlsx)</h3>
                  <p className="text-[11px] text-emerald-100 font-medium">Unggah template file Excel untuk menambah banyak siswa sekaligus.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setParsedRows([]);
                  setFileName('');
                  setImportNotice(null);
                }}
                className="p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
              {importNotice && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{importNotice}</span>
                </div>
              )}

              {/* Step 1 & 2 Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-extrabold">1</span>
                      Unduh Template Excel
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Gunakan template resmi SekolahHub yang sudah dikonfigurasi dengan header kolom & contoh data.
                  </p>
                  <button
                    onClick={downloadExcelTemplate}
                    className="w-full mt-2 px-3 py-2 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Download Template Excel (.xlsx)</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-extrabold">2</span>
                    Pilih File Excel
                  </span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Pilih file .xlsx yang telah diisi data siswa kelas Anda.
                  </p>
                  <label className="w-full mt-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{fileName ? `Ganti File (${fileName})` : 'Pilih File .xlsx'}</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Validation Warning Note */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-snug">
                  <strong>Peringatan Toleransi Data:</strong> Baris data yang tidak valid (misal: nama kosong) akan ditandai warna merah dan diabaikan tanpa menghentikan proses import baris data siswa yang valid.
                </p>
              </div>

              {/* Data Preview Section */}
              {parsedRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Preview Data Hasil Pembacaan Excel</span>
                    </h4>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                        {parsedRows.filter(r => r.isValid).length} Valid
                      </span>
                      {parsedRows.filter(r => !r.isValid).length > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-full text-[10px]">
                          {parsedRows.filter(r => !r.isValid).length} Tidak Valid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Table Preview */}
                  <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-56">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3 w-10">No</th>
                          <th className="py-2 px-3">NIS</th>
                          <th className="py-2 px-3">Nama Lengkap</th>
                          <th className="py-2 px-3">JK</th>
                          <th className="py-2 px-3">Orang Tua</th>
                          <th className="py-2 px-3">WhatsApp</th>
                          <th className="py-2 px-3">Status Validasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedRows.map((row) => (
                          <tr
                            key={row.rowNum}
                            className={row.isValid ? 'hover:bg-slate-50' : 'bg-red-50/70 hover:bg-red-100/50'}
                          >
                            <td className="py-2 px-3 text-slate-500 font-mono">{row.rowNum}</td>
                            <td className="py-2 px-3 font-mono font-medium text-slate-700">{row.nis || '-'}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{row.name || '(Kosong)'}</td>
                            <td className="py-2 px-3">
                              <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${row.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                {row.gender}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-600">{row.parentName || '-'}</td>
                            <td className="py-2 px-3 text-slate-600">{row.parentWhatsapp || '-'}</td>
                            <td className="py-2 px-3">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Valid</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-700 font-bold text-[10px]" title={row.errorReason}>
                                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                                  <span>{row.errorReason || 'Tidak valid'}</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">
                {parsedRows.length > 0 
                  ? `${parsedRows.filter(r => r.isValid).length} dari ${parsedRows.length} siswa siap diimpor`
                  : 'Silakan pilih file .xlsx terlebih dahulu'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setParsedRows([]);
                    setFileName('');
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={parsedRows.filter(r => r.isValid).length === 0 || isImporting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  {isImporting ? 'Mengimpor ke Firestore...' : `Proses Import (${parsedRows.filter(r => r.isValid).length} Data)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
