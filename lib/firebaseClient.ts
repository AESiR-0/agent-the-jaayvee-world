import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

// Export Firebase functions
export { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential };

const firebaseConfig = {
  apiKey: "AIzaSyBq0Mxkl0CASEi3MfyTnZUP7R071u3rnu0",
  authDomain: "tjw-otp-service.firebaseapp.com",
  projectId: "tjw-otp-service",
  storageBucket: "tjw-otp-service.firebasestorage.app",
  messagingSenderId: "236468227907",
  appId: "1:236468227907:web:78ce6d56be0907a2bfe9f6"
};

console.log('Firebase Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const createRecaptchaVerifier = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'normal',
    callback: (response: any) => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
};

export const clearRecaptchaVerifier = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
    console.log('✅ User signed out');
  } catch (error) {
    console.error('❌ Sign out failed:', error);
    throw error;
  }
};


// Verify OTP and authenticate user
export const verifyOTP = async (verificationId: string, otp: string): Promise<{ success: boolean; user?: any; error?: string }> => {
  try {
    console.log('🔍 Verifying OTP:', otp);
    console.log('🔑 Verification ID:', verificationId);
    
    // Validate OTP format
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
    
    // Handle specific Firebase errors
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
