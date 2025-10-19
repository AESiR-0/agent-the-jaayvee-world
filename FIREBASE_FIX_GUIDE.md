# Firebase Configuration Fix Guide

## 🚨 **CRITICAL ISSUE FOUND**

Your Firebase API key format is incorrect! This is causing the `auth/invalid-app-credential` error.

### **Current Issue:**
- ❌ Your API key doesn't start with "AIza"
- ❌ This causes Firebase to reject authentication requests

### **Solution Steps:**

## 1. 🔑 **Fix Firebase API Key**

### **Step 1: Get Correct API Key**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `tjw-otp-service`
3. Go to **Project Settings** (gear icon)
4. Go to **General** tab
5. Scroll down to **Your apps** section
6. Find your web app or create a new one
7. Copy the **API Key** (should start with `AIza`)

### **Step 2: Update .env.local**
Replace your current API key with the correct one:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC... (your actual API key)
```

## 2. 🔗 **Configure Authorized Domains**

### **Step 1: Add Development Domains**
1. Go to Firebase Console > **Authentication** > **Settings**
2. Go to **Authorized domains** tab
3. Add these domains:
   - `localhost`
   - `127.0.0.1`
   - `127.0.0.1:3000` (if using port 3000)

### **Step 2: Add Production Domains**
- Add your production domain when ready

## 3. 📱 **Enable Phone Authentication**

### **Step 1: Enable Phone Auth**
1. Go to Firebase Console > **Authentication** > **Sign-in method**
2. Find **Phone** in the list
3. Click **Enable**
4. Configure reCAPTCHA settings

### **Step 2: Configure reCAPTCHA**
1. In the Phone authentication settings
2. Choose **reCAPTCHA Enterprise** (recommended for production)
3. Or use **reCAPTCHA v3** for development

## 4. 🔧 **Update Firebase Configuration**

### **Step 1: Verify All Settings**
Your current configuration should be:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC... (correct API key)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tjw-otp-service.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tjw-otp-service
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tjw-otp-service.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=236468227907
NEXT_PUBLIC_FIREBASE_APP_ID=1:236468227907:web:78ce6d56be0907a2bfe9f6
```

### **Step 2: Restart Development Server**
```bash
npm run dev
```

## 5. 🧪 **Test the Fix**

### **Step 1: Test Configuration**
```bash
node scripts/fix-firebase-config.js
```

### **Step 2: Test Authentication**
1. Go to your login page
2. Enter a real phone number (e.g., +91 9876543210)
3. Check if OTP is sent successfully
4. Check browser console for any errors

## 6. 🔍 **Debugging Steps**

### **If Still Getting Errors:**

#### **Check 1: API Key Format**
```javascript
// In browser console
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
// Should start with "AIza"
```

#### **Check 2: Firebase Initialization**
```javascript
// In browser console
const { auth } = require('@/lib/firebaseClient');
console.log('Firebase Auth:', auth);
```

#### **Check 3: reCAPTCHA Loading**
```javascript
// In browser console
console.log('reCAPTCHA container:', document.getElementById('recaptcha-container'));
```

## 7. 🚨 **Common Issues & Solutions**

### **Issue 1: API Key Still Wrong**
- **Problem**: API key doesn't start with "AIza"
- **Solution**: Get the correct API key from Firebase Console

### **Issue 2: Domain Not Authorized**
- **Problem**: `auth/invalid-app-credential` error
- **Solution**: Add `localhost` and `127.0.0.1` to authorized domains

### **Issue 3: Phone Auth Not Enabled**
- **Problem**: Phone authentication not working
- **Solution**: Enable phone authentication in Firebase Console

### **Issue 4: reCAPTCHA Issues**
- **Problem**: reCAPTCHA not loading
- **Solution**: Check reCAPTCHA configuration in Firebase Console

## 8. 📞 **Testing with Real Numbers**

### **Important Notes:**
- Use real phone numbers for testing (not test numbers)
- Firebase will send actual SMS messages
- Check your phone for the OTP
- Test with different phone numbers if needed

### **Test Numbers (if available):**
- Use your own phone number first
- Test with different country codes
- Verify SMS delivery

## 9. 🔧 **Production Checklist**

### **Before Going Live:**
- [ ] API key is correct and starts with "AIza"
- [ ] All domains are authorized
- [ ] Phone authentication is enabled
- [ ] reCAPTCHA is configured
- [ ] Test with real phone numbers
- [ ] Check Firebase quotas and billing

## 10. 🆘 **Still Having Issues?**

### **Check These:**
1. **Firebase Console**: Look for any error messages
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Check if requests are being made
4. **Firebase Quotas**: Ensure you have SMS quota available

### **Contact Support:**
- Firebase Support: [Firebase Support](https://firebase.google.com/support)
- Firebase Community: [Firebase Community](https://firebase.google.com/community)

---

## 🎯 **Quick Fix Summary:**

1. **Get correct API key from Firebase Console** (starts with "AIza")
2. **Update .env.local with correct API key**
3. **Add localhost to authorized domains**
4. **Enable phone authentication**
5. **Restart development server**
6. **Test with real phone number**

This should fix your `auth/invalid-app-credential` error! 🚀
