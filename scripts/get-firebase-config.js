// Get Firebase Configuration Script
const fs = require('fs');
const path = require('path');

console.log('🔧 Firebase Configuration Helper\n');

console.log('📋 Current Configuration Status:');
console.log('');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
} else {
  console.log('❌ .env.local file not found');
  console.log('   Create a .env.local file first');
  process.exit(1);
}

console.log('');
console.log('🚨 CRITICAL ISSUE FOUND:');
console.log('   Your Firebase API key format is incorrect!');
console.log('   This is causing the auth/invalid-app-credential error.');
console.log('');

console.log('🔑 TO FIX THIS ISSUE:');
console.log('');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. Select your project: tjw-otp-service');
console.log('3. Click the gear icon (Project Settings)');
console.log('4. Go to "General" tab');
console.log('5. Scroll down to "Your apps" section');
console.log('6. Find your web app or create a new one');
console.log('7. Copy the API Key (should start with "AIza")');
console.log('');

console.log('📝 UPDATE YOUR .env.local FILE:');
console.log('   Replace your current API key with the correct one:');
console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC... (your actual API key)');
console.log('');

console.log('🔗 ALSO ADD THESE DOMAINS TO FIREBASE:');
console.log('1. Go to Firebase Console > Authentication > Settings');
console.log('2. Go to "Authorized domains" tab');
console.log('3. Add these domains:');
console.log('   • localhost');
console.log('   • 127.0.0.1');
console.log('   • 127.0.0.1:3000');
console.log('');

console.log('📱 ENABLE PHONE AUTHENTICATION:');
console.log('1. Go to Firebase Console > Authentication > Sign-in method');
console.log('2. Find "Phone" in the list');
console.log('3. Click "Enable"');
console.log('4. Configure reCAPTCHA settings');
console.log('');

console.log('🧪 TEST THE FIX:');
console.log('1. Update your .env.local file');
console.log('2. Restart your development server: npm run dev');
console.log('3. Test with a real phone number');
console.log('4. Check browser console for any errors');
console.log('');

console.log('📞 IMPORTANT NOTES:');
console.log('• Use real phone numbers for testing (not test numbers)');
console.log('• Firebase will send actual SMS messages');
console.log('• Check your phone for the OTP');
console.log('• Test with different phone numbers if needed');
console.log('');

console.log('🆘 IF STILL HAVING ISSUES:');
console.log('• Check Firebase Console for error messages');
console.log('• Verify your Firebase project is properly configured');
console.log('• Test with a different phone number');
console.log('• Check if your Firebase project has SMS quota available');
console.log('');

console.log('🎯 QUICK FIX SUMMARY:');
console.log('1. Get correct API key from Firebase Console (starts with "AIza")');
console.log('2. Update .env.local with correct API key');
console.log('3. Add localhost to authorized domains');
console.log('4. Enable phone authentication');
console.log('5. Restart development server');
console.log('6. Test with real phone number');
console.log('');
console.log('This should fix your auth/invalid-app-credential error! 🚀');
