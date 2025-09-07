import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';

// Utility function for required environment variables
const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value && import.meta.env.PROD) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};

// Firebase configuration with validation
const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional
};

// Firebase services interface
interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  functions: Functions;
  rtdb: Database;
}

// Connection status interface
interface FirebaseConnectionStatus {
  auth: 'connected' | 'disconnected' | 'error';
  firestore: 'connected' | 'disconnected' | 'error';
  functions: 'connected' | 'disconnected' | 'error';
  database: 'connected' | 'disconnected' | 'error';
  emulators: boolean;
}

class FirebaseManager {
  private static instance: FirebaseManager;
  private services: FirebaseServices | null = null;
  private connectionStatus: FirebaseConnectionStatus = {
    auth: 'disconnected',
    firestore: 'disconnected',
    functions: 'disconnected',
    database: 'disconnected',
    emulators: false,
  };

  static getInstance(): FirebaseManager {
    if (!FirebaseManager.instance) {
      FirebaseManager.instance = new FirebaseManager();
    }
    return FirebaseManager.instance;
  }

  async initialize(): Promise<FirebaseServices> {
    if (this.services) {
      return this.services;
    }

    try {
      // Validate configuration
      this.validateConfig(firebaseConfig);

      // Initialize Firebase app
      const app = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized');

      // Initialize services
      const auth = getAuth(app);
      const db = getFirestore(app);
      const storage = getStorage(app);
      const functions = getFunctions(app);
      const rtdb = getDatabase(app);

      this.services = { app, auth, db, storage, functions, rtdb };

      // Connect to emulators if enabled
      await this.connectEmulators();

      // Monitor connection status
      this.startConnectionMonitoring();

      console.log('🔥 Firebase services initialized successfully');
      return this.services;
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateConfig(config: any): void {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
    }
  }

  private async connectEmulators(): Promise<void> {
    if (!this.services) return;

    const useEmulators = import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
    
    if (!useEmulators) {
      console.log('🔧 Firebase emulators disabled');
      return;
    }

    try {
      const { auth, db, functions, rtdb } = this.services;

      // Connect Auth emulator
      try {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        console.log('🔧 Auth emulator connected');
      } catch (error) {
        console.warn('⚠️ Failed to connect Auth emulator:', error);
      }

      // Connect Firestore emulator
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('🔧 Firestore emulator connected');
      } catch (error) {
        console.warn('⚠️ Failed to connect Firestore emulator:', error);
      }

      // Connect Functions emulator
      try {
        connectFunctionsEmulator(functions, "localhost", 5001);
        console.log('🔧 Functions emulator connected');
      } catch (error) {
        console.warn('⚠️ Failed to connect Functions emulator:', error);
      }

      // Connect Database emulator
      try {
        connectDatabaseEmulator(rtdb, 'localhost', 9000);
        console.log('🔧 Database emulator connected');
      } catch (error) {
        console.warn('⚠️ Failed to connect Database emulator:', error);
      }

      this.connectionStatus.emulators = true;
      console.log('🔧 Firebase emulators setup complete');
    } catch (error) {
      console.warn('⚠️ Some Firebase emulators failed to connect:', error);
    }
  }

  private startConnectionMonitoring(): void {
    if (!this.services) return;

    const { auth } = this.services;

    // Monitor auth connection
    auth.onAuthStateChanged((user) => {
      this.connectionStatus.auth = user ? 'connected' : 'disconnected';
    });

    // Monitor other services (simplified)
    this.connectionStatus.firestore = 'connected';
    this.connectionStatus.functions = 'connected';
    this.connectionStatus.database = 'connected';
  }

  getServices(): FirebaseServices {
    if (!this.services) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.services;
  }

  getConnectionStatus(): FirebaseConnectionStatus {
    return { ...this.connectionStatus };
  }

  async testConnection(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      if (!this.services) {
        await this.initialize();
      }

      // Test basic connectivity
      const { auth, db } = this.services!;

      // Test auth (if user is signed in)
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.getIdToken();
        }
      } catch (error) {
        errors.push(`Auth test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test Firestore
      try {
        // Minimal read operation
        const { collection, getDocs, limit, query } = await import('firebase/firestore');
        const healthRef = collection(db, '_health');
        const healthQuery = query(healthRef, limit(1));
        await getDocs(healthQuery);
      } catch (error) {
        errors.push(`Firestore test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      return {
        success: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      };
    }
  }
}

// Initialize Firebase
const firebaseManager = FirebaseManager.getInstance();

// Export services (will throw if not initialized)
export const getFirebaseServices = (): FirebaseServices => {
  return firebaseManager.getServices();
};

// Export individual services with lazy initialization
export const auth = new Proxy({} as Auth, {
  get(target, prop) {
    const services = firebaseManager.getServices();
    return services.auth[prop as keyof Auth];
  }
});

export const db = new Proxy({} as Firestore, {
  get(target, prop) {
    const services = firebaseManager.getServices();
    return services.db[prop as keyof Firestore];
  }
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(target, prop) {
    const services = firebaseManager.getServices();
    return services.storage[prop as keyof FirebaseStorage];
  }
});

export const functions = new Proxy({} as Functions, {
  get(target, prop) {
    const services = firebaseManager.getServices();
    return services.functions[prop as keyof Functions];
  }
});

export const rtdb = new Proxy({} as Database, {
  get(target, prop) {
    const services = firebaseManager.getServices();
    return services.rtdb[prop as keyof Database];
  }
});

// Initialize Firebase services
export const initializeFirebase = async (): Promise<FirebaseServices> => {
  return firebaseManager.initialize();
};

// Export utility functions
export const getFirebaseConnectionStatus = (): FirebaseConnectionStatus => {
  return firebaseManager.getConnectionStatus();
};

export const testFirebaseConnection = async () => {
  return firebaseManager.testConnection();
};

// Export the app instance
export default firebaseManager;
