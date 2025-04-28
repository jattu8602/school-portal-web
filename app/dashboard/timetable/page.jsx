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
  updateDoc
} from 'firebase/firestore'
import Button from '../../components/ui/Button'

export default function TimetablePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [timetable, setTimetable] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  const timeSlots = [
    '8:00 AM - 8:45 AM',
    '8:45 AM - 9:30 AM',
    '9:30 AM - 10:15 AM',
    '10:15 AM - 10:30 AM',
    '10:30 AM - 11:15 AM',
    '11:15 AM - 12:00 PM',
    '12:00 PM - 12:45 PM',
    '12:45 PM - 1:30 PM',
    '1:30 PM - 2:15 PM',
    '2:15 PM - 3:00 PM'
  ]

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
      fetchTimetable(user.uid, selectedClass)
    }
  }, [user, selectedClass])

  const fetchTimetable = async (schoolId, classId) => {
    try {
      const timetableRef = doc(db, 'schools', schoolId, 'timetables', classId)
      const timetableDoc = await getDoc(timetableRef)

      if (timetableDoc.exists()) {
        setTimetable(timetableDoc.data().schedule || {})
      } else {
        // Initialize with empty timetable
        const emptyTimetable = {}
        timeSlots.forEach(slot => {
          emptyTimetable[slot] = {}
          days.forEach(day => {
            emptyTimetable[slot][day] = {
              subject: '',
              teacher: ''
            }
          })
        })
        setTimetable(emptyTimetable)
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
      setError('Failed to load timetable')
    }
  }

  const handleCellClick = (timeSlot, day) => {
    if (!isEditing) return

    // Prompt user for subject and teacher
    const subject = prompt('Enter subject name:', timetable[timeSlot]?.[day]?.subject || '')
    if (subject === null) return // User cancelled

    const teacher = prompt('Enter teacher name:', timetable[timeSlot]?.[day]?.teacher || '')
    if (teacher === null) return // User cancelled

    // Update timetable
    setTimetable(prev => {
      const newTimetable = { ...prev }
      if (!newTimetable[timeSlot]) {
        newTimetable[timeSlot] = {}
      }
      newTimetable[timeSlot][day] = { subject, teacher }
      return newTimetable
    })
  }

  const saveTimetable = async () => {
    if (!user?.uid || !selectedClass) return

    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const timetableRef = doc(db, 'schools', user.uid, 'timetables', selectedClass)
      const timetableDoc = await getDoc(timetableRef)

      if (timetableDoc.exists()) {
        await updateDoc(timetableRef, {
          schedule: timetable,
          updatedAt: serverTimestamp()
        })
      } else {
        await setDoc(timetableRef, {
          classId: selectedClass,
          schedule: timetable,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }

      setSuccess('Timetable saved successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving timetable:', error)
      setError('Failed to save timetable')
    } finally {
      setIsSaving(false)
    }
  }

  const exportPDF = () => {
    alert('Export PDF functionality will be implemented here')
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
        <p className="text-gray-500">Manage class schedules and subject allocations.</p>
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

        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => {
              if (isEditing) {
                saveTimetable()
              } else {
                setIsEditing(true)
              }
            }}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save Timetable' : 'Edit Timetable'}
          </Button>
          <Button variant="outline" onClick={exportPDF}>Export PDF</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Timetable for Class {classes.find(c => c.id === selectedClass)?.name || ''}
          </h2>
          {isEditing && (
            <p className="text-gray-500 text-sm mb-4">Click on a period to edit subject and teacher allocation</p>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                    Time / Day
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot, index) => (
                  <tr key={timeSlot} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium border-r">
                      {timeSlot}
                    </td>
                    {days.map((day) => (
                      <td
                        key={`${timeSlot}-${day}`}
                        className={`px-6 py-4 whitespace-nowrap text-sm border-r ${isEditing ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                        onClick={() => handleCellClick(timeSlot, day)}
                      >
                        {timetable[timeSlot]?.[day]?.subject ? (
                          <div>
                            <div className="font-medium text-gray-900">{timetable[timeSlot][day].subject}</div>
                            <div className="text-gray-500">{timetable[timeSlot][day].teacher}</div>
                          </div>
                        ) : (
                          isEditing && <div className="text-gray-400">Click to add</div>
                        )}
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
  )
}