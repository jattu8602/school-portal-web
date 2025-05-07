"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function StudentAssignments() {
  const [assignments] = useState([
    {
      id: 1,
      title: "Mathematics Assignment 1",
      subject: "Mathematics",
      dueDate: "2024-03-25",
      status: "pending",
      progress: 0,
      description: "Complete exercises 1-10 from Chapter 5",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2024-03-22",
      status: "submitted",
      progress: 100,
      description: "Write a detailed report on the pendulum experiment",
    },
    {
      id: 3,
      title: "English Essay",
      subject: "English",
      dueDate: "2024-03-28",
      status: "in_progress",
      progress: 60,
      description: "Write a 1000-word essay on climate change",
    },
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "submitted":
        return "Submitted"
      case "in_progress":
        return "In Progress"
      case "pending":
        return "Not Started"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Assignments</h2>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(assignment.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(assignment.status)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Subject: {assignment.subject}</div>
                  <div>Due Date: {assignment.dueDate}</div>
                  <div className="mt-2">{assignment.description}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{assignment.progress}%</span>
                  </div>
                  <Progress value={assignment.progress} className="h-2" />
                </div>

                <div className="flex justify-end space-x-2">
                  {assignment.status !== "submitted" && (
                    <>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}