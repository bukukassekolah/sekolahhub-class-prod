import {
  ClassInfo,
  StudentProfile,
  AttendanceRecord,
  GradeRecord,
  ClassSavingTransaction,
  TeachingJournalEntry,
  FeedbackEntry
} from '../types';

export interface CreateSpreadsheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

export interface SyncSpreadsheetResult {
  success: boolean;
  message: string;
  syncedAt: string;
}

const SHEET_TITLES = [
  'ClassInfo',
  'StudentProfile',
  'Attendance',
  'Grades',
  'ClassSavings',
  'TeachingJournal',
  'Feedback'
];

/**
 * Creates a brand new Google Spreadsheet in the logged-in user's Google Drive via Sheets API v4
 */
export async function createRealClassSpreadsheet(
  accessToken: string,
  classInfo: Partial<ClassInfo>
): Promise<CreateSpreadsheetResult> {
  if (!accessToken) {
    throw new Error(
      'Akses Token Google OAuth tidak ditemukan. Harap login ulang dengan akun Google Anda.'
    );
  }

  const title = `SekolahHub Class Database - ${classInfo.className || 'Kelas'} (${classInfo.schoolName || 'Sekolah'})`;

  // Step 1: Create Spreadsheet with 7 sheets
  const createResp = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: { title },
      sheets: SHEET_TITLES.map((t) => ({
        properties: { title: t }
      }))
    })
  });

  if (!createResp.ok) {
    const errorBody = await createResp.json().catch(() => ({}));
    const message =
      errorBody?.error?.message ||
      `Gagal membuat spreadsheet Google (HTTP Status: ${createResp.status})`;
    if (createResp.status === 401 || createResp.status === 403) {
      throw new Error(
        `Izin Google Sheets/Drive Ditolak (403/401): ${message}. Pastikan memberi centang izin Google Sheets & Drive saat popup login Google.`
      );
    }
    throw new Error(message);
  }

  const spreadsheetData = await createResp.json();
  const spreadsheetId = spreadsheetData.spreadsheetId;
  const spreadsheetUrl = spreadsheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  // Step 2: Initialize headers for all sheets
  const headersBatch = [
    {
      range: 'ClassInfo!A1:I1',
      values: [
        [
          'ID',
          'Nama Sekolah',
          'Nama Kelas',
          'Tahun Ajaran',
          'Jenjang',
          'Nama Guru',
          'Email Guru',
          'Spreadsheet ID',
          'Terakhir Dibarui'
        ]
      ]
    },
    {
      range: 'StudentProfile!A1:J1',
      values: [
        [
          'Student ID',
          'NISN',
          'Nama Lengkap',
          'Jenis Kelamin',
          'Tanggal Lahir',
          'Nama Orang Tua',
          'WhatsApp Orang Tua',
          'Alamat',
          'Catatan Khusus',
          'Tanggal Dibuat'
        ]
      ]
    },
    {
      range: 'Attendance!A1:F1',
      values: [['Attendance ID', 'Tanggal', 'Student ID', 'Nama Siswa', 'Status Presensi', 'Catatan']]
    },
    {
      range: 'Grades!A1:H1',
      values: [
        [
          'Grade ID',
          'Tanggal',
          'Student ID',
          'Nama Siswa',
          'Aspek Perkembangan',
          'Capaian (Rating)',
          'Narasi Perkembangan',
          'Catatan Guru'
        ]
      ]
    },
    {
      range: 'ClassSavings!A1:H1',
      values: [
        [
          'Transaction ID',
          'Tanggal & Waktu',
          'Student ID',
          'Nama Siswa',
          'Jenis Transaksi',
          'Nominal (Rp)',
          'Saldo Berjalan (Rp)',
          'Keterangan'
        ]
      ]
    },
    {
      range: 'TeachingJournal!A1:F1',
      values: [
        ['Journal ID', 'Tanggal', 'Topik / Tema', 'Aktivitas Pembelajaran', 'Media / Alat', 'Refleksi Guru']
      ]
    },
    {
      range: 'Feedback!A1:F1',
      values: [['Feedback ID', 'Tanggal', 'Kategori', 'Email Pengirim', 'Pesan', 'Status']]
    }
  ];

  const headersResp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: headersBatch
      })
    }
  );

  if (!headersResp.ok) {
    const errorBody = await headersResp.json().catch(() => ({}));
    console.warn('Gagal mengisi header awal ke spreadsheet:', errorBody);
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Syncs full class data to real Google Spreadsheet tabs using Sheets API v4
 */
export async function syncAllDataToRealSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  allData: {
    classInfo: ClassInfo;
    students: StudentProfile[];
    attendance: AttendanceRecord[];
    grades: GradeRecord[];
    savings: ClassSavingTransaction[];
    journals: TeachingJournalEntry[];
    feedback: FeedbackEntry[];
  }
): Promise<SyncSpreadsheetResult> {
  if (!accessToken) {
    throw new Error('Access token Google OAuth tidak tersedia. Harap login ulang dengan akun Google Anda.');
  }

  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID belum dikonfigurasi. Harap buat Spreadsheet baru terlebih dahulu.');
  }

  // Clear existing content from row 2 onwards
  const clearResp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ranges: SHEET_TITLES.map((t) => `${t}!A2:Z5000`)
      })
    }
  );

  if (!clearResp.ok) {
    const errBody = await clearResp.json().catch(() => ({}));
    const message = errBody?.error?.message || `Gagal membersihkan data lama (Status ${clearResp.status})`;
    if (clearResp.status === 401 || clearResp.status === 403) {
      throw new Error(
        'Sesi autentikasi Google telah berakhir atau izin ditolak. Harap klik profil dan lakukan Login Google ulang.'
      );
    }
    throw new Error(message);
  }

  // Format data for rows
  const nowIso = new Date().toLocaleString('id-ID');

  const classInfoRows = [
    [
      allData.classInfo.id || 'class_1',
      allData.classInfo.schoolName || '',
      allData.classInfo.className || '',
      allData.classInfo.academicYear || '',
      allData.classInfo.level || '',
      allData.classInfo.teacherName || '',
      allData.classInfo.teacherEmail || '',
      spreadsheetId,
      nowIso
    ]
  ];

  const studentRows = allData.students.map((s) => [
    s.id,
    '', // NISN
    s.fullName,
    s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    s.birthDate,
    s.parentName,
    s.parentWhatsapp,
    s.address,
    s.specialNotes || '',
    s.createdAt
  ]);

  const attendanceRows = allData.attendance.map((a) => [
    a.id,
    a.date,
    a.studentId,
    a.studentName,
    a.status,
    a.notes || ''
  ]);

  const gradeRows = allData.grades.map((g) => [
    g.id,
    g.date,
    g.studentId,
    g.studentName,
    g.aspect,
    g.rating,
    g.description,
    g.teacherNote || ''
  ]);

  const savingsRows = allData.savings.map((s) => [
    s.id,
    s.date,
    s.studentId,
    s.studentName,
    s.type,
    s.amount,
    s.runningBalance,
    s.description || ''
  ]);

  const journalRows = allData.journals.map((j) => [
    j.id,
    j.date,
    j.topic,
    j.activities,
    j.mediaUsed,
    j.reflection
  ]);

  const feedbackRows = allData.feedback.map((f) => [
    f.id,
    f.date,
    f.type,
    f.email,
    f.message,
    f.status
  ]);

  const updateBatch = [
    { range: 'ClassInfo!A2', values: classInfoRows },
    { range: 'StudentProfile!A2', values: studentRows.length ? studentRows : [['', '', '', '', '', '', '', '', '', '']] },
    { range: 'Attendance!A2', values: attendanceRows.length ? attendanceRows : [['', '', '', '', '', '']] },
    { range: 'Grades!A2', values: gradeRows.length ? gradeRows : [['', '', '', '', '', '', '', '']] },
    { range: 'ClassSavings!A2', values: savingsRows.length ? savingsRows : [['', '', '', '', '', '', '', '']] },
    { range: 'TeachingJournal!A2', values: journalRows.length ? journalRows : [['', '', '', '', '', '']] },
    { range: 'Feedback!A2', values: feedbackRows.length ? feedbackRows : [['', '', '', '', '', '']] }
  ];

  const updateResp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: updateBatch
      })
    }
  );

  if (!updateResp.ok) {
    const errBody = await updateResp.json().catch(() => ({}));
    const message = errBody?.error?.message || `Gagal menulis data ke Google Sheets (Status ${updateResp.status})`;
    throw new Error(message);
  }

  return {
    success: true,
    message: `Berhasil menyinkronkan seluruh lembar kerja ke Google Spreadsheet (${spreadsheetId}).`,
    syncedAt: new Date().toISOString()
  };
}
