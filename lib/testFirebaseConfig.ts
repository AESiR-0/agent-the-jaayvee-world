// Test Firebase configuration
export const testFirebaseConfig = () => {
  console.log('🧪 Testing Firebase Configuration...');
  
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log('Environment Variables:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

  console.log('Config Object:');
  console.log(JSON.stringify(config, null, 2));

  // Check if any values are missing
  const missingKeys = Object.entries(config)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.error('❌ Missing configuration keys:', missingKeys);
    return false;
  }

  // Check if values look like placeholders
  const placeholderValues = Object.entries(config)
    .filter(([key, value]) => value && (
      value.includes('your_') || 
      value.includes('replace_') ||
      value === 'your_api_key_here' ||
      value === 'your_messaging_sender_id_here' ||
      value === 'your_app_id_here'
    ))
    .map(([key]) => key);

  if (placeholderValues.length > 0) {
    console.error('❌ Placeholder values found:', placeholderValues);
    return false;
  }

  console.log('✅ Firebase configuration looks valid');
  return true;
};
