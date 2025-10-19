'use client';

import { useState, useEffect } from 'react';
// Remove direct imports - we'll use API routes instead

export default function TestSMTP2GOPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('123456');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConfig = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing SMTP2GO configuration...');
      const response = await fetch('/api/test-smtp2go', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-config' }),
      });

      const result = await response.json();
      setResult(result);
      console.log('📧 SMTP2GO Test Result:', result);
    } catch (error: any) {
      console.error('❌ SMTP2GO Test Error:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSMS = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testing Indian SMS with SMTP2GO...');
      const response = await fetch('/api/test-smtp2go', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'test-sms',
          phoneNumber,
          otp
        }),
      });

      const result = await response.json();
      setResult(result);
      console.log('📱 SMS Test Result:', result);
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

  const [emailStatus, setEmailStatus] = useState({ configured: false, host: '', port: 0, from: '' });

  // Load email status on mount
  useEffect(() => {
    const loadEmailStatus = async () => {
      try {
        const response = await fetch('/api/test-smtp2go', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'get-status' }),
        });
        const result = await response.json();
        if (result.success) {
          setEmailStatus({
            configured: result.configured,
            host: result.host,
            port: result.port,
            from: result.from
          });
        }
      } catch (error) {
        console.error('Failed to load email status:', error);
      }
    };
    
    loadEmailStatus();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            📧 SMTP2GO Integration Test
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Test email sending via SMTP2GO to Indian carrier gateways
          </p>
        </div>

        {/* Email Service Status */}
        <div className={`p-4 rounded-xl border ${
          emailStatus.configured 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h3 className="font-medium text-sm mb-2">
            {emailStatus.configured ? '✅ Email Service Configured' : '❌ Email Service Not Configured'}
          </h3>
          <div className="text-xs text-foreground/80">
            <p><strong>Host:</strong> {emailStatus.host}</p>
            <p><strong>Port:</strong> {emailStatus.port}</p>
            <p><strong>From:</strong> {emailStatus.from || 'Not set'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-soft p-8 space-y-6">
          {/* Test Email Configuration */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">1. Test SMTP2GO Connection</h3>
            <button
              onClick={handleTestConfig}
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : '🔧 Test SMTP2GO Connection'}
            </button>
          </div>

          {/* Test SMS Sending */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">2. Test SMS Sending</h3>
            
            <div className="space-y-4">
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

              <button
                onClick={handleTestSMS}
                disabled={isLoading || !phoneNumber}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : '📱 Send Test SMS'}
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className={`p-4 rounded-xl border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-medium text-sm mb-2">
                {result.success ? '✅ Test Result' : '❌ Test Failed'}
              </h3>
              <pre className="text-xs text-foreground/80 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-3">📋 How to Test:</h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. <strong>Test Connection:</strong> Click "Test SMTP2GO Connection" to verify your credentials</li>
            <li>2. <strong>Enter Phone Number:</strong> Use format +91 9876543210 or 9876543210</li>
            <li>3. <strong>Send SMS:</strong> Click "Send Test SMS" to send via email-to-SMS</li>
            <li>4. <strong>Check SMTP2GO Dashboard:</strong> Verify emails are being sent</li>
            <li>5. <strong>Check Phone:</strong> The SMS should arrive on the phone</li>
          </ol>
          <p className="text-xs text-blue-700 mt-3">
            💡 <strong>Note:</strong> SMS delivery depends on carrier email-to-SMS gateway availability. 
            Jio and Airtel usually work best.
          </p>
        </div>
      </div>
    </div>
  );
}
