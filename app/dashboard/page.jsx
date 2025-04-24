'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import TeacherManagement from '../components/dashboard/TeacherManagement'
import StudentManagement from '../components/dashboard/StudentManagement'
import FirebaseStatus from '../components/debug/FirebaseStatus'
import TestFirebase from '../components/debug/TestFirebase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('teachers')
  const [showDebug, setShowDebug] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">School Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">
              Help
            </Link>
            <button
              onClick={() =>
                auth.signOut().then(() => router.push('/auth/signin'))
              }
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDebug && (
          <div>
            <FirebaseStatus />
            <TestFirebase />
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('teachers')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'teachers'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Teachers
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'students'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'teachers' ? (
              <TeacherManagement schoolId={user?.uid} />
            ) : (
              <StudentManagement schoolId={user?.uid} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
