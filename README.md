# School Portal Web

A comprehensive web portal for schools to manage teachers and students. This project provides an interface for school administrators to register their school, add teachers and students, and manage user access.

## Features

- **School Registration**: Schools can sign up with their name, code, email, and password
- **School Dashboard**: Schools can log in and manage their portal
- **Teacher Management**: Add teachers via email and generate passwords
- **Student Management**: Add students with roll numbers, names, usernames, and passwords
- **Secure Authentication**: Firebase authentication for secure login and user management
- **Database**: Firestore database for storing school, teacher, and student information
- **Banner Management**: Manage school announcements
- **Responsive Design**: Designed for all device sizes

## Tech Stack

- **Frontend**: Next.js, React
- **Authentication**: Firebase Authentication, NextAuth.js
- **Database**: Firebase Firestore
- **Media Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Mobile App**: React Native with Expo
- **State Management**: React Context API

## Getting Started

First, set up your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Get your Firebase configuration and update the `.env` file

Then, set up Cloudinary:

1. Sign up for a Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. From your dashboard, get your cloud name
3. Create an upload preset:
   - Go to Settings > Upload
   - Scroll to "Upload presets" and click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Add a folder name if desired
   - Save the preset
4. Copy the cloud name and upload preset name to your `.env.local` file

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
school-portal-web/
├── app/                 # Next.js App Router
│   ├── api/             # API Routes
│   ├── auth/            # Authentication Pages
│   ├── dashboard/       # School Dashboard
│   ├── components/      # Shared Components
│   └── ...
├── lib/                 # Utility functions
│   ├── firebase.js      # Firebase configuration
│   └── ...
├── public/              # Static assets
└── ...
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA Support

This project includes Progressive Web App (PWA) support, allowing users to install it as a native app on their devices:

- Add to Home Screen on iOS
- Install as app on Android
- Desktop app on Windows/Mac/Linux

The PWA features include:
- Offline support via Service Worker
- App icons and splash screens
- Home screen installation
