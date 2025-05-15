"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Plus, FileText, Calendar, Users } from "lucide-react"

export default function TeacherAssignments() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    classId: "",
    subject: ""
  })

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

        // Fetch assignments for teacher's classes
        const classIds = classesData.map(c => c.id)
        const assignmentsQuery = query(
          collection(db, 'schools', schoolId, 'assignments'),
          where('classId', 'in', classIds)
        )
        const assignmentsSnapshot = await getDocs(assignmentsQuery)
        const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setAssignments(assignmentsData)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleCreateAssignment = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      const { schoolId } = userData

      const assignmentData = {
        ...newAssignment,
        createdAt: new Date().toISOString(),
        teacherId: userData.id,
        status: 'active'
      }

      await addDoc(collection(db, 'schools', schoolId, 'assignments'), assignmentData)

      // Refresh assignments list
      const assignmentsQuery = query(
        collection(db, 'schools', schoolId, 'assignments'),
        where('classId', '==', newAssignment.classId)
      )
      const assignmentsSnapshot = await getDocs(assignmentsQuery)
      const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setAssignments(assignmentsData)

      // Reset form
      setNewAssignment({
        title: "",
        description: "",
        dueDate: "",
        classId: "",
        subject: ""
      })
      setShowCreateForm(false)

    } catch (error) {
      console.error("Error creating assignment:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Assignments</h2>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Enter assignment description"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Class</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newAssignment.classId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, classId: e.target.value })}
                >
                  <option value="">Select a class</option>
                  {classes.map((classData) => (
                    <option key={classData.id} value={classData.id}>
                      {classData.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssignment}>
                  Create Assignment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {classes.find(c => c.id === assignment.classId)?.name || 'Unknown Class'}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{assignment.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium">{assignment.subject}</span>
                <Button variant="outline" size="sm">
                  View Submissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}