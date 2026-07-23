import { getDb } from '../firebaseAdmin';
import { logger } from './LoggerService';

export interface ImplementationRequestDoc {
  id: string;
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
  plan: string;
  status: 'Active' | 'Pending' | 'Approved' | 'Rejected';
  authProvisioning: 'Queued' | 'Processing' | 'Completed' | 'Failed' | 'PendingAdmin';
  firebaseUid?: string;
  errorCode?: string;
  errorMessage?: string;
  submittedAt: string;
  provisionedAt?: string;
  failedAt?: string;
  updatedAt?: string;
}

export class FirestoreService {
  /**
   * Fetches all implementation requests using Firebase Admin SDK for Developer Dashboard.
   */
  public static async getAllRequests(): Promise<ImplementationRequestDoc[]> {
    try {
      const db = getDb();
      const snap = await db.collection('ImplementationRequests').get();

      return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ImplementationRequestDoc, 'id'>),
      }));
    } catch (err: any) {
      logger.warn('FirestoreAdmin', `getAllRequests permission check: ${err.message}`);
      return [];
    }
  }

  /**
   * Fetches queued requests with status == "Active" and authProvisioning == "Queued"
   */
  public static async getQueuedRequests(): Promise<ImplementationRequestDoc[]> {
    try {
      const db = getDb();
      const snap = await db
        .collection('ImplementationRequests')
        .where('status', '==', 'Active')
        .where('authProvisioning', '==', 'Queued')
        .get();

      return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ImplementationRequestDoc, 'id'>),
      }));
    } catch (err: any) {
      if (err.message && err.message.includes('PERMISSION_DENIED')) {
        logger.info('FirestoreAdmin', 'Server Admin SDK permissions limited in preview container mode.');
      } else {
        logger.warn('FirestoreAdmin', `getQueuedRequests warning: ${err.message}`);
      }
      return [];
    }
  }

  /**
   * Fetches failed requests with authProvisioning == "Failed"
   */
  public static async getFailedRequests(): Promise<ImplementationRequestDoc[]> {
    try {
      const db = getDb();
      const snap = await db
        .collection('ImplementationRequests')
        .where('authProvisioning', '==', 'Failed')
        .get();

      return snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ImplementationRequestDoc, 'id'>),
      }));
    } catch (err: any) {
      logger.warn('FirestoreAdmin', `getFailedRequests warning: ${err.message}`);
      return [];
    }
  }

  /**
   * Updates an ImplementationRequests document.
   */
  public static async updateRequest(docId: string, data: Partial<ImplementationRequestDoc>): Promise<void> {
    const db = getDb();
    await db.collection('ImplementationRequests').doc(docId).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Creates initial TeacherProfile document in Firestore.
   */
  public static async createTeacherProfile(data: {
    firebaseUid: string;
    teacherName: string;
    schoolName: string;
    email: string;
    plan: string;
    requestId?: string;
  }): Promise<void> {
    const db = getDb();
    const { firebaseUid, teacherName, schoolName, email, plan, requestId } = data;

    logger.info('Creating Firestore Profile', `Creating TeacherProfile for UID ${firebaseUid}`, requestId);

    await db.collection('TeacherProfile').doc(firebaseUid).set({
      firebaseUid,
      teacherName,
      schoolName,
      email,
      plan,
      className: 'Kelas Utama',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }

  /**
   * Initializes initial collections/metadata for Students, Attendance, Savings, Notes, Announcements
   */
  public static async initializeClassCollections(firebaseUid: string, requestId?: string): Promise<void> {
    const db = getDb();
    logger.info('Creating Firestore Profile', `Preparing initial collection structures for teacher ${firebaseUid}`, requestId);

    // Initial class metadata anchor
    await db.collection('ClassMetadata').doc(firebaseUid).set({
      teacherUid: firebaseUid,
      initializedAt: new Date().toISOString(),
      studentCount: 0,
      activeAcademicYear: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
      modulesEnabled: ['Students', 'Attendance', 'Savings', 'Notes', 'Announcements'],
    }, { merge: true });
  }
}
