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

## Step 3: Set up Cloud Firestore

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can update rules later)
4. Select a location for your database (choose the one closest to your users)

### Important: Firestore Security Rules

For development, you can use test mode rules, but for production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write articles
    match /articles/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click on "Web app" icon (`</>`)
4. Register your app with a name (e.g., "ShortNews Admin")
5. Copy the Firebase configuration object

## Step 5: Create Environment File

Create a `.env` file in your project root with the following variables:

```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration values.

## Step 6: Test the Application

```bash
npm run dev
```

Your application should now be ready with:
- ✅ Firebase Authentication (Login/Signup)
- ✅ Cloud Firestore (News Management)
- ✅ Real-time data synchronization

## Features Available:

1. **Authentication**: Users can sign up, log in, and log out
2. **News Management**: 
   - Create new articles
   - Edit existing articles
   - Delete articles
   - Filter and search articles
   - Articles are stored in Cloud Firestore
3. **Real-time Updates**: Changes are immediately reflected across all users

## Troubleshooting:

- **Permission Denied**: Make sure your Firestore rules allow authenticated users to read/write
- **Articles not loading**: Check browser console for errors and verify Firestore is enabled
- **Authentication issues**: Ensure Email/Password authentication is enabled in Firebase Console 