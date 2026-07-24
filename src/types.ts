/**
 * SekolahHub Class Basic Edition - Data Models
 */

export type EducationLevel = 'PAUD' | 'TK' | 'RA' | 'MI' | 'SD';

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accessToken?: string;
}

export interface ClassInfo {
  id: string;
  schoolName: string;
  className: string;
  level: EducationLevel;
  teacherName: string;
  teacherNip?: string;
  teacherEmail: string;
  academicYear: string;
  studentCount: number;
  schoolLogo?: string;
  googleSheetId?: string;
  googleSheetName?: string;
  googleSheetConnected: boolean;
  lastSyncedAt?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  nickname: string;
  gender: 'L' | 'P';
  birthDate: string; // YYYY-MM-DD
  parentName: string;
  parentWhatsapp: string;
  address: string;
  photoUrl?: string;
  specialNotes?: string; // Alergi, Kebutuhan khusus, Catatan khusus
  createdAt: string;
}

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  notes?: string;
}

export type AssessmentAspect = 'Kognitif' | 'Motorik' | 'Bahasa' | 'Sosial-Emosional' | 'Seni';

// BSB: Berkembang Sangat Baik, BSH: Berkembang Sesuai Harapan, MB: Mulai Berkembang, BB: Belum Berkembang
export type DevelopmentalRating = 'BSB' | 'BSH' | 'MB' | 'BB';

export interface GradeRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  aspect: AssessmentAspect;
  rating: DevelopmentalRating;
  description: string;
  teacherNote?: string;
}

export type SavingTransactionType = 'Setoran' | 'Penarikan';

export interface ClassSavingTransaction {
  id: string;
  date: string; // YYYY-MM-DD HH:mm
  studentId: string;
  studentName: string;
  type: SavingTransactionType;
  amount: number;
  runningBalance: number;
  description: string;
}

export interface TeachingJournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  activities: string;
  mediaUsed: string;
  reflection: string;
  photoUrl?: string;
}

export type FeedbackType = 'Saran' | 'Bug' | 'Pertanyaan' | 'Fitur';

export interface FeedbackEntry {
  id: string;
  date: string;
  type: FeedbackType;
  message: string;
  email: string;
  status: 'Terkirim' | 'Diproses';
}

export interface SyncQueueItem {
  id: string;
  timestamp: string;
  table: 'StudentProfile' | 'Attendance' | 'Grades' | 'ClassSavings' | 'TeachingJournal' | 'ClassInfo' | 'Feedback';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
}

export interface AksaAiRequest {
  mode: 'narrative' | 'journal' | 'activity';
  studentName?: string;
  aspect?: AssessmentAspect;
  observations?: string;
  topic?: string;
  learningGoal?: string;
  ageGroup?: string;
  media?: string;
}

export interface AksaAiResponse {
  success: boolean;
  result: string;
  error?: string;
}
