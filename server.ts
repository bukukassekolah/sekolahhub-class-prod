import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Aksa AI Assistant Endpoint
app.post('/api/aksa-ai', async (req, res) => {
  try {
    const { mode, studentName, aspect, observations, topic, learningGoal, ageGroup, media } = req.body;

    const ai = getGeminiClient();
    let prompt = '';
    let systemInstruction = 'Anda adalah Aksa, asisten AI ramah dan berpengalaman khusus untuk guru TK, PAUD, dan SD di Indonesia. Berikan tanggapan yang hangat, jelas, terstruktur, dan bernilai pedagogis tinggi.';

    if (mode === 'narrative') {
      prompt = `Buatkan narasi perkembangan/raport singkat (1-2 paragraf hangat) untuk siswa berikut:
Nama Siswa: ${studentName || 'Siswa'}
Aspek Perkembangan: ${aspect || 'Kognitif'}
Catatan Pengamatan Guru: ${observations || 'Aktif mengikuti kegiatan dan mau bekerjasama'}

Gunakan kosa kata pendidikan anak usia dini/SD yang santun, positif, mengapresiasi pencapaian (misal: Berkembang Sangat Baik / Berkembang Sesuai Harapan), dan memberikan saran stimulasi sederhana untuk orang tua di rumah.`;
    } else if (mode === 'journal') {
      prompt = `Buatkan draf Jurnal Mengajar Harian guru yang rapi dan terstruktur untuk:
Tema / Topik: ${topic || 'Pengenalan Lingkungan Sekolah'}
Tujuan Pembelajaran: ${learningGoal || 'Anak mengenal teman dan lingkungan kelas'}
Media/Alat: ${media || 'Buku gambar, krayon, dan musik anak'}

Sertakan bagian:
1. Ringkasan Aktivitas Pembelajaran (Awal, Inti, Penutup)
2. Saran Media & Alat Pembelajaran
3. Refleksi Guru (Pertanyaan evaluasi diri guru)`;
    } else if (mode === 'activity') {
      prompt = `Berikan 3 ide aktivitas kelas yang kreatif, interaktif, dan menyenangkan untuk jenjang ${ageGroup || 'TK / SD Awal'}:
Topik / Pembelajaran: ${topic || 'Pengenalan Angka & Bentuk Geometri'}

Untuk setiap ide, cantumkan:
- Nama Aktivitas
- Bahan / Alat Sederhana
- Langkah Kegiatan
- Manfaat Aspek Perkembangan`;
    } else {
      prompt = req.body.prompt || 'Berikan saran kegiatan belajar untuk anak TK/SD hari ini.';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    const resultText = response.text || 'Maaf, Aksa AI tidak dapat menghasilkan narasi saat ini.';
    return res.json({ success: true, result: resultText });
  } catch (error: any) {
    console.error('Error calling Aksa AI:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan saat menghubungkan ke Aksa AI Assistant.'
    });
  }
});

// Real Google Sheets Creation Proxy Endpoint
app.post('/api/sheets/create', async (req, res) => {
  try {
    const { accessToken, classInfo } = req.body;
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Memerlukan Access Token Google OAuth untuk membuat Google Spreadsheet di Google Drive Anda.'
      });
    }

    const title = `SekolahHub Class Database - ${classInfo?.className || 'Kelas'} (${classInfo?.schoolName || 'Sekolah'})`;
    const sheetTitles = ['ClassInfo', 'StudentProfile', 'Attendance', 'Grades', 'ClassSavings', 'TeachingJournal', 'Feedback'];

    // 1. Create Spreadsheet
    const createResp = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { title },
        sheets: sheetTitles.map((t) => ({ properties: { title: t } }))
      })
    });

    if (!createResp.ok) {
      const errBody = await createResp.json().catch(() => ({}));
      const errMsg = errBody?.error?.message || `Gagal membuat Spreadsheet (HTTP ${createResp.status})`;
      return res.status(createResp.status).json({ success: false, error: errMsg });
    }

    const spreadsheetData = await createResp.json();
    const spreadsheetId = spreadsheetData.spreadsheetId;
    const spreadsheetUrl = spreadsheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    // 2. Initialize Headers
    const headersBatch = [
      { range: 'ClassInfo!A1:I1', values: [['ID', 'Nama Sekolah', 'Nama Kelas', 'Tahun Ajaran', 'Jenjang', 'Nama Guru', 'Email Guru', 'Spreadsheet ID', 'Terakhir Dibarui']] },
      { range: 'StudentProfile!A1:J1', values: [['Student ID', 'NISN', 'Nama Lengkap', 'Jenis Kelamin', 'Tanggal Lahir', 'Nama Orang Tua', 'WhatsApp Orang Tua', 'Alamat', 'Catatan Khusus', 'Tanggal Dibuat']] },
      { range: 'Attendance!A1:F1', values: [['Attendance ID', 'Tanggal', 'Student ID', 'Nama Siswa', 'Status Presensi', 'Catatan']] },
      { range: 'Grades!A1:H1', values: [['Grade ID', 'Tanggal', 'Student ID', 'Nama Siswa', 'Aspek Perkembangan', 'Capaian (Rating)', 'Narasi Perkembangan', 'Catatan Guru']] },
      { range: 'ClassSavings!A1:H1', values: [['Transaction ID', 'Tanggal & Waktu', 'Student ID', 'Nama Siswa', 'Jenis Transaksi', 'Nominal (Rp)', 'Saldo Berjalan (Rp)', 'Keterangan']] },
      { range: 'TeachingJournal!A1:F1', values: [['Journal ID', 'Tanggal', 'Topik / Tema', 'Aktivitas Pembelajaran', 'Media / Alat', 'Refleksi Guru']] },
      { range: 'Feedback!A1:F1', values: [['Feedback ID', 'Tanggal', 'Kategori', 'Email Pengirim', 'Pesan', 'Status']] }
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: headersBatch
      })
    });

    return res.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      message: 'Spreadsheet Google berhasil dibuat secara nyata di Google Drive Anda.'
    });
  } catch (error: any) {
    console.error('Error creating Google Spreadsheet:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Terjadi kesalahan saat memanggil Google Sheets API.'
    });
  }
});

// Real Google Sheets Sync Proxy Endpoint
app.post('/api/sheets/sync', async (req, res) => {
  try {
    const { accessToken, spreadsheetId, allData } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Akses Token Google OAuth tidak tersedia. Harap login akun Google.'
      });
    }

    if (!spreadsheetId) {
      return res.status(400).json({
        success: false,
        error: 'Spreadsheet ID belum dikonfigurasi. Harap buat spreadsheet baru di Google Drive.'
      });
    }

    const sheetTitles = ['ClassInfo', 'StudentProfile', 'Attendance', 'Grades', 'ClassSavings', 'TeachingJournal', 'Feedback'];

    // Clear existing data rows (A2:Z5000)
    const clearResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ranges: sheetTitles.map((t) => `${t}!A2:Z5000`)
      })
    });

    if (!clearResp.ok) {
      const errBody = await clearResp.json().catch(() => ({}));
      const errMsg = errBody?.error?.message || `Gagal membersihkan data lama di Google Sheets (HTTP ${clearResp.status})`;
      return res.status(clearResp.status).json({ success: false, error: errMsg });
    }

    if (!allData) {
      return res.json({ success: true, message: 'Baris dibersihkan.', syncedAt: new Date().toISOString() });
    }

    const nowIso = new Date().toLocaleString('id-ID');

    const classInfoRows = [
      [
        allData.classInfo?.id || 'class_1',
        allData.classInfo?.schoolName || '',
        allData.classInfo?.className || '',
        allData.classInfo?.academicYear || '',
        allData.classInfo?.level || '',
        allData.classInfo?.teacherName || '',
        allData.classInfo?.teacherEmail || '',
        spreadsheetId,
        nowIso
      ]
    ];

    const studentRows = (allData.students || []).map((s: any) => [
      s.id, '', s.fullName, s.gender === 'L' ? 'Laki-laki' : 'Perempuan', s.birthDate, s.parentName, s.parentWhatsapp, s.address, s.specialNotes || '', s.createdAt
    ]);

    const attendanceRows = (allData.attendance || []).map((a: any) => [
      a.id, a.date, a.studentId, a.studentName, a.status, a.notes || ''
    ]);

    const gradeRows = (allData.grades || []).map((g: any) => [
      g.id, g.date, g.studentId, g.studentName, g.aspect, g.rating, g.description, g.teacherNote || ''
    ]);

    const savingsRows = (allData.savings || []).map((s: any) => [
      s.id, s.date, s.studentId, s.studentName, s.type, s.amount, s.runningBalance, s.description || ''
    ]);

    const journalRows = (allData.journals || []).map((j: any) => [
      j.id, j.date, j.topic, j.activities, j.mediaUsed, j.reflection
    ]);

    const feedbackRows = (allData.feedback || []).map((f: any) => [
      f.id, f.date, f.type, f.email, f.message, f.status
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

    const updateResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: updateBatch
      })
    });

    if (!updateResp.ok) {
      const errBody = await updateResp.json().catch(() => ({}));
      const errMsg = errBody?.error?.message || `Gagal memperbarui nilai ke Google Sheets (HTTP ${updateResp.status})`;
      return res.status(updateResp.status).json({ success: false, error: errMsg });
    }

    return res.json({
      success: true,
      message: `Berhasil menyinkronkan seluruh lembar kerja ke Google Spreadsheet (${spreadsheetId}).`,
      syncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /api/sheets/sync:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal menyinkronkan data ke Google Sheets API.'
    });
  }
});

// Feedback Endpoint
app.post('/api/feedback', (req, res) => {
  const { type, message, email } = req.body;
  console.log(`[Feedback Received] Type: ${type}, From: ${email}, Message: ${message}`);
  return res.json({
    success: true,
    message: 'Terima kasih! Feedback Anda telah berhasil dikirim ke pengembang SekolahHub.'
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SekolahHub Class Basic Server running on http://localhost:${PORT}`);
  });
}

startServer();
