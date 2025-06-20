# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "shortnews-admin")
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Enable "Email/Password" authentication
4. Optionally, enable other sign-in methods as needed

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click on "Web app" icon (`</>`)
4. Register your app with a name (e.g., "ShortNews Admin")
5. Copy the Firebase configuration object

## Step 4: Create Environment File

Create a `.env` file in your project root with the following variables:

```
VITE_FIREBASE_API_KEY=AIzaSyBpH2CkWlFzJ7dqed-Wms-3y4nHdbo_K3I
VITE_FIREBASE_AUTH_DOMAIN=shortnews-admin.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shortnews-admin
VITE_FIREBASE_STORAGE_BUCKET=shortnews-admin.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=448008497610
VITE_FIREBASE_APP_ID=1:448008497610:web:5c8c880174993981f38733
VITE_FIREBASE_MEASUREMENT_ID=G-0NJ6P925TP
```

Replace the values with your actual Firebase configuration values.

## Step 5: Security Rules (Optional)

If you plan to use Firestore or Storage, set up appropriate security rules in the Firebase Console.

## Step 6: Run the Application

```bash
npm run dev
```

Your application should now be ready with Firebase authentication! 