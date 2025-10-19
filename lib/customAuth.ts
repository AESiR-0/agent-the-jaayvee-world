// Custom Authentication Service
import { sendOTP, verifyOTP, OTPResult, OTPVerificationResult } from './otpService';

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    phoneNumber: string;
    verified: boolean;
    createdAt: Date;
  };
  error?: string;
}

export interface CustomAuthConfig {
  otpLength: number;
  otpExpiry: number; // in minutes
  maxAttempts: number;
  cooldownPeriod: number; // in minutes
}

// Default configuration
const defaultAuthConfig: CustomAuthConfig = {
  otpLength: 6,
  otpExpiry: 5,
  maxAttempts: 3,
  cooldownPeriod: 1
};

// In-memory user storage (replace with database in production)
const userStorage = new Map<string, {
  id: string;
  phoneNumber: string;
  verified: boolean;
  createdAt: Date;
  lastLogin: Date;
}>();

/**
 * Send OTP for authentication
 */
export async function sendAuthOTP(
  phoneNumber: string,
  config: CustomAuthConfig = defaultAuthConfig
): Promise<OTPResult> {
  try {
    console.log('🔍 Sending auth OTP to:', phoneNumber);
    
    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return {
        success: false,
        message: 'Invalid phone number format. Please use international format like +91 9876543210'
      };
    }
    
    // Send OTP
    const result = await sendOTP(phoneNumber, {
      length: config.otpLength,
      expiry: config.otpExpiry,
      maxAttempts: config.maxAttempts,
      cooldownPeriod: config.cooldownPeriod
    });
    
    if (result.success) {
      console.log('✅ Auth OTP sent successfully');
    } else {
      console.log('❌ Failed to send auth OTP:', result.message);
    }
    
    return result;
    
  } catch (error: any) {
    console.error('Send auth OTP error:', error);
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.'
    };
  }
}

/**
 * Verify OTP and authenticate user
 */
export async function verifyAuthOTP(
  otpId: string,
  otp: string,
  phoneNumber: string,
  config: CustomAuthConfig = defaultAuthConfig
): Promise<AuthResult> {
  try {
    console.log('🔍 Verifying auth OTP:', otp);
    console.log('📱 Phone number:', phoneNumber);
    
    // Verify OTP
    const otpResult = await verifyOTP(otpId, otp, {
      length: config.otpLength,
      expiry: config.otpExpiry,
      maxAttempts: config.maxAttempts,
      cooldownPeriod: config.cooldownPeriod
    });
    
    if (!otpResult.success || !otpResult.isValid) {
      return {
        success: false,
        error: otpResult.message
      };
    }
    
    // Create or update user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    // Check if user already exists
    let existingUser = null;
    for (const [id, user] of userStorage.entries()) {
      if (user.phoneNumber === phoneNumber) {
        existingUser = user;
        break;
      }
    }
    
    if (existingUser) {
      // Update existing user
      existingUser.verified = true;
      existingUser.lastLogin = now;
      console.log('✅ Updated existing user:', existingUser.id);
      
      return {
        success: true,
        user: {
          id: existingUser.id,
          phoneNumber: existingUser.phoneNumber,
          verified: existingUser.verified,
          createdAt: existingUser.createdAt
        }
      };
    } else {
      // Create new user
      const newUser = {
        id: userId,
        phoneNumber,
        verified: true,
        createdAt: now,
        lastLogin: now
      };
      
      userStorage.set(userId, newUser);
      console.log('✅ Created new user:', userId);
      
      return {
        success: true,
        user: {
          id: newUser.id,
          phoneNumber: newUser.phoneNumber,
          verified: newUser.verified,
          createdAt: newUser.createdAt
        }
      };
    }
    
  } catch (error: any) {
    console.error('Verify auth OTP error:', error);
    return {
      success: false,
      error: 'Authentication failed. Please try again.'
    };
  }
}

/**
 * Get user by ID
 */
export function getUserById(userId: string): AuthResult['user'] | null {
  const user = userStorage.get(userId);
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    phoneNumber: user.phoneNumber,
    verified: user.verified,
    createdAt: user.createdAt
  };
}

/**
 * Get user by phone number
 */
export function getUserByPhone(phoneNumber: string): AuthResult['user'] | null {
  for (const [id, user] of userStorage.entries()) {
    if (user.phoneNumber === phoneNumber) {
      return {
        id: user.id,
        phoneNumber: user.phoneNumber,
        verified: user.verified,
        createdAt: user.createdAt
      };
    }
  }
  return null;
}

/**
 * Sign out user
 */
export function signOutUser(userId: string): { success: boolean; message: string } {
  const user = userStorage.get(userId);
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }
  
  console.log('✅ User signed out:', userId);
  return {
    success: true,
    message: 'Signed out successfully'
  };
}

/**
 * Get all users (for admin purposes)
 */
export function getAllUsers(): AuthResult['user'][] {
  return Array.from(userStorage.values()).map(user => ({
    id: user.id,
    phoneNumber: user.phoneNumber,
    verified: user.verified,
    createdAt: user.createdAt
  }));
}

/**
 * Get user statistics
 */
export function getUserStats(): {
  totalUsers: number;
  verifiedUsers: number;
  recentLogins: number; // last 24 hours
} {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const users = Array.from(userStorage.values());
  const verifiedUsers = users.filter(user => user.verified);
  const recentLogins = users.filter(user => user.lastLogin > oneDayAgo);
  
  return {
    totalUsers: users.length,
    verifiedUsers: verifiedUsers.length,
    recentLogins: recentLogins.length
  };
}
