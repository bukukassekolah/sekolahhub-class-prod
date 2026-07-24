import {
  ClassInfo,
  StudentProfile,
  AttendanceRecord,
  GradeRecord,
  ClassSavingTransaction,
  TeachingJournalEntry,
  FeedbackEntry
} from '../types';

export const initialClassInfo: ClassInfo = {
  id: 'class_001',
  schoolName: 'TK Pembina Ceria Melati',
  className: 'Kelas B2 - Bintang Kecil',
  level: 'TK',
  teacherName: '',
  teacherNip: '-',
  teacherEmail: '',
  academicYear: '2026/2027',
  studentCount: 10,
  schoolLogo: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=150&auto=format&fit=crop&q=80',
  googleSheetId: '',
  googleSheetName: 'SekolahHub Class Database - TK B2',
  googleSheetConnected: false,
  lastSyncedAt: new Date().toISOString()
};

export const initialStudents: StudentProfile[] = [
  {
    id: 'std_01',
    fullName: 'Ahmad Rafka Alfarizi',
    nickname: 'Rafka',
    gender: 'L',
    birthDate: '2020-04-12',
    parentName: 'Bpk. Hendra Alfarizi',
    parentWhatsapp: '081234567801',
    address: 'Jl. Mawar No. 12, RT 02/04, Kelurahan Sukajadi',
    photoUrl: '',
    specialNotes: 'Alergi seafood & kacang tanah. Memiliki bakat menggambar tinggi.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_02',
    fullName: 'Anindya Kirana Putri',
    nickname: 'Kirin',
    gender: 'P',
    birthDate: '2020-08-25',
    parentName: 'Ibu Ratna Dewi',
    parentWhatsapp: '081234567802',
    address: 'Komplek Asri Indah Blok B3 No. 8',
    photoUrl: '',
    specialNotes: 'Sangat giat membaca cerita sederhana. Pemalu jika dipanggil di depan kelas.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_03',
    fullName: 'Bilal Hafizh Zhafran',
    nickname: 'Bilal',
    gender: 'L',
    birthDate: '2020-02-18',
    parentName: 'Bpk. Ahmad Zhafran',
    parentWhatsapp: '081234567803',
    address: 'Jl. Melati IV No. 45',
    photoUrl: '',
    specialNotes: 'Memerlukan motivasi ekstra saat kegiatan mewarnai.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_04',
    fullName: 'Citra Naura Shakila',
    nickname: 'Naura',
    gender: 'P',
    birthDate: '2020-11-05',
    parentName: 'Ibu Siska Utami',
    parentWhatsapp: '081234567804',
    address: 'Jl. Anggrek Cendrawasih No. 19',
    photoUrl: '',
    specialNotes: 'Sangat komunikatif, sering membantu teman merapikan mainan.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_05',
    fullName: 'Daffa Kenzie Arkan',
    nickname: 'Daffa',
    gender: 'L',
    birthDate: '2020-06-30',
    parentName: 'Bpk. Budi Santoso',
    parentWhatsapp: '081234567805',
    address: 'Jl. Kenanga Mas No. 88',
    photoUrl: '',
    specialNotes: 'Memakai kacamata, disarankan duduk di barisan depan.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_06',
    fullName: 'Fathia Azzahra',
    nickname: 'Fathia',
    gender: 'P',
    birthDate: '2020-03-14',
    parentName: 'Ibu Fitriani',
    parentWhatsapp: '081234567806',
    address: 'Griya Flamboyan No. 15',
    photoUrl: '',
    specialNotes: 'Sangat antusias pada pelajaran menyanyi dan musik ritmis.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_07',
    fullName: 'Gibran Rakha Maulana',
    nickname: 'Gibran',
    gender: 'L',
    birthDate: '2020-09-02',
    parentName: 'Bpk. Irfan Maulana',
    parentWhatsapp: '081234567807',
    address: 'Jl. Teratai Indah No. 3',
    photoUrl: '',
    specialNotes: 'Sangat aktif motorik kasar, menyukai permainan balok bangunan.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_08',
    fullName: 'Hania Syakira',
    nickname: 'Hania',
    gender: 'P',
    birthDate: '2020-07-19',
    parentName: 'Ibu Nabila Kurnia',
    parentWhatsapp: '081234567808',
    address: 'Jl. Kartini Baru No. 102',
    photoUrl: '',
    specialNotes: 'Rajin menabung dan disiplin membawa peralatan tulis sendiri.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_09',
    fullName: 'Ibrahim Hanif Ar-Rasyid',
    nickname: 'Ibrahim',
    gender: 'L',
    birthDate: '2020-01-08',
    parentName: 'Bpk. Faisal Rasyid',
    parentWhatsapp: '081234567809',
    address: 'Jl. Diponegoro Gang 5 No. 7',
    photoUrl: '',
    specialNotes: 'Fokus tinggi dalam menyusun puzzle kompleks 50 keping.',
    createdAt: '2026-07-10'
  },
  {
    id: 'std_10',
    fullName: 'Jasmine Aulia Permata',
    nickname: 'Jasmine',
    gender: 'P',
    birthDate: '2020-12-11',
    parentName: 'Ibu Maya Permata',
    parentWhatsapp: '081234567810',
    address: 'Jl. Sudirman Permai C12',
    photoUrl: '',
    specialNotes: 'Mandiri dan pandai mengungkapkan perasaan dengan sopan.',
    createdAt: '2026-07-10'
  }
];

// Today date string helper YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const initialAttendance: AttendanceRecord[] = [
  // Hari ini
  { id: 'att_101', date: today, studentId: 'std_01', studentName: 'Ahmad Rafka Alfarizi', status: 'Hadir', notes: 'Datang tepat waktu' },
  { id: 'att_102', date: today, studentId: 'std_02', studentName: 'Anindya Kirana Putri', status: 'Hadir' },
  { id: 'att_103', date: today, studentId: 'std_03', studentName: 'Bilal Hafizh Zhafran', status: 'Sakit', notes: 'Demam ringan, orang tua mengabarkan via WA' },
  { id: 'att_104', date: today, studentId: 'std_04', studentName: 'Citra Naura Shakila', status: 'Hadir' },
  { id: 'att_105', date: today, studentId: 'std_05', studentName: 'Daffa Kenzie Arkan', status: 'Hadir' },
  { id: 'att_106', date: today, studentId: 'std_06', studentName: 'Fathia Azzahra', status: 'Hadir' },
  { id: 'att_107', date: today, studentId: 'std_07', studentName: 'Gibran Rakha Maulana', status: 'Hadir' },
  { id: 'att_108', date: today, studentId: 'std_08', studentName: 'Hania Syakira', status: 'Hadir' },
  { id: 'att_109', date: today, studentId: 'std_09', studentName: 'Ibrahim Hanif Ar-Rasyid', status: 'Izin', notes: 'Acara keluarga luar kota' },
  { id: 'att_110', date: today, studentId: 'std_10', studentName: 'Jasmine Aulia Permata', status: 'Hadir' },

  // Kemarin
  { id: 'att_201', date: yesterday, studentId: 'std_01', studentName: 'Ahmad Rafka Alfarizi', status: 'Hadir' },
  { id: 'att_202', date: yesterday, studentId: 'std_02', studentName: 'Anindya Kirana Putri', status: 'Hadir' },
  { id: 'att_203', date: yesterday, studentId: 'std_03', studentName: 'Bilal Hafizh Zhafran', status: 'Hadir' },
  { id: 'att_204', date: yesterday, studentId: 'std_04', studentName: 'Citra Naura Shakila', status: 'Hadir' },
  { id: 'att_205', date: yesterday, studentId: 'std_05', studentName: 'Daffa Kenzie Arkan', status: 'Hadir' },
  { id: 'att_206', date: yesterday, studentId: 'std_06', studentName: 'Fathia Azzahra', status: 'Hadir' },
  { id: 'att_207', date: yesterday, studentId: 'std_07', studentName: 'Gibran Rakha Maulana', status: 'Hadir' },
  { id: 'att_208', date: yesterday, studentId: 'std_08', studentName: 'Hania Syakira', status: 'Hadir' },
  { id: 'att_209', date: yesterday, studentId: 'std_09', studentName: 'Ibrahim Hanif Ar-Rasyid', status: 'Hadir' },
  { id: 'att_210', date: yesterday, studentId: 'std_10', studentName: 'Jasmine Aulia Permata', status: 'Hadir' },

  // 2 hari lalu
  { id: 'att_301', date: twoDaysAgo, studentId: 'std_01', studentName: 'Ahmad Rafka Alfarizi', status: 'Hadir' },
  { id: 'att_302', date: twoDaysAgo, studentId: 'std_02', studentName: 'Anindya Kirana Putri', status: 'Hadir' },
  { id: 'att_303', date: twoDaysAgo, studentId: 'std_03', studentName: 'Bilal Hafizh Zhafran', status: 'Hadir' },
  { id: 'att_304', date: twoDaysAgo, studentId: 'std_04', studentName: 'Citra Naura Shakila', status: 'Hadir' },
  { id: 'att_305', date: twoDaysAgo, studentId: 'std_05', studentName: 'Daffa Kenzie Arkan', status: 'Izin' },
  { id: 'att_306', date: twoDaysAgo, studentId: 'std_06', studentName: 'Fathia Azzahra', status: 'Hadir' },
  { id: 'att_307', date: twoDaysAgo, studentId: 'std_07', studentName: 'Gibran Rakha Maulana', status: 'Hadir' },
  { id: 'att_308', date: twoDaysAgo, studentId: 'std_08', studentName: 'Hania Syakira', status: 'Hadir' },
  { id: 'att_309', date: twoDaysAgo, studentId: 'std_09', studentName: 'Ibrahim Hanif Ar-Rasyid', status: 'Hadir' },
  { id: 'att_310', date: twoDaysAgo, studentId: 'std_10', studentName: 'Jasmine Aulia Permata', status: 'Hadir' }
];

export const initialGrades: GradeRecord[] = [
  {
    id: 'grd_01',
    date: today,
    studentId: 'std_01',
    studentName: 'Ahmad Rafka Alfarizi',
    aspect: 'Seni',
    rating: 'BSB',
    description: 'Mampu menggambar pemandangan alam dengan gradasi warna yang sangat harmonis dan rapi.',
    teacherNote: 'Apresiasi tinggi untuk kerapian memegang pensil warna.'
  },
  {
    id: 'grd_02',
    date: today,
    studentId: 'std_02',
    studentName: 'Anindya Kirana Putri',
    aspect: 'Bahasa',
    rating: 'BSB',
    description: 'Membaca 5 kalimat sederhana dengan artikulasi lancar dan intonasi tepat.',
    teacherNote: 'Kepercayaan diri saat membaca di bangku meningkat pesat.'
  },
  {
    id: 'grd_03',
    date: today,
    studentId: 'std_04',
    studentName: 'Citra Naura Shakila',
    aspect: 'Sosial-Emosional',
    rating: 'BSB',
    description: 'Berbagi bekal dan secara sukarela mengajari temannya merapikan alat permainan.',
    teacherNote: 'Jiwa kepemimpinan dan rasa empati berkembang sangat baik.'
  },
  {
    id: 'grd_04',
    date: yesterday,
    studentId: 'std_05',
    studentName: 'Daffa Kenzie Arkan',
    aspect: 'Kognitif',
    rating: 'BSH',
    description: 'Menghitung benda konkret 1 sampai 20 tanpa terbata-bata dan mengenal bentuk geometri.',
    teacherNote: 'Sudah dapat membedakan persegi, lingkaran, dan segitiga.'
  },
  {
    id: 'grd_05',
    date: yesterday,
    studentId: 'std_07',
    studentName: 'Gibran Rakha Maulana',
    aspect: 'Motorik',
    rating: 'BSB',
    description: 'Melompati rintangan kecil setinggi 15cm dan menyeimbangkan badan di atas papan titian.',
    teacherNote: 'Keterampilan motorik kasar sangat prima.'
  },
  {
    id: 'grd_06',
    date: twoDaysAgo,
    studentId: 'std_09',
    studentName: 'Ibrahim Hanif Ar-Rasyid',
    aspect: 'Kognitif',
    rating: 'BSB',
    description: 'Menyusun puzzle pola hewan 30 keping secara mandiri dalam waktu kurang dari 5 menit.',
    teacherNote: 'Daya konsentrasi dan pemecahan masalah sangat menonjol.'
  }
];

export const initialSavings: ClassSavingTransaction[] = [
  {
    id: 'sav_01',
    date: `${today} 08:30`,
    studentId: 'std_08',
    studentName: 'Hania Syakira',
    type: 'Setoran',
    amount: 20000,
    runningBalance: 20000,
    description: 'Setoran rutin harian'
  },
  {
    id: 'sav_02',
    date: `${today} 08:35`,
    studentId: 'std_01',
    studentName: 'Ahmad Rafka Alfarizi',
    type: 'Setoran',
    amount: 15000,
    runningBalance: 35000,
    description: 'Setoran tabungan minggu ini'
  },
  {
    id: 'sav_03',
    date: `${yesterday} 08:15`,
    studentId: 'std_04',
    studentName: 'Citra Naura Shakila',
    type: 'Setoran',
    amount: 50000,
    runningBalance: 85000,
    description: 'Setoran awal bulan'
  },
  {
    id: 'sav_04',
    date: `${yesterday} 09:00`,
    studentId: 'std_02',
    studentName: 'Anindya Kirana Putri',
    type: 'Setoran',
    amount: 25000,
    runningBalance: 110000,
    description: 'Setoran celengan'
  },
  {
    id: 'sav_05',
    date: `${twoDaysAgo} 10:00`,
    studentId: 'std_08',
    studentName: 'Hania Syakira',
    type: 'Penarikan',
    amount: 10000,
    runningBalance: 100000,
    description: 'Pembelian buku gambar tambahan kelas'
  }
];

export const initialJournals: TeachingJournalEntry[] = [
  {
    id: 'jrn_01',
    date: today,
    topic: 'Tema Alam Semesta: Mengenal Benda-benda Langit',
    activities: '1. Berdoa & bernyanyi "Bintang Kecil". 2. Diskusi interaktif dengan miniatur matahari, bulan, dan bintang. 3. Praktek menggambar & mewarnai langit malam dengan krayon. 4. Refleksi dan penutupan.',
    mediaUsed: 'Proyektor slide gambar planet, miniatur plastik, kertas gambar A4, krayon pastel.',
    reflection: 'Anak-anak sangat antusias saat simulasi ruang angkasa buatan dengan mematikan lampu kelas sebentar. Rafka dan Ibrahim mampu menyebutkan urutan planet dengan lancar.',
    photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'jrn_02',
    date: yesterday,
    topic: 'Tema Tanaman Ciptaan Tuhan: Menanam Biji Kacang Hijau',
    activities: '1. Pengenalan bagian tanaman (akar, batang, daun). 2. Praktek langsung memasukkan kapas basah & biji kacang hijau ke pot plastik transparan. 3. Menulis label nama siswa di pot.',
    mediaUsed: 'Kapas, pot transparan kecil, biji kacang hijau, spidol, botol semprot air.',
    reflection: 'Anak-anak belajar sabar dan menyayangi makhluk hidup. Setiap anak berkomitmen menyiram tanaman mereka setiap pagi sebelum masuk kelas.',
    photoUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=80'
  }
];

export const initialFeedback: FeedbackEntry[] = [];
