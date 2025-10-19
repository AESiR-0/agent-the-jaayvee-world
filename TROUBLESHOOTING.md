# Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Production Features Not Working

#### **Problem**: Production features are not activating even with environment variables set.

#### **Solutions**:

1. **Check Environment Variables**:
   ```bash
   # Run the test script
   node scripts/test-config.js
   ```

2. **Verify .env.local File**:
   ```env
   NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=true
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

4. **Check Browser Console**:
   - Open browser dev tools
   - Look for configuration debug info
   - Check for any errors

### 2. Firebase Not Initializing

#### **Problem**: Firebase shows no activity, authentication not working.

#### **Solutions**:

1. **Check Firebase Configuration**:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

2. **Verify Firebase Console**:
   - Go to Firebase Console
   - Check Authentication settings
   - Verify phone authentication is enabled
   - Check authorized domains

3. **Test Firebase Connection**:
   ```javascript
   // In browser console
   console.log('Firebase config:', {
     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
   });
   ```

### 3. Rate Limiting Not Working

#### **Problem**: Rate limiting is not preventing multiple attempts.

#### **Solutions**:

1. **Check Configuration**:
   ```env
   NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=true
   # OR
   NEXT_PUBLIC_ENABLE_RATE_LIMITING=true
   ```

2. **Test Rate Limiter**:
   - Use the debug components to test
   - Make 3 OTP requests with same phone number
   - Check if rate limiting kicks in

3. **Reset Rate Limiter**:
   ```javascript
   // In browser console
   const { rateLimiter } = require('@/lib/productionConfig');
   rateLimiter.reset('+91 9876543210');
   ```

### 4. Environment Variables Not Loading

#### **Problem**: Environment variables are not being read in the browser.

#### **Solutions**:

1. **Check File Location**:
   - Ensure `.env.local` is in the project root
   - Not in a subdirectory

2. **Check Variable Names**:
   - Must start with `NEXT_PUBLIC_`
   - Case sensitive
   - No spaces around `=`

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

4. **Check Next.js Version**:
   - Ensure you're using Next.js 13+ for proper env var support

### 5. Mock Authentication Not Working

#### **Problem**: Mock authentication is not working in development.

#### **Solutions**:

1. **Check Configuration**:
   ```env
   # Disable production features for mock auth
   NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=false
   ```

2. **Use Test Phone Numbers**:
   - `+91 9876543210` (test number)
   - Use OTP: `123456`

3. **Check Mock Auth Status**:
   ```javascript
   // In browser console
   const { getCurrentConfig } = require('@/lib/devConfig');
   console.log('Config:', getCurrentConfig());
   ```

### 6. reCAPTCHA Issues

#### **Problem**: reCAPTCHA not loading or failing.

#### **Solutions**:

1. **Check Domain Configuration**:
   - Add your domain to Firebase authorized domains
   - Check reCAPTCHA site key

2. **Check Network**:
   - Ensure internet connection
   - Check if reCAPTCHA is blocked by ad blockers

3. **Test reCAPTCHA**:
   ```javascript
   // In browser console
   console.log('reCAPTCHA container:', document.getElementById('recaptcha-container'));
   ```

### 7. Debug Components Not Showing

#### **Problem**: Debug components are not visible.

#### **Solutions**:

1. **Check Environment**:
   - Debug components only show in development
   - Not in production

2. **Check Imports**:
   - Ensure components are imported correctly
   - Check for any import errors

3. **Check CSS**:
   - Ensure components are not hidden by CSS
   - Check z-index values

### 8. Configuration Not Updating

#### **Problem**: Configuration changes are not taking effect.

#### **Solutions**:

1. **Restart Development Server**:
   ```bash
   npm run dev
   ```

2. **Clear Browser Cache**:
   - Hard refresh (Ctrl+F5)
   - Clear browser cache

3. **Check Environment Variables**:
   - Verify variables are set correctly
   - Check for typos

### 9. Firebase Quota Exceeded

#### **Problem**: Firebase quota exceeded, no SMS being sent.

#### **Solutions**:

1. **Check Firebase Console**:
   - Go to Firebase Console
   - Check usage and quotas
   - Upgrade plan if needed

2. **Use Test Numbers**:
   - Use mock authentication for testing
   - Don't use real phone numbers for testing

3. **Wait for Quota Reset**:
   - Quotas reset daily
   - Wait for next day

### 10. Network Errors

#### **Problem**: Network errors when making requests.

#### **Solutions**:

1. **Check Internet Connection**:
   - Ensure stable internet connection
   - Check if firewall is blocking requests

2. **Check API Endpoints**:
   - Verify backend API is running
   - Check API endpoints are accessible

3. **Check CORS**:
   - Ensure CORS is configured correctly
   - Check if requests are being blocked

## 🔧 Debug Commands

### Check Configuration
```bash
node scripts/test-config.js
```

### Check Environment Variables
```javascript
// In browser console
console.log('Env vars:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES: process.env.NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES
});
```

### Test Rate Limiter
```javascript
// In browser console
const { rateLimiter } = require('@/lib/productionConfig');
console.log('Can attempt:', rateLimiter.canAttempt('+91 9876543210'));
```

### Test Firebase
```javascript
// In browser console
const { auth } = require('@/lib/firebaseClient');
console.log('Firebase auth:', auth);
```

## 📋 Quick Checklist

- [ ] Environment variables are set correctly
- [ ] Development server is restarted
- [ ] Firebase configuration is valid
- [ ] Phone authentication is enabled in Firebase
- [ ] Domain is added to authorized domains
- [ ] reCAPTCHA is configured correctly
- [ ] No console errors
- [ ] Network connection is stable

## 🆘 Still Having Issues?

1. **Check Console Logs**:
   - Open browser dev tools
   - Check console for errors
   - Look for configuration debug info

2. **Check Network Tab**:
   - Check if requests are being made
   - Look for failed requests
   - Check response codes

3. **Test Step by Step**:
   - Test configuration loading
   - Test Firebase initialization
   - Test rate limiting
   - Test authentication flow

4. **Use Debug Components**:
   - Check all debug components
   - Use test buttons
   - Monitor configuration changes
