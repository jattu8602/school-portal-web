'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import TeacherManagement from '../components/dashboard/TeacherManagement'
import StudentManagement from '../components/dashboard/StudentManagement'
import FirebaseStatus from '../components/debug/FirebaseStatus'
import TestFirebase from '../components/debug/TestFirebase'
import TeamSection from '../components/TeamSection'

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('teachers')
  const [showDebug, setShowDebug] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    feeCollection: 0,
  })
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

  useEffect(() => {
    // In a real app, fetch these stats from Firestore
    // This is just a placeholder
    setStats({
      totalStudents: 120,
      totalTeachers: 12,
      totalClasses: 8,
      feeCollection: 24000,
    })
  }, [])

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

  const quickActions = [
    {
      name: 'Add New Class',
      href: '/dashboard/add-class',
      icon: '📚',
      description: 'Create a new class section',
    },
    {
      name: 'Take Attendance',
      href: '/dashboard/attendance',
      icon: '✓',
      description: "Mark today's attendance",
    },
    {
      name: 'Manage Timetable',
      href: '/dashboard/timetable',
      icon: '📅',
      description: 'Update class schedules',
    },
    {
      name: 'Collect Fees',
      href: '/dashboard/manage-fees',
      icon: '💰',
      description: 'Record fee payments',
    },
  ]

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


        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Dashboard Overview
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Total Students
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalStudents}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                +5 new this month
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Total Classes
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalClasses}
              </div>
              <div className="text-sm text-gray-500 mt-1">Class 5 - 12</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Teachers
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalTeachers}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                All subjects covered
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">
                Fee Collection
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{stats.feeCollection}
              </div>
              <div className="text-sm text-gray-500 mt-1">This month</div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mb-3">{action.icon}</div>
                  <h3 className="font-medium text-gray-900">{action.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activities */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activities
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📝</span>
                    <div>
                      <p className="text-gray-900">
                        Attendance marked for Class 10
                      </p>
                      <p className="text-sm text-gray-500">
                        By Amit Kumar • 10 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📅</span>
                    <div>
                      <p className="text-gray-900">
                        New timetable created for Class 8
                      </p>
                      <p className="text-sm text-gray-500">
                        By Priya Sharma • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg mr-3">💰</span>
                    <div>
                      <p className="text-gray-900">
                        Fee collected from 5 students
                      </p>
                      <p className="text-sm text-gray-500">
                        By Raj Verma • Yesterday, 5:30 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Our Team
            </h2>
            <TeamSection />
          </section>
        </div>
      </main>
    </div>
  )
}
