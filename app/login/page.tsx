'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendOTP, completeAuth, storeUserData } from '@/lib/firebaseUtils';
import { useFirebase } from '@/lib/useFirebase';
import FirebaseTest from '@/components/FirebaseTest';
import DevHelper from '@/components/DevHelper';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const router = useRouter();
  const { isInitialized: isFirebaseReady, error: firebaseError } = useFirebase();

  useEffect(() => {
    // Check if user is already logged in
    const agentId = localStorage.getItem('agentId');
    if (agentId) {
      router.push('/dashboard');
    }
  }, [router]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFirebaseReady) {
      setError('Firebase is not ready. Please wait and try again.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const result = await sendOTP(phoneNumber);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setStep('otp');
        console.log('✅ OTP sent successfully');
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Phone authentication error:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await completeAuth(verificationId, otp);
      
      if (result.success && result.data) {
        // Store user data
        storeUserData(result.data, localStorage.getItem('firebaseToken') || '');
        
        console.log('✅ Authentication complete, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        setError(result.error || 'Authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            Agents Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Sign in with your phone number
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800">
              <strong>Development Tip:</strong> Use test phone number <code className="bg-blue-100 px-1 rounded">+91 9876543210</code> with OTP <code className="bg-blue-100 px-1 rounded">123456</code> to avoid rate limits.
            </p>
          </div>
        </div>

        <FirebaseTest />

        {!isFirebaseReady && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              ⏳ Initializing Firebase... Please wait.
            </p>
          </div>
        )}

        {firebaseError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">
              ❌ Firebase Error: {firebaseError}
            </p>
          </div>
        )}

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800">
              🧪 <strong>Development Mode:</strong> Using mock authentication and backend responses. Backend API may not be available.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-border shadow-soft p-8">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="mt-1 block w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !isFirebaseReady}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : !isFirebaseReady ? 'Initializing...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="mt-1 block w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                />
                <p className="mt-2 text-sm text-foreground/70">
                  OTP sent to {phoneNumber}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 py-3 px-4 border border-border text-foreground rounded-xl hover:bg-accent-light"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div id="recaptcha-container"></div>
        </div>
      </div>
      
      <DevHelper />
    </div>
  );
}
