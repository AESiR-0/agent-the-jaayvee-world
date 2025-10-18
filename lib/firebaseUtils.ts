import { 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential,
  User
} from 'firebase/auth';
import { auth, createRecaptchaVerifier, clearRecaptchaVerifier } from './firebaseClient';
import { API_BASE_URL } from './utils';
import { isTestPhoneNumber, createMockVerification, verifyMockOTP } from './devAuth';

// Ensure Firebase is initialized before use
const ensureFirebaseInitialized = () => {
  if (typeof window !== 'undefined' && !auth) {
    // Re-import to trigger initialization
    import('./firebaseClient');
  }
};

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface BackendAuthResult {
  agentId: string;
  userId: string;
  displayName: string;
}

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phoneNumber: string, recaptchaElementId: string = 'recaptcha-container'): Promise<{ success: boolean; verificationId?: string; error?: string }> => {
  try {
    // Check if this is a test phone number in development
    if (process.env.NODE_ENV === 'development' && isTestPhoneNumber(phoneNumber)) {
      console.log('🧪 Development mode: Using mock authentication for test number');
      const mockVerification = createMockVerification(phoneNumber);
      return {
        success: true,
        verificationId: mockVerification.verificationId
      };
    }
    
    // Ensure Firebase is initialized for real numbers
    ensureFirebaseInitialized();
    
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    
    // Check for test phone numbers (Indian numbers)
    const testPhoneNumbers = [
      '+91 9876543210',  // Indian test number
      '+91 9876543211',  // Indian test number
      '+91 9876543212',  // Indian test number
      '+91 9999999999',  // Indian test number
      '+91 8888888888',  // Indian test number
    ];
    
    if (testPhoneNumbers.includes(phoneNumber)) {
      console.log('🧪 Using test phone number - OTP will be: 123456');
    }
    
    // Clear any existing reCAPTCHA
    clearRecaptchaVerifier(recaptchaElementId);
    
    const recaptchaVerifier = createRecaptchaVerifier(recaptchaElementId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    
    return {
      success: true,
      verificationId: confirmationResult.verificationId
    };
  } catch (error: any) {
    console.error('Send OTP error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/too-many-requests') {
      return {
        success: false,
        error: 'Too many requests. Please wait 1-2 hours before trying again, or use a test phone number: +1 650-555-3434'
      };
    } else if (error.code === 'auth/invalid-phone-number') {
      return {
        success: false,
        error: 'Invalid phone number format. Please use international format like +91 9876543210'
      };
    } else if (error.code === 'auth/invalid-app-credential') {
      return {
        success: false,
        error: 'Firebase configuration error. Please check your Firebase setup.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to send OTP'
    };
  }
};

/**
 * Verify OTP and authenticate user
 */
export const verifyOTP = async (verificationId: string, otp: string): Promise<AuthResult> => {
  try {
    // Check if this is a mock verification (development mode)
    if (verificationId.startsWith('mock_')) {
      console.log('🧪 Development mode: Verifying mock OTP');
      if (verifyMockOTP(verificationId, otp)) {
        // Create a mock user object
        const mockUser = {
          uid: `mock_${Date.now()}`,
          phoneNumber: verificationId.split('_')[2],
          getIdToken: async () => 'mock_token_' + Date.now()
        } as any;
        
        return {
          success: true,
          user: mockUser
        };
      } else {
        return {
          success: false,
          error: 'Invalid OTP. Use 123456 for test numbers.'
        };
      }
    }
    
    // Ensure Firebase is initialized for real verification
    ensureFirebaseInitialized();
    
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);
    
    return {
      success: true,
      user: result.user
    };
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: error.message || 'Invalid OTP'
    };
  }
};

/**
 * Verify Firebase token with backend
 */
export const verifyTokenWithBackend = async (idToken: string): Promise<BackendAuthResult> => {
  try {
    console.log('🔗 Attempting to verify token with backend:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/agents/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Token verification failed');
    }

    const data = await response.json();
    console.log('✅ Backend verification successful');
    return data;
  } catch (error: any) {
    console.error('❌ Backend verification error:', error);
    
    // If it's a network error and we're in development, provide a fallback
    if (process.env.NODE_ENV === 'development' && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.log('🧪 Development mode: Using mock backend response');
      return {
        agentId: 'DEV_AGENT_001',
        userId: 'DEV_USER_001',
        displayName: 'Development Agent'
      };
    }
    
    throw new Error(error.message || 'Backend verification failed');
  }
};

/**
 * Complete authentication flow
 */
export const completeAuth = async (
  verificationId: string, 
  otp: string
): Promise<{ success: boolean; data?: BackendAuthResult; error?: string }> => {
  try {
    // Verify OTP
    const otpResult = await verifyOTP(verificationId, otp);
    if (!otpResult.success || !otpResult.user) {
      return { success: false, error: otpResult.error };
    }

    // Get Firebase token
    const idToken = await otpResult.user.getIdToken();
    
    // Verify with backend
    const backendResult = await verifyTokenWithBackend(idToken);
    
    return {
      success: true,
      data: backendResult
    };
  } catch (error: any) {
    console.error('Complete auth error:', error);
    return {
      success: false,
      error: error.message || 'Authentication failed'
    };
  }
};

/**
 * Store user data in localStorage
 */
export const storeUserData = (data: BackendAuthResult, firebaseToken: string) => {
  localStorage.setItem('agentId', data.agentId);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('displayName', data.displayName);
  localStorage.setItem('firebaseToken', firebaseToken);
  console.log('✅ User data stored in localStorage');
};

/**
 * Clear user data from localStorage
 */
export const clearUserData = () => {
  localStorage.removeItem('agentId');
  localStorage.removeItem('userId');
  localStorage.removeItem('displayName');
  localStorage.removeItem('firebaseToken');
  console.log('✅ User data cleared from localStorage');
};

/**
 * Get stored user data
 */
export const getStoredUserData = () => {
  return {
    agentId: localStorage.getItem('agentId'),
    userId: localStorage.getItem('userId'),
    displayName: localStorage.getItem('displayName'),
    firebaseToken: localStorage.getItem('firebaseToken')
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const { agentId, userId, firebaseToken } = getStoredUserData();
  return !!(agentId && userId && firebaseToken);
};
