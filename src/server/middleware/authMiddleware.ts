import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth, getDb } from '../firebaseAdmin';
import { logger } from '../services/LoggerService';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware authenticateUser
 * Verifies the Firebase ID Token sent via Authorization Bearer token header using Firebase Admin SDK.
 * Attaches decoded user information to req.user if valid.
 * Returns HTTP 401 Unauthorized if missing or invalid.
 */
export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('AuthMiddleware', 'Token tidak valid', undefined, { path: req.path, reason: 'Missing or invalid Bearer header' });
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid Authorization header',
    });
  }

  const idToken = authHeader.substring(7).trim();

  if (!idToken) {
    logger.warn('AuthMiddleware', 'Token tidak valid', undefined, { path: req.path, reason: 'Empty token' });
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Token is empty',
    });
  }

  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    logger.info('AuthMiddleware', 'Login berhasil', undefined, { uid: decodedToken.uid, email: decodedToken.email });
    return next();
  } catch (error: any) {
    logger.warn('AuthMiddleware', 'Token tidak valid', undefined, { path: req.path, error: error.message });
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired token',
    });
  }
}

/**
 * Middleware requireDeveloper
 * Runs after authenticateUser.
 * Fetches user role from Firestore using Firebase Admin SDK.
 * Returns HTTP 403 Forbidden if user role is not 'developer'.
 */
export async function requireDeveloper(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !req.user.uid) {
    logger.warn('AuthMiddleware', 'Akses ditolak', undefined, { reason: 'Missing user information' });
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing user information',
    });
  }

  const uid = req.user.uid;

  try {
    const db = getDb();
    let role: string | undefined;

    // Check Users collection
    const userDoc = await db.collection('Users').doc(uid).get();
    if (userDoc.exists) {
      role = userDoc.data()?.role;
    } else {
      // Fallback check in lowercase 'users' or 'TeacherProfile'
      const usersDoc = await db.collection('users').doc(uid).get();
      if (usersDoc.exists) {
        role = usersDoc.data()?.role;
      } else {
        const teacherDoc = await db.collection('TeacherProfile').doc(uid).get();
        if (teacherDoc.exists) {
          role = teacherDoc.data()?.role;
        }
      }
    }

    // Also check token custom claims if role was set directly on decoded token
    if (!role && req.user.role) {
      role = req.user.role;
    }

    if (!role || role.toLowerCase() !== 'developer') {
      logger.warn('AuthMiddleware', 'Akses ditolak', undefined, { uid, role: role || 'none' });
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Access restricted to developer role',
      });
    }

    return next();
  } catch (error: any) {
    logger.error('AuthMiddleware', 'Akses ditolak', undefined, { uid, error: error.message });
    console.error('Error verifying developer role in Firestore:', error);
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Unable to verify developer role',
    });
  }
}


