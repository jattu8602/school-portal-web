'use client'

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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchClasses(currentUser.uid)
      } else {
        router.push("/auth/signin")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

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
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
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
              </option>
            ))}
          </select>
        </div>
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
                </div>
              </div>
            </div>

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
