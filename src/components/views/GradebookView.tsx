import React, { useState } from 'react';
import {
  Award,
  Plus,
  Search,
  Sparkles,
  X,
  FileText,
  User,
  Calendar,
  Filter
} from 'lucide-react';
import { StudentProfile, GradeRecord, AssessmentAspect, DevelopmentalRating } from '../../types';

interface GradebookViewProps {
  students: StudentProfile[];
  grades: GradeRecord[];
  onSaveGrade: (grade: GradeRecord) => void;
  onOpenAksaAi: () => void;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  students,
  grades,
  onSaveGrade,
  onOpenAksaAi,
}) => {
  const [selectedAspect, setSelectedAspect] = useState<AssessmentAspect | 'Semua'>('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [aspect, setAspect] = useState<AssessmentAspect>('Kognitif');
  const [rating, setRating] = useState<DevelopmentalRating>('BSH');
  const [description, setDescription] = useState('');
  const [teacherNote, setTeacherNote] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);

  const openAddModal = () => {
    setStudentId(students[0]?.id || '');
    setAspect('Kognitif');
    setRating('BSH');
    setDescription('');
    setTeacherNote('');
    setRecordDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !description.trim()) return;

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newGrade: GradeRecord = {
      id: `grd_${Date.now()}`,
      date: recordDate,
      studentId: student.id,
      studentName: student.fullName,
      aspect,
      rating,
      description,
      teacherNote
    };

    onSaveGrade(newGrade);
    setIsModalOpen(false);
  };

  const filteredGrades = grades.filter(g => {
    const matchesAspect = selectedAspect === 'Semua' || g.aspect === selectedAspect;
    const matchesSearch = g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAspect && matchesSearch;
  });

  const getRatingBadge = (r: DevelopmentalRating) => {
    switch (r) {
      case 'BSB':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">BSB (Sangat Baik)</span>;
      case 'BSH':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">BSH (Sesuai Harapan)</span>;
      case 'MB':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">MB (Mulai Berkembang)</span>;
      case 'BB':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">BB (Belum Berkembang)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-teal-700" />
            <span>Buku Nilai & Perkembangan Belajar Siswa</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Dokumentasi evaluasi aspek Kognitif, Motorik, Bahasa, Sosial-Emosional, dan Seni
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenAksaAi}
            className="flex-1 sm:flex-none text-xs bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-2.5 px-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Aksa AI Narasi Raport</span>
          </button>

          <button
            onClick={openAddModal}
            id="btn-add-grade"
            className="flex-1 sm:flex-none text-xs bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan Nilai</span>
          </button>
        </div>
      </div>

      {/* Filter by Aspect & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa atau deskripsi capaian..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-teal-600 outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-300 text-xs font-medium overflow-x-auto">
          {(['Semua', 'Kognitif', 'Motorik', 'Bahasa', 'Sosial-Emosional', 'Seni'] as const).map(asp => (
            <button
              key={asp}
              onClick={() => setSelectedAspect(asp)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedAspect === asp
                  ? 'bg-teal-800 text-white font-bold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {asp}
            </button>
          ))}
        </div>
      </div>

      {/* Grades List Cards */}
      <div className="space-y-3">
        {filteredGrades.map((g) => (
          <div
            key={g.id}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{g.studentName}</h3>
                  <div className="text-[11px] text-stone-400 flex items-center gap-2">
                    <span className="font-semibold text-teal-800">{g.aspect}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {g.date}
                    </span>
                  </div>
                </div>
              </div>

              <div>{getRatingBadge(g.rating)}</div>
            </div>

            <div className="text-xs text-stone-800 leading-relaxed bg-stone-50/60 p-3 rounded-xl border border-stone-100">
              {g.description}
            </div>

            {g.teacherNote && (
              <div className="text-xs text-stone-500 italic pl-3 border-l-2 border-teal-600">
                Catatan Guru: {g.teacherNote}
              </div>
            )}
          </div>
        ))}

        {filteredGrades.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
            Belum ada rekam catatan nilai untuk filter ini. Klik "Tambah Catatan Nilai" atau gunakan Aksa AI.
          </div>
        )}
      </div>

      {/* Add Grade Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-teal-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-400" />
                <span>Input Hasil Belajar / Nilai Siswa</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-teal-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Siswa *</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.nickname})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Aspek Perkembangan *</label>
                  <select
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value as AssessmentAspect)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 outline-none"
                  >
                    <option value="Kognitif">Kognitif</option>
                    <option value="Motorik">Motorik</option>
                    <option value="Bahasa">Bahasa</option>
                    <option value="Sosial-Emosional">Sosial-Emosional</option>
                    <option value="Seni">Seni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tingkat Capaian (PAUD/SD) *</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value as DevelopmentalRating)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 outline-none font-semibold text-teal-900"
                  >
                    <option value="BSB">BSB - Berkembang Sangat Baik</option>
                    <option value="BSH">BSH - Berkembang Sesuai Harapan</option>
                    <option value="MB">MB - Mulai Berkembang</option>
                    <option value="BB">BB - Belum Berkembang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tanggal Evaluasi</label>
                <input
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Deskripsi Hasil Belajar / Narasi *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Mampu menggambar pemandangan alam dengan gradasi warna yang rapi dan serasi..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Catatan Tambahan Guru (Opsional)</label>
                <input
                  type="text"
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  placeholder="Contoh: Perlu dorongan kecil saat bercerita di depan kelas."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-teal-600 outline-none"
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-800 hover:bg-teal-700 text-white shadow-sm"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
