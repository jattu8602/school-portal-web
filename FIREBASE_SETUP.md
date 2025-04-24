# Firebase Setup Guide for School Portal Web

## Prerequisites

- Node.js installed on your computer
- A Google account

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "School Portal")
4. Enable Google Analytics if desired (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. On the project overview page, click the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "School Portal Web")
3. Check "Set up Firebase Hosting" if you plan to deploy
4. Click "Register app"
5. Firebase will generate configuration code - you'll need this information

## Step 3: Copy Firebase Configuration

From the generated code, copy the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
}
```

## Step 4: Update Environment Variables

1. Open the `.env` file in your project
2. Update the Firebase configuration variables with your values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Generate a random string for NextAuth secret
NEXTAUTH_SECRET=generate_a_random_string_here
NEXTAUTH_URL=http://localhost:3000
```

To generate a random string for NEXTAUTH_SECRET, you can run this command in your terminal:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Enable Authentication

1. In the Firebase Console, navigate to "Authentication"
2. Click "Get started"
3. Select "Email/Password" as a sign-in method
4. Toggle "Email/Password" to enabled
5. Click "Save"

## Step 6: Set Up Firestore Database

1. In the Firebase Console, navigate to "Firestore Database"
2. Click "Create database"
3. Start in production mode or test mode (you can change this later)
4. Choose a location closest to your users
5. Click "Enable"

## Step 7: Set Up Firestore Rules

1. In the Firestore Database section, go to the "Rules" tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Schools can read their own data
    match /schools/{schoolId} {
      allow read, update: if request.auth != null && request.auth.uid == schoolId;
      allow create: if request.auth != null;

      // Teachers collection
      match /teachers/{teacherId} {
        allow read, write: if request.auth != null && request.auth.uid == schoolId;
      }

      // Students collection
      match /students/{studentId} {
        allow read, write: if request.auth != null && request.auth.uid == schoolId;
      }
    }
  }
}
```

## Step 8: Run Your Application

1. Save all changes
2. Start your development server:

```
npm run dev
```

3. Access your application at http://localhost:3000

## Troubleshooting

- If you encounter authentication issues, ensure the correct Firebase configuration is in your `.env` file
- For Firestore access issues, check the Firestore rules
- Make sure you've enabled the Email/Password authentication method
