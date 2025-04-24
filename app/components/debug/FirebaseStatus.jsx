'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'

export default function FirebaseStatus() {
  const [authStatus, setAuthStatus] = useState('Checking...')
  const [dbStatus, setDbStatus] = useState('Checking...')
  const [currentUser, setCurrentUser] = useState(null)
  const [schoolData, setSchoolData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Test Firebase authentication status
    const testAuth = async () => {
      try {
        const methods = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              continueUri: window.location.origin,
              providerId: 'password',
            }),
          }
        ).then((res) => res.json())

        console.log('Firebase auth status check:', methods)

        if (methods.error) {
          setAuthStatus(`Error checking auth: ${methods.error.message}`)
        }
      } catch (error) {
        console.error('Error checking Firebase auth status:', error)
      }
    }

    testAuth()

    // Check authentication status
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthStatus('Authenticated')
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        })

        // Try to access Firestore data
        try {
          // Check if we can query the schools collection
          const schoolsRef = collection(db, 'schools')
          const schoolsSnapshot = await getDocs(schoolsRef)
          setDbStatus(
            `Connected to Firestore. Found ${schoolsSnapshot.docs.length} schools.`
          )

          // If user is authenticated, try to get their school data
          if (user) {
            try {
              // For testing, list teachers and students if the user has any
              const teachersRef = collection(
                db,
                'schools',
                user.uid,
                'teachers'
              )
              const teachersSnapshot = await getDocs(teachersRef)

              const studentsRef = collection(
                db,
                'schools',
                user.uid,
                'students'
              )
              const studentsSnapshot = await getDocs(studentsRef)

              setSchoolData({
                teachersCount: teachersSnapshot.docs.length,
                studentsCount: studentsSnapshot.docs.length,
              })
            } catch (err) {
              console.error('Error fetching school data:', err)
            }
          }
        } catch (error) {
          setDbStatus(`Error connecting to Firestore: ${error.message}`)
          setError(error)
        }
      } else {
        setAuthStatus('Not authenticated')
        setCurrentUser(null)
        setSchoolData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="bg-gray-100 p-4 rounded-md my-4">
      <h2 className="text-lg font-bold mb-2">Firebase Connection Status</h2>

      <div className="mb-2">
        <strong>Authentication:</strong> {authStatus}
      </div>

      <div className="mb-2">
        <strong>Firestore:</strong> {dbStatus}
      </div>

      {currentUser && (
        <div className="mb-2">
          <strong>Current User:</strong>
          <pre className="bg-gray-200 p-2 rounded mt-1 text-xs overflow-auto">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>
      )}

      {schoolData && (
        <div className="mb-2">
          <strong>School Data:</strong>
          <div className="bg-gray-200 p-2 rounded mt-1 text-sm">
            <p>Teachers: {schoolData.teachersCount}</p>
            <p>Students: {schoolData.studentsCount}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 mb-2">
          <strong>Error:</strong>
          <pre className="bg-red-100 p-2 rounded mt-1 text-xs overflow-auto">
            {error.toString()}
          </pre>
        </div>
      )}
    </div>
  )
}
