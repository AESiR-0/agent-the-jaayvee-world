// Development authentication bypass for test phone numbers
export const isTestPhoneNumber = (phoneNumber: string): boolean => {
  const testNumbers = [
    '+91 9876543210',
    '+91 9876543211', 
    '+91 9876543212',
    '+91 9999999999',
    '+91 8888888888',
  ];
  
  return testNumbers.includes(phoneNumber);
};

export const createMockVerification = (phoneNumber: string) => {
  return {
    verificationId: `mock_${Date.now()}_${phoneNumber.replace(/\s/g, '')}`,
    phoneNumber,
    isTest: true
  };
};

export const verifyMockOTP = (verificationId: string, otp: string): boolean => {
  // For test numbers, accept any 6-digit OTP or specifically 123456
  return otp === '123456' || (otp.length === 6 && /^\d{6}$/.test(otp));
};
