# Production Setup Guide for Firebase OTP Authentication

This guide will help you deploy the OTP login system to production with proper security and error handling.

## 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration (REQUIRED)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend API Configuration (REQUIRED)
NEXT_PUBLIC_API_BASE_URL=https://talaash.thejaayveeworld.com/api

# Optional: Google Maps API Key (for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Production Security Settings
NEXT_PUBLIC_ENABLE_RATE_LIMITING=true
NEXT_PUBLIC_ENABLE_CSRF_PROTECTION=true
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=false
```

## 2. Firebase Console Configuration

### 2.1 Authentication Setup
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Phone" authentication
3. Add your production domain to "Authorized domains"
4. Configure reCAPTCHA settings:
   - Enable "reCAPTCHA Enterprise" for production
   - Add your domain to reCAPTCHA domains

### 2.2 Security Rules
1. Go to Firebase Console → Authentication → Settings
2. Enable "App check" for additional security
3. Configure "Authorized domains" with your production domain

### 2.3 Phone Authentication Settings
1. Set up SMS templates in your preferred language
2. Configure sender ID (if required by your region)
3. Set up fallback SMS providers if needed

## 3. Production Deployment Checklist

### 3.1 Environment Validation
- [ ] All Firebase environment variables are set
- [ ] No placeholder values in production
- [ ] API keys are valid and active
- [ ] Backend API endpoints are accessible

### 3.2 Security Configuration
- [ ] Rate limiting is enabled
- [ ] CSRF protection is enabled
- [ ] Debug logs are disabled
- [ ] Error reporting is configured
- [ ] Domain restrictions are set

### 3.3 Testing
- [ ] Test with real phone numbers
- [ ] Test rate limiting functionality
- [ ] Test error handling scenarios
- [ ] Test reCAPTCHA functionality
- [ ] Test backend integration

## 4. Common Production Issues and Solutions

### 4.1 reCAPTCHA Issues
**Problem**: reCAPTCHA not loading or failing
**Solutions**:
- Ensure domain is added to Firebase authorized domains
- Check reCAPTCHA site key configuration
- Verify SSL certificate is valid
- Clear browser cache and cookies

### 4.2 SMS Delivery Issues
**Problem**: OTP not received
**Solutions**:
- Check phone number format (must include country code)
- Verify Firebase SMS quota
- Check carrier restrictions
- Test with different phone numbers

### 4.3 Rate Limiting Issues
**Problem**: Users getting locked out
**Solutions**:
- Adjust rate limiting configuration
- Implement user-friendly error messages
- Add manual unlock mechanism for admins

### 4.4 Backend Integration Issues
**Problem**: Token verification failing
**Solutions**:
- Verify backend API endpoints
- Check CORS configuration
- Validate token format
- Test network connectivity

## 5. Monitoring and Maintenance

### 5.1 Error Monitoring
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor Firebase usage and quotas
- Track authentication success/failure rates

### 5.2 Performance Monitoring
- Monitor page load times
- Track Firebase response times
- Monitor reCAPTCHA load times

### 5.3 Security Monitoring
- Monitor for suspicious activity
- Track failed authentication attempts
- Monitor rate limiting effectiveness

## 6. Troubleshooting Commands

### 6.1 Check Environment Variables
```bash
npm run check-env
```

### 6.2 Test Firebase Configuration
```bash
npm run test-firebase
```

### 6.3 Debug Production Issues
```bash
NODE_ENV=production npm run debug
```

## 7. Support and Maintenance

### 7.1 Regular Maintenance
- Update Firebase SDK regularly
- Monitor quota usage
- Review security logs
- Update dependencies

### 7.2 Emergency Procedures
- Disable authentication if needed
- Implement fallback authentication
- Contact Firebase support for critical issues
- Monitor system health

## 8. Security Best Practices

### 8.1 Environment Security
- Never commit environment variables to version control
- Use secure secret management
- Rotate API keys regularly
- Monitor for exposed credentials

### 8.2 Application Security
- Implement proper error handling
- Use HTTPS in production
- Validate all inputs
- Implement proper logging

### 8.3 Firebase Security
- Use Firebase App Check
- Implement proper security rules
- Monitor authentication events
- Use Firebase Admin SDK for server-side operations

## 9. Performance Optimization

### 9.1 Firebase Optimization
- Enable Firebase Performance Monitoring
- Optimize reCAPTCHA loading
- Use Firebase caching
- Monitor Firebase usage

### 9.2 Application Optimization
- Implement code splitting
- Use lazy loading
- Optimize bundle size
- Implement proper caching

## 10. Backup and Recovery

### 10.1 Data Backup
- Backup Firebase configuration
- Backup environment variables
- Backup custom configurations

### 10.2 Recovery Procedures
- Document recovery procedures
- Test backup restoration
- Maintain emergency contacts
- Document rollback procedures
