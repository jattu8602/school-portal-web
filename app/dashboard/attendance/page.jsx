'use client'

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchClasses(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

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

    const stats = {
      present: 0,
      absent: 0,
      late: 0,
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
              </option>
            ))}
          </select>
        </div>

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
                </div>
              </div>
            </div>

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