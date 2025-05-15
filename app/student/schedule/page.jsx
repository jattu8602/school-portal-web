"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

export default function StudentSchedule() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [schedule, setSchedule] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          router.push('/auth/student/login')
          return
        }

        const { schoolId, id: studentId } = userData

        // Fetch student's class
        const studentDoc = await getDoc(doc(db, 'schools', schoolId, 'students', studentId))
        if (!studentDoc.exists()) return

        const classId = studentDoc.data().classId

        // Fetch class schedule
        const scheduleQuery = query(
          collection(db, 'schools', schoolId, 'schedules'),
          where('classId', '==', classId)
        )
        const scheduleSnapshot = await getDocs(scheduleQuery)
        const scheduleData = scheduleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Sort schedule by day and time
        const sortedSchedule = scheduleData.sort((a, b) => {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          const dayDiff = days.indexOf(a.day) - days.indexOf(b.day)
          if (dayDiff !== 0) return dayDiff
          return a.startTime.localeCompare(b.startTime)
        })

        setSchedule(sortedSchedule)

        // Fetch upcoming events
        const eventsQuery = query(
          collection(db, 'schools', schoolId, 'events'),
          where('classId', '==', classId)
        )
        const eventsSnapshot = await getDocs(eventsQuery)
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Sort events by date
        const sortedEvents = eventsData.sort((a, b) =>
          new Date(a.date) - new Date(b.date)
        )

        setEvents(sortedEvents)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Schedule</h2>
      </div>

      {/* Class Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
          <CardDescription>
            Your weekly class timetable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((classItem) => (
              <div
                key={classItem.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{classItem.subject}</div>
                    <div className="text-sm text-gray-600">
                      {classItem.day} • {classItem.startTime} - {classItem.endTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {classItem.room}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {classItem.teacher}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Important dates and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    event.type === 'exam' ? 'bg-red-100' :
                    event.type === 'holiday' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    <Calendar className={`h-4 w-4 ${
                      event.type === 'exam' ? 'text-red-600' :
                      event.type === 'holiday' ? 'text-green-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} • {event.time}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {event.type}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}