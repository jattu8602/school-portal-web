'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '../../../lib/firebase'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState('5A')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchAttendance()
  }, [selectedClass, selectedDate])

  const fetchStudents = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      const studentsRef = collection(db, 'students')
      const q = query(
        studentsRef,
        where('schoolId', '==', user.uid),
        where('class', '==', selectedClass)
      )
      const querySnapshot = await getDocs(q)

      const studentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setStudents(studentsList)
    } catch (err) {
      console.error('Error fetching students:', err)
      setError(err.message)
    }
  }

  const fetchAttendance = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      const attendanceRef = doc(
        db,
        'attendance',
        `${user.uid}_${selectedClass}_${selectedDate}`
      )
      const attendanceDoc = await getDoc(attendanceRef)

      if (attendanceDoc.exists()) {
        setAttendance(attendanceDoc.data())
      } else {
        setAttendance({})
      }
    } catch (err) {
      console.error('Error fetching attendance:', err)
      setError(err.message)
    }
  }

  const handleAttendanceChange = async (studentId, status) => {
    try {
      const user = auth.currentUser
      if (!user) return

      const updatedAttendance = {
        ...attendance,
        [studentId]: status,
      }

      const attendanceRef = doc(
        db,
        'attendance',
        `${user.uid}_${selectedClass}_${selectedDate}`
      )
      await setDoc(attendanceRef, updatedAttendance)

      setAttendance(updatedAttendance)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating attendance:', err)
      setError(err.message)
    }
  }

  const getAttendanceStats = () => {
    const total = students.length
    const present = Object.values(attendance).filter(
      (status) => status === 'present'
    ).length
    const absent = Object.values(attendance).filter(
      (status) => status === 'absent'
    ).length
    const late = Object.values(attendance).filter(
      (status) => status === 'late'
    ).length

    return {
      total,
      present,
      absent,
      late,
      percentage: total ? Math.round((present / total) * 100) : 0,
    }
  }

  const stats = getAttendanceStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-2 text-gray-600">Mark and track student attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Present</div>
          <div className="text-2xl font-bold text-green-600">
            {stats.present}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.percentage}% Attendance
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Absent</div>
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Late</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">
            Total Students
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="5A">Class 5A</option>
                <option value="5B">Class 5B</option>
                <option value="6A">Class 6A</option>
                <option value="6B">Class 6B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-md">
              Attendance updated successfully!
            </div>
          )}

          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={attendance[student.id] || ''}
                      onChange={(e) =>
                        handleAttendanceChange(student.id, e.target.value)
                      }
                      className="px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
