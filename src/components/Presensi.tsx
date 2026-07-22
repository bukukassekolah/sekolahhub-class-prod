import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AttendanceStatus } from '../types';
import { getTodayFormatted } from '../lib/demoData';
import { 
  CalendarCheck, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Save, 
  Share2, 
  Sparkles 
} from 'lucide-react';

export const Presensi: React.FC = () => {
  const { students, attendance, saveAttendanceBatch, teacherProfile } = useAuth();

  const [date, setDate] = useState<string>(getTodayFormatted());
  const activeStudents = students.filter(s => s.isActive);

  // Local state for attendance entries for selected date
  const [records, setRecords] = useState<{ [studentId: string]: { status: AttendanceStatus; notes: string } }>({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Populate from existing attendance state for this date
    const dateRecords = attendance.filter(a => a.date === date);
    const initialMap: { [studentId: string]: { status: AttendanceStatus; notes: string } } = {};

    activeStudents.forEach(s => {
      const existing = dateRecords.find(a => a.studentId === s.id);
      if (existing) {
        initialMap[s.id] = { status: existing.status, notes: existing.notes || '' };
      } else {
        initialMap[s.id] = { status: 'Hadir', notes: '' };
      }
    });

    setRecords(initialMap);
    setSavedSuccess(false);
  }, [date, students, attendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
    setSavedSuccess(false);
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }));
    setSavedSuccess(false);
  };

  const handleSetAllHadir = () => {
    const updated = { ...records };
    activeStudents.forEach(s => {
      updated[s.id] = { ...updated[s.id], status: 'Hadir' };
    });
    setRecords(updated);
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const batch = activeStudents.map(s => ({
        date,
        studentId: s.id,
        studentName: s.name,
        status: records[s.id]?.status || 'Hadir',
        notes: records[s.id]?.notes || ''
      }));

      await saveAttendanceBatch(batch);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate statistics
  const recordValues = Object.values(records) as { status: AttendanceStatus; notes: string }[];
  const hadirCount = recordValues.filter(r => r.status === 'Hadir').length;
  const izinCount = recordValues.filter(r => r.status === 'Izin').length;
  const sakitCount = recordValues.filter(r => r.status === 'Sakit').length;
  const alfaCount = recordValues.filter(r => r.status === 'Alfa').length;

  const generateWAFormat = () => {
    let msg = `*REKAP PRESENSI KELAS ${teacherProfile.className.toUpperCase()}*\n`;
    msg += `Sekolah: ${teacherProfile.schoolName}\n`;
    msg += `Tanggal: ${date}\n\n`;
    msg += `📊 *Ringkasan Kehadiran:*\n`;
    msg += `• Hadir: ${hadirCount} siswa\n`;
    msg += `• Sakit: ${sakitCount} siswa\n`;
    msg += `• Izin: ${izinCount} siswa\n`;
    msg += `• Alfa: ${alfaCount} siswa\n`;
    msg += `• Total: ${activeStudents.length} siswa\n\n`;

    const nonHadir = activeStudents.filter(s => records[s.id]?.status !== 'Hadir');
    if (nonHadir.length > 0) {
      msg += `📋 *Keterangan Siswa Tidak Hadir:*\n`;
      nonHadir.forEach(s => {
        const r = records[s.id];
        msg += `- ${s.name}: ${r.status}${r.notes ? ` (${r.notes})` : ''}\n`;
      });
      msg += `\n`;
    }

    msg += `_Dikirim via SekolahHub Class Basic_`;
    return encodeURIComponent(msg);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>Presensi Kehadiran Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan harian kehadiran siswa kelas {teacherProfile.className}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
          />

          <a
            href={`https://wa.me/?text=${generateWAFormat()}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Bagikan ke WA</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black mt-1">{hadirCount}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Izin</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black mt-1">{izinCount}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Sakit</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black mt-1">{sakitCount}</p>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Alfa</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black mt-1">{alfaCount}</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Presensi tanggal {date} berhasil disimpan!</span>
          </div>
          <a
            href={`https://wa.me/?text=${generateWAFormat()}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 underline font-bold flex items-center gap-1"
          >
            <span>Kirim WhatsApp Sekarang</span>
            <Share2 className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Daftar Siswa Kelas ({activeStudents.length} Siswa)</span>
          <button
            onClick={handleSetAllHadir}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors border border-blue-200 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Set Semua Hadir</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {activeStudents.map(s => {
            const currentStatus = records[s.id]?.status || 'Hadir';
            const currentNotes = records[s.id]?.notes || '';

            return (
              <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-600 flex items-center justify-center shrink-0">
                    {s.nis ? s.nis.slice(-2) : s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500">
                      NIS: {s.nis || '-'} &bull; {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'Hadir')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${currentStatus === 'Hadir' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'Izin')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${currentStatus === 'Izin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Izin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'Sakit')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${currentStatus === 'Sakit' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Sakit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(s.id, 'Alfa')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${currentStatus === 'Alfa' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Alfa
                    </button>
                  </div>

                  {currentStatus !== 'Hadir' && (
                    <input
                      type="text"
                      placeholder="Keterangan / Alasan..."
                      value={currentNotes}
                      onChange={e => handleNotesChange(s.id, e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Presensi Hari Ini'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
