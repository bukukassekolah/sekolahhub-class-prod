import React, { useState } from 'react';
import { FileText, Printer, Download, Calendar, ShieldCheck } from 'lucide-react';
import { TeacherProfile, Student, AttendanceRecord, TeacherNote } from '../types';

interface ReportsViewProps {
  profile: TeacherProfile;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  notes: TeacherNote[];
  showToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  profile,
  students,
  attendanceRecords,
  notes,
  showToast,
}) => {
  const [reportMonth, setReportMonth] = useState<string>('2025-07');

  const handlePrint = () => {
    window.print();
    showToast('info', 'Membuka dialog cetak PDF...');
  };

  // Calculate stats for current month
  const currentMonthRecords = attendanceRecords.filter(r => r.date.startsWith(reportMonth));

  const totalPresent = currentMonthRecords.filter(r => r.status === 'Hadir').length;
  const totalPermission = currentMonthRecords.filter(r => r.status === 'Izin').length;
  const totalSick = currentMonthRecords.filter(r => r.status === 'Sakit').length;
  const totalAlpha = currentMonthRecords.filter(r => r.status === 'Alfa').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar (Hidden during print) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Laporan Administrasi & Presensi Kelas
          </h2>
          <p className="text-xs text-slate-500">
            Format resmi siap cetak PDF / Fisik untuk laporan ke Kepala Sekolah & Dinas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          />

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Cetak Laporan PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 font-sans text-slate-900 print:shadow-none print:border-none print:p-0">
        {/* KOP SURAT SEKOLAH */}
        <div className="text-center pb-6 border-b-2 border-slate-900">
          <h1 className="text-xl font-black uppercase tracking-wide text-slate-900">{profile.schoolName}</h1>
          <p className="text-sm font-extrabold text-slate-800 mt-1">
            LAPORAN BULANAN ADMINISTRASI KELAS {profile.className.toUpperCase()}
          </p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Tahun Pelajaran {profile.academicYear} &bull; Semester {profile.semester} &bull; Periode: {reportMonth}
          </p>
        </div>

        {/* Ringkasan Profil Guru */}
        <div className="grid grid-cols-2 text-xs gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-transparent">
          <div><span className="font-bold">Wali Kelas:</span> {profile.teacherName}</div>
          <div><span className="font-bold">Total Murid:</span> {students.length} Anak</div>
          <div><span className="font-bold">Jumlah Laki-laki:</span> {students.filter(s => s.gender === 'L').length} Anak</div>
          <div><span className="font-bold">Jumlah Perempuan:</span> {students.filter(s => s.gender === 'P').length} Anak</div>
        </div>

        {/* Tabel Rekapitulasi Presensi */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            I. Rekapitulasi Kehadiran Siswa
          </h3>
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                <th className="p-2 border border-slate-300 w-10 text-center">No</th>
                <th className="p-2 border border-slate-300">NIS</th>
                <th className="p-2 border border-slate-300">Nama Siswa</th>
                <th className="p-2 border border-slate-300 text-center w-12">JK</th>
                <th className="p-2 border border-slate-300 text-center w-16">Hadir</th>
                <th className="p-2 border border-slate-300 text-center w-16">Izin</th>
                <th className="p-2 border border-slate-300 text-center w-16">Sakit</th>
                <th className="p-2 border border-slate-300 text-center w-16">Alfa</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const sRecords = currentMonthRecords.filter(r => r.studentId === student.id);
                const h = sRecords.filter(r => r.status === 'Hadir').length;
                const i = sRecords.filter(r => r.status === 'Izin').length;
                const s = sRecords.filter(r => r.status === 'Sakit').length;
                const a = sRecords.filter(r => r.status === 'Alfa').length;

                return (
                  <tr key={student.id} className="border-b border-slate-200">
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-mono">{student.nis}</td>
                    <td className="p-2 border border-slate-300 font-bold">{student.name}</td>
                    <td className="p-2 border border-slate-300 text-center">{student.gender}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-700">{h}</td>
                    <td className="p-2 border border-slate-300 text-center text-blue-700">{i}</td>
                    <td className="p-2 border border-slate-300 text-center text-amber-700">{s}</td>
                    <td className="p-2 border border-slate-300 text-center text-rose-700">{a}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Pengesahan */}
        <div className="pt-12 grid grid-cols-2 text-center text-xs font-semibold gap-8">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala Sekolah</p>
            <div className="h-20" />
            <p className="font-bold underline">_______________________</p>
            <p className="text-[11px] text-slate-500">NIP. ....................................</p>
          </div>

          <div>
            <p>Kota/Kab, .............................. 2025</p>
            <p className="font-bold">Wali Kelas {profile.className}</p>
            <div className="h-20" />
            <p className="font-bold underline">{profile.teacherName}</p>
            <p className="text-[11px] text-slate-500">Guru Kelas SekolahHub</p>
          </div>
        </div>
      </div>
    </div>
  );
};
