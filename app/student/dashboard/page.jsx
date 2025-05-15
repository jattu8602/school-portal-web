"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BookOpen, Calendar, FileText, TrendingUp, Clock, Check, X } from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    assignments: {
      total: 0,
      completed: 0,
      pending: 0
    },
    attendance: {
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0
    },
    grades: {
      average: 0,
      highest: 0,
      lowest: 0
    },
    upcomingEvents: []
  })

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

        // Fetch assignments
        const assignmentsQuery = query(
          collection(db, 'schools', schoolId, 'assignments'),
          where('classId', '==', classId)
        )
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Fetch submissions
        const submissionsQuery = query(
          collection(db, 'schools', schoolId, 'submissions'),
          where('studentId', '==', studentId)
        )
        const submissionsSnapshot = await getDocs(submissionsQuery)
        const submissionsData = submissionsSnapshot.docs.map(doc => doc.data())

        // Calculate assignment stats
        const completedAssignments = assignmentsData.filter(assignment =>
          submissionsData.some(submission => submission.assignmentId === assignment.id)
        )

        // Fetch attendance
        const attendanceQuery = query(
          collection(db, 'schools', schoolId, 'attendance'),
          where('classId', '==', classId)
        )
        const attendanceSnapshot = await getDocs(attendanceQuery)
        const attendanceData = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Calculate attendance stats
        const studentAttendance = attendanceData.map(record => {
          const studentRecord = record.records.find(r => r.studentId === studentId)
          return studentRecord?.status || 'absent'
        })

        const present = studentAttendance.filter(status => status === 'present').length
        const absent = studentAttendance.filter(status => status === 'absent').length
        const late = studentAttendance.filter(status => status === 'late').length
        const attendancePercentage = studentAttendance.length > 0
          ? Math.round((present / studentAttendance.length) * 100)
          : 0

        // Fetch grades
        const gradesQuery = query(
          collection(db, 'schools', schoolId, 'grades'),
          where('classId', '==', classId),
          where('studentId', '==', studentId)
        )
        const gradesSnapshot = await getDocs(gradesQuery)
        const gradesData = gradesSnapshot.docs.map(doc => doc.data())

        // Calculate grade stats
        const scores = gradesData.map(grade => grade.score)
        const average = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0
        const highest = scores.length > 0 ? Math.max(...scores) : 0
        const lowest = scores.length > 0 ? Math.min(...scores) : 0

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

        // Sort events by date and get upcoming ones
        const upcomingEvents = eventsData
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .filter(event => new Date(event.date) >= new Date())
          .slice(0, 3)

        setStats({
          assignments: {
            total: assignmentsData.length,
            completed: completedAssignments.length,
            pending: assignmentsData.length - completedAssignments.length
          },
          attendance: {
            present,
            absent,
            late,
            percentage: attendancePercentage
          },
          grades: {
            average,
            highest,
            lowest
          },
          upcomingEvents
        })

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
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignments.total}</div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500" />
              <span>{stats.assignments.completed} Completed</span>
              <X className="h-4 w-4 text-red-500 ml-2" />
              <span>{stats.assignments.pending} Pending</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendance.percentage}%</div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500" />
              <span>{stats.attendance.present} Present</span>
              <X className="h-4 w-4 text-red-500 ml-2" />
              <span>{stats.attendance.absent} Absent</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.grades.average}%</div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Highest: {stats.grades.highest}%</span>
              <span>Lowest: {stats.grades.lowest}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents.length}</div>
            <div className="text-sm text-gray-600">
              Next: {stats.upcomingEvents[0]?.title || 'No events'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Your upcoming events and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.upcomingEvents.map((event) => (
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