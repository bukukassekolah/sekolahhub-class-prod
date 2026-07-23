import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { 
  TeacherProfile, 
  Student, 
  AttendanceRecord, 
  TeacherNote, 
  Announcement,
  AnnouncementStatus, 
  FeedbackMessage,
  SavingsTransaction,
  ImplementationRequest
} from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Initialize Firestore with specific databaseId
export const db = firebaseConfigJson.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
};

export {
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  collection
};

// Initial Sample Data for Demo Mode
export const SAMPLE_TEACHER_PROFILE: TeacherProfile = {
  teacherName: 'Siti Nurhaliza, S.Pd.',
  schoolName: 'SD Negeri 01 Merdeka',
  className: 'Kelas 4-A',
  academicYear: '2025/2026',
  semester: 'Ganjil (1)',
  phone: '081234567890',
};

export const SAMPLE_STUDENTS: Student[] = [
  {
    id: 'std_01',
    nis: '20250101',
    name: 'Ahmad Faiz Pratama',
    gender: 'L',
    birthDate: '2015-05-12',
    parentName: 'Budi Pratama',
    parentWhatsapp: '6281234567891',
    address: 'Jl. Pemuda No. 12, Kel. Merdeka',
    isActive: true,
  },
  {
    id: 'std_02',
    nis: '20250102',
    name: 'Aisyah Putri Azzahra',
    gender: 'P',
    birthDate: '2015-08-20',
    parentName: 'Hendra Setiawan',
    parentWhatsapp: '6281234567892',
    address: 'Jl. Melati IV No. 5',
    isActive: true,
  },
  {
    id: 'std_03',
    nis: '20250103',
    name: 'Bagas Aditya Nugraha',
    gender: 'L',
    birthDate: '2015-03-04',
    parentName: 'Agus Nugraha',
    parentWhatsapp: '6281234567893',
    address: 'Griya Asri Blok C-8',
    isActive: true,
  },
  {
    id: 'std_04',
    nis: '20250104',
    name: 'Cantika Dewi Lestari',
    gender: 'P',
    birthDate: '2015-11-15',
    parentName: 'Dedi Lestari',
    parentWhatsapp: '6281234567894',
    address: 'Jl. Mawar Indah No. 22',
    isActive: true,
  },
  {
    id: 'std_05',
    nis: '20250105',
    name: 'Daffa Rizky Ramadhan',
    gender: 'L',
    birthDate: '2015-06-18',
    parentName: 'Eko Ramadhan',
    parentWhatsapp: '6281234567895',
    address: 'Jl. Flamboyan No. 3',
    isActive: true,
  },
  {
    id: 'std_06',
    nis: '20250106',
    name: 'Eunike Grace Wibowo',
    gender: 'P',
    birthDate: '2015-01-29',
    parentName: 'Daniel Wibowo',
    parentWhatsapp: '6281234567896',
    address: 'Jl. Merpati No. 17',
    isActive: true,
  },
  {
    id: 'std_07',
    nis: '20250107',
    name: 'Farhan Kenzie Maulana',
    gender: 'L',
    birthDate: '2015-09-08',
    parentName: 'Irfan Maulana',
    parentWhatsapp: '6281234567897',
    address: 'Jl. Kenanga Gg. 2 No. 9',
    isActive: true,
  },
  {
    id: 'std_08',
    nis: '20250108',
    name: 'Gisella Amanda Putri',
    gender: 'P',
    birthDate: '2015-04-14',
    parentName: 'Rahmat Hidayat',
    parentWhatsapp: '6281234567898',
    address: 'Perumahan Harmony B-12',
    isActive: true,
  }
];

export const SAMPLE_NOTES: TeacherNote[] = [
  {
    id: 'note_01',
    date: new Date().toISOString().split('T')[0],
    title: 'Pelaksanaan Pembelajaran Tematik Subtema 1',
    content: 'Siswa sangat antusias melakukan diskusi kelompok tentang keanekaragaman budaya. Bagas dan Daffa memimpin jalannya presentasi dengan percaya diri.',
    category: 'Jurnal Harian',
  },
  {
    id: 'note_02',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    title: 'Catatan Perkembangan Matematika - Pecahan',
    content: 'Perlu bimbingan tambahan untuk materi penyederhanaan pecahan bagi beberapa siswa. Rencana remedial singkat akan diadakan besok sebelum jam istirahat.',
    category: 'Perkembangan Siswa',
  }
];

export const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Persiapan Kegiatan Outing Class Minggu Depan',
    content: 'Yth. Bapak/Ibu Orang Tua Siswa. Diberitahukan bahwa pada hari Kamis mendatang kelas kita akan mengadakan Outing Class ke Museum Daerah. Harap membawakan bekal sehat dan botol minum.',
    date: new Date().toISOString().split('T')[0],
    status: 'Publikasikan',
  },
  {
    id: 'ann_02',
    title: 'Pengumpulan Tugas Proyek Daur Ulang Plastik',
    content: 'Pengumpulan kerajinan bahan daur ulang paling lambat hari Jumat tanggal 25. Mohon dukungan Bapak/Ibu dalam membimbing ananda di rumah.',
    date: new Date().toISOString().split('T')[0],
    status: 'Draft',
  }
];

// Firestore Helpers

export async function fetchTeacherProfile(userId: string): Promise<TeacherProfile | null> {
  try {
    const docRef = doc(db, 'TeacherProfile', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TeacherProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching teacher profile:', err);
    return null;
  }
}

export async function saveTeacherProfile(userId: string, profile: TeacherProfile): Promise<boolean> {
  try {
    const docRef = doc(db, 'TeacherProfile', userId);
    await setDoc(docRef, {
      ...profile,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving teacher profile:', err);
    return false;
  }
}

export async function fetchStudents(userId: string): Promise<Student[]> {
  try {
    const q = query(collection(db, 'Students'), where('teacherId', '==', userId));
    const snapshot = await getDocs(q);
    const list: Student[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Student);
    });
    return list;
  } catch (err) {
    console.error('Error fetching students:', err);
    return [];
  }
}

export async function addStudent(userId: string, student: Omit<Student, 'id'>): Promise<string | null> {
  try {
    const colRef = collection(db, 'Students');
    const docRef = await addDoc(colRef, {
      ...student,
      teacherId: userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error adding student:', err);
    return null;
  }
}

export async function updateStudent(studentId: string, data: Partial<Student>): Promise<boolean> {
  try {
    const docRef = doc(db, 'Students', studentId);
    await updateDoc(docRef, data);
    return true;
  } catch (err) {
    console.error('Error updating student:', err);
    return false;
  }
}

export async function deleteStudent(studentId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'Students', studentId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting student:', err);
    return false;
  }
}

export async function fetchAttendanceByDate(userId: string, dateStr: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(
      collection(db, 'Attendance'), 
      where('teacherId', '==', userId),
      where('date', '==', dateStr)
    );
    const snapshot = await getDocs(q);
    const list: AttendanceRecord[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as AttendanceRecord);
    });
    return list;
  } catch (err) {
    console.error('Error fetching attendance:', err);
    return [];
  }
}

export async function saveAttendanceBatch(userId: string, records: AttendanceRecord[]): Promise<boolean> {
  try {
    for (const rec of records) {
      const docId = `${userId}_${rec.date}_${rec.studentId}`;
      const docRef = doc(db, 'Attendance', docId);
      await setDoc(docRef, {
        ...rec,
        teacherId: userId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    return true;
  } catch (err) {
    console.error('Error saving attendance batch:', err);
    return false;
  }
}

export async function fetchAllAttendance(userId: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(collection(db, 'Attendance'), where('teacherId', '==', userId));
    const snapshot = await getDocs(q);
    const list: AttendanceRecord[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as AttendanceRecord);
    });
    return list;
  } catch (err) {
    console.error('Error fetching all attendance:', err);
    return [];
  }
}

export async function fetchTeacherNotes(userId: string): Promise<TeacherNote[]> {
  try {
    const q = query(collection(db, 'Notes'), where('teacherId', '==', userId));
    const snapshot = await getDocs(q);
    const list: TeacherNote[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as TeacherNote);
    });
    return list.sort((a, b) => b.date.localeCompare(a.date));
  } catch (err) {
    console.error('Error fetching notes:', err);
    return [];
  }
}

export async function addTeacherNote(userId: string, note: Omit<TeacherNote, 'id'>): Promise<string | null> {
  try {
    const colRef = collection(db, 'Notes');
    const docRef = await addDoc(colRef, {
      ...note,
      teacherId: userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error adding note:', err);
    return null;
  }
}

export async function deleteTeacherNote(noteId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'Notes', noteId));
    return true;
  } catch (err) {
    console.error('Error deleting note:', err);
    return false;
  }
}

export async function fetchAnnouncements(userId: string): Promise<Announcement[]> {
  try {
    const q = query(collection(db, 'Announcements'), where('teacherId', '==', userId));
    const snapshot = await getDocs(q);
    const list: Announcement[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Announcement);
    });
    return list.sort((a, b) => b.date.localeCompare(a.date));
  } catch (err) {
    console.error('Error fetching announcements:', err);
    return [];
  }
}

export async function addAnnouncement(userId: string, announcement: Omit<Announcement, 'id'>): Promise<string | null> {
  try {
    const colRef = collection(db, 'Announcements');
    const docRef = await addDoc(colRef, {
      ...announcement,
      teacherId: userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error adding announcement:', err);
    return null;
  }
}

export async function updateAnnouncementStatus(announcementId: string, status: AnnouncementStatus): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'Announcements', announcementId), { status });
    return true;
  } catch (err) {
    console.error('Error updating announcement:', err);
    return false;
  }
}

export async function deleteAnnouncement(announcementId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'Announcements', announcementId));
    return true;
  } catch (err) {
    console.error('Error deleting announcement:', err);
    return false;
  }
}

export async function sendUserFeedback(feedback: Omit<FeedbackMessage, 'createdAt'>): Promise<boolean> {
  try {
    const colRef = collection(db, 'Feedback');
    await addDoc(colRef, {
      ...feedback,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Error submitting feedback:', err);
    return false;
  }
}

export const saveFeedbackMessage = sendUserFeedback;

export async function fetchSavingsTransactions(userId: string): Promise<SavingsTransaction[]> {
  try {
    const q = query(collection(db, 'Savings'), where('teacherId', '==', userId));
    const snapshot = await getDocs(q);
    const list: SavingsTransaction[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as SavingsTransaction);
    });
    return list.sort((a, b) => b.date.localeCompare(a.date));
  } catch (err) {
    console.error('Error fetching savings transactions:', err);
    return [];
  }
}

export async function addSavingsTransaction(userId: string, tx: Omit<SavingsTransaction, 'id'>): Promise<string | null> {
  try {
    const colRef = collection(db, 'Savings');
    const docRef = await addDoc(colRef, {
      ...tx,
      teacherId: userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error adding savings transaction:', err);
    return null;
  }
}

export async function deleteSavingsTransaction(txId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'Savings', txId));
    return true;
  } catch (err) {
    console.error('Error deleting savings transaction:', err);
    return false;
  }
}

export async function saveImplementationRequest(reqData: {
  schoolName: string;
  contactName: string;
  email: string;
  whatsapp: string;
  city: string;
  educationLevel: string;
  teacherCount: number;
  studentCount: number;
  notes?: string;
  plan: 'SekolahHub Class Basic' | 'SekolahHub Class Pro' | 'Basic Free' | 'Pro';
}): Promise<{ id: string; status: 'Active' | 'Pending'; plan: string; authProvisioning: 'Queued' | 'PendingAdmin' }> {
  try {
    const colRef = collection(db, 'ImplementationRequests');
    const requestId = `REQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isBasic = reqData.plan === 'SekolahHub Class Basic' || reqData.plan === 'Basic Free';

    // Automatic status based on selected plan:
    // SekolahHub Class Basic -> Active (automatically activated)
    // SekolahHub Class Pro -> Pending (requires admin verification of payment)
    const status: 'Active' | 'Pending' = isBasic ? 'Active' : 'Pending';
    const authProvisioning: 'Queued' | 'PendingAdmin' = isBasic ? 'Queued' : 'PendingAdmin';

    const docRef = await addDoc(colRef, {
      ...reqData,
      requestId,
      status,
      authProvisioning,
      backendWorkerService: 'Firebase Admin SDK / Cloud Functions',
      submittedAt: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      status,
      plan: reqData.plan,
      authProvisioning,
    };
  } catch (err) {
    console.error('Error saving implementation request:', err);
    throw err;
  }
}

export async function getLatestImplementationRequestByEmail(email: string): Promise<ImplementationRequest | null> {
  if (!email || !email.trim()) return null;
  try {
    const colRef = collection(db, 'ImplementationRequests');
    const q = query(colRef, where('email', '==', email.trim().toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docs = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ImplementationRequest, 'id'>),
    }));

    docs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return docs[0] || null;
  } catch (err) {
    console.error('Error fetching latest implementation request by email:', err);
    return null;
  }
}

export async function fetchAllImplementationRequests(): Promise<ImplementationRequest[]> {
  try {
    const headers: Record<string, string> = {};
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/developer/implementation-requests', { headers });
    if (!res.ok) {
      throw new Error(`Backend API returned HTTP status ${res.status}`);
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const docs = json.data as ImplementationRequest[];
      docs.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
      return docs;
    }
    return [];
  } catch (err) {
    console.error('Error fetching implementation requests via backend API:', err);
    return [];
  }
}




