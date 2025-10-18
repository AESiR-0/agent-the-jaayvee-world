import { useEffect, useState } from 'react';
import { auth } from './firebaseClient';

export const useFirebase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFirebase = () => {
      try {
        if (auth && auth.app) {
          setIsInitialized(true);
          setError(null);
          console.log('✅ Firebase is ready');
        } else {
          setError('Firebase not initialized');
          console.error('❌ Firebase not initialized');
        }
      } catch (err) {
        setError('Firebase initialization failed');
        console.error('❌ Firebase check failed:', err);
      }
    };

    // Check immediately
    checkFirebase();

    // Also check after a short delay to ensure initialization
    const timer = setTimeout(checkFirebase, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return { isInitialized, error };
};
