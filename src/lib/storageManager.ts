import {
  ClassInfo,
  StudentProfile,
  AttendanceRecord,
  GradeRecord,
  ClassSavingTransaction,
  TeachingJournalEntry,
  FeedbackEntry,
  SyncQueueItem
} from '../types';
import {
  initialClassInfo,
  initialStudents,
  initialAttendance,
  initialGrades,
  initialSavings,
  initialJournals,
  initialFeedback
} from '../data/initialData';

const STORAGE_KEYS = {
  CLASS_INFO: 'sekolahhub_class_info',
  STUDENTS: 'sekolahhub_students',
  ATTENDANCE: 'sekolahhub_attendance',
  GRADES: 'sekolahhub_grades',
  SAVINGS: 'sekolahhub_savings',
  JOURNALS: 'sekolahhub_journals',
  FEEDBACK: 'sekolahhub_feedback',
  SYNC_QUEUE: 'sekolahhub_sync_queue',
  IS_LOGGED_IN: 'sekolahhub_is_logged_in',
};

// Helper event dispatcher
export const notifyDataChanged = () => {
  window.dispatchEvent(new CustomEvent('sekolahhub_data_changed'));
};

export const getStoredClassInfo = (): ClassInfo => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASS_INFO);
    return raw ? JSON.parse(raw) : initialClassInfo;
  } catch {
    return initialClassInfo;
  }
};

export const saveClassInfo = (info: ClassInfo) => {
  localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(info));
  addToSyncQueue('ClassInfo', 'UPDATE', info);
  notifyDataChanged();
};

export const getStoredStudents = (): StudentProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : initialStudents;
  } catch {
    return initialStudents;
  }
};

export const saveStudent = (student: StudentProfile) => {
  const students = getStoredStudents();
  const existingIdx = students.findIndex(s => s.id === student.id);
  if (existingIdx >= 0) {
    students[existingIdx] = student;
    addToSyncQueue('StudentProfile', 'UPDATE', student);
  } else {
    students.unshift(student);
    addToSyncQueue('StudentProfile', 'CREATE', student);
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

  // Update student count in ClassInfo
  const info = getStoredClassInfo();
  info.studentCount = students.length;
  localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(info));

  notifyDataChanged();
};

export const deleteStudent = (studentId: string) => {
  const students = getStoredStudents().filter(s => s.id !== studentId);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  addToSyncQueue('StudentProfile', 'DELETE', { id: studentId });

  const info = getStoredClassInfo();
  info.studentCount = students.length;
  localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(info));

  notifyDataChanged();
};

export const getStoredAttendance = (): AttendanceRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : initialAttendance;
  } catch {
    return initialAttendance;
  }
};

export const saveAttendanceBatch = (records: AttendanceRecord[]) => {
  const attendance = getStoredAttendance();
  records.forEach(rec => {
    const idx = attendance.findIndex(a => a.date === rec.date && a.studentId === rec.studentId);
    if (idx >= 0) {
      attendance[idx] = rec;
    } else {
      attendance.unshift(rec);
    }
  });
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  addToSyncQueue('Attendance', 'UPDATE', records);
  notifyDataChanged();
};

export const getStoredGrades = (): GradeRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GRADES);
    return raw ? JSON.parse(raw) : initialGrades;
  } catch {
    return initialGrades;
  }
};

export const saveGrade = (grade: GradeRecord) => {
  const grades = getStoredGrades();
  const idx = grades.findIndex(g => g.id === grade.id);
  if (idx >= 0) {
    grades[idx] = grade;
    addToSyncQueue('Grades', 'UPDATE', grade);
  } else {
    grades.unshift(grade);
    addToSyncQueue('Grades', 'CREATE', grade);
  }
  localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  notifyDataChanged();
};

export const getStoredSavings = (): ClassSavingTransaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    return raw ? JSON.parse(raw) : initialSavings;
  } catch {
    return initialSavings;
  }
};

export const addSavingTransaction = (transaction: Omit<ClassSavingTransaction, 'id' | 'runningBalance'>): ClassSavingTransaction => {
  const savings = getStoredSavings();
  const lastBalance = savings.length > 0 ? savings[0].runningBalance : 0;
  const newBalance = transaction.type === 'Setoran'
    ? lastBalance + transaction.amount
    : Math.max(0, lastBalance - transaction.amount);

  const newTrans: ClassSavingTransaction = {
    ...transaction,
    id: `sav_${Date.now()}`,
    runningBalance: newBalance
  };

  savings.unshift(newTrans);
  localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savings));
  addToSyncQueue('ClassSavings', 'CREATE', newTrans);
  notifyDataChanged();
  return newTrans;
};

export const getStoredJournals = (): TeachingJournalEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return raw ? JSON.parse(raw) : initialJournals;
  } catch {
    return initialJournals;
  }
};

export const saveJournalEntry = (journal: TeachingJournalEntry) => {
  const journals = getStoredJournals();
  const idx = journals.findIndex(j => j.id === journal.id);
  if (idx >= 0) {
    journals[idx] = journal;
    addToSyncQueue('TeachingJournal', 'UPDATE', journal);
  } else {
    journals.unshift(journal);
    addToSyncQueue('TeachingJournal', 'CREATE', journal);
  }
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  notifyDataChanged();
};

export const getStoredFeedback = (): FeedbackEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    return raw ? JSON.parse(raw) : initialFeedback;
  } catch {
    return initialFeedback;
  }
};

export const saveFeedback = (feedback: Omit<FeedbackEntry, 'id' | 'date' | 'status'>) => {
  const list = getStoredFeedback();
  const entry: FeedbackEntry = {
    ...feedback,
    id: `fb_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Terkirim'
  };
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
  addToSyncQueue('Feedback', 'CREATE', entry);
  notifyDataChanged();
  return entry;
};

export const getSyncQueue = (): SyncQueueItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addToSyncQueue = (
  table: SyncQueueItem['table'],
  action: SyncQueueItem['action'],
  data: any
) => {
  const queue = getSyncQueue();
  queue.push({
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    table,
    action,
    data
  });
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
};

export const clearSyncQueue = () => {
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
  notifyDataChanged();
};

export const resetAllDataToDefault = () => {
  localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(initialClassInfo));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));
  localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(initialGrades));
  localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(initialSavings));
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(initialJournals));
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(initialFeedback));
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
  notifyDataChanged();
};

export const getLoginState = (): boolean => {
  const val = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
  return val === null ? true : val === 'true'; // Default logged in for smooth demo experience
};

export const setLoginState = (loggedIn: boolean) => {
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, loggedIn ? 'true' : 'false');
  notifyDataChanged();
};
