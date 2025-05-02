'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ToastProvider } from '../../app/context/ToastContext'
import { Bell, Menu, X, User, ChevronDown, Sun, Moon } from 'lucide-react'
import { getDoc, doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore'

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  // Check system dark mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: light)').matches
      setDarkMode(prefersDark)

      // Listen for changes in dark mode preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        setDarkMode(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchSchoolInfo(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  // Fetch school information and notifications
  const fetchSchoolInfo = async (schoolId) => {
    try {
      const schoolDoc = await getDoc(doc(db, 'schools', schoolId))
      if (schoolDoc.exists()) {
        setSchoolInfo(schoolDoc.data())
      }

      // Fetch notifications
      const notificationsRef = collection(db, 'schools', schoolId, 'notifications')
      const q = query(notificationsRef, where('status', '==', 'unread'))
      const snapshot = await getDocs(q)
      setUnreadNotifications(snapshot.size)
    } catch (error) {
      console.error('Error fetching school info:', error)
    }
  }

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if click is outside
      const profileElement = document.getElementById('profile-dropdown')
      if (profileDropdownOpen && profileElement && !profileElement.contains(event.target)) {
        setProfileDropdownOpen(false)
      }

      // Close notifications dropdown if click is outside
      const notificationsElement = document.getElementById('notifications-dropdown')
      if (notificationsOpen && notificationsElement && !notificationsElement.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen, notificationsOpen])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode)
  }, [])

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

  const notifications = [
    { id: 1, title: 'New student added', time: '2 minutes ago' },
    { id: 2, title: 'Attendance updated', time: '1 hour ago' },
    { id: 3, title: 'Fee payment received', time: 'Yesterday' },
  ]

  const handleNotificationClick = () => {
    setNotificationsOpen(false)
    router.push('/dashboard/notification')
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
    <ToastProvider>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        {/* Top Navbar - Always visible */}
        <header className={`fixed top-0 left-0 right-0 ${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-sm'} z-30`}>
          <div className="flex items-center justify-between px-4 h-16">
            {/* Left section with logo and mobile menu toggle */}
            <div className="flex items-center">
              <button
                className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center">
                <div className="h-9 w-9 relative flex-shrink-0">
                  <img
                    src={darkMode ? "/present_sir_night_logo.jpg" : "/present_sir_day-logo.jpg"}
                    alt="Present Sir Logo"
                    className="h-full w-full object-contain rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/36?text=PS";
                    }}
                  />
                </div>
                <span className="ml-2 text-xl font-bold tracking-wide uppercase hidden sm:block">Present Sir</span>
              </div>
            </div>






            {/* Right section with theme toggle, notifications and profile */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              {/* <button
                className={`text-gray-500 hover:text-gray-700 p-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button> */}

              {/* Notifications */}
              <div className="relative" id="notifications-dropdown">
                <button
                  className="text-gray-500 hover:text-gray-700 relative"
                  onClick={handleNotificationClick}
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className={`absolute right-0 mt-2 w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg overflow-hidden z-20`}>
                    <div className={`py-2 px-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'} border-b`}>
                      <h3 className="text-sm font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                          {notifications.map(notification => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                              onClick={() => {
                                // Mark notification as read
                                const notificationRef = doc(db, 'schools', user.uid, 'notifications', notification.id)
                                updateDoc(notificationRef, { status: 'read' })
                                setUnreadNotifications(prev => prev - 1)
                                setNotificationsOpen(false)
                              }}
                            >
                              <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <div className={`py-2 px-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'} border-t text-center`}>
                      <Link href="/dashboard/notification" className="text-xs text-blue-600 hover:text-blue-800">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative" id="profile-dropdown">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                    {schoolInfo?.photoURL ? (
                      <img
                        src={schoolInfo.photoURL}
                        alt={schoolInfo.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/32?text=S";
                        }}
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className={`text-sm font-medium hidden md:block ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {schoolInfo?.name || user?.email?.split('@')[0] || "School"}
                  </span>
                  <ChevronDown size={16} className="hidden md:block" />
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg overflow-hidden z-20`}>
                    <div className="py-1">
                      <Link href="/dashboard/profile" className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        Your Profile
                      </Link>
                      <Link href="/dashboard/settings" className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        Settings
                      </Link>
                      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}></div>
                      <button
                        onClick={() => auth.signOut().then(() => router.push('/auth/signin'))}
                        className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar - Hidden on mobile unless toggled */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 ${darkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-lg'} transition-transform transform z-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{ top: '64px', height: 'calc(100vh - 64px)' }}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-6 py-3 ${
                      isActive
                        ? darkMode
                          ? 'bg-gray-700 text-blue-400 border-r-4 border-blue-400'
                          : 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* School Info */}
            <div className={`border-t p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-xs text-gray-500 mb-1">Logged in as:</div>
              <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {schoolInfo?.name || "School Account"}
              </div>
              <div className="text-xs text-gray-500">
                {schoolInfo?.email || user?.email || ""}
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Adjust padding for fixed navbar */}
        <main className={`md:ml-64 min-h-screen pt-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
