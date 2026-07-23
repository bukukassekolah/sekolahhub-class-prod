import { FirestoreService, ImplementationRequestDoc } from './FirestoreService';
import { FirebaseAuthService } from './FirebaseAuthService';
import { EmailProvisioningService } from './EmailProvisioningService';
import { logger } from './LoggerService';

export class QueueProvisioningService {
  private static isProcessing = false;

  /**
   * Processes all queued implementation requests sequentially and safely.
   */
  public static async processQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
    if (this.isProcessing) {
      logger.warn('QueueService', 'Queue processing is already in progress. Skipping duplicate invocation.');
      return { processed: 0, succeeded: 0, failed: 0 };
    }

    this.isProcessing = true;
    let succeeded = 0;
    let failed = 0;

    try {
      const queuedDocs = await FirestoreService.getQueuedRequests();
      logger.info('QueueService', `Found ${queuedDocs.length} requests in Queued state.`);

      for (const reqDoc of queuedDocs) {
        const result = await this.provisionSingleRequest(reqDoc);
        if (result) {
          succeeded++;
        } else {
          failed++;
        }
      }

      return {
        processed: queuedDocs.length,
        succeeded,
        failed,
      };
    } catch (err: any) {
      if (err.message && err.message.includes('PERMISSION_DENIED')) {
        logger.info('QueueService', 'Queue processing skipped: Admin credentials limited in preview container.');
      } else {
        logger.warn('QueueService', `Queue runner note: ${err.message}`);
      }
      return { processed: 0, succeeded, failed };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Provisions a single implementation request document step-by-step.
   */
  private static async provisionSingleRequest(reqDoc: ImplementationRequestDoc): Promise<boolean> {
    const { id, requestId, email, contactName, schoolName, plan } = reqDoc;

    logger.info('Provisioning Started', `Starting backend provisioning for ${schoolName} (${email})`, requestId);

    try {
      // 1. Mark as Processing
      await FirestoreService.updateRequest(id, {
        authProvisioning: 'Processing',
      });

      // 2. Check if Firebase Auth account already exists
      const existingUser = await FirebaseAuthService.getUserByEmail(email);
      if (existingUser) {
        logger.error(
          'Failed',
          `Provisioning failed: Email ${email} already exists in Firebase Auth (UID: ${existingUser.uid}).`,
          requestId
        );

        await FirestoreService.updateRequest(id, {
          authProvisioning: 'Failed',
          errorCode: 'EMAIL_ALREADY_EXISTS',
          errorMessage: `Email ${email} sudah terdaftar di Firebase Authentication.`,
          failedAt: new Date().toISOString(),
        });

        return false;
      }

      // 3. Create Firebase User
      logger.info('Creating Firebase User', `Creating user account for ${contactName} (${email})`, requestId);
      const userRecord = await FirebaseAuthService.createFirebaseUser(email, contactName, requestId);

      // 4. Save firebaseUid to ImplementationRequests document
      await FirestoreService.updateRequest(id, {
        firebaseUid: userRecord.uid,
      });

      // 5. Create TeacherProfile
      logger.info('Creating Firestore Profile', `Creating profile for teacher ${contactName}`, requestId);
      await FirestoreService.createTeacherProfile({
        firebaseUid: userRecord.uid,
        teacherName: contactName,
        schoolName,
        email,
        plan,
        requestId,
      });

      // 6. Initialize initial collection structure
      await FirestoreService.initializeClassCollections(userRecord.uid, requestId);

      // 7. Generate Password Setup Link & Send Email
      logger.info('Sending Password Setup Email', `Generating official password reset email link for ${email}`, requestId);
      const setupLink = await FirebaseAuthService.generatePasswordSetupLink(email, requestId);

      await EmailProvisioningService.sendPasswordSetupEmail({
        email,
        contactName,
        schoolName,
        plan,
        passwordSetupLink: setupLink,
        requestId,
      });

      // 8. Mark as Completed
      const now = new Date().toISOString();
      await FirestoreService.updateRequest(id, {
        authProvisioning: 'Completed',
        status: 'Active',
        provisionedAt: now,
        updatedAt: now,
      });

      logger.info('Completed', `Provisioning completed successfully for ${schoolName} (UID: ${userRecord.uid})`, requestId);
      return true;

    } catch (err: any) {
      const errorMsg = err.message || 'Unknown provisioning error';
      const errorCode = err.code || 'PROVISIONING_ERROR';

      logger.error('Failed', `Error during provisioning for request ${id}: ${errorMsg}`, requestId, { errorCode });

      await FirestoreService.updateRequest(id, {
        authProvisioning: 'Failed',
        errorCode,
        errorMessage: errorMsg,
        failedAt: new Date().toISOString(),
      });

      return false;
    }
  }

  /**
   * Retries all requests with authProvisioning == "Failed".
   */
  public static async retryFailedProvisioning(): Promise<{ resetCount: number; runResult: { processed: number; succeeded: number; failed: number } }> {
    logger.info('Retry Service', 'Fetching failed requests for provisioning retry.');

    const failedDocs = await FirestoreService.getFailedRequests();
    logger.info('Retry Service', `Found ${failedDocs.length} failed requests to reset.`);

    for (const doc of failedDocs) {
      await FirestoreService.updateRequest(doc.id, {
        authProvisioning: 'Queued',
        errorCode: undefined,
        errorMessage: undefined,
        failedAt: undefined,
      });
    }

    const runResult = await this.processQueue();
    return {
      resetCount: failedDocs.length,
      runResult,
    };
  }
}
