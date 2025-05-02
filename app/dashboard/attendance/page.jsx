'use client'

<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  where
} from 'firebase/firestore'
import Button from '../../components/ui/Button'

export default function AttendancePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [savingAttendance, setSavingAttendance] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  // Format date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

=======
import { useState, useEffect } from "react"
import { Calendar, Check, Download, X, AlertCircle, Users } from "lucide-react"
import { db, auth } from "../../../lib/firebase"
import { collection, getDocs, query, where, doc, setDoc, getDoc, Timestamp, onSnapshot } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [statistics, setStatistics] = useState({
    present: 0,
    absent: 0,
    late: 0,
    unrecorded: 0,
    attendanceRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' })
  const [attendanceListener, setAttendanceListener] = useState(null)
  const router = useRouter()
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize today to start of day

  // Listen for auth state changes
>>>>>>> origin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchClasses(currentUser.uid)
      } else {
<<<<<<< HEAD
        router.push('/auth/signin')
=======
        router.push("/auth/signin")
>>>>>>> origin
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

<<<<<<< HEAD
  const fetchClasses = async (schoolId) => {
    try {
      const classesRef = collection(db, 'schools', schoolId, 'classes')
      const classesSnapshot = await getDocs(classesRef)
      const classesList = classesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setClasses(classesList)

      // Select first class by default if available
      if (classesList.length > 0 && !selectedClass) {
        setSelectedClass(classesList[0].id)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setError('Failed to load classes')
    }
  }

  useEffect(() => {
    if (user?.uid && selectedClass) {
      fetchStudents(user.uid, selectedClass)
    }
  }, [user, selectedClass])

  useEffect(() => {
    if (user?.uid && selectedClass && selectedDate) {
      fetchAttendance(user.uid, selectedClass, selectedDate)
    }
  }, [user, selectedClass, selectedDate])

  const fetchStudents = async (schoolId, classId) => {
    try {
      const studentsRef = collection(db, 'schools', schoolId, 'students')
      const q = query(studentsRef, where('classId', '==', classId))
      const studentsSnapshot = await getDocs(q)

      if (studentsSnapshot.empty) {
        // Try to fetch all students if no class-specific students found
        const allStudentsSnapshot = await getDocs(studentsRef)
        const studentsList = allStudentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setStudents(studentsList)
      } else {
        const studentsList = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setStudents(studentsList)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setError('Failed to load students')
    }
  }

  const fetchAttendance = async (schoolId, classId, date) => {
    try {
      const attendanceRef = doc(db, 'schools', schoolId, 'attendance', `${classId}_${date}`)
      const attendanceDoc = await getDoc(attendanceRef)

      if (attendanceDoc.exists()) {
        setAttendance(attendanceDoc.data().records || {})
      } else {
        // Initialize with empty attendance
        setAttendance({})
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      setError('Failed to load attendance records')
    }
  }

  const toggleAttendance = (studentId, status = 'present') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        status,
        timestamp: new Date().toISOString()
      }
    }))
  }

  const markAllPresent = () => {
    const newAttendance = {}
    students.forEach(student => {
      newAttendance[student.id] = {
        status: 'present',
        timestamp: new Date().toISOString()
      }
    })
    setAttendance(newAttendance)
  }

  const saveAttendance = async () => {
    if (!user?.uid || !selectedClass || !selectedDate) return

    setSavingAttendance(true)
    setError('')
    setSuccess('')

    try {
      const attendanceRef = doc(db, 'schools', user.uid, 'attendance', `${selectedClass}_${selectedDate}`)
      await setDoc(attendanceRef, {
        classId: selectedClass,
        date: selectedDate,
        records: attendance,
        updatedAt: serverTimestamp()
      })

      setSuccess('Attendance saved successfully')
    } catch (error) {
      console.error('Error saving attendance:', error)
      setError('Failed to save attendance')
    } finally {
      setSavingAttendance(false)
    }
  }

  const exportAttendance = () => {
    alert('Export functionality will be implemented here')
  }

  const getAttendanceStats = () => {
    if (!attendance || Object.keys(attendance).length === 0) {
      return { present: 0, absent: 0, late: 0, unrecorded: students.length }
    }

=======
  // Clean up attendance listener when component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      if (attendanceListener) {
        attendanceListener()
      }
    }
  }, [attendanceListener])

  // Click outside calendar handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const calendar = document.getElementById('date-picker')
      if (calendarOpen && calendar && !calendar.contains(event.target)) {
        setCalendarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [calendarOpen])

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Check if date is in the future
  const isDateInFuture = (date) => {
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0) // Normalize to start of day
    return targetDate > today
  }

  // Fetch classes for the school
  const fetchClasses = async (schoolId) => {
    try {
      const classesCol = collection(db, 'schools', schoolId, 'classes')
      const classesSnapshot = await getDocs(classesCol)

      const classesData = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setClasses(classesData)

      if (classesData.length > 0) {
        setSelectedClass(classesData[0].id)
        fetchStudents(schoolId, classesData[0].id)
      }
    } catch (err) {
      console.error('Error fetching classes:', err)
      setStatusMessage({ type: 'error', message: 'Failed to load classes' })
    }
  }

  // Fetch students for a specific class
  const fetchStudents = async (schoolId, classId) => {
    setLoading(true)
    try {
      const studentsRef = collection(db, 'schools', schoolId, 'students')
      const studentsQuery = query(studentsRef, where('classId', '==', classId))
      const studentsSnapshot = await getDocs(studentsQuery)

      const studentsList = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setStudents(studentsList)

      // After setting students, set up real-time listener for attendance
      setupAttendanceListener(schoolId, classId, selectedDate)
    } catch (err) {
      console.error('Error fetching students:', err)
      setStatusMessage({ type: 'error', message: 'Failed to load students' })
      setLoading(false)
    }
  }

  // Set up real-time listener for attendance changes
  const setupAttendanceListener = (schoolId, classId, date) => {
    // First, clean up any existing listener
    if (attendanceListener) {
      attendanceListener()
    }

    const dateString = date.toISOString().split('T')[0]
    const attendanceDocRef = doc(db, 'schools', schoolId, 'attendance', `${classId}_${dateString}`)

    // Create a real-time listener
    const unsubscribe = onSnapshot(attendanceDocRef,
      (doc) => {
        // Success handler
        setLoading(false)

        let attendanceMap = {}

        if (doc.exists()) {
          const data = doc.data()
          attendanceMap = data.records || {}
        }

        // Initialize attendance for students without records
        const updatedAttendanceMap = {}

        // Only include active students in the attendance data
        students.forEach(student => {
          // If student has an existing record, use it; otherwise mark as unrecorded
          updatedAttendanceMap[student.id] = attendanceMap[student.id] || {
            status: 'unrecorded',
            timestamp: null
          }
        })

        setAttendanceData(updatedAttendanceMap)
        calculateStatistics(updatedAttendanceMap, students.length)
      },
      (error) => {
        // Error handler
        console.error('Error fetching attendance:', error)
        setStatusMessage({ type: 'error', message: 'Failed to load attendance data in real-time' })
        setLoading(false)
      }
    )

    // Save the unsubscribe function to clean up later
    setAttendanceListener(() => unsubscribe)
  }

  // Fetch attendance data for specific date and class (used when there's no listener yet)
  const fetchAttendance = async (schoolId, classId, date) => {
    try {
      const dateString = date.toISOString().split('T')[0]
      const attendanceDocRef = doc(db, 'schools', schoolId, 'attendance', `${classId}_${dateString}`)
      const attendanceDoc = await getDoc(attendanceDocRef)

      let attendanceMap = {}

      if (attendanceDoc.exists()) {
        const data = attendanceDoc.data()
        attendanceMap = data.records || {}
      }

      // Initialize attendance for students without records
      const updatedAttendanceMap = {}

      // Only include active students in the attendance data
      students.forEach(student => {
        // If student has an existing record, use it; otherwise mark as unrecorded
        updatedAttendanceMap[student.id] = attendanceMap[student.id] || {
          status: 'unrecorded',
          timestamp: null
        }
      })

      setAttendanceData(updatedAttendanceMap)
      calculateStatistics(updatedAttendanceMap, students.length)
      setLoading(false)

      // Set up real-time listener after initial fetch
      setupAttendanceListener(schoolId, classId, date)
    } catch (err) {
      console.error('Error fetching attendance:', err)
      setStatusMessage({ type: 'error', message: 'Failed to load attendance data' })
      setLoading(false)
    }
  }

  // Calculate attendance statistics
  const calculateStatistics = (data, totalStudents) => {
>>>>>>> origin
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
<<<<<<< HEAD
      unrecorded: 0
    }

    students.forEach(student => {
      const record = attendance[student.id]
      if (!record) {
        stats.unrecorded++
      } else if (record.status === 'present') {
        stats.present++
      } else if (record.status === 'absent') {
        stats.absent++
      } else if (record.status === 'late') {
        stats.late++
      }
    })

    return stats
  }

  // Generate dates for the week
  const getWeekDates = () => {
    const today = new Date(selectedDate)
    today.setHours(0, 0, 0, 0)

    const dates = []
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Adjust to start from Monday

    const monday = new Date(today)
    monday.setDate(today.getDate() - startOffset)

    for (let i = 0; i < 6; i++) { // Monday to Saturday
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)

      const dateObj = {
        day: i + 8, // Starting from 8 (just like in the UI)
        dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        date: formatDate(date),
        isToday: formatDate(date) === formatDate(new Date())
      }

      dates.push(dateObj)
    }

    return dates
  }

  const weekDates = getWeekDates()

  const stats = getAttendanceStats()
  const attendanceRate = students.length
    ? Math.round((stats.present / students.length) * 100)
    : 0

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500">Mark and track student attendance records.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="w-full md:w-60">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class {cls.name}
=======
      unrecorded: 0,
      attendanceRate: 0
    }

    // Count statuses only for active students
    Object.values(data).forEach(record => {
      if (record.status === 'present') stats.present++
      else if (record.status === 'absent') stats.absent++
      else if (record.status === 'late') stats.late++
      else stats.unrecorded++
    })

    // Make sure unrecorded count is accurate
    stats.unrecorded = totalStudents - (stats.present + stats.absent + stats.late)
    if (stats.unrecorded < 0) stats.unrecorded = 0

    // Calculate attendance rate based on present students
    stats.attendanceRate = totalStudents > 0
      ? Math.round((stats.present / totalStudents) * 100)
      : 0

    setStatistics(stats)
  }

  // Handle class change
  const handleClassChange = (e) => {
    const classId = e.target.value
    setSelectedClass(classId)
    if (user && classId) {
      // Clean up existing listener if there is one
      if (attendanceListener) {
        attendanceListener()
        setAttendanceListener(null)
      }
      fetchStudents(user.uid, classId)
    }
  }

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value)

    // Prevent selecting future dates
    if (isDateInFuture(newDate)) {
      setStatusMessage({ type: 'error', message: 'Cannot mark attendance for future dates' })
      setCalendarOpen(false)
      return
    }

    setSelectedDate(newDate)
    setCalendarOpen(false)

    if (user && selectedClass) {
      // Clean up existing listener if there is one
      if (attendanceListener) {
        attendanceListener()
        setAttendanceListener(null)
      }
      fetchAttendance(user.uid, selectedClass, newDate)
    }
  }

  // Toggle attendance status for a student
  const toggleAttendance = (studentId) => {
    setAttendanceData(prev => {
      const currentAttendance = prev[studentId] || { status: 'unrecorded', timestamp: null }
      let newStatus = 'unrecorded'

      // Cycle through statuses: unrecorded -> present -> absent -> late -> unrecorded
      if (currentAttendance.status === 'unrecorded') newStatus = 'present'
      else if (currentAttendance.status === 'present') newStatus = 'absent'
      else if (currentAttendance.status === 'absent') newStatus = 'late'

      const updated = {
        ...prev,
        [studentId]: {
          status: newStatus,
          timestamp: Timestamp.now()
        }
      }

      calculateStatistics(updated, students.length)
      return updated
    })
  }

  // Mark all students as present
  const markAllPresent = () => {
    const updated = { ...attendanceData }
    students.forEach(student => {
      updated[student.id] = {
        status: 'present',
        timestamp: Timestamp.now()
      }
    })

    setAttendanceData(updated)
    calculateStatistics(updated, students.length)
  }

  // Save attendance to database
  const saveAttendance = async () => {
    if (!user || !selectedClass) return

    setSaving(true)
    setStatusMessage({ type: '', message: '' })

    try {
      const dateString = selectedDate.toISOString().split('T')[0]
      const attendanceDocRef = doc(db, 'schools', user.uid, 'attendance', `${selectedClass}_${dateString}`)

      await setDoc(attendanceDocRef, {
        class: selectedClass,
        date: Timestamp.fromDate(selectedDate),
        records: attendanceData,
        updatedAt: Timestamp.now()
      })

      setStatusMessage({ type: 'success', message: 'Attendance saved successfully' })
    } catch (err) {
      console.error('Error saving attendance:', err)
      setStatusMessage({ type: 'error', message: 'Failed to save attendance' })
    } finally {
      setSaving(false)
    }
  }

  // Export attendance as CSV
  const exportAttendance = () => {
    if (students.length === 0) return

    const dateStr = selectedDate.toISOString().split('T')[0]
    const className = classes.find(c => c.id === selectedClass)?.name || 'Class'

    let csvContent = "Roll No,Name,Status,Date\n"

    students.forEach(student => {
      const status = attendanceData[student.id]?.status || 'unrecorded'
      csvContent += `${student.rollNo},"${student.name}",${status},${dateStr}\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${className}_attendance_${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get class name from class ID
  const getClassName = (classId) => {
    const classObj = classes.find(c => c.id === classId)
    return classObj ? `${classObj.name} ${classObj.section}` : ''
  }

  // Get status indicator color
  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500'
      case 'absent': return 'bg-red-500'
      case 'late': return 'bg-yellow-500'
      default: return 'bg-gray-100 border'
    }
  }

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setCalendarOpen(!calendarOpen)
  }

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="text-sm text-gray-500">Mark and track student attendance records.</p>
      </div>

      {statusMessage.message && (
        <div className={`mt-4 p-3 rounded-md flex items-center ${statusMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {statusMessage.type === 'error' ?
            <AlertCircle className="h-4 w-4 mr-2" /> :
            <Check className="h-4 w-4 mr-2" />
          }
          <p className="text-sm">{statusMessage.message}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="w-48">
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={selectedClass}
            onChange={handleClassChange}
            disabled={loading}
          >
            {classes.map(classItem => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name} {classItem.section}
>>>>>>> origin
              </option>
            ))}
          </select>
        </div>
<<<<<<< HEAD

        <div className="w-full md:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <Button onClick={markAllPresent}>Mark All Present</Button>
          <Button onClick={saveAttendance} disabled={savingAttendance}>
            {savingAttendance ? 'Saving...' : 'Save Attendance'}
          </Button>
          <Button variant="outline" onClick={exportAttendance}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
            <p className="text-gray-500 text-sm mb-4">{selectedDate}</p>

            <div className="flex items-center mb-4">
              <div className="text-4xl font-bold text-gray-900">{attendanceRate}%</div>
              <div className="ml-auto relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-red-100"></div>
                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
                  <div className="text-sm font-medium text-gray-900">{stats.present}/{students.length}</div>
=======
        <div className="flex items-center gap-2 relative">
          <div className="flex items-center rounded-md border border-gray-300 px-3 py-2">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-sm">{formatDate(selectedDate)}</span>
          </div>
          <button
            type="button"
            className="rounded-md bg-gray-100 px-3 py-2 text-sm cursor-pointer hover:bg-gray-200"
            onClick={toggleCalendar}
          >
            Change
          </button>

          {calendarOpen && (
            <div className="absolute top-full left-0 mt-1 z-10 bg-white border rounded-md shadow-lg p-2">
              <input
                type="date"
                id="date-picker"
                className="p-2 border rounded-md"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
              />
            </div>
          )}
        </div>
        <button
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
          onClick={markAllPresent}
          disabled={loading || saving || students.length === 0}
        >
          Mark All Present
        </button>
        <button
          className="flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
          onClick={saveAttendance}
          disabled={loading || saving || students.length === 0}
        >
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Attendance
            </>
          )}
        </button>
        <button
          className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={exportAttendance}
          disabled={loading || students.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-gray-800"></div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="col-span-1 rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold">Statistics</h2>
            <p className="text-xs text-gray-500">{formatDate(selectedDate)}</p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{statistics.attendanceRate}%</p>
                <p className="text-xs text-gray-500">Attendance Rate</p>
              </div>
              <div className="relative h-16 w-16">
                <div className={`h-16 w-16 rounded-full border-4 ${statistics.attendanceRate < 50 ? 'border-red-100' : 'border-green-100'}`}></div>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                  {statistics.present}/{students.length}
>>>>>>> origin
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="space-y-4">
              <div className="bg-green-100 p-4 rounded-md">
                <p className="text-xs font-medium uppercase mb-1">Present</p>
                <p className="text-2xl font-bold">{stats.present}</p>
              </div>

              <div className="bg-red-100 p-4 rounded-md">
                <p className="text-xs font-medium uppercase mb-1">Absent</p>
                <p className="text-2xl font-bold">{stats.absent}</p>
              </div>

              <div className="bg-yellow-100 p-4 rounded-md">
                <p className="text-xs font-medium uppercase mb-1">Late</p>
                <p className="text-2xl font-bold">{stats.late}</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-xs font-medium uppercase mb-1">Unrecorded</p>
                <p className="text-2xl font-bold">{stats.unrecorded}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2 mt-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Late</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance Sheet</h2>
            <p className="text-gray-500 text-sm mb-4">Click to toggle attendance status</p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    {weekDates.map((date) => (
                      <th
                        key={date.day}
                        scope="col"
                        className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="text-center">{date.day}</div>
                        <div className="text-center">{date.dayName}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name || `Student ${index + 1}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.gender || (index % 2 === 0 ? 'Male' : 'Female')}
                      </td>
                      {weekDates.map((date) => (
                        <td key={date.day} className="px-3 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <button
                              className={`w-6 h-6 rounded-full transition-colors ${
                                attendance[student.id]?.status === 'present'
                                  ? 'bg-green-500 text-white'
                                  : attendance[student.id]?.status === 'absent'
                                  ? 'bg-red-500 text-white'
                                  : attendance[student.id]?.status === 'late'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                              onClick={() => {
                                const currentStatus = attendance[student.id]?.status
                                if (!currentStatus) {
                                  toggleAttendance(student.id, 'present')
                                } else if (currentStatus === 'present') {
                                  toggleAttendance(student.id, 'absent')
                                } else if (currentStatus === 'absent') {
                                  toggleAttendance(student.id, 'late')
                                } else {
                                  // Reset if late
                                  toggleAttendance(student.id, 'present')
                                }
                              }}
                            >
                              {attendance[student.id]?.status === 'present' && '✓'}
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
=======
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-green-50 p-3">
                <p className="text-center text-lg font-semibold text-green-600">{statistics.present}</p>
                <p className="text-center text-xs font-medium uppercase text-green-600">Present</p>
              </div>
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-center text-lg font-semibold text-red-600">{statistics.absent}</p>
                <p className="text-center text-xs font-medium uppercase text-red-600">Absent</p>
              </div>
              <div className="rounded-md bg-yellow-50 p-3">
                <p className="text-center text-lg font-semibold text-yellow-600">{statistics.late}</p>
                <p className="text-center text-xs font-medium uppercase text-yellow-600">Late</p>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-center text-lg font-semibold text-gray-600">{statistics.unrecorded}</p>
                <p className="text-center text-xs font-medium uppercase text-gray-600">Unrecorded</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Present</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Absent</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Late</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3 rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold">Attendance Sheet</h2>
            <p className="text-xs text-gray-500">Click to toggle attendance status</p>

            {students.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-gray-100 p-3">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">There are no students in this class or the class hasn't been set up yet.</p>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full min-w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b">
                      <th className="py-2 pl-4 pr-2 text-left text-xs font-medium text-gray-500">Roll</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Gender</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.sort((a, b) => a.rollNo - b.rollNo).map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 pl-4 pr-2 text-sm">{student.rollNo}</td>
                        <td className="px-2 py-3 text-sm">{student.name}</td>
                        <td className="px-2 py-3 text-sm">{student.gender === 'male' ? 'Male' : 'Female'}</td>
                        <td className="px-2 py-3 text-center">
                          <button
                            onClick={() => toggleAttendance(student.id)}
                            className="focus:outline-none"
                          >
                            {attendanceData[student.id]?.status === 'present' ? (
                              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white">
                                <Check className="h-4 w-4" />
                              </div>
                            ) : attendanceData[student.id]?.status === 'absent' ? (
                              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white">
                                <X className="h-4 w-4" />
                              </div>
                            ) : attendanceData[student.id]?.status === 'late' ? (
                              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500 text-white">
                                <span className="text-xs font-bold">L</span>
                              </div>
                            ) : (
                              <div className="mx-auto h-7 w-7 rounded-full border hover:bg-gray-100"></div>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
>>>>>>> origin
