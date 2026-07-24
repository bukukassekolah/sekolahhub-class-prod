import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  Calendar as CalendarIcon,
  Save,
  CheckCheck,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { StudentProfile, AttendanceRecord, AttendanceStatus } from '../../types';

interface AttendanceViewProps {
  students: StudentProfile[];
  attendance: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendance,
  onSaveAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'input' | 'monthly'>('input');

  // Draft attendance for the selected date
  const [draftStatus, setDraftStatus] = useState<Record<string, { status: AttendanceStatus; notes: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; notes: string }> = {};
    students.forEach(s => {
      const existing = attendance.find(a => a.date === selectedDate && a.studentId === s.id);
      map[s.id] = {
        status: existing ? existing.status : 'Hadir',
        notes: existing?.notes || ''
      };
    });
    return map;
  });

  // When selected date changes, update draft map
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const map: Record<string, { status: AttendanceStatus; notes: string }> = {};
    students.forEach(s => {
      const existing = attendance.find(a => a.date === newDate && a.studentId === s.id);
      map[s.id] = {
        status: existing ? existing.status : 'Hadir',
        notes: existing?.notes || ''
      };
    });
    setDraftStatus(map);
  };

  const handleSetAllHadir = () => {
    const map: Record<string, { status: AttendanceStatus; notes: string }> = {};
    students.forEach(s => {
      map[s.id] = {
        status: 'Hadir',
        notes: draftStatus[s.id]?.notes || ''
      };
    });
    setDraftStatus(map);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setDraftStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setDraftStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes
      }
    }));
  };

  const handleSave = () => {
    const records: AttendanceRecord[] = students.map(s => ({
      id: `att_${selectedDate}_${s.id}`,
      date: selectedDate,
      studentId: s.id,
      studentName: s.fullName,
      status: draftStatus[s.id]?.status || 'Hadir',
      notes: draftStatus[s.id]?.notes || ''
    }));

    onSaveAttendance(records);
    alert('Presensi harian berhasil disimpan!');
  };

  // Calculate stats for current view date
  const statusValues = Object.values(draftStatus) as Array<{ status: AttendanceStatus; notes: string }>;
  const hadirCount = statusValues.filter(v => v.status === 'Hadir').length;
  const izinCount = statusValues.filter(v => v.status === 'Izin').length;
  const sakitCount = statusValues.filter(v => v.status === 'Sakit').length;
  const alpaCount = statusValues.filter(v => v.status === 'Alpa').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-teal-700" />
            <span>Presensi Harian & Rekap Kehadiran</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pencatatan kehadiran siswa (Hadir, Izin, Sakit, Alpa) dan persentase kehadiran bulanan
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'input'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Input Presensi Date
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'monthly'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Laporan Rekap Bulanan
          </button>
        </div>
      </div>

      {activeTab === 'input' ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-teal-700" />
              <div>
                <label className="block text-[10px] font-bold uppercase text-stone-500">Tanggal Presensi</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="text-xs font-bold text-stone-800 border-none bg-stone-100 px-2.5 py-1 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleSetAllHadir}
                className="flex-1 sm:flex-none text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Tandai Semua Hadir</span>
              </button>

              <button
                onClick={handleSave}
                id="btn-save-attendance"
                className="flex-1 sm:flex-none text-xs bg-teal-800 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Presensi</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Summary Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs text-emerald-800 font-medium">Hadir</span>
              <div className="text-2xl font-bold text-emerald-950">{hadirCount}</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs text-blue-800 font-medium">Izin</span>
              <div className="text-2xl font-bold text-blue-950">{izinCount}</div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-xs text-amber-800 font-medium">Sakit</span>
              <div className="text-2xl font-bold text-amber-950">{sakitCount}</div>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
              <span className="text-xs text-rose-800 font-medium">Alpa</span>
              <div className="text-2xl font-bold text-rose-950">{alpaCount}</div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">#</th>
                    <th className="p-3.5">Nama Siswa</th>
                    <th className="p-3.5 text-center">Status Kehadiran</th>
                    <th className="p-3.5 pr-5">Catatan Khusus (Opsional)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {students.map((student, idx) => {
                    const current = draftStatus[student.id]?.status || 'Hadir';
                    const currentNotes = draftStatus[student.id]?.notes || '';

                    return (
                      <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3.5 pl-5 font-mono text-stone-400">{idx + 1}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-stone-900">{student.fullName}</div>
                          <div className="text-[11px] text-stone-400">"{student.nickname}"</div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStatusChange(student.id, 'Hadir')}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                current === 'Hadir'
                                  ? 'bg-emerald-700 text-white shadow-sm'
                                  : 'bg-stone-100 text-stone-600 hover:bg-emerald-100'
                              }`}
                            >
                              Hadir
                            </button>

                            <button
                              onClick={() => handleStatusChange(student.id, 'Izin')}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                current === 'Izin'
                                  ? 'bg-blue-700 text-white shadow-sm'
                                  : 'bg-stone-100 text-stone-600 hover:bg-blue-100'
                              }`}
                            >
                              Izin
                            </button>

                            <button
                              onClick={() => handleStatusChange(student.id, 'Sakit')}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                current === 'Sakit'
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                              }`}
                            >
                              Sakit
                            </button>

                            <button
                              onClick={() => handleStatusChange(student.id, 'Alpa')}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                current === 'Alpa'
                                  ? 'bg-rose-700 text-white shadow-sm'
                                  : 'bg-stone-100 text-stone-600 hover:bg-rose-100'
                              }`}
                            >
                              Alpa
                            </button>
                          </div>
                        </td>

                        <td className="p-3.5 pr-5">
                          <input
                            type="text"
                            value={currentNotes}
                            onChange={(e) => handleNotesChange(student.id, e.target.value)}
                            placeholder="Alasan izin / surat sakit / keterangan..."
                            className="w-full text-xs p-2 rounded-lg border border-stone-200 focus:ring-1 focus:ring-teal-600 outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Monthly Rekap Tab */
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-700" />
              <span>Rekap Persentase Kehadiran Bulanan Siswa</span>
            </h3>

            <div className="text-xs text-stone-500 font-medium">
              Total Record Presensi: {attendance.length} entri
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3 pl-4">#</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center">Total Pertemuan</th>
                  <th className="p-3 text-center text-emerald-700">Hadir</th>
                  <th className="p-3 text-center text-blue-700">Izin</th>
                  <th className="p-3 text-center text-amber-700">Sakit</th>
                  <th className="p-3 text-center text-rose-700">Alpa</th>
                  <th className="p-3 text-center font-bold">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {students.map((student, idx) => {
                  const studentRecords = attendance.filter(a => a.studentId === student.id);
                  const total = studentRecords.length;
                  const h = studentRecords.filter(a => a.status === 'Hadir').length;
                  const i = studentRecords.filter(a => a.status === 'Izin').length;
                  const s = studentRecords.filter(a => a.status === 'Sakit').length;
                  const a = studentRecords.filter(a => a.status === 'Alpa').length;
                  const pct = total > 0 ? Math.round((h / total) * 100) : 100;

                  return (
                    <tr key={student.id} className="hover:bg-stone-50">
                      <td className="p-3 pl-4 font-mono text-stone-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-stone-900">{student.fullName}</td>
                      <td className="p-3 text-center font-semibold text-stone-600">{total}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">{h}</td>
                      <td className="p-3 text-center font-bold text-blue-600">{i}</td>
                      <td className="p-3 text-center font-bold text-amber-600">{s}</td>
                      <td className="p-3 text-center font-bold text-rose-600">{a}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-extrabold text-xs ${
                          pct >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : pct >= 75
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
