"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"

export default function StudentAttendance() {
  const [attendance] = useState({
    present: 85,
    absent: 10,
    late: 5,
    total: 100,
    records: [
      { date: "2024-03-20", status: "present" },
      { date: "2024-03-19", status: "present" },
      { date: "2024-03-18", status: "absent" },
      { date: "2024-03-17", status: "present" },
      { date: "2024-03-16", status: "late" },
    ],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Attendance</h2>
      </div>

      {/* Attendance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attendance Rate</span>
              <span className="text-sm font-medium">{attendance.present}%</span>
            </div>
            <Progress value={attendance.present} className="h-2" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{attendance.present}%</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{attendance.absent}%</div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{attendance.late}%</div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendance.records.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      record.status === "present"
                        ? "bg-green-500"
                        : record.status === "absent"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="capitalize">{record.status}</span>
                </div>
                <span className="text-sm text-gray-600">{record.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}