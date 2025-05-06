'use client'

import { useState, useEffect } from "react"
import { Calendar, Check, Download, X, AlertCircle, Users, FileText, FileSpreadsheet, Clock, BarChart3 } from "lucide-react"
import { db, auth } from "../../../lib/firebase"
import { collection, getDocs, query, where, doc, setDoc, getDoc, Timestamp, onSnapshot, orderBy } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

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
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false)
  const [user, setUser] = useState(null)
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' })
  const [attendanceListener, setAttendanceListener] = useState(null)
  const [schoolStats, setSchoolStats] = useState({
    totalStudents: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalUnrecorded: 0,
    overallAttendanceRate: 0
  })
  const router = useRouter()
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize today to start of day

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchSchoolInfo(currentUser.uid)
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

  // Fetch school information
  const fetchSchoolInfo = async (schoolId) => {
    try {
      const schoolDoc = await getDoc(doc(db, 'schools', schoolId))
      if (schoolDoc.exists()) {
        setSchoolInfo(schoolDoc.data())
      }
    } catch (err) {
      console.error('Error fetching school info:', err)
    }
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
    try {
      setLoading(true)
      console.log('Fetching students for class:', classId) // Debug log

      // Query students for the specific class
      const studentsRef = collection(db, 'schools', schoolId, 'students')
      const studentsQuery = query(
        studentsRef,
        where('classId', '==', classId)
      )
      const studentsSnapshot = await getDocs(studentsQuery)

      console.log('Students found:', studentsSnapshot.size) // Debug log

      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Sort students by roll number
      studentsData.sort((a, b) => Number(a.rollNo) - Number(b.rollNo))
      setStudents(studentsData)

      // Initialize attendance data for all students in this class
      const initialAttendanceData = {}
      studentsData.forEach(student => {
        initialAttendanceData[student.id] = {
          status: 'unrecorded',
          timestamp: null
        }
      })
      setAttendanceData(initialAttendanceData)

      // Update statistics for this specific class
      const stats = calculateStatistics(initialAttendanceData, studentsData.length)
      setStatistics(stats)

      // Fetch attendance after getting students
      await fetchAttendance(schoolId, classId, selectedDate)
    } catch (err) {
      console.error('Error fetching students:', err)
      showToast('Failed to fetch students', 'error')
    } finally {
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
      const dateStr = formatDate(date)
      console.log('Fetching attendance for:', dateStr) // Debug log

      const attendanceRef = doc(db, 'schools', schoolId, 'attendance', `${classId}_${dateStr}`)
      const attendanceDoc = await getDoc(attendanceRef)

      if (attendanceDoc.exists()) {
        const data = attendanceDoc.data()
        console.log('Found existing attendance:', data) // Debug log

        // Update attendance data only for students in this class
        const updatedAttendanceData = {}
        Object.entries(data.attendance || {}).forEach(([studentId, record]) => {
          // Only include attendance for students in the current class
          if (students.some(student => student.id === studentId)) {
            updatedAttendanceData[studentId] = record
          }
        })
        setAttendanceData(updatedAttendanceData)
        setIsAttendanceMarked(true)

        // Update statistics with correct student count for this class
        const stats = calculateStatistics(updatedAttendanceData, students.length)
        setStatistics(stats)
      } else {
        console.log('No existing attendance found') // Debug log
        // Initialize with unrecorded status for all students in this class
        const initialAttendanceData = {}
        students.forEach(student => {
          initialAttendanceData[student.id] = {
            status: 'unrecorded',
            timestamp: null
          }
        })
        setAttendanceData(initialAttendanceData)
        setIsAttendanceMarked(false)

        // Update statistics for unrecorded state
        const stats = calculateStatistics(initialAttendanceData, students.length)
        setStatistics(stats)
      }
    } catch (err) {
      console.error('Error fetching attendance:', err)
      showToast('Failed to fetch attendance data', 'error')
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

    // Count statuses only for students in the current class
    Object.entries(data).forEach(([studentId, record]) => {
      // Verify the student belongs to the current class
      if (students.some(student => student.id === studentId)) {
        if (record.status === 'present') stats.present++
        else if (record.status === 'absent') stats.absent++
        else if (record.status === 'late') stats.late++
      }
    })

    // Calculate unrecorded as remaining students in this class
    stats.unrecorded = totalStudents - (stats.present + stats.absent + stats.late)
    if (stats.unrecorded < 0) stats.unrecorded = 0

    // Calculate attendance rate based on present students in this class
    stats.attendanceRate = totalStudents > 0
      ? Math.min(Math.round((stats.present / totalStudents) * 100), 100)
      : 0

    return stats
  }

  // Handle class change
  const handleClassChange = async (e) => {
    const classId = e.target.value
    console.log('Class changed to:', classId) // Debug log
    setSelectedClass(classId)

    if (classId) {
      const schoolId = auth.currentUser.uid
      // Clear previous data
      setStudents([])
      setAttendanceData({})
      setStatistics({
        present: 0,
        absent: 0,
        late: 0,
        unrecorded: 0,
        attendanceRate: 0
      })
      setIsAttendanceMarked(false)

      // Fetch new data
      await fetchStudents(schoolId, classId)
    }
  }

  // Handle date change
  const handleDateChange = async (e) => {
    const newDate = e.target.value
    setSelectedDate(new Date(newDate))

    if (selectedClass) {
      const schoolId = auth.currentUser.uid
      // Clear previous attendance data
      setAttendanceData({})
      setStatistics({
        present: 0,
        absent: 0,
        late: 0,
        unrecorded: students.length,
        attendanceRate: 0
      })
      setIsAttendanceMarked(false)

      // Fetch new attendance data
      await fetchAttendance(schoolId, selectedClass, new Date(newDate))
    }
  }

  // Toggle attendance status for a student
  const toggleAttendance = (studentId) => {
    if (isAttendanceMarked) return // Don't allow changes if already marked

    setAttendanceData(prev => {
      const currentStatus = prev[studentId]?.status
      let newStatus

      // Cycle through statuses: unrecorded -> present -> absent -> late -> unrecorded
      if (currentStatus === 'unrecorded') newStatus = 'present'
      else if (currentStatus === 'present') newStatus = 'absent'
      else if (currentStatus === 'absent') newStatus = 'late'
      else newStatus = 'unrecorded'

      const newData = {
        ...prev,
        [studentId]: {
          status: newStatus,
          timestamp: Timestamp.now()
        }
      }

      // Update statistics immediately
      const stats = calculateStatistics(newData, students.length)
      setStatistics(stats)

      return newData
    })
  }

  // Mark all students as present
  const markAllPresent = () => {
    if (isAttendanceMarked) return // Don't allow changes if already marked

    const newAttendanceData = {}
    students.forEach(student => {
      newAttendanceData[student.id] = {
        status: 'present',
        timestamp: Timestamp.now()
      }
    })

    setAttendanceData(newAttendanceData)

    // Update statistics
    const stats = calculateStatistics(newAttendanceData, students.length)
    setStatistics(stats)
  }

  // Save attendance to database
  const saveAttendance = async () => {
    if (!selectedClass) {
      showToast('Please select a class first', 'error')
      return
    }

    if (isAttendanceMarked) {
      showToast('Attendance already marked for this date', 'warning')
      return
    }

    try {
      setSaving(true)
      const schoolId = auth.currentUser.uid
      const dateStr = formatDate(selectedDate)
      const attendanceRef = doc(db, 'schools', schoolId, 'attendance', `${selectedClass}_${dateStr}`)

      // Verify no duplicate attendance
      const existingAttendance = await getDoc(attendanceRef)
      if (existingAttendance.exists()) {
        showToast('Attendance already marked for this date', 'error')
        return
      }

      // Prepare attendance data only for students in this class
      const attendanceDataToSave = {
        attendance: attendanceData,
        date: Timestamp.fromDate(selectedDate),
        classId: selectedClass,
        className: getClassName(selectedClass),
        totalStudents: students.length, // Use actual number of students in this class
        markedBy: auth.currentUser.email,
        markedAt: Timestamp.now(),
        statistics: statistics
      }

      await setDoc(attendanceRef, attendanceDataToSave)
      setIsAttendanceMarked(true)
      showToast('Attendance saved successfully', 'success')
    } catch (err) {
      console.error('Error saving attendance:', err)
      showToast('Failed to save attendance', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Export attendance as Excel
  const exportAttendanceExcel = () => {
    if (students.length === 0) return

    const dateStr = selectedDate.toISOString().split('T')[0]
    const className = classes.find(c => c.id === selectedClass)?.name || 'Class'
    const section = classes.find(c => c.id === selectedClass)?.section || ''
    const classTeacher = classes.find(c => c.id === selectedClass)?.classTeacher || ''

    // Prepare data for Excel
    const data = [
      ['School Name:', schoolInfo?.name || ''],
      ['Class:', `${className} ${section}`],
      ['Class Teacher:', classTeacher],
      ['Date:', formatDate(selectedDate)],
      [], // Empty row for spacing
      ['Roll No', 'Name', 'Status', 'Time']
    ]

    // Add student data
    students.forEach(student => {
      const status = attendanceData[student.id]?.status || 'unrecorded'
      const time = attendanceData[student.id]?.timestamp ?
        new Date(attendanceData[student.id].timestamp.toDate()).toLocaleTimeString() : ''
      data.push([student.rollNo, student.name, status, time])
    })

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance')

    // Save file
    XLSX.writeFile(wb, `${className}_${section}_attendance_${dateStr}.xlsx`)
  }

  // Export attendance as PDF
  const exportAttendancePDF = () => {
    if (students.length === 0) return

    const dateStr = selectedDate.toISOString().split('T')[0]
    const className = classes.find(c => c.id === selectedClass)?.name || 'Class'
    const section = classes.find(c => c.id === selectedClass)?.section || ''
    const classTeacher = classes.find(c => c.id === selectedClass)?.classTeacher || ''

    // Create PDF document
    const doc = new jsPDF()

    // Add header information
    doc.setFontSize(16)
    doc.text(schoolInfo?.name || '', 14, 15)
    doc.setFontSize(12)
    doc.text(`Class: ${className} ${section}`, 14, 25)
    doc.text(`Class Teacher: ${classTeacher}`, 14, 35)
    doc.text(`Date: ${formatDate(selectedDate)}`, 14, 45)

    // Prepare table data
    const tableData = students.map(student => {
      const status = attendanceData[student.id]?.status || 'unrecorded'
      const time = attendanceData[student.id]?.timestamp ?
        new Date(attendanceData[student.id].timestamp.toDate()).toLocaleTimeString() : ''
      return [student.rollNo, student.name, status, time]
    })

    // Add table
    doc.autoTable({
      startY: 55,
      head: [['Roll No', 'Name', 'Status', 'Time']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    })

    // Save PDF
    doc.save(`${className}_${section}_attendance_${dateStr}.pdf`)
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

  // Add this new function to calculate school-wide statistics
  const calculateSchoolStats = async (schoolId) => {
    try {
      const classesRef = collection(db, 'schools', schoolId, 'classes')
      const classesSnapshot = await getDocs(classesRef)
      let totalStudents = 0
      let totalPresent = 0
      let totalAbsent = 0
      let totalLate = 0
      let totalUnrecorded = 0

      // Get attendance for each class
      for (const classDoc of classesSnapshot.docs) {
        const classId = classDoc.id
        const dateStr = formatDate(selectedDate)
        const attendanceRef = doc(db, 'schools', schoolId, 'attendance', `${classId}_${dateStr}`)
        const attendanceDoc = await getDoc(attendanceRef)

        // Get total students in class first
        const studentsRef = collection(db, 'schools', schoolId, 'students')
        const studentsQuery = query(studentsRef, where('classId', '==', classId))
        const studentsSnapshot = await getDocs(studentsQuery)
        const classTotalStudents = studentsSnapshot.size
        totalStudents += classTotalStudents

        if (attendanceDoc.exists()) {
          const data = attendanceDoc.data()
          const attendance = data.attendance || {}

          // Count attendance statuses
          Object.values(attendance).forEach(record => {
            if (record.status === 'present') totalPresent++
            else if (record.status === 'absent') totalAbsent++
            else if (record.status === 'late') totalLate++
          })
        }
      }

      // Calculate unrecorded as remaining students
      totalUnrecorded = totalStudents - (totalPresent + totalAbsent + totalLate)
      if (totalUnrecorded < 0) totalUnrecorded = 0

      // Calculate overall attendance rate
      const overallAttendanceRate = totalStudents > 0
        ? Math.min(Math.round((totalPresent / totalStudents) * 100), 100)
        : 0

      setSchoolStats({
        totalStudents,
        totalPresent,
        totalAbsent,
        totalLate,
        totalUnrecorded,
        overallAttendanceRate
      })
    } catch (err) {
      console.error('Error calculating school stats:', err)
    }
  }

  // Update useEffect to calculate school stats when date changes
  useEffect(() => {
    if (user) {
      calculateSchoolStats(user.uid)
    }
  }, [selectedDate, user])

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="text-sm text-gray-500">Mark and track student attendance records.</p>
      </div>

      {schoolInfo && (
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">School Name</p>
              <p className="font-medium">{schoolInfo.name}</p>
            </div>
            {selectedClass && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{getClassName(selectedClass)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class Teacher</p>
                  <p className="font-medium">{classes.find(c => c.id === selectedClass)?.classTeacher || 'Not Assigned'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
        <div className="flex gap-2">
          <button
            className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            onClick={exportAttendanceExcel}
            disabled={loading || students.length === 0}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </button>
          <button
            className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            onClick={exportAttendancePDF}
            disabled={loading || students.length === 0}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-gray-800"></div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6">
          {/* School-wide Statistics */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">School-wide Attendance Statistics</h2>
            <p className="text-sm text-gray-500 mb-6">{formatDate(selectedDate)}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">{schoolStats.totalStudents}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600">Present</p>
                    <p className="text-2xl font-bold text-green-700">{schoolStats.totalPresent}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm text-red-600">Absent</p>
                    <p className="text-2xl font-bold text-red-700">{schoolStats.totalAbsent}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm text-yellow-600">Late</p>
                    <p className="text-2xl font-bold text-yellow-700">{schoolStats.totalLate}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Unrecorded</p>
                    <p className="text-2xl font-bold text-gray-700">{schoolStats.totalUnrecorded}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-gray-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-700">{schoolStats.overallAttendanceRate}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Class-specific Statistics */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Class Attendance Statistics</h2>
            <p className="text-sm text-gray-500 mb-6">{formatDate(selectedDate)} - {getClassName(selectedClass)}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">{students.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600">Present</p>
                    <p className="text-2xl font-bold text-green-700">{statistics.present}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm text-red-600">Absent</p>
                    <p className="text-2xl font-bold text-red-700">{statistics.absent}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm text-yellow-600">Late</p>
                    <p className="text-2xl font-bold text-yellow-700">{statistics.late}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Unrecorded</p>
                    <p className="text-2xl font-bold text-gray-700">{statistics.unrecorded}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-gray-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-700">{statistics.attendanceRate}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Sheet */}
          <div className="rounded-lg border bg-white p-6">
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
