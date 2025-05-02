'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { Bell, Send, Clock, User, BookOpen, CheckCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function Notification() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'general', // general, attendance, announcement
    target: 'all' // all, teachers, students
  })
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        loadNotifications(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadNotifications = async (schoolId) => {
    try {
      const notificationsRef = collection(db, 'schools', schoolId, 'notifications')
      const q = query(notificationsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)

      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setNotifications(notificationsData)
    } catch (error) {
      console.error('Error loading notifications:', error)
      showToast('Failed to load notifications', 'error')
    }
  }

  const handleSendNotification = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setSending(true)
      const notificationsRef = collection(db, 'schools', user.uid, 'notifications')

      await addDoc(notificationsRef, {
        ...newNotification,
        createdAt: serverTimestamp(),
        status: 'sent'
      })

      // Reset form
      setNewNotification({
        title: '',
        message: '',
        type: 'general',
        target: 'all'
      })

      showToast('Notification sent successfully!', 'success')
      loadNotifications(user.uid)
    } catch (error) {
      console.error('Error sending notification:', error)
      showToast('Failed to send notification', 'error')
    } finally {
      setSending(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'attendance':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'announcement':
        return <Bell className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTargetIcon = (target) => {
    switch (target) {
      case 'teachers':
        return <User className="h-4 w-4 text-blue-500" />
      case 'students':
        return <BookOpen className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-gray-500">Send and manage notifications for teachers and students</p>
      </div>

      {/* Send Notification Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Send New Notification</h2>
        <form onSubmit={handleSendNotification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newNotification.type}
                onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="general">General</option>
                <option value="attendance">Attendance Update</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <select
                value={newNotification.target}
                onChange={(e) => setNewNotification({ ...newNotification, target: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All Users</option>
                <option value="teachers">Teachers Only</option>
                <option value="students">Students Only</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Notification History</h2>
        </div>

        <div className="divide-y">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div>
                      <h3 className="text-sm font-medium">{notification.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          {getTargetIcon(notification.target)}
                          <span className="ml-1">
                            {notification.target === 'all' ? 'All Users' :
                             notification.target === 'teachers' ? 'Teachers' : 'Students'}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {notification.createdAt?.toDate().toLocaleString() || 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No notifications yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}