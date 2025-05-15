"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Calendar, Check, X, Clock } from "lucide-react"

export default function StudentAttendance() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0
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

        // Fetch attendance records
        const attendanceQuery = query(
          collection(db, 'schools', schoolId, 'attendance'),
          where('classId', '==', classId)
        )
        const attendanceSnapshot = await getDocs(attendanceQuery)
        const attendanceData = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Get student's attendance records
        const studentAttendance = attendanceData.map(record => {
          const studentRecord = record.records.find(r => r.studentId === studentId)
          return {
            date: record.date,
            status: studentRecord?.status || 'absent'
          }
        })

        setAttendance(studentAttendance)

        // Calculate stats
        const totalDays = studentAttendance.length
        const present = studentAttendance.filter(a => a.status === 'present').length
        const absent = studentAttendance.filter(a => a.status === 'absent').length
        const late = studentAttendance.filter(a => a.status === 'late').length
        const percentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0

        setStats({
          totalDays,
          present,
          absent,
          late,
          percentage
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
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Attendance</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.late}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Overall Attendance: {stats.percentage}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendance.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    record.status === 'present' ? 'bg-green-100' :
                    record.status === 'absent' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {record.status === 'present' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : record.status === 'absent' ? (
                      <X className="h-4 w-4 text-red-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}