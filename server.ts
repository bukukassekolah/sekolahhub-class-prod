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

// Google Sheets Sync Proxy Endpoint
app.post('/api/sheets/sync', (req, res) => {
  const { queue, sheetId } = req.body;
  const count = Array.isArray(queue) ? queue.length : 0;

  // Simulate Google Sheets Sync
  return res.json({
    success: true,
    message: `Berhasil menyinkronkan ${count} perubahan ke Google Spreadsheet database (${sheetId || 'SekolahHub Class Database'}).`,
    syncedAt: new Date().toISOString(),
    processedCount: count
  });
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
