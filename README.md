# SekolahHub Class Basic

Aplikasi manajemen administrasi guru kelas PAUD, TK, RA, MI, & SD terpadu dengan integrasi Google Workspace & Aksa AI Assistant (Gemini 3.6 Flash).

---

## 🔑 Panduan Konfigurasi Google OAuth 2.0 Client ID

Untuk mengaktifkan autentikasi Google Login secara aman tanpa error `invalid_client` / 401, ikuti langkah-langkah pembuatan OAuth 2.0 Client ID di Google Cloud Console berikut:

### Langkah 1: Buka Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru (misalnya: `SekolahHub-Class`) atau pilih proyek yang sudah ada.

### Langkah 2: Konfigurasi Layar Persetujuan OAuth (OAuth Consent Screen)
1. Di menu navigasi kiri, pilih **APIs & Services** > **OAuth consent screen**.
2. Pilih User Type **External** (atau Internal jika khusus organisasi sekolah Anda), lalu klik **Create**.
3. Isi informasi dasar:
   - **App name**: `SekolahHub Class`
   - **User support email**: Email Anda
   - **Developer contact information**: Email Anda
4. Tambahkan scope dasar: `openid`, `../auth/userinfo.profile`, `../auth/userinfo.email`.
5. Simpan dan lanjutkan hingga selesai.

### Langkah 3: Buat OAuth Client ID
1. Pilih menu **APIs & Services** > **Credentials**.
2. Klik tombol **+ CREATE CREDENTIALS** di bagian atas, lalu pilih **OAuth client ID**.
3. Pada pilihan **Application type**, pilih **Web application**.
4. Beri nama Kredensial (misalnya: `SekolahHub Web Client`).

### Langkah 4: Tambahkan Authorized JavaScript Origins (Asal JavaScript)
Di bagian **Authorized JavaScript origins**, klik **+ ADD URI** dan masukkan URL tempat aplikasi Anda diakses:
- Untuk pengembangan lokal:
  `http://localhost:3000`
- Untuk deployment / AI Studio preview (misalnya):
  `https://ais-dev-osyp7emchk7hy5bmqxmism-485269170369.asia-east1.run.app`
  *(Sesuaikan dengan URL domain Cloud Run / AI Studio tempat aplikasi Anda berjalan)*

> ⚠️ **PENTING**: Jika domain origin tidak ditambahkan di list *Authorized JavaScript origins*, Google akan menolak permintaan login dengan pesan error `invalid_client` atau Error 400/401.

### Langkah 5: Salin Client ID ke Environment Variable
1. Klik **Create**. Google akan menampilkan popup berisi **Client ID** (contoh format: `123456789012-abc123xyz456.apps.googleusercontent.com`).
2. Buat atau buka file `.env` di direktori utama aplikasi.
3. Tambahkan baris berikut:
   ```env
   VITE_GOOGLE_CLIENT_ID="123456789012-abc123xyz456.apps.googleusercontent.com"
   ```
4. Simpan file `.env` dan restart server pengembang (`npm run dev`).

---

## 🛠️ Fitur Utama Aplikasi

- **Presensi Harian Siswa**: Pencatatan cepat status Hadir, Izin, Sakit, Alpa, beserta rekap persentase harian.
- **Buku Nilai & Perkembangan**: Pencatatan perkembangan kognitif, motorik, bahasa, dan seni dengan dukungan narasi Aksa AI.
- **Tabungan Kelas**: Pencatatan saldo kas tabungan siswa terpadu.
- **Jurnal Mengajar Harian**: Dokumentasi materi, peraga, dan draf AI mengajar.
- **Otomatis Sync ke Google Sheets**: Semua data tersimpan aman secara terstruktur langsung ke Google Spreadsheet milik akun Google pribadi Anda.
