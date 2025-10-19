// Firebase Configuration Fix Script
const fs = require('fs');
const path = require('path');

console.log('🔧 Firebase Configuration Fix Script\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('   Create a .env.local file with your Firebase configuration');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

console.log('📋 Current Firebase Configuration:');
console.log('API Key:', envVars.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing');
console.log('Auth Domain:', envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Missing');
console.log('Project ID:', envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Missing');
console.log('Storage Bucket:', envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Missing');
console.log('Messaging Sender ID:', envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'Missing');
console.log('App ID:', envVars.NEXT_PUBLIC_FIREBASE_APP_ID || 'Missing');

// Check for common issues
console.log('\n🔍 Checking for Common Issues:');

// Check API Key format
if (envVars.NEXT_PUBLIC_FIREBASE_API_KEY) {
  if (!envVars.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith('AIza')) {
    console.log('⚠️  API Key format may be incorrect (should start with AIza)');
  } else {
    console.log('✅ API Key format looks correct');
  }
}

// Check Auth Domain format
if (envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  if (!envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.includes('.firebaseapp.com')) {
    console.log('⚠️  Auth Domain should typically end with .firebaseapp.com');
  } else {
    console.log('✅ Auth Domain format looks correct');
  }
}

// Check for placeholder values
const placeholderValues = Object.entries(envVars)
  .filter(([key, value]) => value && (
    value.includes('your_') || 
    value.includes('replace_') ||
    value === 'your_api_key_here' ||
    value === 'your_messaging_sender_id_here' ||
    value === 'your_app_id_here'
  ))
  .map(([key]) => key);

if (placeholderValues.length > 0) {
  console.log('❌ Placeholder values found:', placeholderValues.join(', '));
  console.log('   Replace these with your actual Firebase configuration values');
} else {
  console.log('✅ No placeholder values found');
}

console.log('\n🛠️  Common Solutions for auth/invalid-app-credential:');
console.log('');
console.log('1. 🔗 Authorized Domains:');
console.log('   - Go to Firebase Console > Authentication > Settings > Authorized Domains');
console.log('   - Add these domains:');
console.log('     • localhost (for development)');
console.log('     • 127.0.0.1 (alternative to localhost)');
console.log('     • your-production-domain.com (for production)');
console.log('');
console.log('2. 📱 Phone Authentication Setup:');
console.log('   - Go to Firebase Console > Authentication > Sign-in method');
console.log('   - Enable "Phone" authentication');
console.log('   - Configure reCAPTCHA settings');
console.log('');
console.log('3. 🔑 reCAPTCHA Configuration:');
console.log('   - Ensure reCAPTCHA is properly implemented');
console.log('   - Check that reCAPTCHA tokens are valid');
console.log('   - Verify reCAPTCHA site key in Firebase Console');
console.log('');
console.log('4. 🌐 Domain Issues:');
console.log('   - Use 127.0.0.1 instead of localhost if having issues');
console.log('   - Ensure your domain is in authorized domains');
console.log('   - Check that you\'re not using HTTP in production (use HTTPS)');
console.log('');
console.log('5. 🔧 Firebase Project Setup:');
console.log('   - Verify your Firebase project is active');
console.log('   - Check that Authentication is enabled');
console.log('   - Ensure your project has the correct billing plan');
console.log('');
console.log('6. 🧪 Testing Steps:');
console.log('   - Test with a real phone number (not test numbers)');
console.log('   - Check browser console for detailed error messages');
console.log('   - Verify reCAPTCHA is loading correctly');
console.log('');
console.log('📞 If still having issues:');
console.log('   - Check Firebase Console for any error messages');
console.log('   - Verify your Firebase project is properly configured');
console.log('   - Test with a different phone number');
console.log('   - Check if your Firebase project has SMS quota available');
