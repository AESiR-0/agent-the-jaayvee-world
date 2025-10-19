// Free SMS for India - Email-to-SMS Gateways
import { sendOTPEmail } from './emailService';

export interface IndiaSMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  carrier?: string;
}

// Indian carrier email mappings
const INDIA_CARRIER_EMAILS = {
  // Major Indian carriers
  'airtel': '@airtelmail.com',
  'vodafone': '@voda.co.in', 
  'jio': '@jio.com',
  'idea': '@ideacellular.net',
  'bsnl': '@bsnl.co.in',
  'tata_docomo': '@tatadocomo.com',
  'reliance': '@rcom.co.in',
  'uninor': '@uninor.in',
  'mts': '@mtsindia.in',
  'aircel': '@aircel.co.in',
  'videocon': '@videoconmobile.com',
  'loop': '@loopmobile.in'
};

export class IndiaSMSService {
  name = 'India Email-to-SMS';
  
  async sendSMS(phoneNumber: string, message: string): Promise<IndiaSMSResult> {
    try {
      console.log(`📱 [India SMS] Sending to ${phoneNumber}: ${message}`);
      
      // Extract 10-digit Indian number
      const cleanNumber = this.extractIndianNumber(phoneNumber);
      
      if (!cleanNumber) {
        return {
          success: false,
          error: 'Invalid Indian phone number format'
        };
      }
      
      // Try major Indian carriers in order of popularity
      const carriers = ['jio', 'airtel', 'vodafone', 'idea', 'bsnl'];
      
      for (const carrier of carriers) {
        const emailAddress = `${cleanNumber}${INDIA_CARRIER_EMAILS[carrier as keyof typeof INDIA_CARRIER_EMAILS]}`;
        
        console.log(`📧 [India SMS] Trying ${carrier}: ${emailAddress}`);
        console.log(`📧 [India SMS] Message: ${message}`);
        
        // Send real email via SMTP2GO
        const emailResult = await sendOTPEmail(emailAddress, message, carrier, 5);
        
        if (emailResult.success) {
          console.log(`✅ [India SMS] OTP sent via ${carrier} to ${phoneNumber}: ${message}`);
          console.log(`📧 [India SMS] Email ID: ${emailResult.messageId}`);
          
          return {
            success: true,
            messageId: emailResult.messageId,
            carrier: carrier
          };
        } else {
          console.log(`❌ [India SMS] Failed to send via ${carrier}: ${emailResult.error}`);
          // Try next carrier
          continue;
        }
      }
      
      return {
        success: false,
        error: 'No suitable Indian carrier found'
      };
      
    } catch (error: any) {
      console.error('India SMS error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  private extractIndianNumber(phoneNumber: string): string | null {
    // Remove all non-digits
    let cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    
    // Handle different Indian number formats
    if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
      // +91 9876543210 format
      cleanNumber = cleanNumber.substring(2);
    } else if (cleanNumber.startsWith('0') && cleanNumber.length === 11) {
      // 0 9876543210 format
      cleanNumber = cleanNumber.substring(1);
    } else if (cleanNumber.length === 10) {
      // 9876543210 format
      // Already correct
    } else {
      return null;
    }
    
    // Validate Indian mobile number
    if (cleanNumber.length !== 10) {
      return null;
    }
    
    // Check if it's a valid Indian mobile number
    const firstDigit = cleanNumber[0];
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      return null;
    }
    
    return cleanNumber;
  }
}

// Send OTP via Indian carriers
export async function sendOTPViaIndiaSMS(
  phoneNumber: string,
  otp: string,
  expiryMinutes: number = 5
): Promise<IndiaSMSResult> {
  try {
    const smsService = new IndiaSMSService();
    const message = `Your OTP is: ${otp}\n\nValid for ${expiryMinutes} minutes.\n\nDo not share this code with anyone.\n\n- The Jaayvee World`;
    
    return await smsService.sendSMS(phoneNumber, message);
    
  } catch (error: any) {
    console.error('❌ [India SMS] Error in sendOTPViaIndiaSMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get carrier info for Indian number
export function getIndianCarrierInfo(phoneNumber: string): {
  carrier: string;
  emailAddress: string;
  isValid: boolean;
} {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '').slice(-10);
  
  if (cleanNumber.length !== 10) {
    return {
      carrier: 'unknown',
      emailAddress: '',
      isValid: false
    };
  }
  
  // Try to determine carrier by number prefix
  const prefix = cleanNumber.substring(0, 4);
  
  // Jio numbers (usually start with 6, 7, 8, 9)
  if (['6000', '7000', '8000', '9000'].includes(prefix)) {
    return {
      carrier: 'jio',
      emailAddress: `${cleanNumber}@jio.com`,
      isValid: true
    };
  }
  
  // Airtel numbers
  if (['6001', '7001', '8001', '9001'].includes(prefix)) {
    return {
      carrier: 'airtel',
      emailAddress: `${cleanNumber}@airtelmail.com`,
      isValid: true
    };
  }
  
  // Default to Jio (most popular)
  return {
    carrier: 'jio',
    emailAddress: `${cleanNumber}@jio.com`,
    isValid: true
  };
}

// Test Indian SMS service
export async function testIndianSMS(): Promise<void> {
  console.log('🧪 Testing Indian SMS Service...');
  
  const testNumbers = [
    '+91 9876543210',
    '+91 8765432109',
    '+91 7654321098',
    '9876543210',
    '0 9876543210'
  ];
  
  for (const number of testNumbers) {
    console.log(`\n📱 Testing: ${number}`);
    const result = await sendOTPViaIndiaSMS(number, '123456', 5);
    console.log(`Result: ${result.success ? '✅ Success' : '❌ Failed'}`);
    if (result.carrier) {
      console.log(`Carrier: ${result.carrier}`);
    }
  }
}
