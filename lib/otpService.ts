// Custom OTP Service - India SMS
import { sendOTPViaIndiaSMS } from './indiaSMS';

export interface OTPConfig {
  length: number;
  expiry: number; // in minutes
  maxAttempts: number;
  cooldownPeriod: number; // in minutes
}

export interface OTPResult {
  success: boolean;
  message: string;
  otpId?: string;
  expiresAt?: Date;
  attemptsRemaining?: number;
}

export interface OTPVerificationResult {
  success: boolean;
  message: string;
  isValid: boolean;
  attemptsRemaining?: number;
}

// Default configuration
const defaultConfig: OTPConfig = {
  length: 6,
  expiry: 5, // 5 minutes
  maxAttempts: 3,
  cooldownPeriod: 1 // 1 minute between requests
};

// In-memory storage (replace with database in production)
const otpStorage = new Map<string, {
  otp: string;
  phoneNumber: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}>();

// Rate limiting storage
const rateLimitStorage = new Map<string, {
  lastRequest: Date;
  requestCount: number;
}>();

/**
 * Generate a random OTP
 */
function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

/**
 * Clean expired OTPs
 */
function cleanExpiredOTPs(): void {
  const now = new Date();
  for (const [key, data] of otpStorage.entries()) {
    if (data.expiresAt < now) {
      otpStorage.delete(key);
    }
  }
}

/**
 * Check rate limiting
 */
function checkRateLimit(phoneNumber: string, config: OTPConfig): { allowed: boolean; message?: string } {
  const now = new Date();
  const key = `rate_${phoneNumber}`;
  const rateData = rateLimitStorage.get(key);
  
  if (rateData) {
    const timeDiff = now.getTime() - rateData.lastRequest.getTime();
    const cooldownMs = config.cooldownPeriod * 60 * 1000;
    
    if (timeDiff < cooldownMs) {
      const remainingTime = Math.ceil((cooldownMs - timeDiff) / 1000);
      return {
        allowed: false,
        message: `Please wait ${remainingTime} seconds before requesting another OTP`
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(
  phoneNumber: string, 
  config: OTPConfig = defaultConfig
): Promise<OTPResult> {
  try {
    // Clean expired OTPs
    cleanExpiredOTPs();
    
    // Validate phone number
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return {
        success: false,
        message: 'Invalid phone number format. Please use international format like +91 9876543210'
      };
    }
    
    // Check rate limiting
    const rateCheck = checkRateLimit(phoneNumber, config);
    if (!rateCheck.allowed) {
      return {
        success: false,
        message: rateCheck.message!
      };
    }
    
    // Generate OTP
    const otp = generateOTP(config.length);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + config.expiry * 60 * 1000);
    const otpId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store OTP
    otpStorage.set(otpId, {
      otp,
      phoneNumber,
      createdAt: now,
      expiresAt,
      attempts: 0,
      verified: false
    });
    
    // Update rate limiting
    const rateKey = `rate_${phoneNumber}`;
    rateLimitStorage.set(rateKey, {
      lastRequest: now,
      requestCount: (rateLimitStorage.get(rateKey)?.requestCount || 0) + 1
    });
    
    // Send SMS via Indian carriers
    const smsResult = await sendOTPViaIndiaSMS(phoneNumber, otp, config.expiry);
    
    if (!smsResult.success) {
      // Remove OTP from storage if SMS failed
      otpStorage.delete(otpId);
      return {
        success: false,
        message: `Failed to send SMS: ${smsResult.error}`
      };
    }
    
    console.log(`📱 OTP sent via ${smsResult.carrier} to ${phoneNumber}: ${otp}`);
    
    return {
      success: true,
      message: `OTP sent to ${phoneNumber}`,
      otpId,
      expiresAt
    };
    
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.'
    };
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(
  otpId: string,
  enteredOTP: string,
  config: OTPConfig = defaultConfig
): Promise<OTPVerificationResult> {
  try {
    // Clean expired OTPs
    cleanExpiredOTPs();
    
    // Get OTP data
    const otpData = otpStorage.get(otpId);
    if (!otpData) {
      return {
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.',
        isValid: false
      };
    }
    
    // Check if already verified
    if (otpData.verified) {
      return {
        success: false,
        message: 'OTP has already been used. Please request a new OTP.',
        isValid: false
      };
    }
    
    // Check attempts
    if (otpData.attempts >= config.maxAttempts) {
      otpStorage.delete(otpId);
      return {
        success: false,
        message: 'Maximum attempts exceeded. Please request a new OTP.',
        isValid: false
      };
    }
    
    // Check expiry
    if (otpData.expiresAt < new Date()) {
      otpStorage.delete(otpId);
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
        isValid: false
      };
    }
    
    // Increment attempts
    otpData.attempts++;
    
    // Verify OTP
    if (otpData.otp === enteredOTP) {
      otpData.verified = true;
      return {
        success: true,
        message: 'OTP verified successfully!',
        isValid: true
      };
    } else {
      const attemptsRemaining = config.maxAttempts - otpData.attempts;
      
      if (attemptsRemaining <= 0) {
        otpStorage.delete(otpId);
        return {
          success: false,
          message: 'Maximum attempts exceeded. Please request a new OTP.',
          isValid: false
        };
      }
      
      return {
        success: false,
        message: `Invalid OTP. ${attemptsRemaining} attempts remaining.`,
        isValid: false,
        attemptsRemaining
      };
    }
    
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      message: 'Failed to verify OTP. Please try again.',
      isValid: false
    };
  }
}

/**
 * Get OTP status
 */
export function getOTPStatus(otpId: string): {
  exists: boolean;
  verified: boolean;
  expired: boolean;
  attemptsRemaining: number;
} {
  const otpData = otpStorage.get(otpId);
  if (!otpData) {
    return {
      exists: false,
      verified: false,
      expired: true,
      attemptsRemaining: 0
    };
  }
  
  const now = new Date();
  const expired = otpData.expiresAt < now;
  const attemptsRemaining = Math.max(0, defaultConfig.maxAttempts - otpData.attempts);
  
  return {
    exists: true,
    verified: otpData.verified,
    expired,
    attemptsRemaining
  };
}

/**
 * Clean up expired OTPs (call this periodically)
 */
export function cleanupExpiredOTPs(): void {
  cleanExpiredOTPs();
}

/**
 * Get statistics
 */
export function getOTPStats(): {
  activeOTPs: number;
  totalRateLimited: number;
} {
  const now = new Date();
  const activeOTPs = Array.from(otpStorage.values()).filter(
    data => data.expiresAt > now && !data.verified
  ).length;
  
  const totalRateLimited = rateLimitStorage.size;
  
  return {
    activeOTPs,
    totalRateLimited
  };
}
