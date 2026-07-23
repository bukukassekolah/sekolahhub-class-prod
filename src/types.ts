export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';

export type NoteCategory = 'Jurnal Harian' | 'Perkembangan Siswa' | 'Pelanggaran' | 'Prestasi' | 'Catatan Khusus';

export type AnnouncementStatus = 'Draft' | 'Publikasikan' | 'Terkirim';

export type FeedbackType = 'Saran' | 'Bug' | 'Pertanyaan' | 'Permintaan Fitur';

export interface TeacherProfile {
  id?: string;
  userId?: string;
  teacherName: string;
  schoolName: string;
  className: string;
  academicYear: string;
  semester: string;
  schoolLogo?: string;
  phone?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  birthDate: string;
  parentName: string;
  parentWhatsapp: string;
  address: string;
  isActive: boolean;
  teacherId?: string;
  createdAt?: string;
}

export interface AttendanceRecord {
  id?: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  notes?: string;
  teacherId?: string;
  updatedAt?: string;
}

export type Gender = 'L' | 'P';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isDemo?: boolean;
}

export type NoteItem = TeacherNote;
export type AnnouncementItem = Announcement;

export interface FeedbackItem {
  id?: string;
  userId?: string;
  userEmail: string;
  type: FeedbackType;
  message: string;
  createdAt: string;
}

export interface TeacherNote {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  category: NoteCategory;
  teacherId?: string;
  createdAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  status: AnnouncementStatus;
  teacherId?: string;
  createdAt?: string;
}

export interface FeedbackMessage {
  id?: string;
  type: FeedbackType;
  content: string;
  userEmail: string;
  userName?: string;
  createdAt: string;
}

export interface ClassSummaryStats {
  totalStudents: number;
  activeStudents: number;
  todayAttendancePercent: number;
  presentCount: number;
  permissionCount: number;
  sickCount: number;
  alphaCount: number;
  unrecordedCount: number;
  totalNotes: number;
  publishedAnnouncements: number;
}

export type SavingsTransactionType = 'deposit' | 'withdrawal';

export interface SavingsTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: SavingsTransactionType;
  amount: number;
  notes?: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  createdAt?: string;
}

export interface StudentSavingsSummary {
  student: Student;
  studentId: string;
  studentName: string;
  nis?: string;
  balance: number;
  currentBalance: number;
  totalDeposit: number;
  totalWithdrawal: number;
  transactionCount: number;
  lastTransactionDate?: string;
}

export interface ImplementationRequest {
  id?: string;
  requestId?: string;
  schoolName: string;
  contactName: string;
  email: string;
  whatsapp: string;
  city: string;
  educationLevel: string;
  teacherCount: number;
  studentCount: number;
  notes?: string;
  plan: 'SekolahHub Class Basic' | 'SekolahHub Class Pro' | 'Basic Free' | 'Pro' | string;
  authProvisioning?: 'Queued' | 'Processing' | 'Completed' | 'Failed' | 'PendingAdmin' | string;
  status: 'Active' | 'Pending' | 'Approved' | 'Failed' | 'Completed' | 'Rejected' | string;
  submittedAt: string;
  backendWorkerService?: string;
}


