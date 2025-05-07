"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Check, X, Clock } from "lucide-react"

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState("Class 10-A")
  const [searchQuery, setSearchQuery] = useState("")
  const [students] = useState([
    { id: 1, name: "John Doe", rollNo: "101", status: "present" },
    { id: 2, name: "Jane Smith", rollNo: "102", status: "absent" },
    { id: 3, name: "Mike Johnson", rollNo: "103", status: "late" },
    { id: 4, name: "Sarah Williams", rollNo: "104", status: "present" },
    { id: 5, name: "David Brown", rollNo: "105", status: "present" },
  ])

  const classes = ["Class 10-A", "Class 10-B", "Class 11-A", "Class 11-B"]

  const handleStatusChange = (studentId, status) => {
    // TODO: Implement attendance marking logic
    console.log(`Marking student ${studentId} as ${status}`)
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
            {classes.map((className) => (
              <Button
                key={className}
                variant={selectedClass === className ? "default" : "outline"}
                onClick={() => setSelectedClass(className)}
              >
                {className}
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
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">Roll No: {student.rollNo}</div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={student.status === "present" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(student.id, "present")}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    variant={student.status === "absent" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(student.id, "absent")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                  <Button
                    variant={student.status === "late" ? "secondary" : "outline"}
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
        <Button size="lg" className="w-full sm:w-auto">
          Submit Attendance
        </Button>
      </div>
    </div>
  )
}