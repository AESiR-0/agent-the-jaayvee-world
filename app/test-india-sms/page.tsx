'use client';

import { useState } from 'react';
import { sendOTPViaIndiaSMS, getIndianCarrierInfo } from '@/lib/indiaSMS';

export default function TestIndiaSMSPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('123456');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestSMS = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing Indian SMS...');
      const result = await sendOTPViaIndiaSMS(phoneNumber, otp, 5);
      setResult(result);
      console.log('📱 SMS Result:', result);
    } catch (error: any) {
      console.error('❌ SMS Test Error:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckCarrier = () => {
    const carrierInfo = getIndianCarrierInfo(phoneNumber);
    setResult({
      success: true,
      carrier: carrierInfo.carrier,
      emailAddress: carrierInfo.emailAddress,
      isValid: carrierInfo.isValid
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            🇮🇳 Indian SMS Service Test
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Test free SMS via Indian carrier email-to-SMS gateways
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-soft p-8 space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground">
              Indian Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 9876543210 or 9876543210"
              className="mt-1 block w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <p className="mt-2 text-sm text-foreground/70">
              Supports: +91 9876543210, 9876543210, 0 9876543210
            </p>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-foreground">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="mt-1 block w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTestSMS}
              disabled={isLoading || !phoneNumber}
              className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : '📱 Send SMS'}
            </button>
            
            <button
              onClick={handleCheckCarrier}
              disabled={!phoneNumber}
              className="flex-1 py-3 px-4 border border-border text-foreground rounded-xl hover:bg-accent-light disabled:opacity-50"
            >
              🔍 Check Carrier
            </button>
          </div>

          {result && (
            <div className={`p-4 rounded-xl border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-medium text-sm mb-2">
                {result.success ? '✅ Result' : '❌ Error'}
              </h3>
              <pre className="text-xs text-foreground/80 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-3">🇮🇳 Indian Carriers Supported:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
            <div>• Jio (@jio.com)</div>
            <div>• Airtel (@airtelmail.com)</div>
            <div>• Vodafone (@voda.co.in)</div>
            <div>• Idea (@ideacellular.net)</div>
            <div>• BSNL (@bsnl.co.in)</div>
            <div>• Tata Docomo (@tatadocomo.com)</div>
          </div>
          <p className="text-xs text-blue-700 mt-3">
            💡 <strong>How it works:</strong> We send emails to carrier-specific addresses that forward to SMS. 
            Completely free, no API keys needed!
          </p>
        </div>
      </div>
    </div>
  );
}
