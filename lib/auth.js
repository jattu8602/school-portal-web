import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
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

// Teacher Management
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

// Student Management
export const addStudent = async (rollNo, name, username, gender, classId, schoolId) => {
  try {
    // Generate a random password
    const password = Math.random().toString(36).slice(-8)

    // Store student info in Firestore
    const studentRef = doc(db, 'schools', schoolId, 'students', rollNo)
    await setDoc(studentRef, {
      rollNo,
      name,
      username,
      gender,
      classId,
      password, // This would be encrypted in a real system
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Update class counts
    if (classId) {
      const classRef = doc(db, 'schools', schoolId, 'classes', classId)
      const classDoc = await getDoc(classRef)

      if (classDoc.exists()) {
        const classData = classDoc.data()
        const boysCount = gender === 'Male' ? (classData.boysCount || 0) + 1 : (classData.boysCount || 0)
        const girlsCount = gender === 'Female' ? (classData.girlsCount || 0) + 1 : (classData.girlsCount || 0)

        await updateDoc(classRef, {
          boysCount,
          girlsCount,
          updatedAt: serverTimestamp()
        })
      }
    }

    return { success: true, password }
  } catch (error) {
    console.error('Error adding student:', error)
    return { success: false, error: error.message }
  }
}

// Class Management
export const addClass = async (classData, schoolId) => {
  try {
    const classesRef = collection(db, 'schools', schoolId, 'classes')
    const newClassRef = await addDoc(classesRef, {
      ...classData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { success: true, classId: newClassRef.id }
  } catch (error) {
    console.error('Error adding class:', error)
    return { success: false, error: error.message }
  }
}

export const updateClass = async (classId, classData, schoolId) => {
  try {
    const classRef = doc(db, 'schools', schoolId, 'classes', classId)
    await updateDoc(classRef, {
      ...classData,
      updatedAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating class:', error)
    return { success: false, error: error.message }
  }
}

export const deleteClass = async (classId, schoolId) => {
  try {
    await deleteDoc(doc(db, 'schools', schoolId, 'classes', classId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting class:', error)
    return { success: false, error: error.message }
  }
}

// Attendance Management
export const saveAttendance = async (classId, date, attendanceRecords, schoolId) => {
  try {
    const attendanceRef = doc(db, 'schools', schoolId, 'attendance', `${classId}_${date}`)
    await setDoc(attendanceRef, {
      classId,
      date,
      records: attendanceRecords,
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error saving attendance:', error)
    return { success: false, error: error.message }
  }
}

// Timetable Management
export const saveTimetable = async (classId, timetableData, schoolId) => {
  try {
    const timetableRef = doc(db, 'schools', schoolId, 'timetables', classId)
    const timetableDoc = await getDoc(timetableRef)

    if (timetableDoc.exists()) {
      await updateDoc(timetableRef, {
        schedule: timetableData,
        updatedAt: serverTimestamp()
      })
    } else {
      await setDoc(timetableRef, {
        classId,
        schedule: timetableData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving timetable:', error)
    return { success: false, error: error.message }
  }
}
