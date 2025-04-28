'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '../../../lib/firebase'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

export default function Timetable() {
  const [selectedClass, setSelectedClass] = useState('5A')
  const [timetable, setTimetable] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const timeSlots = [
    '8:00 AM - 8:45 AM',
    '8:45 AM - 9:30 AM',
    '9:30 AM - 10:15 AM',
    '10:15 AM - 10:30 AM', // Break
    '10:30 AM - 11:15 AM',
    '11:15 AM - 12:00 PM',
    '12:00 PM - 12:45 PM',
    '12:45 PM - 1:30 PM',
    '1:30 PM - 2:15 PM',
    '2:15 PM - 3:00 PM',
  ]

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  useEffect(() => {
    fetchTimetable()
  }, [selectedClass])

  const fetchTimetable = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      const timetableRef = doc(db, 'timetables', `${user.uid}_${selectedClass}`)
      const timetableDoc = await getDoc(timetableRef)

      if (timetableDoc.exists()) {
        setTimetable(timetableDoc.data())
      } else {
        // Initialize empty timetable
        const emptyTimetable = {}
        days.forEach((day) => {
          emptyTimetable[day] = {}
          timeSlots.forEach((slot) => {
            emptyTimetable[day][slot] = { subject: '', teacher: '' }
          })
        })
        setTimetable(emptyTimetable)
      }
    } catch (err) {
      console.error('Error fetching timetable:', err)
      setError(err.message)
    }
  }

  const handleCellUpdate = async (day, timeSlot, value) => {
    try {
      const user = auth.currentUser
      if (!user) return

      const updatedTimetable = {
        ...timetable,
        [day]: {
          ...timetable[day],
          [timeSlot]: value,
        },
      }

      const timetableRef = doc(db, 'timetables', `${user.uid}_${selectedClass}`)
      await setDoc(timetableRef, updatedTimetable)

      setTimetable(updatedTimetable)
    } catch (err) {
      console.error('Error updating timetable:', err)
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Class Timetable</h1>
        <p className="mt-2 text-gray-600">
          Manage class schedules and subject allocations
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
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
            <button
              onClick={() => fetchTimetable()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timeSlot}
                    </td>
                    {days.map((day) => (
                      <td
                        key={`${day}-${timeSlot}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Subject"
                            value={timetable[day]?.[timeSlot]?.subject || ''}
                            onChange={(e) =>
                              handleCellUpdate(day, timeSlot, {
                                ...timetable[day][timeSlot],
                                subject: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border rounded focus:ring-primary-500 focus:border-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Teacher"
                            value={timetable[day]?.[timeSlot]?.teacher || ''}
                            onChange={(e) =>
                              handleCellUpdate(day, timeSlot, {
                                ...timetable[day][timeSlot],
                                teacher: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border rounded focus:ring-primary-500 focus:border-primary-500"
                          />
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
  )
}
