"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function StudentLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    schoolCode: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!formData.username || !formData.password || !formData.schoolCode) {
        setError("Please fill in all fields")
        return
      }

      // Get the school document using school code
      const schoolsRef = collection(db, 'schools')
      const q = query(schoolsRef, where('schoolCode', '==', formData.schoolCode))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setError("Invalid school code")
        return
      }

      const schoolDoc = querySnapshot.docs[0]
      const schoolId = schoolDoc.id

      // Get the student document
      const studentsRef = collection(db, 'schools', schoolId, 'students')
      const studentQuery = query(studentsRef, where('username', '==', formData.username))
      const studentSnapshot = await getDocs(studentQuery)

      if (studentSnapshot.empty) {
        setError("Invalid username or password")
        return
      }

      const studentDoc = studentSnapshot.docs[0]
      const studentData = studentDoc.data()

      // Verify password
      if (studentData.password !== formData.password) {
        setError("Invalid username or password")
        return
      }

      // Store student info in localStorage for session management
      localStorage.setItem('user', JSON.stringify({
        id: studentDoc.id,
        name: studentData.name,
        username: studentData.username,
        role: 'student',
        schoolId: schoolId,
        classId: studentData.classId
      }))

      router.push("/student/home")
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Student Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your student portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolCode">School Code</Label>
              <Input
                id="schoolCode"
                type="text"
                placeholder="Enter your school code"
                value={formData.schoolCode}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                className="w-full"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/auth/student/forgot-password" className="hover:text-primary">
              Forgot password?
            </Link>
          </div>
          <div className="text-sm text-center">
            <span className="text-muted-foreground">Are you a teacher? </span>
            <Link href="/auth/teacher/login" className="text-primary hover:underline">
              Login here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}