'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendAuthOTP, verifyAuthOTP } from '@/lib/customAuth';

export default function CustomLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');

    try {
      const result = await sendAuthOTP(phoneNumber);
      
      if (result.success && result.otpId) {
        setOtpId(result.otpId);
        setStep('otp');
        console.log('✅ OTP sent successfully');
      } else {
        setError(result.message || 'Failed to send OTP. Please try again.');
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
      const result = await verifyAuthOTP(otpId, otp, phoneNumber);
      
      if (result.success && result.user) {
        // Store user data in localStorage
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('phoneNumber', result.user.phoneNumber);
        localStorage.setItem('verified', result.user.verified.toString());
        localStorage.setItem('authProvider', 'custom');
        
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
            Custom OTP Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Sign in with your phone number using our custom OTP service
          </p>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-xs text-green-800">
              <strong>Custom OTP Service:</strong> No Firebase dependency. Full control over OTP generation and SMS delivery.
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
                  placeholder="+91 9876543210"
                  className="mt-1 block w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                />
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
        </div>

        <div className="text-center">
          <p className="text-sm text-foreground/70">
            Using custom OTP service with full control
          </p>
        </div>
      </div>
    </div>
  );
}
