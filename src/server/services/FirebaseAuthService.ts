import { getFirebaseAuth } from '../firebaseAdmin';
import { logger } from './LoggerService';
import { UserRecord } from 'firebase-admin/auth';

export class FirebaseAuthService {
  /**
   * Checks if a user already exists in Firebase Auth by email.
   */
  public static async getUserByEmail(email: string): Promise<UserRecord | null> {
    try {
      const auth = getFirebaseAuth();
      const user = await auth.getUserByEmail(email);
      return user;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        return null;
      }
      logger.error('CheckUserExists', `Error checking user email ${email}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Creates a new user in Firebase Auth without a fixed password.
   * User will create their own password via the email link.
   */
  public static async createFirebaseUser(email: string, displayName: string, requestId?: string): Promise<UserRecord> {
    const auth = getFirebaseAuth();
    logger.info('Creating Firebase User', `Attempting user creation for ${email}`, requestId);
    
    const userRecord = await auth.createUser({
      email,
      displayName,
      emailVerified: false,
    });

    logger.info('Creating Firebase User', `User created successfully with UID: ${userRecord.uid}`, requestId);
    return userRecord;
  }

  /**
   * Generates a password setup/reset link using Firebase Auth official mechanism.
   */
  public static async generatePasswordSetupLink(email: string, requestId?: string): Promise<string> {
    const auth = getFirebaseAuth();
    logger.info('Sending Password Setup Email', `Generating official Firebase password reset link for ${email}`, requestId);
    
    // Optional action code settings
    const actionCodeSettings = {
      url: process.env.APP_URL || 'http://localhost:3000',
      handleCodeInApp: false,
    };

    const link = await auth.generatePasswordResetLink(email, actionCodeSettings);
    logger.info('Sending Password Setup Email', `Password setup link generated successfully`, requestId);
    return link;
  }
}
