# Development Testing Guide

This guide shows you how to test production-level features in development mode.

## 🧪 Testing Production Features in Development

### 1. Enable Production Features

Add these environment variables to your `.env.local` file:

```env
# Enable all production features
NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=true

# Or enable individual features
NEXT_PUBLIC_ENABLE_RATE_LIMITING=true
NEXT_PUBLIC_ENABLE_STRICT_VALIDATION=true
NEXT_PUBLIC_ENABLE_CSRF=true
NEXT_PUBLIC_ENABLE_PRODUCTION_ERRORS=true
```

### 2. Testing Scenarios

#### 2.1 Rate Limiting Testing
```bash
# Test rate limiting by making multiple OTP requests
# You should see rate limiting after 3 attempts
```

#### 2.2 Strict Validation Testing
```bash
# Test with invalid phone numbers
# Test with placeholder Firebase config
# Test with missing environment variables
```

#### 2.3 Error Handling Testing
```bash
# Test network errors
# Test Firebase quota exceeded
# Test invalid OTP codes
# Test expired verification codes
```

### 3. Development Configuration Options

#### 3.1 Full Production Testing
```env
NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=true
```
This enables all production features:
- Rate limiting
- Strict validation
- CSRF protection
- Production error handling
- Real Firebase authentication

#### 3.2 Granular Feature Testing
```env
# Test only rate limiting
NEXT_PUBLIC_ENABLE_RATE_LIMITING=true

# Test only strict validation
NEXT_PUBLIC_ENABLE_STRICT_VALIDATION=true

# Test only CSRF protection
NEXT_PUBLIC_ENABLE_CSRF=true

# Test only production error handling
NEXT_PUBLIC_ENABLE_PRODUCTION_ERRORS=true
```

#### 3.3 Development Mode (Default)
```env
NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=false
```
This enables development features:
- Mock authentication for test numbers
- Debug logs
- Relaxed validation
- Detailed error messages

### 4. Testing Checklist

#### 4.1 Rate Limiting Tests
- [ ] Make 3 OTP requests with same phone number
- [ ] Verify rate limiting kicks in after 3 attempts
- [ ] Test cooldown period (5 minutes)
- [ ] Test lockout period (1 hour)
- [ ] Verify user-friendly error messages

#### 4.2 Validation Tests
- [ ] Test with invalid phone numbers
- [ ] Test with missing Firebase config
- [ ] Test with placeholder values
- [ ] Test with malformed API keys
- [ ] Verify strict validation errors

#### 4.3 Error Handling Tests
- [ ] Test network errors
- [ ] Test Firebase quota exceeded
- [ ] Test invalid OTP codes
- [ ] Test expired verification codes
- [ ] Test reCAPTCHA failures
- [ ] Verify user-friendly error messages

#### 4.4 Security Tests
- [ ] Test CSRF protection
- [ ] Test domain validation
- [ ] Test input sanitization
- [ ] Test rate limiting effectiveness

### 5. Debug Commands

#### 5.1 Check Current Configuration
```javascript
// In browser console
console.log('Current config:', getCurrentConfig());
```

#### 5.2 Test Rate Limiting
```javascript
// In browser console
console.log('Rate limiter status:', rateLimiter);
```

#### 5.3 Test Firebase Configuration
```javascript
// In browser console
testFirebaseConfig();
```

### 6. Common Testing Scenarios

#### 6.1 Test Phone Number Formatting
```javascript
// Test various phone number formats
const testNumbers = [
  '9876543210',        // Should become +91 9876543210
  '09876543210',       // Should become +91 9876543210
  '+91 9876543210',    // Should remain +91 9876543210
  '9876543210',        // Should become +91 9876543210
];
```

#### 6.2 Test Rate Limiting
```javascript
// Test rate limiting by making multiple requests
for (let i = 0; i < 5; i++) {
  sendOTP('+91 9876543210');
}
```

#### 6.3 Test Error Handling
```javascript
// Test with invalid phone number
sendOTP('invalid');

// Test with invalid OTP
verifyOTP('verificationId', 'invalid');
```

### 7. Production Feature Comparison

| Feature | Development Default | Production Testing | Production |
|---------|-------------------|-------------------|------------|
| Mock Auth | ✅ | ❌ | ❌ |
| Rate Limiting | ❌ | ✅ | ✅ |
| Strict Validation | ❌ | ✅ | ✅ |
| CSRF Protection | ❌ | ✅ | ✅ |
| Debug Logs | ✅ | ✅ | ❌ |
| Detailed Errors | ✅ | ✅ | ❌ |

### 8. Troubleshooting

#### 8.1 Production Features Not Working
- Check environment variables are set correctly
- Restart development server after changing env vars
- Check browser console for configuration logs

#### 8.2 Rate Limiting Not Working
- Ensure `NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=true`
- Check rate limiter configuration
- Verify phone number formatting

#### 8.3 Validation Not Working
- Check Firebase configuration
- Verify environment variables
- Check validation rules

### 9. Best Practices

#### 9.1 Testing Strategy
1. Start with development mode (default)
2. Enable individual features for testing
3. Test full production mode before deployment
4. Verify all error scenarios

#### 9.2 Environment Management
- Use separate `.env.local` for different testing scenarios
- Document your testing configuration
- Keep production and development configs separate

#### 9.3 Testing Documentation
- Document all test scenarios
- Keep track of what works and what doesn't
- Share testing results with team

### 10. Quick Start

1. **Enable Production Features:**
   ```env
   NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=true
   ```

2. **Restart Development Server:**
   ```bash
   npm run dev
   ```

3. **Test Rate Limiting:**
   - Make 3 OTP requests with same phone number
   - Verify rate limiting kicks in

4. **Test Validation:**
   - Try invalid phone numbers
   - Check error messages

5. **Test Error Handling:**
   - Test network errors
   - Test invalid OTP codes
   - Verify user-friendly messages

Your development environment now supports testing all production features! 🚀
