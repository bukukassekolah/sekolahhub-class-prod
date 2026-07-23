import { getApps, initializeApp, App, AppOptions } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

export function getFirebaseAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    return apps[0];
  }

  let projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT;

  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!projectId && config.projectId) {
        projectId = config.projectId;
      }
    }
  } catch (e) {
    console.warn('[FirebaseAdmin] Failed to read firebase-applet-config.json:', e);
  }

  const options: AppOptions = {};
  if (projectId) {
    options.projectId = projectId;
  }

  return initializeApp(options);
}

export function getDb(): Firestore {
  const app = getFirebaseAdminApp();
  let databaseId: string | undefined;
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      databaseId = config.firestoreDatabaseId;
    }
  } catch (e) {
    // Ignore error
  }

  if (databaseId && databaseId !== '(default)') {
    return getFirestore(app, databaseId);
  }
  return getFirestore(app);
}

export function getFirebaseAuth(): Auth {
  const app = getFirebaseAdminApp();
  return getAuth(app);
}
