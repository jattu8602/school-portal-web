'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ToastProvider } from '../../app/context/ToastContext'
import { Bell, Menu, X, User, ChevronDown } from 'lucide-react'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { SearchBar } from '../components/ui/search-bar'

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
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
      const notificationsRef = collection(
        db,
        'schools',
        schoolId,
        'notifications'
      )
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
      if (
        profileDropdownOpen &&
        profileElement &&
        !profileElement.contains(event.target)
      ) {
        setProfileDropdownOpen(false)
      }

      // Close notifications dropdown if click is outside
      const notificationsElement = document.getElementById(
        'notifications-dropdown'
      )
      if (
        notificationsOpen &&
        notificationsElement &&
        !notificationsElement.contains(event.target)
      ) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen, notificationsOpen])

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
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
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

  // Placeholder for any future custom handlers

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
      <div className="min-h-screen bg-gray-100 text-gray-900">
        {/* Top Navbar - Always visible */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
          <div className="flex items-center px-2 md:px-4 h-full">
            {/* Left section with menu toggle and logo */}
            <div
              className={`flex items-center ${isMobile ? 'w-auto' : 'w-1/4'}`}
            >
              <button
                className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 relative hidden md:block">
                  <Image
                    src="/present_sir_day-logo.jpg"
                    alt="Present Sir Logo"
                    width={32}
                    height={32}
                    className="h-full w-full object-contain rounded-md"
                    priority={true}
                    quality={85}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://via.placeholder.com/32?text=PS'
                    }}
                  />
                </div>
                <span className="ml-2 text-lg font-bold tracking-wide uppercase hidden md:block">
                  Present Sir
                </span>
              </div>
            </div>

            {/* Center section with search bar - expanded on mobile */}
            <div className={`px-1 md:px-4 ${isMobile ? 'flex-1' : 'w-1/2'}`}>
              <SearchBar />
            </div>

            {/* Right section with notifications and profile */}
            <div
              className={`flex items-center justify-end space-x-2 md:space-x-4 ${
                isMobile ? 'ml-1' : 'w-1/4'
              }`}
            >
              {/* Notifications */}
              <div className="relative" id="notifications-dropdown">
                <button
                  className="text-gray-500 hover:text-gray-700 relative p-1 rounded-full hover:bg-gray-100"
                  onClick={handleNotificationClick}
                >
                  <Bell size={isMobile ? 16 : 18} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile */}
              <div className="relative" id="profile-dropdown">
                <button
                  className="flex items-center space-x-1 md:space-x-2 text-gray-700 hover:bg-gray-100 rounded-full p-1"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {schoolInfo?.photoURL ? (
                      <img
                        src={schoolInfo.photoURL}
                        alt={schoolInfo.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://via.placeholder.com/32?text=S'
                        }}
                      />
                    ) : (
                      <User size={isMobile ? 14 : 16} />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden md:block text-gray-800">
                    {schoolInfo?.name || user?.email?.split('@')[0] || 'School'}
                  </span>
                  <ChevronDown size={14} className="hidden md:block" />
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() =>
                          auth.signOut().then(() => router.push('/auth/signin'))
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transition-transform transform z-50 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{ top: '64px', height: 'calc(100vh - 64px)' }}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2.5 my-0.5 mx-2 rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3 w-5 text-center">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* School Info */}
            <div className="border-t border-b border-gray-200">
              <button
                onClick={() =>
                  auth.signOut().then(() => router.push('/auth/signin'))
                }
                className="w-full text-left p-2"
              >
                <div
                  id="nav-logout"
                  className="flex items-center justify-between bg-white text-white rounded-xl p-2 hover:bg-gray-50"
                >
                  {/* Left side: icon + text */}
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#fef2f2] p-3 rounded-lg">
                      {/* you can swap this SVG for whatever logout icon you like */}
                      <svg
                        className="w-6 h-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-red-500 font-bold">Logout</div>
                      <div className="text-gray-400 text-xs">
                        Sign out of your account
                      </div>
                    </div>
                  </div>
                  {/* Right side: chevron */}
                  <div className="text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <Link
                href="/dashboard/profile"
                className="block border-t border-gray-200 px-2 py-2 text-sm text-gray-700 "
              >
                <div className=" p-2 rounded-xl hover:bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">
                    Logged in as:
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {schoolInfo?.name || 'School Account'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {schoolInfo?.email || user?.email || ''}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar backdrop - visible only when sidebar open on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Adjust padding for fixed navbar */}
        <main className="md:ml-64 min-h-screen pt-16 bg-gray-100 px-4 py-6 relative z-0">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
