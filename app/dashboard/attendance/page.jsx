'use client'

import { useState, useEffect } from "react"
import { Calendar, Check, Download, X, AlertCircle, Users, FileText, FileSpreadsheet } from "lucide-react"
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

      console.log('Processed student data:', studentsData) // Debug log

      // Sort students by roll number
      studentsData.sort((a, b) => Number(a.rollNo) - Number(b.rollNo))
      setStudents(studentsData)

      // Initialize attendance data for all students
      const initialAttendanceData = {}
      studentsData.forEach(student => {
        initialAttendanceData[student.id] = {
          status: 'unrecorded',
          timestamp: null
        }
      })
      setAttendanceData(initialAttendanceData)

      // Update statistics
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

        // Update attendance data
        const updatedAttendanceData = { ...attendanceData }
        Object.entries(data.attendance || {}).forEach(([studentId, record]) => {
          updatedAttendanceData[studentId] = record
        })
        setAttendanceData(updatedAttendanceData)
        setIsAttendanceMarked(true)

        // Update statistics
        const stats = calculateStatistics(updatedAttendanceData, students.length)
        setStatistics(stats)
      } else {
        console.log('No existing attendance found') // Debug log
        setIsAttendanceMarked(false)
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
      const newStatus = currentStatus === 'present' ? 'absent' : 'present'

      return {
        ...prev,
        [studentId]: {
          status: newStatus,
          timestamp: Timestamp.now()
        }
      }
    })

    // Update statistics immediately
    const updatedAttendance = {
      ...attendanceData,
      [studentId]: {
        status: attendanceData[studentId]?.status === 'present' ? 'absent' : 'present',
        timestamp: Timestamp.now()
      }
    }
    const stats = calculateStatistics(updatedAttendance, students.length)
    setStatistics(stats)
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

      // Prepare attendance data
      const attendanceDataToSave = {
        attendance: attendanceData,
        date: Timestamp.fromDate(selectedDate),
        classId: selectedClass,
        className: getClassName(selectedClass),
        totalStudents: students.length,
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
