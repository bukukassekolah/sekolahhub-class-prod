import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  Eye,
  X,
  User,
  Heart
} from 'lucide-react';
import { StudentProfile, AttendanceRecord, GradeRecord, ClassSavingTransaction } from '../../types';

interface StudentProfileViewProps {
  students: StudentProfile[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  savings: ClassSavingTransaction[];
  onSaveStudent: (student: StudentProfile) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  students,
  attendance,
  grades,
  savings,
  onSaveStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'Semua' | 'L' | 'P'>('Semua');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthDate, setBirthDate] = useState('2020-01-01');
  const [parentName, setParentName] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const openAddModal = () => {
    setEditingStudent(null);
    setFullName('');
    setNickname('');
    setGender('L');
    setBirthDate('2020-01-01');
    setParentName('');
    setParentWhatsapp('');
    setAddress('');
    setPhotoUrl('');
    setSpecialNotes('');
    setIsFormOpen(true);
  };

  const openEditModal = (student: StudentProfile) => {
    setEditingStudent(student);
    setFullName(student.fullName);
    setNickname(student.nickname);
    setGender(student.gender);
    setBirthDate(student.birthDate);
    setParentName(student.parentName);
    setParentWhatsapp(student.parentWhatsapp);
    setAddress(student.address);
    setPhotoUrl(student.photoUrl || '');
    setSpecialNotes(student.specialNotes || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newStudent: StudentProfile = {
      id: editingStudent ? editingStudent.id : `std_${Date.now()}`,
      fullName,
      nickname: nickname || fullName.split(' ')[0],
      gender,
      birthDate,
      parentName,
      parentWhatsapp,
      address,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      specialNotes,
      createdAt: editingStudent ? editingStudent.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveStudent(newStudent);
    setIsFormOpen(false);
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === 'Semua' || s.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  // Calculate Student Individual Stats for detail modal
  const getStudentStats = (studentId: string) => {
    const stdAtt = attendance.filter(a => a.studentId === studentId);
    const totalAtt = stdAtt.length;
    const hadir = stdAtt.filter(a => a.status === 'Hadir').length;
    const attPct = totalAtt > 0 ? Math.round((hadir / totalAtt) * 100) : 100;

    const stdGrades = grades.filter(g => g.studentId === studentId);

    const stdSavings = savings.filter(s => s.studentId === studentId);
    const masuk = stdSavings.filter(s => s.type === 'Setoran').reduce((sum, s) => sum + s.amount, 0);
    const keluar = stdSavings.filter(s => s.type === 'Penarikan').reduce((sum, s) => sum + s.amount, 0);
    const balance = masuk - keluar;

    return { attPct, hadir, totalAtt, stdGrades, balance };
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <span>Profil & Data Siswa</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar biodata, informasi orang tua, dan catatan khusus siswa
          </p>
        </div>

        <button
          onClick={openAddModal}
          id="btn-add-student"
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, nama panggilan, atau nama orang tua..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-300 text-xs font-medium">
          <button
            onClick={() => setGenderFilter('Semua')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${genderFilter === 'Semua' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            Semua ({students.length})
          </button>
          <button
            onClick={() => setGenderFilter('L')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${genderFilter === 'L' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            Laki-laki ({students.filter(s => s.gender === 'L').length})
          </button>
          <button
            onClick={() => setGenderFilter('P')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${genderFilter === 'P' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            Perempuan ({students.filter(s => s.gender === 'P').length})
          </button>
        </div>
      </div>

      {/* Student Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((s) => {
          const stats = getStudentStats(s.id);

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-4 space-y-3">
                {/* Header info */}
                <div className="flex items-start gap-3">
                  <img
                    src={s.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                    alt={s.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${s.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                        {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                      <span className="text-[11px] text-stone-400">"{s.nickname}"</span>
                    </div>
                    <h3 className="font-bold text-sm text-stone-900 truncate" title={s.fullName}>
                      {s.fullName}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{s.birthDate}</span>
                    </p>
                  </div>
                </div>

                {/* Parent & Contact */}
                <div className="bg-stone-50 p-2.5 rounded-xl text-xs space-y-1 text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Orang Tua / Wali:</span>
                    <span className="font-semibold text-stone-800">{s.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">WhatsApp OrtU:</span>
                    <a
                      href={`https://wa.me/${s.parentWhatsapp.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{s.parentWhatsapp}</span>
                    </a>
                  </div>
                </div>

                {/* Special Notes Alert */}
                {s.specialNotes && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{s.specialNotes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-stone-100 bg-stone-50/50 p-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingStudent(s)}
                  className="text-xs bg-emerald-800 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail Rekam</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit Data Siswa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus data siswa ${s.fullName}?`)) {
                        onDeleteStudent(s.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Siswa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Student Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                <span>{editingStudent ? 'Edit Profil Siswa' : 'Tambah Siswa Baru'}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Ahmad Rafka Alfarizi"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Contoh: Rafka"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nomor WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    value={parentWhatsapp}
                    onChange={(e) => setParentWhatsapp(e.target.value)}
                    placeholder="081234567890"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Bpk. Hendra Alfarizi"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Mawar No. 12..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">URL Foto Siswa (Opsional)</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Catatan Khusus (Alergi / Kebutuhan Khusus)</label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Alergi udang/kacang, bakat khusus, dll."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Student Detailed Profile Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={viewingStudent.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                  alt={viewingStudent.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                />
                <div>
                  <h3 className="font-bold text-lg">{viewingStudent.fullName}</h3>
                  <p className="text-xs text-emerald-200">
                    Panggilan: "{viewingStudent.nickname}" • Jenis Kelamin: {viewingStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingStudent(null)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Individual Stats Bar */}
              {(() => {
                const st = getStudentStats(viewingStudent.id);
                return (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-center">
                      <div className="text-[10px] text-teal-800 font-semibold uppercase">Presensi</div>
                      <div className="text-lg font-bold text-teal-950">{st.attPct}%</div>
                      <div className="text-[10px] text-teal-700">{st.hadir}/{st.totalAtt} Hadir</div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                      <div className="text-[10px] text-emerald-800 font-semibold uppercase">Nilai Terrekam</div>
                      <div className="text-lg font-bold text-emerald-950">{st.stdGrades.length} Catatan</div>
                      <div className="text-[10px] text-emerald-700">Perkembangan</div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                      <div className="text-[10px] text-amber-800 font-semibold uppercase">Saldo Tabungan</div>
                      <div className="text-sm font-bold text-amber-950 truncate">
                        Rp {st.balance.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-amber-700">Kas Kelas</div>
                    </div>
                  </div>
                );
              })()}

              {/* Bio Details */}
              <div className="bg-stone-50 p-4 rounded-xl space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Tanggal Lahir:</span>
                  <span className="font-semibold">{viewingStudent.birthDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Orang Tua / Wali:</span>
                  <span className="font-semibold">{viewingStudent.parentName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">WhatsApp OrtU:</span>
                  <span className="font-semibold">{viewingStudent.parentWhatsapp}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-stone-500">Alamat:</span>
                  <span className="font-semibold text-right max-w-[200px]">{viewingStudent.address}</span>
                </div>
              </div>

              {/* Special Notes */}
              {viewingStudent.specialNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Catatan Khusus Guru / Kesehatan</span>
                  </div>
                  <p>{viewingStudent.specialNotes}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-800 text-white"
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
