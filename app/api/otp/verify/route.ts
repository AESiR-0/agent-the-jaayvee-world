// Free OTP Verify API
import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otpService';

export async function POST(request: NextRequest) {
  try {
    const { otpId, otp } = await request.json();
    
    if (!otpId || !otp) {
      return NextResponse.json(
        { success: false, error: 'OTP ID and OTP are required' },
        { status: 400 }
      );
    }
    
    // Verify OTP
    const result = await verifyOTP(otpId, otp);
    
    if (result.success && result.isValid) {
      return NextResponse.json({
        success: true,
        message: result.message,
        isValid: true
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.message,
          attemptsRemaining: result.attemptsRemaining 
        },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('OTP verify API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
