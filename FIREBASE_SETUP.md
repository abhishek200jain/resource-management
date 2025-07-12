# Firebase Setup Guide

This guide will help you set up Firebase Authentication for your Resource Management application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "resource-management")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle the "Enable" switch
   - Click "Save"

## Step 3: Get Your Firebase Configuration

1. In the Firebase console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "resource-management-web")
6. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

1. Open `src/config/firebase.ts` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Test the Application

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Click "Sign Up" to create a new account
4. Use the created credentials to log in

## Features Implemented

- ✅ Firebase Authentication integration
- ✅ Email/Password sign up and login
- ✅ Protected routes with authentication
- ✅ Automatic session management
- ✅ Logout functionality
- ✅ Loading states and error handling
- ✅ User context throughout the application

## Security Notes

- The Firebase configuration is safe to include in client-side code
- Firebase handles password hashing and security automatically
- User sessions are managed securely by Firebase
- No sensitive data is stored in localStorage anymore

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Make sure you've copied the correct API key from Firebase console

2. **"Firebase: Error (auth/user-not-found)"**
   - The user doesn't exist. Use the signup page to create an account first

3. **"Firebase: Error (auth/wrong-password)"**
   - Check that you're using the correct password

4. **"Firebase: Error (auth/email-already-in-use)"**
   - The email is already registered. Use the login page instead

### Development Tips:

- Use the Firebase console to manage users during development
- Check the browser console for detailed error messages
- The Firebase console shows authentication logs and user management

## Next Steps

Once Firebase is set up, you can:

1. Add more authentication providers (Google, GitHub, etc.)
2. Implement password reset functionality
3. Add email verification
4. Set up Firestore for data storage
5. Add user roles and permissions 