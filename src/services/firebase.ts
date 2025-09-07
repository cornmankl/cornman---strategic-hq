import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

/**
 * Require environment variable with proper validation
 */
const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value && import.meta.env.PROD) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};

/**
 * Validate Firebase configuration
 */
const validateFirebaseConfig = (config: any): void => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0 && import.meta.env.PROD) {
    throw new Error(`Missing required Firebase config fields: ${missingFields.join(', ')}`);
  }
};

const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY') || "AIzaSyBQFrju1Vl6VJsPD2ZfRl5xIS2Fh066nRU",
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN') || "chatflow-builder-qwix4.firebaseapp.com",
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID') || "chatflow-builder-qwix4",
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET') || "chatflow-builder-qwix4.firebasestorage.app",
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "287388723540",
  appId: requireEnv('VITE_FIREBASE_APP_ID') || "1:287388723540:web:b54160f980fec2a182c0c1",
};

// Validate configuration before initialization
validateFirebaseConfig(firebaseConfig);

let app: any;
let auth: any;
let db: any;
let storage: any;
let functions: any;
let rtdb: any;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  rtdb = getDatabase(app);

  // Firebase Emulator setup for development
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectFunctionsEmulator(functions, "localhost", 5001);
      connectDatabaseEmulator(rtdb, 'localhost', 9000);
      console.log('✅ Firebase emulators connected');
    } catch (error) {
      console.warn('⚠️ Firebase emulator connection failed:', error);
      // Continue with cloud Firebase in development
    }
  }

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // In development, provide fallback mock services
  if (import.meta.env.DEV) {
    console.warn('⚠️ Using mock Firebase services for development');
    
    // Create mock objects to prevent runtime errors
    auth = {
      currentUser: null,
      signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available')),
      signOut: () => Promise.reject(new Error('Firebase not available')),
      onAuthStateChanged: () => () => {},
    };
    
    db = {
      collection: () => ({
        doc: () => ({
          get: () => Promise.reject(new Error('Firebase not available')),
          set: () => Promise.reject(new Error('Firebase not available')),
          update: () => Promise.reject(new Error('Firebase not available')),
          delete: () => Promise.reject(new Error('Firebase not available')),
        }),
        add: () => Promise.reject(new Error('Firebase not available')),
        where: () => ({
          get: () => Promise.reject(new Error('Firebase not available')),
        }),
      }),
    };
    
    storage = {
      ref: () => ({
        put: () => Promise.reject(new Error('Firebase not available')),
        getDownloadURL: () => Promise.reject(new Error('Firebase not available')),
      }),
    };
    
    functions = {
      httpsCallable: () => () => Promise.reject(new Error('Firebase not available')),
    };
    
    rtdb = {
      ref: () => ({
        set: () => Promise.reject(new Error('Firebase not available')),
        get: () => Promise.reject(new Error('Firebase not available')),
        on: () => () => {},
        off: () => {},
      }),
    };
  } else {
    // In production, re-throw the error
    throw error;
  }
}

/**
 * Firebase service health check
 */
export const checkFirebaseHealth = async (): Promise<{
  auth: boolean;
  firestore: boolean;
  storage: boolean;
  functions: boolean;
  database: boolean;
}> => {
  const health = {
    auth: false,
    firestore: false,
    storage: false,
    functions: false,
    database: false,
  };

  try {
    // Check auth
    if (auth && typeof auth.currentUser !== 'undefined') {
      health.auth = true;
    }

    // Check Firestore
    if (db && typeof db.collection === 'function') {
      health.firestore = true;
    }

    // Check Storage
    if (storage && typeof storage.ref === 'function') {
      health.storage = true;
    }

    // Check Functions
    if (functions && typeof functions.httpsCallable === 'function') {
      health.functions = true;
    }

    // Check Realtime Database
    if (rtdb && typeof rtdb.ref === 'function') {
      health.database = true;
    }
  } catch (error) {
    console.warn('Firebase health check failed:', error);
  }

  return health;
};

/**
 * Get Firebase configuration info (safe for logging)
 */
export const getFirebaseInfo = () => ({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  isEmulator: import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true',
  environment: import.meta.env.PROD ? 'production' : 'development',
});

export { auth, db, storage, functions, rtdb };
export default app;
