import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

export const signUp = async (email, password, schoolName, schoolCode) => {
  try {
    console.log('Starting signup process:', { email, schoolName, schoolCode })

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    console.log('User created in Firebase Auth:', user.uid)

    // Create school document in Firestore
    try {
      await setDoc(doc(db, 'schools', user.uid), {
        name: schoolName,
        code: schoolCode,
        email: email,
        role: 'school',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log('School document created in Firestore')
    } catch (firestoreError) {
      console.error('Error creating school document:', firestoreError)
      return {
        success: false,
        error: `Auth successful but database error: ${firestoreError.message}`,
        user,
      }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Signup error:', error)
    let errorMessage = 'An error occurred during signup.'

    // Provide more specific error messages for common issues
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email address is already in use.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please provide a valid email address.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. It should be at least 6 characters.'
    } else if (error.code) {
      errorMessage = `${error.message} (${error.code})`
    } else {
      errorMessage = error.message || errorMessage
    }

    return { success: false, error: errorMessage }
  }
}

export const signIn = async (email, password) => {
  try {
    console.log('Starting signin process for:', email)

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    console.log('User authenticated:', user.uid)

    // Get additional user data from Firestore
    try {
      const userDoc = await getDoc(doc(db, 'schools', user.uid))
      console.log('Fetched school data from Firestore')

      if (userDoc.exists()) {
        return { success: true, user, userData: userDoc.data() }
      } else {
        console.error('No school record found for user:', user.uid)
        await firebaseSignOut(auth)
        return {
          success: false,
          error: 'No school record found for this account.',
        }
      }
    } catch (firestoreError) {
      console.error('Error fetching school data:', firestoreError)
      return {
        success: false,
        error: `Auth successful but database error: ${firestoreError.message}`,
        user,
      }
    }
  } catch (error) {
    console.error('Signin error:', error)
    let errorMessage = 'An error occurred during signin.'

    // Provide more specific error messages for common issues
    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      errorMessage = 'Invalid email or password. Please try again.'
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage =
        'Too many unsuccessful login attempts. Please try again later.'
    } else if (error.code) {
      errorMessage = `${error.message} (${error.code})`
    } else {
      errorMessage = error.message || errorMessage
    }

    return { success: false, error: errorMessage }
  }
}

export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const addTeacher = async (email, schoolId) => {
  try {
    // Generate a random password
    const password = Math.random().toString(36).slice(-8)

    // Store teacher info in Firestore
    const teacherRef = doc(db, 'schools', schoolId, 'teachers', email)
    await setDoc(teacherRef, {
      email,
      password, // This would be encrypted in a real system
      role: 'teacher',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { success: true, password }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const addStudent = async (rollNo, name, username, schoolId) => {
  try {
    // Generate a random password
    const password = Math.random().toString(36).slice(-8)

    // Store student info in Firestore
    const studentRef = doc(db, 'schools', schoolId, 'students', rollNo)
    await setDoc(studentRef, {
      rollNo,
      name,
      username,
      password, // This would be encrypted in a real system
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { success: true, password }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const verifySchoolAdmin = async (userId) => {
  try {
    if (!userId) {
      console.error("No user ID provided to verifySchoolAdmin");
      return false;
    }

    const schoolDoc = await getDoc(doc(db, "schools", userId));
    if (!schoolDoc.exists()) {
      console.error("School document not found for user:", userId);
      return false;
    }

    const schoolData = schoolDoc.data();
    console.log("School data:", schoolData);

    // Check if the user has the correct role
    if (schoolData.role !== 'school') {
      console.error("User does not have school admin role");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying school admin:", error);
    return false;
  }
};
