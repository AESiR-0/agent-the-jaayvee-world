import { 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential,
  User
} from 'firebase/auth';
import { auth, createRecaptchaVerifier, clearRecaptchaVerifier } from './firebaseClient';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Phone number validation and formatting
const validateAndFormatPhoneNumber = (phoneNumber: string): string => {
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0')) {
      cleaned = '+91 ' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      cleaned = '+91 ' + cleaned;
    } else {
      cleaned = '+91 ' + cleaned;
    }
  }
  
  // Validate the format
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(cleaned)) {
    throw new Error('Invalid phone number format. Please use international format like +91 9876543210');
  }
  
  return cleaned;
};

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phoneNumber: string, recaptchaElementId: string = 'recaptcha-container'): Promise<{ success: boolean; verificationId?: string; error?: string }> => {
  try {
    console.log('🔍 Sending OTP to:', phoneNumber);
    
    const formattedPhoneNumber = validateAndFormatPhoneNumber(phoneNumber);
    console.log('📱 Formatted phone number:', formattedPhoneNumber);
    
    clearRecaptchaVerifier(recaptchaElementId);
    console.log('🧹 Cleared reCAPTCHA');
    
    const recaptchaVerifier = createRecaptchaVerifier(recaptchaElementId);
    console.log('🔐 Created reCAPTCHA verifier');
    
    console.log('📞 Calling signInWithPhoneNumber...');
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
    console.log('✅ OTP sent successfully!', confirmationResult.verificationId);
    
    return {
      success: true,
      verificationId: confirmationResult.verificationId
    };
  } catch (error: any) {
    console.error('❌ Send OTP error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
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
    } else if (error.message && error.message.includes('Invalid phone number format')) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to send OTP. Please try again.'
    };
  }
};

export const verifyOTP = async (verificationId: string, otp: string): Promise<AuthResult> => {
  try {
    console.log('🔍 Verifying OTP:', otp);
    console.log('🔑 Verification ID:', verificationId);
    
    if (!otp || otp.length < 4 || otp.length > 8) {
      console.log('❌ Invalid OTP format');
      return {
        success: false,
        error: 'Invalid OTP format. Please enter the 6-digit code sent to your phone.'
      };
    }
    
    console.log('🔐 Creating credential...');
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    console.log('✅ Credential created');
    
    console.log('🔑 Signing in with credential...');
    const result = await signInWithCredential(auth, credential);
    console.log('✅ Authentication successful!', result.user.uid);
    
    return {
      success: true,
      user: result.user
    };
  } catch (error: any) {
    console.error('❌ Verify OTP error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'auth/invalid-verification-code') {
      return {
        success: false,
        error: 'Invalid OTP. Please check the code and try again.'
      };
    } else if (error.code === 'auth/code-expired') {
      return {
        success: false,
        error: 'OTP has expired. Please request a new code.'
      };
    } else if (error.code === 'auth/invalid-verification-id') {
      return {
        success: false,
        error: 'Verification session expired. Please start the process again.'
      };
    } else if (error.code === 'auth/network-request-failed') {
      return {
        success: false,
        error: 'Network error. Please check your internet connection and try again.'
      };
    } else if (error.code === 'auth/too-many-requests') {
      return {
        success: false,
        error: 'Too many failed attempts. Please wait before trying again.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Invalid OTP. Please try again.'
    };
  }
};

export const completeAuth = async (
  verificationId: string, 
  otp: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const otpResult = await verifyOTP(verificationId, otp);
    if (!otpResult.success || !otpResult.user) {
      return { success: false, error: otpResult.error };
    }

    const idToken = await otpResult.user.getIdToken();
    
    localStorage.setItem('firebaseToken', idToken);
    
    return {
      success: true,
      user: otpResult.user
    };
  } catch (error: any) {
    console.error('Complete auth error:', error);
    return {
      success: false,
      error: error.message || 'Authentication failed'
    };
  }
};
