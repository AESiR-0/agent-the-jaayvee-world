import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration with validation
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missingKeys.length > 0) {
    console.error('❌ Missing Firebase configuration:', missingKeys);
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
  }

  console.log('✅ Firebase configuration validated');
  return true;
};

// Initialize Firebase app (prevent multiple initializations)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Debug function to log config
const debugConfig = () => {
  console.log('🔍 Firebase Config Debug:');
  console.log('API Key:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'Missing');
  console.log('Auth Domain:', firebaseConfig.authDomain);
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Storage Bucket:', firebaseConfig.storageBucket);
  console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId);
  console.log('App ID:', firebaseConfig.appId);
  console.log('Full Config:', JSON.stringify(firebaseConfig, null, 2));
};

// Initialize Firebase - will be called when needed
const initializeFirebase = () => {
  if (typeof window === 'undefined') {
    console.log('⚠️ Firebase initialization skipped (server-side)');
    return;
  }

  try {
    // Debug config in browser
    debugConfig();

    // Validate config first
    validateFirebaseConfig();

    // Initialize app if not already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('🚀 Firebase app initialized');
      console.log('App name:', app.name);
      console.log('App options:', app.options);
    } else {
      app = getApps()[0];
      console.log('♻️ Using existing Firebase app');
      console.log('Existing app name:', app.name);
      console.log('Existing app options:', app.options);
    }

    // Initialize services
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);

    console.log('✅ Firebase services initialized');
    console.log('Auth app name:', auth.app.name);
    console.log('Auth app options:', auth.app.options);
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Config that failed:', firebaseConfig);
    throw error;
  }
};

// Initialize immediately if in browser
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Enhanced reCAPTCHA verifier with error handling
export const createRecaptchaVerifier = (elementId: string) => {
  // Ensure Firebase is initialized
  if (typeof window !== 'undefined' && !auth) {
    initializeFirebase();
  }
  
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: (response: any) => {
        console.log('✅ reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('⏰ reCAPTCHA expired');
      },
      'error-callback': (error: any) => {
        console.error('❌ reCAPTCHA error:', error);
      }
    });

    return recaptchaVerifier;
  } catch (error) {
    console.error('❌ Failed to create reCAPTCHA verifier:', error);
    throw error;
  }
};

// Clear reCAPTCHA verifier
export const clearRecaptchaVerifier = (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = '';
    }
  } catch (error) {
    console.error('❌ Failed to clear reCAPTCHA:', error);
  }
};

// Auth state change handler
export const onAuthStateChanged = (callback: (user: any) => void) => {
  // Ensure Firebase is initialized
  if (typeof window !== 'undefined' && !auth) {
    initializeFirebase();
  }
  
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  return auth.onAuthStateChanged(callback);
};

// Get current user
export const getCurrentUser = () => {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
};

// Sign out
export const signOut = async () => {
  // Ensure Firebase is initialized
  if (typeof window !== 'undefined' && !auth) {
    initializeFirebase();
  }
  
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  
  try {
    await auth.signOut();
    console.log('✅ User signed out');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
    throw error;
  }
};

// Export services
export { auth, firestore, storage };
export default app;
