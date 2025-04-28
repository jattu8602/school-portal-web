'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
    totalFees: 0,
    recentActivities: []
  })
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchDashboardData(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchDashboardData = async (schoolId) => {
    try {
      // Fetch total students
      const studentsRef = collection(db, 'schools', schoolId, 'students')
      const studentsSnapshot = await getDocs(studentsRef)
      const totalStudents = studentsSnapshot.size

      // Fetch total classes
      const classesRef = collection(db, 'schools', schoolId, 'classes')
      const classesSnapshot = await getDocs(classesRef)
      const totalClasses = classesSnapshot.size

      // Fetch total teachers
      const teachersRef = collection(db, 'schools', schoolId, 'teachers')
      const teachersSnapshot = await getDocs(teachersRef)
      const totalTeachers = teachersSnapshot.size

      // Get recent activities
      // This is a simplified version - in a real app you'd have a specific collection for activities
      const activities = [
        {
          id: 1,
          type: 'attendance',
          description: 'Attendance marked for Class 10',
          user: 'Amit Kumar',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          timeAgo: '10 minutes ago'
        },
        {
          id: 2,
          type: 'timetable',
          description: 'New timetable created for Class 8',
          user: 'Priya Sharma',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          timeAgo: '2 hours ago'
        },
        {
          id: 3,
          type: 'fee',
          description: 'Fee collected from 5 students',
          user: 'Raj Verma',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          timeAgo: 'Yesterday, 5:30 PM'
        }
      ]

      setStats({
        totalStudents,
        totalClasses,
        totalTeachers,
        totalFees: 24000, // Placeholder value
        recentActivities: activities
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <h2 className="text-3xl font-bold text-gray-900">{stats.totalStudents}</h2>
                <p className="text-gray-500 text-sm mt-1">+5 new this month</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Total Classes Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Classes</p>
                <h2 className="text-3xl font-bold text-gray-900">{stats.totalClasses}</h2>
                <p className="text-gray-500 text-sm mt-1">Class 5 - 12</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Teachers</p>
                <h2 className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</h2>
                <p className="text-gray-500 text-sm mt-1">All subjects covered</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Collection Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Fee Collection</p>
                <h2 className="text-3xl font-bold text-gray-900">₹{stats.totalFees.toLocaleString()}</h2>
                <p className="text-gray-500 text-sm mt-1">This month</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-gray-500 mb-6">Frequently used actions for your school</p>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/classes/add" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-primary-50 p-3 rounded-full mb-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Add New Class</span>
              </Link>

              <Link href="/dashboard/attendance" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-green-50 p-3 rounded-full mb-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Take Attendance</span>
              </Link>

              <Link href="/dashboard/timetable" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-blue-50 p-3 rounded-full mb-3">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Manage Timetable</span>
              </Link>

              <Link href="/dashboard/fees" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-purple-50 p-3 rounded-full mb-3">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Collect Fees</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <p className="text-gray-500 mb-6">Latest actions in your school</p>

            <div className="space-y-6">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'attendance' ? 'bg-green-100' :
                    activity.type === 'timetable' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'attendance' ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                    ) : activity.type === 'timetable' ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <span className="text-xs text-gray-500">{activity.timeAgo}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">By {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
