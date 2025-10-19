// SMTP2GO Test API Route
import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfig, getEmailServiceStatus } from '@/lib/emailService';
import { sendOTPViaIndiaSMS } from '@/lib/indiaSMS';

export async function POST(request: NextRequest) {
  try {
    const { action, phoneNumber, otp } = await request.json();
    
    switch (action) {
      case 'test-config':
        console.log('🧪 [API] Testing SMTP2GO configuration...');
        const configResult = await testEmailConfig();
        return NextResponse.json(configResult);
        
      case 'test-sms':
        if (!phoneNumber || !otp) {
          return NextResponse.json(
            { success: false, error: 'Phone number and OTP are required' },
            { status: 400 }
          );
        }
        
        console.log('🧪 [API] Testing Indian SMS with SMTP2GO...');
        const smsResult = await sendOTPViaIndiaSMS(phoneNumber, otp, 5);
        return NextResponse.json(smsResult);
        
      case 'get-status':
        const status = getEmailServiceStatus();
        return NextResponse.json({ success: true, ...status });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error: any) {
    console.error('❌ [API] SMTP2GO Test Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
