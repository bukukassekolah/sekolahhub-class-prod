import { GoogleGenAI } from '@google/genai';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AIContextData {
  teacherName?: string;
  className?: string;
  schoolName?: string;
  studentCount?: number;
}

/**
 * Aksa AI Modular Service
 * Provides helper logic to respond to user prompts using Gemini SDK when available or fallback smart templates.
 */
export async function queryAksaAI(prompt: string, context?: AIContextData): Promise<string> {
  const normalizedPrompt = prompt.trim().toLowerCase();

  // 1. Quick Prompts / Built-in Intelligent Helpers
  if (normalizedPrompt.includes('buat pengumuman kelas') || normalizedPrompt.includes('pengumuman')) {
    return `📢 **Draf Pengumuman Kelas**
    
Yth. Bapak/Ibu Orang Tua/Wali Murid ${context?.className || 'Kelas'},

Salam hangat. Diberitahukan bahwa pada minggu ini kelas kita akan menyelenggarakan kegiatan pembelajaran tematik proyek. Mohon pastikan ananda membawa perlengkapan sekolah lengkap serta menjaga kebersihan dan kesehatan.

Terima kasih atas perhatian dan kerja samanya.

Salam hormat,
**${context?.teacherName || 'Wali Kelas'}**
${context?.schoolName || 'SekolahHub Class'}`;
  }

  if (normalizedPrompt.includes('catatan wali kelas') || normalizedPrompt.includes('catatan guru')) {
    return `📝 **Rekomendasi Catatan Wali Kelas**

**Topik:** Perkembangan Pembelajaran & Sikap Siswa
**Tanggal:** ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

1. **Akademik:** Sebagian besar siswa telah memahami materi dasar dengan sangat baik. Perlu latihan penguatan lanjutan untuk beberapa siswa.
2. **Karakter & Kedisiplinan:** Kedisiplinan kehadiran dan kerapian pakaian siswa sangat memuaskan minggu ini.
3. **Rencana Tindak Lanjut:** Mengadakan pendampingan kelompok belajar kecil sebelum jam istirahat.`;
  }

  if (normalizedPrompt.includes('ringkas kehadiran') || normalizedPrompt.includes('kehadiran minggu ini')) {
    return `📊 **Ringkasan Kehadiran Kelas**

- **Total Siswa Terdaftar:** ${context?.studentCount || 8} Siswa
- **Rata-rata Kehadiran:** ~96%
- **Status Dominan:** Hadir tepat waktu.
- **Catatan Tambahan:** Ada 1 siswa izin sakit yang sudah menyampaikan surat keterangan via WhatsApp orang tua.

💡 *Tips:* Anda dapat mencetak rekapitulasi kehadiran resmi di menu **Presensi Harian** atau **Laporan PDF**.`;
  }

  if (normalizedPrompt.includes('buat pesan untuk orang tua') || normalizedPrompt.includes('pesan orang tua')) {
    return `💬 **Draf Pesan WhatsApp untuk Orang Tua/Wali**

"Assalamu'alaikum / Selamat Pagi Bapak/Ibu Orang Tua/Wali Murid. 

Semoga Bapak/Ibu senantiasa sehat. Kami ingin menginformasikan bahwa besok ananda perlu membawa buku catatan tematik & alat tulis lengkap. Mohon bantuan Bapak/Ibu untuk memeriksa kelengkapan tas ananda malam ini.

Terima kasih atas perhatian dan pendampingan Bapak/Ibu di rumah. 🙏😊"`;
  }

  if (normalizedPrompt.includes('bantu menggunakan sekolahhub') || normalizedPrompt.includes('bantuan') || normalizedPrompt.includes('cara menggunakan')) {
    return `🤖 **Panduan Penggunaan SekolahHub Class Basic**

Berikut panduan singkat menu utama aplikasi:

1. 🏫 **Profil Kelas:** Atur nama guru, sekolah, kelas, dan tahun akademik.
2. 👥 **Data Siswa:** Kelola data siswa manual atau **Import dari file Excel (.xlsx)**.
3. 📅 **Presensi Harian:** Catat kehadiran siswa (Hadir, Izin, Sakit, Alfa) secara cepat.
4. 💰 **Tabungan Siswa:** Catat setoran & penarikan saldo tabungan siswa serta ekspor rekap PDF.
5. 📖 **Catatan & Jurnal:** Tulis catatan perkembangan & aktivitas jurnal harian.
6. 📢 **Pengumuman Kelas:** Kelola pengumuman untuk wali murid.
7. 📄 **Laporan PDF:** Cetak rekapitulasi lengkap administrasi kelas Anda.`;
  }

  // 2. Fallback to Gemini API if available, or generate general AI guidance
  try {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Anda adalah Aksa AI, asisten kecerdasan buatan ramah dan profesional khusus untuk guru di aplikasi SekolahHub Class Basic.
Jawablah pertanyaan guru dalam Bahasa Indonesia yang sopan, terstruktur, dan praktis.
Nama Guru: ${context?.teacherName || 'Guru'}
Kelas: ${context?.className || 'Kelas'}
Sekolah: ${context?.schoolName || 'Sekolah'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction
        }
      });

      if (response.text) {
        return response.text;
      }
    }
  } catch (err) {
    console.warn('Aksa AI Gemini call failed or key not set, using default assistant responder:', err);
  }

  // General helpful response
  return `Halo Bapak/Ibu **${context?.teacherName || 'Guru'}**! Saya **Aksa AI**, asisten siap bantu administrasi ${context?.className || 'kelas'} Anda.

Saya bisa membantu Anda untuk:
- Membuat draf pengumuman kelas & pesan orang tua.
- Membuat catatan perkembangan & jurnal wali kelas.
- Menyusun ringkasan presensi & administrasi tabungan siswa.

Silakan pilih tombol **Prompt Cepat** di atas atau ketik pertanyaan Anda!`;
}
