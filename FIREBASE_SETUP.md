# Firebase Console Setup Guide

## 🔧 Fix reCAPTCHA Error: "Hostname match not found"

The error you're seeing indicates that your domain isn't authorized in Firebase Console. Here's how to fix it:

### **Step 1: Go to Firebase Console**
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **tjw-otp-service**

### **Step 2: Configure Authentication**
1. Go to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Make sure it's **Enabled**

### **Step 3: Add Authorized Domains**
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add these domains:
   - `localhost` (for development)
   - `agents.thejaayveeworld.com` (for production)
   - `thejaayveeworld.com` (if needed)

### **Step 4: Configure reCAPTCHA**
1. In **Authentication** → **Sign-in method** → **Phone**
2. Click **reCAPTCHA Enterprise** tab
3. Make sure reCAPTCHA is properly configured
4. If not configured, use the **reCAPTCHA v3** option

### **Step 5: Test Configuration**
1. Go to **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Make sure your web app is registered
4. Copy the config if needed

## 🧪 **Quick Fix for Development**

If you want to test immediately without fixing Firebase Console:

1. **Use test phone numbers** (they bypass reCAPTCHA):
   - `+91 9876543210`
   - `+91 9876543211`
   - `+91 9876543212`

2. **Use OTP**: `123456`

## 🔍 **Common Issues & Solutions**

### **Issue: "Hostname match not found"**
- **Solution**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### **Issue: "reCAPTCHA verification failed"**
- **Solution**: Use test phone numbers or fix reCAPTCHA configuration

### **Issue: "Invalid app credential"**
- **Solution**: Check your Firebase configuration in `.env.local`

## 📱 **Test Phone Numbers (No reCAPTCHA Required)**

For development testing, use these numbers:
- `+91 9876543210` (OTP: 123456)
- `+91 9876543211` (OTP: 123456)
- `+91 9876543212` (OTP: 123456)
- `+91 9999999999` (OTP: 123456)
- `+91 8888888888` (OTP: 123456)

These numbers use mock authentication and don't require reCAPTCHA verification.

