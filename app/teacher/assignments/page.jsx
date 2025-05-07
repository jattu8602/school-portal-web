"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, Plus, Users, Calendar, FileText } from "lucide-react"

export default function TeacherAssignments() {
  const [assignments] = useState([
    {
      id: 1,
      title: "Mathematics Assignment 1",
      subject: "Mathematics",
      class: "Class 10-A",
      dueDate: "2024-03-25",
      submissions: 15,
      totalStudents: 30,
      description: "Complete exercises 1-10 from Chapter 5",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      class: "Class 11-B",
      dueDate: "2024-03-22",
      submissions: 28,
      totalStudents: 30,
      description: "Write a detailed report on the pendulum experiment",
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject: "",
    class: "",
    dueDate: "",
    description: "",
  })

  const handleCreateAssignment = () => {
    // TODO: Implement assignment creation logic
    console.log("Creating new assignment:", newAssignment)
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
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
                  placeholder="Enter assignment title"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select
                    value={newAssignment.subject}
                    onValueChange={(value) =>
                      setNewAssignment({ ...newAssignment, subject: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Class</label>
                  <Select
                    value={newAssignment.class}
                    onValueChange={(value) =>
                      setNewAssignment({ ...newAssignment, class: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class-10-a">Class 10-A</SelectItem>
                      <SelectItem value="class-10-b">Class 10-B</SelectItem>
                      <SelectItem value="class-11-a">Class 11-A</SelectItem>
                      <SelectItem value="class-11-b">Class 11-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, dueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter assignment description"
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, description: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssignment}>Create Assignment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {assignment.submissions}/{assignment.totalStudents} Submitted
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {assignment.dueDate}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Subject: {assignment.subject}</div>
                  <div>Class: {assignment.class}</div>
                  <div className="mt-2">{assignment.description}</div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Submissions
                  </Button>
                  <Button size="sm">Edit Assignment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}