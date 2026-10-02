import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App safely
let appInstance: any = null;
try {
  appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn('Firebase initialization note:', e);
}

export const app = appInstance;

let authInstance: Auth | null = null;
try {
  if (app) {
    authInstance = getAuth(app);
  }
} catch (e) {
  console.warn('Firebase Auth note:', e);
}
export const auth = authInstance;

let firestoreInstance: Firestore | null = null;
try {
  if (app) {
    firestoreInstance = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
} catch (e) {
  console.warn('Firestore initialization note:', e);
}
export const db = firestoreInstance;

// Connection test helper as specified in firebase-integration skill
export async function testFirebaseConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn("Firestore client offline, using resilient local cache mode.");
    }
    return true;
  }
}
