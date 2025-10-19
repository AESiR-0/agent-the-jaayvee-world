// SMS Provider Integration
export interface SMSProvider {
  name: string;
  sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Twilio SMS Provider
export class TwilioSMSProvider implements SMSProvider {
  name = 'Twilio';
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }

  async sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In production, you would use the actual Twilio SDK
      // const client = require('twilio')(this.accountSid, this.authToken);
      // const result = await client.messages.create({
      //   body: message,
      //   from: this.fromNumber,
      //   to: phoneNumber
      // });
      
      console.log(`📱 [Twilio] Sending SMS to ${phoneNumber}: ${message}`);
      
      // Mock response for development
      return {
        success: true,
        messageId: `twilio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error: any) {
      console.error('Twilio SMS error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS via Twilio'
      };
    }
  }
}

// AWS SNS Provider
export class AWSSNSProvider implements SMSProvider {
  name = 'AWS SNS';
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    this.region = region;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
  }

  async sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In production, you would use the actual AWS SDK
      // const AWS = require('aws-sdk');
      // const sns = new AWS.SNS({
      //   region: this.region,
      //   accessKeyId: this.accessKeyId,
      //   secretAccessKey: this.secretAccessKey
      // });
      // const result = await sns.publish({
      //   Message: message,
      //   PhoneNumber: phoneNumber
      // }).promise();
      
      console.log(`📱 [AWS SNS] Sending SMS to ${phoneNumber}: ${message}`);
      
      // Mock response for development
      return {
        success: true,
        messageId: `aws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error: any) {
      console.error('AWS SNS SMS error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS via AWS SNS'
      };
    }
  }
}

// Console SMS Provider (for development)
export class ConsoleSMSProvider implements SMSProvider {
  name = 'Console';

  async sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`📱 [Console SMS] To: ${phoneNumber}`);
    console.log(`📱 [Console SMS] Message: ${message}`);
    console.log(`📱 [Console SMS] ================================`);
    
    return {
      success: true,
      messageId: `console_${Date.now()}`
    };
  }
}

// SMS Provider Factory
export class SMSProviderFactory {
  static createProvider(type: 'twilio' | 'aws' | 'console', config?: any): SMSProvider {
    switch (type) {
      case 'twilio':
        return new TwilioSMSProvider(
          config.accountSid,
          config.authToken,
          config.fromNumber
        );
      case 'aws':
        return new AWSSNSProvider(
          config.region,
          config.accessKeyId,
          config.secretAccessKey
        );
      case 'console':
      default:
        return new ConsoleSMSProvider();
    }
  }
}

// Environment-based SMS Provider
export function getSMSProvider(): SMSProvider {
  const providerType = process.env.SMS_PROVIDER || 'console';
  
  switch (providerType) {
    case 'twilio':
      return SMSProviderFactory.createProvider('twilio', {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_FROM_NUMBER
      });
    case 'aws':
      return SMSProviderFactory.createProvider('aws', {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });
    default:
      return SMSProviderFactory.createProvider('console');
  }
}
