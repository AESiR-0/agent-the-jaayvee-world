# The Jaayvee World - Agents Dashboard

A Next.js 15 application for managing agents and merchant onboarding for The Jaayvee World.

## Features

### Agents Dashboard
- **Login**: Firebase Phone OTP authentication
- **Dashboard**: Overview with QR codes, merchants, and commission stats
- **QR Management**: View and manage assigned QR codes
- **Merchants**: List and manage onboarded merchants
- **Profile**: View wallet balance, referral link, and agent details

### Merchant Activation
- **Ease Page**: Merchant self-registration via QR code scanning
- **Location Picker**: Interactive map for business location selection
- **Firebase OTP**: Secure phone verification for merchants

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Google Maps API Key (for enhanced location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Firebase Setup
1. Create a Firebase project
2. Enable Phone Authentication
3. Add your domain to authorized domains
4. Configure reCAPTCHA for phone authentication
5. Copy the configuration values to your `.env.local` file

### 4. Run the Application
```bash
npm run dev
```

## API Endpoints

The application connects to the following backend APIs:

- `https://talaash.thejaayveeworld.com/api/agents/auth/verify-token`
- `https://talaash.thejaayveeworld.com/api/agents/qr/list`
- `https://talaash.thejaayveeworld.com/api/agents/merchants`
- `https://talaash.thejaayveeworld.com/api/agents/commissions`
- `https://talaash.thejaayveeworld.com/api/agents/profile`
- `https://talaash.thejaayveeworld.com/api/agents/referral`
- `https://talaash.thejaayveeworld.com/api/qr/resolve`
- `https://talaash.thejaayveeworld.com/api/merchant/activate`

## Pages

### Agent Pages
- `/login` - Firebase OTP login
- `/dashboard` - Overview with stats
- `/qrs` - QR codes management
- `/merchants` - Merchants list
- `/profile` - Agent profile and wallet

### Merchant Pages
- `/ease?merchantId=TJW0001&role=merchant` - Merchant activation

## Theme

The application uses The Jaayvee World brand colors:
- Background: #FFFFFF
- Foreground: #0C0C0C
- Accent: #00719C
- Accent Light: #E8F6FA
- Border: #E0E0E0

## Components

- `Header` - Navigation header with logout
- `StatCard` - Dashboard statistics cards
- `QRCard` - QR code display and management
- `MerchantTable` - Merchants listing table
- `ProfileCard` - Agent profile information
- `LocationPicker` - Interactive map for location selection

## Authentication Flow

1. Agent enters phone number
2. Firebase sends OTP via SMS
3. Agent enters OTP
4. Backend verifies token and returns agent data
5. Agent data stored in localStorage
6. Redirect to dashboard

## Merchant Activation Flow

1. Merchant scans QR code
2. System checks QR validity
3. If valid and unactivated, show registration form
4. Merchant fills form and verifies phone with OTP
5. System activates merchant account
6. Success confirmation shown
