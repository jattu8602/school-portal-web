'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
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

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: '🏠' },
    { name: 'Add Class Details', href: '/dashboard/add-class', icon: '📚' },
    { name: 'Add Teachers', href: '/dashboard/add-teachers', icon: '👨‍🏫' },
    
    { name: 'Timetable', href: '/dashboard/timetable', icon: '📅' },
    { name: 'Attendance', href: '/dashboard/attendance', icon: '✓' },
    { name: 'Marks Details', href: '/dashboard/marks-details', icon: '📊' },
    { name: 'Manage Fees', href: '/dashboard/manage-fees', icon: '💰' },
    {
      name: 'Payment & Subscriptions',
      href: '/dashboard/payment-and-subscriptions',
      icon: '💳',
    },
    { name: 'About PresentSir', href: '/dashboard/about', icon: 'ℹ️' },
  ]

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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-4 border-b">
            <span className="text-2xl font-bold text-gray-900">PresentSir</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <button
              onClick={() =>
                auth.signOut().then(() => router.push('/auth/signin'))
              }
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <span className="mr-3">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}
