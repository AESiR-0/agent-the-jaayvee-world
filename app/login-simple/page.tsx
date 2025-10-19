'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyOTP, createRecaptchaVerifier, clearRecaptchaVerifier, signInWithPhoneNumber, auth } from '@/lib/firebaseClient';

export default function SimpleLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
      router.push('/dashboard');
    }
  }, [router]);

  const sendOTP = async (phoneNumber: string, recaptchaElementId: string = 'recaptcha-container') => {
    try {
      console.log('🔍 Sending OTP to:', phoneNumber);
      
      // Clear any existing reCAPTCHA
      clearRecaptchaVerifier(recaptchaElementId);
      console.log('🧹 Cleared reCAPTCHA');
      
      const recaptchaVerifier = createRecaptchaVerifier(recaptchaElementId);
      console.log('🔐 Created reCAPTCHA verifier');
      
      console.log('📞 Calling signInWithPhoneNumber...');
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('✅ OTP sent successfully!', confirmationResult.verificationId);
      
      return {
        success: true,
        verificationId: confirmationResult.verificationId
      };
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many OTP requests. Please wait 1-2 hours before trying again.'
        };
      } else if (error.code === 'auth/invalid-phone-number') {
        return {
          success: false,
          error: 'Invalid phone number format. Please use international format like +91 9876543210'
        };
      } else if (error.code === 'auth/invalid-app-credential') {
        return {
          success: false,
          error: 'Authentication service error. Please try again later.'
        };
      } else if (error.code === 'auth/captcha-check-failed') {
        return {
          success: false,
          error: 'Security verification failed. Please try again.'
        };
      } else if (error.code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'Network error. Please check your internet connection and try again.'
        };
      } else if (error.code === 'auth/quota-exceeded') {
        return {
          success: false,
          error: 'SMS quota exceeded. Please try again later.'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to send OTP. Please try again.'
      };
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const result = await verifyOTP(verificationId, otp);
      
      if (result.success && result.user) {
        // Store user data in localStorage
        localStorage.setItem('userId', result.user.uid);
        localStorage.setItem('phoneNumber', result.user.phoneNumber || '');
        localStorage.setItem('verified', 'true');
        
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
            Firebase OTP Login
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Sign in with your phone number using Firebase
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800">
              <strong>Firebase OTP:</strong> Direct integration with Firebase Auth. No environment variables needed.
            </p>
          </div>
        </div>

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
                  placeholder="+919876543210"
                  className="mt-1 block w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                />
                <p className="mt-2 text-sm text-foreground/70">
                  Enter phone number with country code (e.g., +919876543210)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
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

          <div id="recaptcha-container" className="flex justify-center mt-4"></div>
        </div>

        <div className="text-center">
          <p className="text-sm text-foreground/70">
            🔥 Firebase Auth • 📱 Phone OTP • 🚀 No Environment Variables
          </p>
        </div>
      </div>
    </div>
  );
}
