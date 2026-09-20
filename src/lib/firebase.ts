import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
export { getFriendlyAuthErrorMessage } from '../utils/authErrors';

// Initialize or reuse Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore as mandated by Firebase Integration Skill:
// export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Authentication with explicit persistence for page refreshes
export const auth = getAuth(app);

// Enforce browserLocalPersistence so authentication state persists across refreshes and restarts
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('browserLocalPersistence not available, trying session persistence:', err);
    setPersistence(auth, browserSessionPersistence).catch((sessionErr) => {
      console.warn('sessionPersistence failed, falling back to inMemory:', sessionErr);
      setPersistence(auth, inMemoryPersistence).catch(() => {});
    });
  });
}

// Google Auth Provider configured with account prompt
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test helper per Firebase integration guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration.');
    }
    return false;
  }
}

// Probe connection once on boot as specified in the Firebase skill
testConnection().catch(() => {});

