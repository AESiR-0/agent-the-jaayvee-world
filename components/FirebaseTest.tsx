'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/lib/useFirebase';
import { testFirebaseConfig } from '@/lib/testFirebaseConfig';
import { testAuthEndpoint } from '@/lib/backendStatus';

export default function FirebaseTest() {
  const { isInitialized, error } = useFirebase();
  const [configTest, setConfigTest] = useState<boolean | null>(null);
  const [backendTest, setBackendTest] = useState<boolean | null>(null);

  useEffect(() => {
    const testConfig = () => {
      try {
        const isValid = testFirebaseConfig();
        setConfigTest(isValid);
      } catch (err) {
        console.error('Config test failed:', err);
        setConfigTest(false);
      }
    };

    const testBackend = async () => {
      try {
        const result = await testAuthEndpoint();
        setBackendTest(result.isAvailable);
      } catch (err) {
        console.error('Backend test failed:', err);
        setBackendTest(false);
      }
    };

    testConfig();
    testBackend();
  }, []);

  return (
    <div className="p-4 bg-accent-light rounded-xl border border-accent">
      <h3 className="font-semibold text-foreground mb-2">Firebase Status</h3>
      <div className="space-y-2 text-sm text-foreground/70">
        <p>
          <strong>Configuration:</strong> {configTest === null ? '⏳ Testing...' : configTest ? '✅ Valid' : '❌ Invalid'}
        </p>
        <p>
          <strong>Initialization:</strong> {isInitialized ? '✅ Ready' : error ? `❌ ${error}` : '⏳ Loading...'}
        </p>
        <p>
          <strong>Backend API:</strong> {backendTest === null ? '⏳ Testing...' : backendTest ? '✅ Available' : '❌ Unavailable (using mock)'}
        </p>
      </div>
    </div>
  );
}
