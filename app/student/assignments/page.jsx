"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { FileText, Calendar, Upload, Check, X } from "lucide-react"

export default function StudentAssignments() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submission, setSubmission] = useState({
    content: "",
    file: null
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

        // Fetch assignments for student's class
        const assignmentsQuery = query(
          collection(db, 'schools', schoolId, 'assignments'),
          where('classId', '==', classId)
        )
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Fetch submissions for each assignment
        const assignmentsWithSubmissions = await Promise.all(
          assignmentsData.map(async (assignment) => {
            const submissionsQuery = query(
              collection(db, 'schools', schoolId, 'submissions'),
              where('assignmentId', '==', assignment.id),
              where('studentId', '==', studentId)
            )
            const submissionsSnapshot = await getDocs(submissionsQuery)
            const submission = submissionsSnapshot.docs[0]?.data() || null

            return {
              ...assignment,
              submission
            }
          })
        )

        setAssignments(assignmentsWithSubmissions)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSubmission(prev => ({
        ...prev,
        file
      }))
    }
  }

  const handleSubmit = async () => {
    if (!selectedAssignment) return

    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      const { schoolId, id: studentId } = userData

      const submissionData = {
        assignmentId: selectedAssignment.id,
        studentId,
        content: submission.content,
        fileUrl: null, // TODO: Implement file upload
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      }

      await addDoc(collection(db, 'schools', schoolId, 'submissions'), submissionData)

      // Update local state
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === selectedAssignment.id
            ? { ...assignment, submission: submissionData }
            : assignment
        )
      )

      setSelectedAssignment(null)
      setSubmission({ content: "", file: null })

    } catch (error) {
      console.error("Error submitting assignment:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Assignments</h2>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{assignment.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{assignment.subject}</span>
                    {assignment.submission ? (
                      <span className="text-sm text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Submitted
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        Not Submitted
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    {assignment.submission ? "View Submission" : "Submit Work"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Assignment</CardTitle>
            <CardDescription>{selectedAssignment.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Your Work</label>
                <Textarea
                  placeholder="Enter your submission..."
                  value={submission.content}
                  onChange={(e) => setSubmission(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Attach File</label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {submission.file && (
                    <span className="text-sm text-gray-600">{submission.file.name}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}