"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Calendar, Search, Check, X, Clock } from "lucide-react"

export default function TeacherAttendance() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState(null)
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          router.push('/auth/teacher/login')
          return
        }

        const { schoolId, id: teacherId } = userData

        // Fetch teacher's classes
        const classesQuery = query(
          collection(db, 'schools', schoolId, 'classes'),
          where('teachers', 'array-contains', teacherId)
        )
        const classesSnapshot = await getDocs(classesQuery)
        const classesData = classesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setClasses(classesData)

        if (classesData.length > 0) {
          setSelectedClass(classesData[0].id)
        }

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return

      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        const { schoolId } = userData

        // Fetch students in selected class
        const studentsQuery = query(
          collection(db, 'schools', schoolId, 'students'),
          where('classId', '==', selectedClass)
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setStudents(studentsData)

        // Initialize attendance state
        const initialAttendance = {}
        studentsData.forEach(student => {
          initialAttendance[student.id] = 'present'
        })
        setAttendance(initialAttendance)

      } catch (error) {
        console.error("Error fetching students:", error)
      }
    }

    fetchStudents()
  }, [selectedClass])

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSubmitAttendance = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      const { schoolId, id: teacherId } = userData

      const attendanceData = {
        classId: selectedClass,
        teacherId,
        date: new Date().toISOString(),
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status
        }))
      }

      await addDoc(collection(db, 'schools', schoolId, 'attendance'), attendanceData)

      // Show success message or handle response
      alert('Attendance marked successfully!')

    } catch (error) {
      console.error("Error submitting attendance:", error)
      alert('Error marking attendance. Please try again.')
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Mark Attendance</h2>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {classes.map((classData) => (
              <Button
                key={classData.id}
                variant={selectedClass === classData.id ? "default" : "outline"}
                onClick={() => setSelectedClass(classData.id)}
              >
                {classData.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">Roll No: {student.rollNumber}</div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={attendance[student.id] === "present" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(student.id, "present")}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    variant={attendance[student.id] === "absent" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(student.id, "absent")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                  <Button
                    variant={attendance[student.id] === "late" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(student.id, "late")}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Late
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button size="lg" className="w-full sm:w-auto" onClick={handleSubmitAttendance}>
          Submit Attendance
        </Button>
      </div>
    </div>
  )
}