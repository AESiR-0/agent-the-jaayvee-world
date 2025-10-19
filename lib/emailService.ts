// Email Service with SMTP2GO Integration
import nodemailer from 'nodemailer';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

// Get email configuration from environment variables
function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST || 'mail.smtp2go.com',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || ''
  };
}

// Create SMTP transporter
function createTransporter() {
  const config = getEmailConfig();
  
  if (!config.user || !config.pass || !config.from) {
    throw new Error('SMTP2GO configuration missing. Please check environment variables.');
  }
  
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      rejectUnauthorized: false // For development
    }
  });
}

// Send email function
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<EmailResult> {
  try {
    console.log(`📧 [Email Service] Sending email to: ${to}`);
    console.log(`📧 [Email Service] Subject: ${subject}`);
    
    const transporter = createTransporter();
    const config = getEmailConfig();
    
    const mailOptions = {
      from: `"The Jaayvee World" <${config.from}>`,
      to: to,
      subject: subject,
      text: text,
      html: html || text.replace(/\n/g, '<br>')
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ [Email Service] Email sent successfully: ${result.messageId}`);
    
    return {
      success: true,
      messageId: result.messageId
    };
    
  } catch (error: any) {
    console.error('❌ [Email Service] Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email'
    };
  }
}

// Send OTP email to carrier gateway
export async function sendOTPEmail(
  phoneNumber: string,
  otp: string,
  carrier: string,
  expiryMinutes: number = 5
): Promise<EmailResult> {
  try {
    const subject = 'OTP Code';
    const text = `Your OTP is: ${otp}\n\nValid for ${expiryMinutes} minutes.\n\nDo not share this code with anyone.\n\n- The Jaayvee World`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
        </div>
        <p style="color: #666;">Valid for <strong>${expiryMinutes} minutes</strong></p>
        <p style="color: #666;">Do not share this code with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">- The Jaayvee World</p>
      </div>
    `;
    
    return await sendEmail(phoneNumber, subject, text, html);
    
  } catch (error: any) {
    console.error('❌ [Email Service] Error sending OTP email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send OTP email'
    };
  }
}

// Test email configuration
export async function testEmailConfig(): Promise<EmailResult> {
  try {
    console.log('🧪 [Email Service] Testing SMTP2GO configuration...');
    
    const config = getEmailConfig();
    console.log('📧 [Email Service] Config:', {
      host: config.host,
      port: config.port,
      user: config.user,
      from: config.from
    });
    
    const transporter = createTransporter();
    
    // Test connection
    await transporter.verify();
    console.log('✅ [Email Service] SMTP2GO connection verified');
    
    return {
      success: true,
      messageId: 'test_connection'
    };
    
  } catch (error: any) {
    console.error('❌ [Email Service] Configuration test failed:', error);
    return {
      success: false,
      error: error.message || 'SMTP2GO configuration test failed'
    };
  }
}

// Get email service status
export function getEmailServiceStatus(): {
  configured: boolean;
  host: string;
  port: number;
  from: string;
} {
  const config = getEmailConfig();
  
  return {
    configured: !!(config.user && config.pass && config.from),
    host: config.host,
    port: config.port,
    from: config.from
  };
}
