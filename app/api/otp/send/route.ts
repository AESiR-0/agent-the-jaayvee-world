// Free OTP Send API
import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/otpService';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();
    
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    // Send OTP
    const result = await sendOTP(phoneNumber);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        otpId: result.otpId,
        expiresAt: result.expiresAt
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('OTP send API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
