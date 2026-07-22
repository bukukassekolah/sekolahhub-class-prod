import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  auth, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  fetchTeacherProfile,
  saveTeacherProfile,
  fetchStudents,
  addStudent as cloudAddStudent,
  updateStudent as cloudUpdateStudent,
  deleteStudent as cloudDeleteStudent,
  fetchAllAttendance,
  saveAttendanceBatch as cloudSaveAttendanceBatch,
  fetchTeacherNotes,
  addTeacherNote as cloudAddNote,
  deleteTeacherNote as cloudDeleteNote,
  fetchAnnouncements,
  addAnnouncement as cloudAddAnnouncement,
  updateAnnouncementStatus as cloudUpdateAnnouncementStatus,
  deleteAnnouncement as cloudDeleteAnnouncement,
  saveFeedbackMessage as cloudSaveFeedback,
  fetchSavingsTransactions,
  addSavingsTransaction as cloudAddSavingsTransaction,
  deleteSavingsTransaction as cloudDeleteSavingsTransaction
} from '../lib/firebase';

import { 
  TeacherProfile, 
  Student, 
  AttendanceRecord, 
  TeacherNote, 
  Announcement, 
  FeedbackItem,
  AppUser,
  SavingsTransaction
} from '../types';

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  teacherName: '',
  schoolName: '',
  className: '',
  academicYear: '2025/2026',
  semester: 'Ganjil',
  schoolLogo: ''
};

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  teacherProfile: TeacherProfile;
  students: Student[];
  attendance: AttendanceRecord[];
  notes: TeacherNote[];
  announcements: Announcement[];
  savingsTransactions: SavingsTransaction[];
  
  // Auth operations
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, teacherName?: string, schoolName?: string, className?: string) => Promise<void>;
  logout: () => Promise<void>;

  // Data operations
  updateProfile: (profile: Partial<TeacherProfile>) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  importStudentsBatch: (studentsList: Omit<Student, 'id'>[]) => Promise<number>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  saveAttendanceBatch: (records: Omit<AttendanceRecord, 'id'>[]) => Promise<void>;
  addNote: (note: Omit<TeacherNote, 'id'>) => Promise<void>;
  updateNote: (id: string, note: Partial<TeacherNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addSavingsTransaction: (tx: Omit<SavingsTransaction, 'id'>) => Promise<void>;
  deleteSavingsTransaction: (id: string) => Promise<void>;
  submitFeedback: (feedback: FeedbackItem) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(DEFAULT_TEACHER_PROFILE);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Guru Kelas',
        });
        await loadCloudData(user.uid);
      } else {
        setCurrentUser(null);
        setTeacherProfile(DEFAULT_TEACHER_PROFILE);
        setStudents([]);
        setAttendance([]);
        setNotes([]);
        setAnnouncements([]);
        setSavingsTransactions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadCloudData = async (userId: string) => {
    try {
      const prof = await fetchTeacherProfile(userId);
      if (prof) {
        setTeacherProfile(prof);
      } else {
        setTeacherProfile({
          teacherName: 'Guru Kelas',
          schoolName: 'SD Negeri',
          className: 'Kelas 1-A',
          academicYear: '2025/2026',
          semester: 'Ganjil',
        });
      }

      const stds = await fetchStudents(userId);
      setStudents(stds);

      const att = await fetchAllAttendance(userId);
      setAttendance(att);

      const nts = await fetchTeacherNotes(userId);
      setNotes(nts);

      const anns = await fetchAnnouncements(userId);
      setAnnouncements(anns);

      const savs = await fetchSavingsTransactions(userId);
      setSavingsTransactions(savs);
    } catch (err) {
      console.error('Error loading Firestore data:', err);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (
    email: string, 
    pass: string, 
    teacherName?: string, 
    schoolName?: string, 
    className?: string
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      const newProf: TeacherProfile = {
        teacherName: teacherName || cred.user.displayName || 'Guru Kelas',
        schoolName: schoolName || 'SD Negeri',
        className: className || 'Kelas 1-A',
        academicYear: '2025/2026',
        semester: 'Ganjil',
      };
      await saveTeacherProfile(cred.user.uid, newProf);
      setTeacherProfile(newProf);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setTeacherProfile(DEFAULT_TEACHER_PROFILE);
    setStudents([]);
    setAttendance([]);
    setNotes([]);
    setAnnouncements([]);
    setSavingsTransactions([]);
  };

  const updateProfile = async (updatedProf: Partial<TeacherProfile>) => {
    const newProfile = { ...teacherProfile, ...updatedProf };
    setTeacherProfile(newProfile);
    if (currentUser) {
      await saveTeacherProfile(currentUser.uid, newProfile);
    }
  };

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const tempId = `s_${Date.now()}`;
    const newStudent = { ...studentData, id: tempId };
    setStudents(prev => [...prev, newStudent]);

    if (currentUser) {
      const cloudId = await cloudAddStudent(currentUser.uid, studentData);
      if (cloudId) {
        setStudents(prev => prev.map(s => s.id === tempId ? { ...s, id: cloudId } : s));
      }
    }
  };

  const importStudentsBatch = async (studentsList: Omit<Student, 'id'>[]): Promise<number> => {
    let successCount = 0;
    const createdStudents: Student[] = [];

    for (let i = 0; i < studentsList.length; i++) {
      const studentData = studentsList[i];
      const tempId = `s_${Date.now()}_${i}`;
      let finalId = tempId;

      if (currentUser) {
        const cloudId = await cloudAddStudent(currentUser.uid, studentData);
        if (cloudId) {
          finalId = cloudId;
        }
      }

      createdStudents.push({ ...studentData, id: finalId });
      successCount++;
    }

    setStudents(prev => [...prev, ...createdStudents]);
    return successCount;
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    if (currentUser) {
      await cloudUpdateStudent(id, data);
    }
  };

  const deleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (currentUser) {
      await cloudDeleteStudent(id);
    }
  };

  const saveAttendanceBatch = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `att_${Date.now()}_${i}`
    }));

    setAttendance(prev => {
      const datesToReplace = new Set(records.map(r => r.date));
      const filtered = prev.filter(r => !datesToReplace.has(r.date));
      return [...filtered, ...newRecords];
    });

    if (currentUser) {
      await cloudSaveAttendanceBatch(currentUser.uid, newRecords);
    }
  };

  const addNote = async (noteData: Omit<TeacherNote, 'id'>) => {
    const tempId = `note_${Date.now()}`;
    const newNote = { ...noteData, id: tempId };
    setNotes(prev => [newNote, ...prev]);

    if (currentUser) {
      const cloudId = await cloudAddNote(currentUser.uid, noteData);
      if (cloudId) {
        setNotes(prev => prev.map(n => n.id === tempId ? { ...n, id: cloudId } : n));
      }
    }
  };

  const updateNote = async (id: string, noteData: Partial<TeacherNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...noteData } : n));
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (currentUser) {
      await cloudDeleteNote(id);
    }
  };

  const addAnnouncement = async (annData: Omit<Announcement, 'id'>) => {
    const tempId = `ann_${Date.now()}`;
    const newAnn = { ...annData, id: tempId };
    setAnnouncements(prev => [newAnn, ...prev]);

    if (currentUser) {
      const cloudId = await cloudAddAnnouncement(currentUser.uid, annData);
      if (cloudId) {
        setAnnouncements(prev => prev.map(a => a.id === tempId ? { ...a, id: cloudId } : a));
      }
    }
  };

  const updateAnnouncement = async (id: string, annData: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...annData } : a));
    if (currentUser && annData.status) {
      await cloudUpdateAnnouncementStatus(id, annData.status);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (currentUser) {
      await cloudDeleteAnnouncement(id);
    }
  };

  const addSavingsTransaction = async (txData: Omit<SavingsTransaction, 'id'>) => {
    const tempId = `sav_${Date.now()}`;
    const newTx = { ...txData, id: tempId };
    setSavingsTransactions(prev => [newTx, ...prev]);

    if (currentUser) {
      const cloudId = await cloudAddSavingsTransaction(currentUser.uid, txData);
      if (cloudId) {
        setSavingsTransactions(prev => prev.map(s => s.id === tempId ? { ...s, id: cloudId } : s));
      }
    }
  };

  const deleteSavingsTransaction = async (id: string) => {
    setSavingsTransactions(prev => prev.filter(s => s.id !== id));
    if (currentUser) {
      await cloudDeleteSavingsTransaction(id);
    }
  };

  const submitFeedback = async (feedback: FeedbackItem) => {
    if (currentUser) {
      await cloudSaveFeedback({
        type: feedback.type,
        content: feedback.message,
        userEmail: feedback.userEmail,
        userName: currentUser.displayName || undefined
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      teacherProfile,
      students,
      attendance,
      notes,
      announcements,
      savingsTransactions,
      loginWithEmail,
      registerWithEmail,
      logout,
      updateProfile,
      addStudent,
      importStudentsBatch,
      updateStudent,
      deleteStudent,
      saveAttendanceBatch,
      addNote,
      updateNote,
      deleteNote,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addSavingsTransaction,
      deleteSavingsTransaction,
      submitFeedback
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
