// Test configuration loading
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Configuration Loading...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  // Read and parse .env.local
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
  
  console.log('\n📋 Environment Variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES:', envVars.NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES || 'Not set');
  console.log('NEXT_PUBLIC_ENABLE_RATE_LIMITING:', envVars.NEXT_PUBLIC_ENABLE_RATE_LIMITING || 'Not set');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', envVars.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing');
  
  // Test configuration logic
  console.log('\n🧪 Configuration Logic Test:');
  const enableProductionFeatures = envVars.NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES === 'true';
  const enableRateLimiting = envVars.NEXT_PUBLIC_ENABLE_RATE_LIMITING === 'true' || enableProductionFeatures;
  const enableStrictValidation = envVars.NEXT_PUBLIC_ENABLE_STRICT_VALIDATION === 'true' || enableProductionFeatures;
  
  console.log('Production Features Enabled:', enableProductionFeatures);
  console.log('Rate Limiting Enabled:', enableRateLimiting);
  console.log('Strict Validation Enabled:', enableStrictValidation);
  
  if (enableProductionFeatures) {
    console.log('\n✅ Production features are enabled!');
    console.log('   - Rate limiting will be active');
    console.log('   - Strict validation will be active');
    console.log('   - Mock auth will be disabled');
  } else {
    console.log('\n⚠️ Production features are disabled');
    console.log('   - Mock auth will be enabled');
    console.log('   - Rate limiting will be disabled');
    console.log('   - Strict validation will be disabled');
  }
  
} else {
  console.log('❌ .env.local file not found');
  console.log('   Create a .env.local file with your configuration');
}

console.log('\n📝 To enable production features, add to .env.local:');
console.log('NEXT_PUBLIC_ENABLE_PRODUCTION_FEATURES=true');
console.log('\n📝 To enable individual features:');
console.log('NEXT_PUBLIC_ENABLE_RATE_LIMITING=true');
console.log('NEXT_PUBLIC_ENABLE_STRICT_VALIDATION=true');
console.log('NEXT_PUBLIC_ENABLE_CSRF=true');
