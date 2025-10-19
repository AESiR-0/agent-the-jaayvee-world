// Free Email-to-SMS Service
export interface EmailToSMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Carrier email mappings
const CARRIER_EMAILS = {
  // US Carriers
  'verizon': '@vtext.com',
  'att': '@txt.att.net', 
  'tmobile': '@tmomail.net',
  'sprint': '@messaging.sprintpcs.com',
  'boost': '@myboostmobile.com',
  'cricket': '@sms.cricketwireless.net',
  'metropcs': '@mymetropcs.com',
  'uscellular': '@email.uscc.net',
  
  // International
  'airtel_india': '@airtelmail.com',
  'vodafone_india': '@voda.co.in',
  'jio_india': '@jio.com',
  'idea_india': '@ideacellular.net',
  
  // UK
  'vodafone_uk': '@vodafone.net',
  'o2_uk': '@o2.co.uk',
  'ee_uk': '@ee.co.uk',
  
  // Canada
  'bell_canada': '@txt.bell.ca',
  'rogers_canada': '@pcs.rogers.com',
  'telus_canada': '@msg.telus.com'
};

export class EmailToSMSService {
  name = 'Email-to-SMS';
  
  async sendSMS(phoneNumber: string, message: string): Promise<EmailToSMSResult> {
    try {
      console.log(`📧 [Email-to-SMS] Sending to ${phoneNumber}: ${message}`);
      
      // Extract 10-digit number
      const cleanNumber = phoneNumber.replace(/[^\d]/g, '').slice(-10);
      
      if (cleanNumber.length !== 10) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }
      
      // Try multiple carriers (in order of popularity)
      const carriers = ['verizon', 'att', 'tmobile', 'sprint', 'boost', 'cricket'];
      
      for (const carrier of carriers) {
        const emailAddress = `${cleanNumber}${CARRIER_EMAILS[carrier as keyof typeof CARRIER_EMAILS]}`;
        
        console.log(`📧 [Email-to-SMS] Trying ${carrier}: ${emailAddress}`);
        
        // In a real implementation, you would send email here
        // For now, we'll just log it
        console.log(`📧 [Email-to-SMS] Email would be sent to: ${emailAddress}`);
        console.log(`📧 [Email-to-SMS] Subject: OTP Code`);
        console.log(`📧 [Email-to-SMS] Body: ${message}`);
        
        // For demo purposes, we'll assume success
        return {
          success: true,
          messageId: `email_${carrier}_${Date.now()}`
        };
      }
      
      return {
        success: false,
        error: 'No suitable carrier found'
      };
      
    } catch (error: any) {
      console.error('Email-to-SMS error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Simple email sending function (using Node.js built-in)
export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // This would use Node.js built-in email capabilities
    // For now, we'll just log it
    console.log(`📧 [Email] To: ${to}`);
    console.log(`📧 [Email] Subject: ${subject}`);
    console.log(`📧 [Email] Body: ${body}`);
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Get carrier email for phone number
export function getCarrierEmail(phoneNumber: string): string | null {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '').slice(-10);
  
  if (cleanNumber.length !== 10) {
    return null;
  }
  
  // Default to Verizon (most popular in US)
  return `${cleanNumber}@vtext.com`;
}

// Send OTP via email-to-SMS
export async function sendOTPViaEmail(
  phoneNumber: string,
  otp: string,
  expiryMinutes: number = 5
): Promise<EmailToSMSResult> {
  try {
    const emailAddress = getCarrierEmail(phoneNumber);
    
    if (!emailAddress) {
      return {
        success: false,
        error: 'Invalid phone number format'
      };
    }
    
    const subject = 'Your OTP Code';
    const body = `Your OTP is: ${otp}\n\nValid for ${expiryMinutes} minutes.\n\nDo not share this code with anyone.`;
    
    const result = await sendEmail(emailAddress, subject, body);
    
    if (result.success) {
      console.log(`📱 [Email-to-SMS] OTP sent to ${phoneNumber} via ${emailAddress}: ${otp}`);
      return {
        success: true,
        messageId: `email_${Date.now()}`
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
