"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BookOpen, TrendingUp, Award, BarChart } from "lucide-react"

export default function StudentGrades() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [grades, setGrades] = useState([])
  const [stats, setStats] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    totalSubjects: 0
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

        // Fetch grades
        const gradesQuery = query(
          collection(db, 'schools', schoolId, 'grades'),
          where('classId', '==', classId),
          where('studentId', '==', studentId)
        )
        const gradesSnapshot = await getDocs(gradesQuery)
        const gradesData = gradesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setGrades(gradesData)

        // Calculate stats
        if (gradesData.length > 0) {
          const scores = gradesData.map(grade => grade.score)
          const average = scores.reduce((a, b) => a + b, 0) / scores.length
          const highest = Math.max(...scores)
          const lowest = Math.min(...scores)
          const totalSubjects = new Set(gradesData.map(grade => grade.subject)).size

          setStats({
            average: Math.round(average * 100) / 100,
            highest,
            lowest,
            totalSubjects
          })
        }

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
        <h2 className="text-2xl font-bold">Grades</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.average}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highest}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowest}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Report</CardTitle>
          <CardDescription>
            Showing all grades for current academic year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    grade.score >= 90 ? 'bg-green-100' :
                    grade.score >= 70 ? 'bg-blue-100' :
                    grade.score >= 50 ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <BookOpen className={`h-4 w-4 ${
                      grade.score >= 90 ? 'text-green-600' :
                      grade.score >= 70 ? 'text-blue-600' :
                      grade.score >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{grade.subject}</div>
                    <div className="text-sm text-gray-600">
                      {grade.assignmentType} - {new Date(grade.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{grade.score}%</div>
                  <div className="text-sm text-gray-600">
                    {grade.score >= 90 ? 'A' :
                     grade.score >= 80 ? 'B' :
                     grade.score >= 70 ? 'C' :
                     grade.score >= 60 ? 'D' :
                     'F'}
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