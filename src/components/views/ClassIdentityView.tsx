import React, { useState } from 'react';
import { School, Save, Check, GraduationCap } from 'lucide-react';
import { ClassInfo, EducationLevel } from '../../types';

interface ClassIdentityViewProps {
  classInfo: ClassInfo;
  onSaveClassInfo: (info: ClassInfo) => void;
}

export const ClassIdentityView: React.FC<ClassIdentityViewProps> = ({
  classInfo,
  onSaveClassInfo,
}) => {
  const [formData, setFormData] = useState<ClassInfo>({ ...classInfo });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveClassInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <School className="w-6 h-6 text-emerald-800" />
            <span>Identitas Kelas & Sekolah</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pengaturan profil tunggal kelas, jenjang pendidikan, wali kelas, dan tahun ajaran
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Identitas Kelas Tersimpan!</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Nama Sekolah *</label>
            <input
              type="text"
              required
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              placeholder="TK Pembina Ceria Melati / SD Negeri 01"
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Nama Kelas *</label>
            <input
              type="text"
              required
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              placeholder="Kelas B2 - Bintang Kecil / Kelas 1 A"
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Jenjang Pendidikan *</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as EducationLevel })}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none font-semibold text-emerald-900"
            >
              <option value="PAUD">PAUD (Pendidikan Anak Usia Dini)</option>
              <option value="TK">TK (Taman Kanak-Kanak)</option>
              <option value="RA">RA (Raudhatul Athfal)</option>
              <option value="SD">SD (Sekolah Dasar)</option>
              <option value="MI">MI (Madrasah Ibtidaiyah)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tahun Ajaran *</label>
            <input
              type="text"
              required
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="2026/2027"
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Nama Guru / Wali Kelas *</label>
            <input
              type="text"
              required
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              placeholder="Ibu Nurhayati, S.Pd."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">NIP / NUPTK Guru</label>
            <input
              type="text"
              value={formData.teacherNip || ''}
              onChange={(e) => setFormData({ ...formData, teacherNip: e.target.value })}
              placeholder="19880512 201201 2 004"
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Google Wali Kelas</label>
            <input
              type="email"
              required
              value={formData.teacherEmail}
              onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">URL Logo / Lambang Sekolah</label>
            <input
              type="text"
              value={formData.schoolLogo || ''}
              onChange={(e) => setFormData({ ...formData, schoolLogo: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>Mode Edisi Basic: Single Teacher — Single Class</span>
          </div>

          <button
            type="submit"
            id="btn-save-class-identity"
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Identitas Kelas</span>
          </button>
        </div>
      </form>
    </div>
  );
};
