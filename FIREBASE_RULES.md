# Firebase Firestore Security Rules

Copy and paste these rules into your Firebase Firestore Rules in the Firebase Console to fix the permissions error.

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(schoolId) {
      return request.auth.uid == schoolId;
    }

    // Allow read access to authenticated users for their own school data
    function isSchoolMember(schoolId) {
      return isSignedIn() &&
        (isOwner(schoolId) ||
         exists(/databases/$(database)/documents/schools/$(schoolId)/teachers/$(request.auth.uid)) ||
         exists(/databases/$(database)/documents/schools/$(schoolId)/students/$(request.auth.uid)));
    }

    // School data rules
    match /schools/{schoolId} {
      // Allow any authenticated user to read a school document
      // This is needed to find which school a user belongs to
      allow read: if isSignedIn();

      // Only school admin can write to their own document
      allow write: if isSignedIn() && isOwner(schoolId);

      // Banners collection - NEW
      match /banners/{bannerId} {
        // School members can read banners
        allow read: if isSchoolMember(schoolId);
        // Only school owner can manage banners
        allow write: if isSignedIn() && isOwner(schoolId);
      }

      // Classes collection
      match /classes/{classId} {
        // School members can read, but only owner can write
        allow read: if isSchoolMember(schoolId);
        allow write: if isSignedIn() && isOwner(schoolId);
      }

      // Teachers collection
      match /teachers/{teacherId} {
        // School members can read teachers
        allow read: if isSchoolMember(schoolId);
        // Only school owner can manage teachers
        allow write: if isSignedIn() && isOwner(schoolId);
      }

      // Students collection
      match /students/{studentId} {
        // School members can read students
        allow read: if isSchoolMember(schoolId);
        // Only school owner can manage students
        allow write: if isSignedIn() && isOwner(schoolId);
      }

      // Attendance collection
      match /attendance/{attendanceId} {
        // School members can read attendance
        allow read: if isSchoolMember(schoolId);
        // Only school owner and teachers can manage attendance
        allow write: if isSignedIn() &&
                     (isOwner(schoolId) ||
                      exists(/databases/$(database)/documents/schools/$(schoolId)/teachers/$(request.auth.uid)));
      }

      // Timetable collection
      match /timetable/{timetableId} {
        // School members can read timetables
        allow read: if isSchoolMember(schoolId);
        // Only school owner can manage timetables
        allow write: if isSignedIn() && isOwner(schoolId);
      }

      // Exams collection
      match /exams/{examId} {
        // School members can read exams
        allow read: if isSchoolMember(schoolId);
        // Only school owner and teachers can manage exams
        allow write: if isSignedIn() &&
                     (isOwner(schoolId) ||
                      exists(/databases/$(database)/documents/schools/$(schoolId)/teachers/$(request.auth.uid)));

        // Exam results subcollection
        match /results/{resultId} {
          allow read: if isSchoolMember(schoolId);
          allow write: if isSignedIn() &&
                       (isOwner(schoolId) ||
                        exists(/databases/$(database)/documents/schools/$(schoolId)/teachers/$(request.auth.uid)));
        }
      }

      // Fees collection
      match /fees/{feeId} {
        // School members can read fee records (students should see their own fees)
        allow read: if isSchoolMember(schoolId);
        // Only school owner can manage fee records
        allow write: if isSignedIn() && isOwner(schoolId);
      }

      // Announcements collection
      match /announcements/{announcementId} {
        // School members can read announcements
        allow read: if isSchoolMember(schoolId);
        // Only school owner and teachers can create/modify announcements
        allow write: if isSignedIn() &&
                     (isOwner(schoolId) ||
                      exists(/databases/$(database)/documents/schools/$(schoolId)/teachers/$(request.auth.uid)));
      }

      // Chat collection
      match /chats/{chatId} {
        // All school members can read and write to chats they're part of
        allow read, write: if isSchoolMember(schoolId) &&
                            (request.auth.uid in resource.data.participants ||
                             request.auth.uid in request.resource.data.participants);
      }
    }

    // Users collection - to store user profiles
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if isSignedIn() && request.auth.uid == userId;
    }

    // Public school information - read only for everyone
    match /public-schools/{schoolId} {
      allow read: if true;
      allow write: if isSignedIn() && isOwner(schoolId);
    }

    // Allow newly created users to create their school profile
    match /school-registrations/{registrationId} {
      allow read, write: if isSignedIn();
    }

    // Navigation items collection - both students and teachers need access
    match /navigation-items/{itemId} {
      allow read: if isSignedIn();
    }
  }
}
```

## Applying These Rules

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Firestore Database" in the left menu
4. Select the "Rules" tab
5. Replace all rules with the above rules
6. Click "Publish"

## Using Cloudinary for Media Storage

As you mentioned, Firebase's free plan doesn't support direct storage of large media files like images and videos. We'll use Cloudinary instead:

## Setting up Cloudinary

1. Create a free Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. From your dashboard, get the following details:
   - Cloud name
   - API Key
   - Upload preset (create an unsigned upload preset in Settings > Upload)

## Create a .env.local file

Create a `.env.local` file in the root of your project with these variables:

```
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Optional - only if you need server-side Cloudinary operations
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Banner Data Structure

Your banners in Firestore will store Cloudinary URLs, not the actual media files:

```
schools/
  {schoolId}/
    banners/
      {bannerId}/
        type: "image" | "video"
        url: "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/school-banners/example.jpg"
        title: "Banner Title"
        description: "Banner Description"
        createdAt: timestamp
        updatedAt: timestamp
```

## Security Notes

- Media files are hosted on Cloudinary, not Firebase Storage
- Only URLs are stored in Firestore
- School ID is used in the Cloudinary folder path for organization
- Set up your upload preset to restrict file types and sizes