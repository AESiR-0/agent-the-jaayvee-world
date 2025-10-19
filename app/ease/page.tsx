'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { verifyOTP, createRecaptchaVerifier, clearRecaptchaVerifier, signInWithPhoneNumber, auth } from '@/lib/firebaseClient';
import { API_BASE_URL } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

interface QRStatus {
  isValid: boolean;
  isActivated: boolean;
  merchantId?: string;
}

interface MerchantFormData {
  name: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

function EasePageContent() {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get('merchantId');
  const role = searchParams.get('role');

  const [qrStatus, setQrStatus] = useState<QRStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'checking' | 'invalid' | 'activated' | 'form' | 'success'>('checking');
  const [formData, setFormData] = useState<MerchantFormData>({
    name: '',
    phone: '',
    address: '',
  });
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!merchantId || role !== 'merchant') {
      setStep('invalid');
      setIsLoading(false);
      return;
    }

    checkQRStatus();
  }, [merchantId, role]);

  const checkQRStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/qr/resolve?code=${merchantId}`);
      const data = await response.json();

      if (!data.success || !data.data.isValid) {
        setStep('invalid');
      } else if (data.data.isActivated) {
        setStep('activated');
      } else {
        setStep('form');
      }
    } catch (error) {
      console.error('Error checking QR status:', error);
      setStep('invalid');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Clear any existing reCAPTCHA
      clearRecaptchaVerifier('recaptcha-container');
      console.log('🧹 Cleared reCAPTCHA');
      
      const recaptchaVerifier = createRecaptchaVerifier('recaptcha-container');
      console.log('🔐 Created reCAPTCHA verifier');
      
      console.log('📞 Calling signInWithPhoneNumber...');
      const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, recaptchaVerifier);
      console.log('✅ OTP sent successfully!', confirmationResult.verificationId);
      
      setVerificationId(confirmationResult.verificationId);
      setStep('form');
      console.log('✅ OTP sent successfully');
    } catch (error: any) {
      console.error('Phone verification error:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await verifyOTP(verificationId, otp);
      
      if (result.success) {
        // Submit merchant activation
        const response = await fetch(`${API_BASE_URL}/merchant/activate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseToken: localStorage.getItem('firebaseToken') || 'mock_token',
            merchantId,
            ...formData,
          }),
        });

        if (!response.ok) {
          throw new Error('Activation failed');
        }

        setStep('success');
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
        setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-foreground/70">Checking QR code...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">The Jaayvee World</h1>
          <p className="text-foreground/70 mt-2">Merchant Activation</p>
        </div>

        {step === 'invalid' && (
          <div className="bg-white rounded-xl border border-red-200 shadow-soft p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Invalid QR Code</h2>
            <p className="text-foreground/70">This QR code is invalid or unassigned.</p>
          </div>
        )}

        {step === 'activated' && (
          <div className="bg-white rounded-xl border border-green-200 shadow-soft p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Already Activated</h2>
            <p className="text-foreground/70">This merchant account is already activated.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-xl border border-green-200 shadow-soft p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Registration Successful</h2>
            <p className="text-foreground/70">Your registration is under verification. You'll be notified once approved.</p>
          </div>
        )}

        {step === 'form' && (
          <div className="bg-white rounded-xl border border-border shadow-soft p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Complete Your Registration</h2>
            
            <form onSubmit={verificationId ? handleOtpSubmit : handlePhoneSubmit} className="space-y-6">
              {!verificationId ? (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Business Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                      Business Address
                    </label>
                    <textarea
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Enter your business address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location (Optional)
                    </label>
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="123456"
                  />
                  <p className="mt-2 text-sm text-foreground/70">
                    OTP sent to {formData.phone}
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : verificationId ? 'Verify & Activate' : 'Send OTP'}
              </button>
            </form>

            <div id="recaptcha-container"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-foreground/70">Loading...</div>
      </div>
    }>
      <EasePageContent />
    </Suspense>
  );
}
