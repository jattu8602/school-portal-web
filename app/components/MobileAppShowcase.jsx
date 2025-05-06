"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  FileText,
  MessageCircle,
  BarChart2,
  User,
  CheckCircle,
  X,
  Clock,
  Calendar,
  Bell,
  BookOpen,
  Settings,
  Info,
  Search,
  Send,
  LogOut,
  CheckSquare,
  Paperclip,
  Download,
  Filter,
} from "lucide-react"

export default function MobileAppShowcase() {
  const [activeTab, setActiveTab] = useState("teacher")
  const [activeSection, setActiveSection] = useState("home")
  const [studentActiveSection, setStudentActiveSection] = useState("home")

  // TEACHER DUMMY DATA
  const teacherData = {
    title: "PresentSir Teacher",
    welcome: "Mrs. Sharma",
    date: "Tuesday, May 6, 2025",
    profile: {
      name: "Anita Sharma",
      email: "anita.sharma@presentschool.edu",
      phone: "+91 98765 43210",
      department: "Science Department",
      subjects: ["Physics", "Chemistry"],
      experience: "12 years",
      photo: "/placeholder.svg?height=100&width=100",
      notifications: [
        {
          id: 1,
          title: "Staff Meeting",
          message: "Reminder: Staff meeting today at 4:30 PM",
          time: "2 hours ago",
          read: false,
        },
        {
          id: 2,
          title: "Exam Schedule",
          message: "Final exam schedule has been published",
          time: "1 day ago",
          read: true,
        },
        {
          id: 3,
          title: "Holiday Notice",
          message: "School will remain closed on May 15 for Buddha Purnima",
          time: "2 days ago",
          read: true,
        },
      ],
    },
    quickActions: [
      { Icon: CheckCircle, label: "Take Attendance", desc: "Mark attendance for your classes", variant: "primary" },
      { Icon: Clock, label: "Sync Device", desc: "Connect to attendance device", variant: "blue" },
      { Icon: Settings, label: "Settings", desc: "App preferences", variant: "gray" },
      { Icon: Info, label: "Help", desc: "Get support", variant: "gray" },
    ],
    todaysClasses: [
      { name: "Physics - Grade 10A", time: "9:00 AM - 10:00 AM", status: "Completed", room: "Lab 2", students: 32 },
      { name: "Chemistry - Grade 11B", time: "11:30 AM - 12:30 PM", status: "Upcoming", room: "Lab 1", students: 28 },
      { name: "Biology - Grade 9C", time: "2:00 PM - 3:00 PM", status: "Upcoming", room: "Room 103", students: 35 },
      { name: "Math - Grade 12A", time: "3:30 PM - 4:30 PM", status: "Upcoming", room: "Room 201", students: 30 },
    ],
    attendanceSummary: [
      { label: "Present", value: 42, color: "bg-green-500" },
      { label: "Absent", value: 3, color: "bg-red-500" },
      { label: "Leave", value: 1, color: "bg-amber-500" },
      { label: "Late", value: 2, color: "bg-blue-500" },
    ],
    students: [
      { id: 1, name: "Rahul Sharma", rollNo: "10A01", status: "present" },
      { id: 2, name: "Priya Patel", rollNo: "10A02", status: "present" },
      { id: 3, name: "Amit Kumar", rollNo: "10A03", status: "absent" },
      { id: 4, name: "Sneha Gupta", rollNo: "10A04", status: "present" },
      { id: 5, name: "Vikram Singh", rollNo: "10A05", status: "late" },
      { id: 6, name: "Neha Verma", rollNo: "10A06", status: "present" },
      { id: 7, name: "Raj Malhotra", rollNo: "10A07", status: "leave" },
    ],
    assignments: [
      { id: 1, title: "Physics Lab Report", class: "Grade 10A", dueDate: "May 10, 2025", submissions: 15, total: 32 },
      { id: 2, title: "Chemistry Equations", class: "Grade 11B", dueDate: "May 8, 2025", submissions: 20, total: 28 },
      { id: 3, title: "Biology Diagrams", class: "Grade 9C", dueDate: "May 12, 2025", submissions: 10, total: 35 },
    ],
    chats: [
      {
        id: 1,
        name: "Principal Mehta",
        lastMessage: "Please submit the monthly report by Friday",
        time: "10:30 AM",
        unread: 2,
      },
      { id: 2, name: "Grade 10A Group", lastMessage: "When is the next physics test?", time: "Yesterday", unread: 0 },
      {
        id: 3,
        name: "Science Department",
        lastMessage: "Meeting rescheduled to 3 PM tomorrow",
        time: "Yesterday",
        unread: 1,
      },
      { id: 4, name: "Vikram Singh (Parent)", lastMessage: "Thank you for your guidance", time: "May 4", unread: 0 },
    ],
    results: [
      {
        id: 1,
        title: "Physics Mid-Term",
        class: "Grade 10A",
        date: "Apr 15, 2025",
        average: 78,
        highest: 95,
        lowest: 45,
      },
      {
        id: 2,
        title: "Chemistry Quiz 3",
        class: "Grade 11B",
        date: "Apr 22, 2025",
        average: 82,
        highest: 98,
        lowest: 60,
      },
      {
        id: 3,
        title: "Biology Project",
        class: "Grade 9C",
        date: "Apr 30, 2025",
        average: 85,
        highest: 100,
        lowest: 65,
      },
    ],
    books: [
      {
        id: 1,
        title: "Advanced Physics - Grade 10",
        author: "Dr. R.K. Sharma",
        cover: "/placeholder.svg?height=80&width=60",
      },
      {
        id: 2,
        title: "Chemistry Fundamentals",
        author: "Prof. S.K. Verma",
        cover: "/placeholder.svg?height=80&width=60",
      },
      { id: 3, title: "Modern Biology", author: "Dr. Anita Desai", cover: "/placeholder.svg?height=80&width=60" },
    ],
  }

  // STUDENT DUMMY DATA
  const studentData = {
    title: "PresentSir Student",
    welcome: "Rahul",
    date: "Tuesday, May 6, 2025",
    profile: {
      name: "Rahul Sharma",
      rollNo: "10A01",
      class: "Grade 10A",
      section: "Science",
      admissionNo: "ADM2023-1042",
      dob: "August 15, 2010",
      parentName: "Mr. Rajesh Sharma",
      parentContact: "+91 98765 12345",
      address: "42, Green Park, New Delhi - 110016",
      photo: "/placeholder.svg?height=100&width=100",
      notifications: [
        {
          id: 1,
          title: "Assignment Due",
          message: "Physics Lab Report due tomorrow",
          time: "3 hours ago",
          read: false,
        },
        {
          id: 2,
          title: "Test Result",
          message: "Your Mathematics test result has been published",
          time: "1 day ago",
          read: false,
        },
        {
          id: 3,
          title: "Holiday Notice",
          message: "School will remain closed on May 15 for Buddha Purnima",
          time: "2 days ago",
          read: true,
        },
      ],
    },
    attendance: {
      month: "95%",
      overall: "92%",
      details: [
        { date: "May 6, 2025", status: "Present" },
        { date: "May 5, 2025", status: "Present" },
        { date: "May 4, 2025", status: "Weekend" },
        { date: "May 3, 2025", status: "Weekend" },
        { date: "May 2, 2025", status: "Present" },
        { date: "May 1, 2025", status: "Absent" },
        { date: "Apr 30, 2025", status: "Present" },
      ],
    },
    timetable: [
      { subj: "Physics", time: "9:00 AM - 10:00 AM", status: "Completed", teacher: "Mrs. Sharma", room: "Lab 2" },
      { subj: "Mathematics", time: "11:30 AM - 12:30 PM", status: "Upcoming", teacher: "Mr. Verma", room: "Room 101" },
      { subj: "English", time: "2:00 PM - 3:00 PM", status: "Upcoming", teacher: "Mrs. Gupta", room: "Room 105" },
    ],
    assignments: [
      {
        id: 1,
        title: "Physics Lab Report",
        subject: "Physics",
        due: "May 7, 2025",
        status: "Pending",
        description: "Complete the lab report on light refraction experiment",
      },
      {
        id: 2,
        title: "Mathematics Quiz",
        subject: "Mathematics",
        due: "May 10, 2025",
        status: "Pending",
        description: "Prepare for quiz on trigonometry",
      },
      {
        id: 3,
        title: "English Essay",
        subject: "English",
        due: "May 12, 2025",
        status: "Pending",
        description: "Write a 500-word essay on environmental conservation",
      },
      {
        id: 4,
        title: "Chemistry Lab",
        subject: "Chemistry",
        due: "May 5, 2025",
        status: "Completed",
        description: "Submit report on acid-base titration experiment",
      },
    ],
    weeklySlots: [
      {
        day: "Monday",
        slots: [
          { subj: "Mathematics", time: "9:00-10:00", teacher: "Mr. Verma", room: "Room 101" },
          { subj: "Physics", time: "11:30-12:30", teacher: "Mrs. Sharma", room: "Lab 2" },
          { subj: "Computer Science", time: "2:00-3:00", teacher: "Mr. Kumar", room: "Computer Lab" },
        ],
      },
      {
        day: "Tuesday",
        slots: [
          { subj: "English", time: "9:00-10:00", teacher: "Mrs. Gupta", room: "Room 105" },
          { subj: "Chemistry", time: "11:30-12:30", teacher: "Dr. Patel", room: "Lab 1" },
          { subj: "Physical Education", time: "2:00-3:00", teacher: "Mr. Singh", room: "Playground" },
        ],
      },
      {
        day: "Wednesday",
        slots: [
          { subj: "Physics", time: "9:00-10:00", teacher: "Mrs. Sharma", room: "Lab 2" },
          { subj: "Mathematics", time: "11:30-12:30", teacher: "Mr. Verma", room: "Room 101" },
          { subj: "Hindi", time: "2:00-3:00", teacher: "Mrs. Mishra", room: "Room 103" },
        ],
      },
      {
        day: "Thursday",
        slots: [
          { subj: "Biology", time: "9:00-10:00", teacher: "Dr. Reddy", room: "Lab 3" },
          { subj: "History", time: "11:30-12:30", teacher: "Mr. Sharma", room: "Room 104" },
          { subj: "Art", time: "2:00-3:00", teacher: "Ms. Kapoor", room: "Art Room" },
        ],
      },
      {
        day: "Friday",
        slots: [
          { subj: "Geography", time: "9:00-10:00", teacher: "Mrs. Das", room: "Room 102" },
          { subj: "Computer Science", time: "11:30-12:30", teacher: "Mr. Kumar", room: "Computer Lab" },
          { subj: "Library", time: "2:00-3:00", teacher: "Mrs. Joshi", room: "Library" },
        ],
      },
    ],
    chats: [
      {
        id: 1,
        name: "Mrs. Sharma (Physics)",
        lastMessage: "Don't forget to submit your lab report",
        time: "11:15 AM",
        unread: 1,
      },
      {
        id: 2,
        name: "Grade 10A Group",
        lastMessage: "Has anyone completed the math homework?",
        time: "Yesterday",
        unread: 5,
      },
      {
        id: 3,
        name: "Amit Kumar",
        lastMessage: "Can you share your notes from today's class?",
        time: "Yesterday",
        unread: 0,
      },
      {
        id: 4,
        name: "Mr. Verma (Mathematics)",
        lastMessage: "The quiz will cover chapters 5-7",
        time: "May 4",
        unread: 0,
      },
    ],
    results: [
      { id: 1, subject: "Physics", test: "Mid-Term Exam", date: "Apr 15, 2025", marks: 85, total: 100, grade: "A" },
      { id: 2, subject: "Mathematics", test: "Quiz 2", date: "Apr 10, 2025", marks: 18, total: 20, grade: "A+" },
      { id: 3, subject: "English", test: "Essay Competition", date: "Apr 5, 2025", marks: 45, total: 50, grade: "A" },
      { id: 4, subject: "Chemistry", test: "Lab Assessment", date: "Mar 28, 2025", marks: 28, total: 30, grade: "A+" },
    ],
    books: [
      {
        id: 1,
        title: "Physics NCERT - Grade 10",
        author: "NCERT",
        cover: "/placeholder.svg?height=80&width=60",
        borrowed: true,
        dueDate: "May 15, 2025",
      },
      {
        id: 2,
        title: "Mathematics - Advanced Problems",
        author: "R.D. Sharma",
        cover: "/placeholder.svg?height=80&width=60",
        borrowed: true,
        dueDate: "May 20, 2025",
      },
      {
        id: 3,
        title: "English Literature",
        author: "Oxford Publications",
        cover: "/placeholder.svg?height=80&width=60",
        borrowed: false,
      },
      {
        id: 4,
        title: "Chemistry Fundamentals",
        author: "S.K. Verma",
        cover: "/placeholder.svg?height=80&width=60",
        borrowed: false,
      },
    ],
  }

  const renderBadge = (status) => {
    const base = "text-xs sm:text-sm px-2 py-1 rounded-full"
    const style =
      status === "Completed"
        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        : status === "Pending"
          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    return <span className={`${base} ${style}`}>{status}</span>
  }

  const renderTeacherContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <>
            <div className="mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-semibold">Welcome, {teacherData.welcome}</h4>
              <p className="text-[10px] sm:text-sm text-muted-foreground">{teacherData.date}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {teacherData.quickActions.map((act, i) => (
                <div key={i} className="bg-card border p-2 sm:p-3 rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-center mb-1">
                    <act.Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1 sm:mr-2" />
                    <span className="font-medium text-xs sm:text-sm">{act.label}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{act.desc}</p>
                </div>
              ))}
            </div>
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h4 className="font-medium text-sm sm:text-base">Today's Classes</h4>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] sm:text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {teacherData.todaysClasses.map((cls, i) => (
                  <div key={i} className="border rounded-lg p-2 sm:p-3 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-xs sm:text-sm">{cls.name}</h5>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{cls.time}</p>
                        <div className="flex items-center mt-1 text-[10px] sm:text-xs text-muted-foreground">
                          <span className="mr-2">{cls.room}</span>
                          <span>{cls.students} students</span>
                        </div>
                      </div>
                      {renderBadge(cls.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Attendance Summary</h4>
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-1 sm:space-y-2 mb-3">
                    {teacherData.attendanceSummary.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-[10px] sm:text-sm flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${it.color} mr-1`}></span>
                          {it.label}:
                        </span>
                        <span className="text-[10px] sm:text-sm font-medium">{it.value} students</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mt-1 sm:mt-2 overflow-hidden">
                    <div className="flex h-full">
                      <div className="h-full bg-green-500" style={{ width: "87%" }}></div>
                      <div className="h-full bg-red-500" style={{ width: "6%" }}></div>
                      <div className="h-full bg-amber-500" style={{ width: "2%" }}></div>
                      <div className="h-full bg-blue-500" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                  <div className="text-right mt-1 sm:mt-2">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">91% attendance rate</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      case "assignments":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base sm:text-lg font-semibold">Assignments</h4>
              <Button size="sm" className="h-8">
                Create New
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {teacherData.assignments.map((assignment, i) => (
                <Card key={i} className="hover:border-primary transition-colors">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">{assignment.title}</h5>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{assignment.class}</p>
                      </div>
                      <Badge variant="outline">Due: {assignment.dueDate}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] sm:text-xs">
                        <span className="font-medium">{assignment.submissions}</span> of <span>{assignment.total}</span>{" "}
                        submissions
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] sm:text-xs">
                        View Details
                      </Button>
                    </div>
                    <Progress value={(assignment.submissions / assignment.total) * 100} className="h-1 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="text-[10px] sm:text-xs">
                View All Assignments
              </Button>
            </div>
          </>
        )
      case "chats":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base sm:text-lg font-semibold">Messages</h4>
              <Button variant="outline" size="sm" className="h-8">
                New Message
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-md border bg-background"
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              {teacherData.chats.map((chat, i) => (
                <div
                  key={i}
                  className="flex items-center p-2 sm:p-3 border rounded-lg hover:border-primary transition-colors"
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                      <span className="text-primary font-medium">{chat.name.charAt(0)}</span>
                    </div>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-xs sm:text-sm truncate">{chat.name}</h5>
                      <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px]">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <h5 className="font-medium text-xs sm:text-sm mb-2">Quick Contacts</h5>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                <div className="flex flex-col items-center">
                  <Avatar className="h-12 w-12 mb-1">
                    <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                      <span className="text-primary font-medium">P</span>
                    </div>
                  </Avatar>
                  <span className="text-[10px]">Principal</span>
                </div>
                <div className="flex flex-col items-center">
                  <Avatar className="h-12 w-12 mb-1">
                    <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                      <span className="text-primary font-medium">SD</span>
                    </div>
                  </Avatar>
                  <span className="text-[10px]">Science Dept</span>
                </div>
                <div className="flex flex-col items-center">
                  <Avatar className="h-12 w-12 mb-1">
                    <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                      <span className="text-primary font-medium">10A</span>
                    </div>
                  </Avatar>
                  <span className="text-[10px]">Grade 10A</span>
                </div>
                <div className="flex flex-col items-center">
                  <Avatar className="h-12 w-12 mb-1">
                    <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                      <span className="text-primary font-medium">+</span>
                    </div>
                  </Avatar>
                  <span className="text-[10px]">New</span>
                </div>
              </div>
            </div>
          </>
        )
      case "results":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base sm:text-lg font-semibold">Results & Analytics</h4>
              <Button variant="outline" size="sm" className="h-8">
                Add New
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {teacherData.results.map((result, i) => (
                <Card key={i} className="hover:border-primary transition-colors">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">{result.title}</h5>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {result.class} • {result.date}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] sm:text-xs">
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <div className="text-[10px] text-muted-foreground">Average</div>
                        <div className="font-medium text-sm">{result.average}%</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <div className="text-[10px] text-muted-foreground">Highest</div>
                        <div className="font-medium text-sm text-green-600">{result.highest}%</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <div className="text-[10px] text-muted-foreground">Lowest</div>
                        <div className="font-medium text-sm text-red-600">{result.lowest}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4">
              <Card>
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Class Average Performance</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Physics</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Chemistry</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>Biology</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      case "profile":
        return (
          <>
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-16 w-16 mb-2">
                <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                  <span className="text-primary font-medium text-lg">{teacherData.profile.name.charAt(0)}</span>
                </div>
              </Avatar>
              <h4 className="text-base sm:text-lg font-semibold">{teacherData.profile.name}</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{teacherData.profile.department}</p>
            </div>

            <Card className="mb-4">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Email</span>
                    <span className="text-[10px] sm:text-xs">{teacherData.profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Phone</span>
                    <span className="text-[10px] sm:text-xs">{teacherData.profile.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Department</span>
                    <span className="text-[10px] sm:text-xs">{teacherData.profile.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Subjects</span>
                    <span className="text-[10px] sm:text-xs">{teacherData.profile.subjects.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Experience</span>
                    <span className="text-[10px] sm:text-xs">{teacherData.profile.experience}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4">
              <h5 className="font-medium text-xs sm:text-sm mb-2">Notifications</h5>
              <div className="space-y-2">
                {teacherData.profile.notifications.map((notification, i) => (
                  <div
                    key={i}
                    className={`p-2 border rounded-lg ${!notification.read ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <h6 className="font-medium text-xs">{notification.title}</h6>
                      <span className="text-[8px] text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Info className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  const renderStudentContent = () => {
    switch (studentActiveSection) {
      case "home":
        return (
          <>
            <div className="mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-semibold">Welcome, {studentData.welcome}</h4>
              <p className="text-[10px] sm:text-sm text-muted-foreground">{studentData.date}</p>
            </div>
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-3 sm:p-4">
                <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Your Attendance</h4>
                <div className="flex justify-between mb-1 sm:mb-2 text-[10px] sm:text-sm">
                  <span>This Month:</span>
                  <span className="font-medium">{studentData.attendance.month}</span>
                </div>
                <div className="flex justify-between mb-1 sm:mb-2 text-[10px] sm:text-sm">
                  <span>Overall:</span>
                  <span className="font-medium">{studentData.attendance.overall}</span>
                </div>
                <Progress value={95} className="h-2 mt-1 sm:mt-2" />
              </CardContent>
            </Card>
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h4 className="font-medium text-sm sm:text-base">Today's Timetable</h4>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] sm:text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {studentData.timetable.map((tt, i) => (
                  <div key={i} className="border rounded-lg p-2 sm:p-3 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-xs sm:text-sm">{tt.subj}</h5>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{tt.time}</p>
                        <div className="flex items-center mt-1 text-[10px] sm:text-xs text-muted-foreground">
                          <span className="mr-2">{tt.teacher}</span>
                          <span>{tt.room}</span>
                        </div>
                      </div>
                      {renderBadge(tt.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h4 className="font-medium text-sm sm:text-base">Pending Assignments</h4>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] sm:text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {studentData.assignments
                  .filter((a) => a.status === "Pending")
                  .slice(0, 2)
                  .map((asg, i) => (
                    <div key={i} className="border rounded-lg p-2 sm:p-3 hover:border-primary transition-colors">
                      <h5 className="font-medium text-xs sm:text-sm">{asg.title}</h5>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">Due: {asg.due}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[8px] sm:text-[10px]">
                          {asg.subject}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] sm:text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h4 className="font-medium text-sm sm:text-base">Recent Results</h4>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] sm:text-xs">
                  View All
                </Button>
              </div>
              <Card>
                <CardContent className="p-3 sm:p-4 space-y-2">
                  {studentData.results.slice(0, 2).map((result, i) => (
                    <div key={i} className="flex justify-between items-center p-2 border rounded-md">
                      <div>
                        <h6 className="font-medium text-xs sm:text-sm">
                          {result.subject} - {result.test}
                        </h6>
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground">{result.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-xs sm:text-sm">
                          {result.marks}/{result.total}
                        </div>
                        <Badge variant={result.grade.startsWith("A") ? "default" : "secondary"} className="text-[8px]">
                          {result.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )
      case "assignments":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base sm:text-lg font-semibold">Assignments</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Search className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 bg-primary text-primary-foreground">
                  All
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Pending
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Completed
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Physics
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Mathematics
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  English
                </Badge>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {studentData.assignments.map((assignment, i) => (
                <Card
                  key={i}
                  className={`hover:border-primary transition-colors ${assignment.status === "Pending" ? "border-amber-200 dark:border-amber-800" : ""}`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">{assignment.title}</h5>
                        <Badge variant="outline" className="mt-1 text-[8px] sm:text-[10px]">
                          {assignment.subject}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Badge variant={assignment.status === "Pending" ? "outline" : "secondary"} className="mb-1">
                          {assignment.status}
                        </Badge>
                        <div className="text-[10px] text-muted-foreground">Due: {assignment.due}</div>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{assignment.description}</p>
                    <div className="flex justify-end space-x-2">
                      {assignment.status === "Pending" ? (
                        <>
                          <Button variant="outline" size="sm" className="h-7 text-[10px] sm:text-xs">
                            <Paperclip className="h-3 w-3 mr-1" />
                            Attach
                          </Button>
                          <Button size="sm" className="h-7 text-[10px] sm:text-xs">
                            Submit
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" className="h-7 text-[10px] sm:text-xs">
                          <CheckSquare className="h-3 w-3 mr-1" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )
      case "chats":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base sm:text-lg font-semibold">Messages</h4>
              <Button variant="outline" size="sm" className="h-8">
                New Chat
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-md border bg-background"
              />
            </div>
            <div className="space-y-2 sm:space-y-3 mb-4">
              {studentData.chats.map((chat, i) => (
                <div
                  key={i}
                  className="flex items-center p-2 sm:p-3 border rounded-lg hover:border-primary transition-colors"
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                      <span className="text-primary font-medium">{chat.name.charAt(0)}</span>
                    </div>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-xs sm:text-sm truncate">{chat.name}</h5>
                      <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px]">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Card className="mb-4">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm">Chat with Mrs. Sharma (Physics)</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2 max-w-[80%]">
                      <p className="text-[10px] sm:text-xs">
                        Good morning, Mrs. Sharma. I had a question about today's assignment.
                      </p>
                      <div className="text-[8px] text-right mt-1 opacity-70">9:45 AM</div>
                    </div>
                  </div>
                  <div className="flex">
                    <Avatar className="h-6 w-6 mr-2">
                      <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                        <span className="text-primary font-medium text-[10px]">S</span>
                      </div>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-2 max-w-[80%]">
                      <p className="text-[10px] sm:text-xs">Good morning, Rahul. What's your question?</p>
                      <div className="text-[8px] text-right mt-1 opacity-70">10:15 AM</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2 max-w-[80%]">
                      <p className="text-[10px] sm:text-xs">Is the lab report due tomorrow or next week?</p>
                      <div className="text-[8px] text-right mt-1 opacity-70">10:20 AM</div>
                    </div>
                  </div>
                  <div className="flex">
                    <Avatar className="h-6 w-6 mr-2">
                      <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                        <span className="text-primary font-medium text-[10px]">S</span>
                      </div>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-2 max-w-[80%]">
                      <p className="text-[10px] sm:text-xs">
                        It's due tomorrow. Don't forget to include all the graphs we discussed in class.
                      </p>
                      <div className="text-[8px] text-right mt-1 opacity-70">11:15 AM</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 text-xs rounded-md border bg-background mr-2"
                  />
                  <Button size="sm" className="h-8 w-8 p-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )
      case "results":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base sm:text-lg font-semibold">Results</h4>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>

            <Card className="mb-4">
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-sm">Performance Overview</h5>
                  <Badge variant="outline">Term 1</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <div className="text-[10px] text-muted-foreground">Average</div>
                    <div className="font-medium text-sm">85%</div>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <div className="text-[10px] text-muted-foreground">Rank</div>
                    <div className="font-medium text-sm">3rd</div>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <div className="text-[10px] text-muted-foreground">Grade</div>
                    <div className="font-medium text-sm">A</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span>Physics</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span>Mathematics</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span>English</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span>Chemistry</span>
                      <span>93%</span>
                    </div>
                    <Progress value={93} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4">
              <h5 className="font-medium text-sm mb-2">Recent Test Results</h5>
              <div className="space-y-2">
                {studentData.results.map((result, i) => (
                  <Card key={i} className="hover:border-primary transition-colors">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h6 className="font-medium text-xs sm:text-sm">
                            {result.subject} - {result.test}
                          </h6>
                          <p className="text-[8px] sm:text-[10px] text-muted-foreground">{result.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-xs sm:text-sm">
                            {result.marks}/{result.total}
                          </div>
                          <Badge
                            variant={result.grade.startsWith("A") ? "default" : "secondary"}
                            className="text-[8px]"
                          >
                            {result.grade}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(result.marks / result.total) * 100} className="h-1 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="sm">
                View All Results
              </Button>
            </div>
          </>
        )
      case "profile":
        return (
          <>
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-16 w-16 mb-2">
                <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                  <span className="text-primary font-medium text-lg">{studentData.profile.name.charAt(0)}</span>
                </div>
              </Avatar>
              <h4 className="text-base sm:text-lg font-semibold">{studentData.profile.name}</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {studentData.profile.class} • Roll No: {studentData.profile.rollNo}
              </p>
            </div>

            <Card className="mb-4">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Class</span>
                    <span className="text-[10px] sm:text-xs">{studentData.profile.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Section</span>
                    <span className="text-[10px] sm:text-xs">{studentData.profile.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Admission No.</span>
                    <span className="text-[10px] sm:text-xs">{studentData.profile.admissionNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Date of Birth</span>
                    <span className="text-[10px] sm:text-xs">{studentData.profile.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Parent Name</span>
                    <span className="text-[10px] sm:text-xs">{studentData.profile.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Parent Contact</span>
                    <span className="text-[10px] sm:text-xs">{studentData.profile.parentContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Address</span>
                    <span className="text-[10px] sm:text-xs">{studentData.profile.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4">
              <h5 className="font-medium text-xs sm:text-sm mb-2">Notifications</h5>
              <div className="space-y-2">
                {studentData.profile.notifications.map((notification, i) => (
                  <div
                    key={i}
                    className={`p-2 border rounded-lg ${!notification.read ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <h6 className="font-medium text-xs">{notification.title}</h6>
                      <span className="text-[8px] text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Info className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto mb-[-150px] md:mb-[1px]">
      <Tabs defaultValue="teacher" onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6 sm:mb-8">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="teacher" className="flex items-center justify-center space-x-2">
              <User className="w-4 h-4" />
              <span>Teacher</span>
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center justify-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Student</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TEACHER VIEW */}
        <TabsContent value="teacher" className="flex justify-center">
          <div className="relative transform scale-75 sm:scale-100 transition-transform">
            {/* phone */}
            <div className="w-60 sm:w-72 h-[500px] sm:h-[600px] bg-background border-6 sm:border-8 border-gray-800 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-xl">
              <div className="h-6 bg-gray-800"></div>
              <div className="h-[calc(100%-96px)] overflow-y-auto">
                {/* header */}
                <div className="p-3 sm:p-4 bg-primary text-primary-foreground flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <h3 className="font-semibold text-sm sm:text-base text-white">{teacherData.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Bell className="h-5 w-5" />
                    <Settings className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-3 sm:p-4">{renderTeacherContent()}</div>
              </div>
              <div className="h-16 sm:h-20 border-t bg-background flex items-center justify-around px-1 sm:px-2">
                {[
                  { Icon: Home, label: "Home", section: "home" },
                  { Icon: FileText, label: "Assignments", section: "assignments" },
                  { Icon: MessageCircle, label: "Chats", section: "chats" },
                  { Icon: BarChart2, label: "Results", section: "results" },
                  { Icon: User, label: "Profile", section: "profile" },
                ].map((nav, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center text-[10px] sm:text-xs cursor-pointer ${nav.section === activeSection ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => setActiveSection(nav.section)}
                  >
                    <nav.Icon
                      className={`h-5 sm:h-6 w-5 sm:w-6 ${nav.section === activeSection ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="mt-1">{nav.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Attendance Overlay */}
            {activeTab === "teacher" && activeSection === "home" && (
              <div className="absolute -right-32 sm:-right-40 top-16 sm:top-20 transform rotate-6 scale-75 sm:scale-100 w-60 sm:w-72 h-[400px] sm:h-[500px] bg-background border-6 sm:border-8 border-gray-800 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-xl">
                <div className="h-6 bg-gray-800"></div>
                <div className="p-3 sm:p-4 bg-primary text-primary-foreground flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">Take Attendance</span>
                  <span className="text-[10px] sm:text-xs">09:15 AM</span>
                </div>
                <div className="p-3 sm:p-4 h-[calc(100%-96px)] overflow-y-auto">
                  {teacherData.students.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 sm:p-3 border rounded-md mb-1 sm:mb-2"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-primary font-medium text-xs sm:text-sm">{s.name.charAt(0)}</span>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm block">{s.name}</span>
                          <span className="text-[8px] sm:text-[10px] text-muted-foreground">{s.rollNo}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${s.status === "present" ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"} flex items-center justify-center`}
                        >
                          <CheckCircle
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${s.status === "present" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                          />
                        </button>
                        <button
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${s.status === "absent" ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"} flex items-center justify-center`}
                        >
                          <X
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${s.status === "absent" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 sm:mt-4 flex justify-end">
                    <Button className="text-xs sm:text-sm">Save Attendance</Button>
                  </div>
                </div>
                <div className="h-12 sm:h-16 border-t bg-background"></div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* STUDENT VIEW */}
        <TabsContent value="student" className="flex justify-center">
          <div className="relative transform scale-75 sm:scale-100 transition-transform">
            <div className="w-60 sm:w-72 h-[500px] sm:h-[600px] bg-background border-6 sm:border-8 border-gray-800 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-xl">
              <div className="h-6 bg-gray-800"></div>
              <div className="h-[calc(100%-96px)] overflow-y-auto">
                <div className="p-3 sm:p-4 bg-primary text-primary-foreground flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="font-semibold text-sm sm:text-base text-white">{studentData.title}</h3>
                  </div>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="p-3 sm:p-4">{renderStudentContent()}</div>
              </div>
              <div className="h-16 sm:h-20 border-t bg-background flex items-center justify-around px-1 sm:px-2">
                {[
                  { Icon: Home, label: "Home", section: "home" },
                  { Icon: FileText, label: "Assignments", section: "assignments" },
                  { Icon: MessageCircle, label: "Chats", section: "chats" },
                  { Icon: BarChart2, label: "Results", section: "results" },
                  { Icon: User, label: "Profile", section: "profile" },
                ].map((nav, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center text-[10px] sm:text-xs cursor-pointer ${nav.section === studentActiveSection ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => setStudentActiveSection(nav.section)}
                  >
                    <nav.Icon
                      className={`h-5 sm:h-6 w-5 sm:w-6 ${nav.section === studentActiveSection ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="mt-1">{nav.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Weekly Timetable Overlay */}
            {activeTab === "student" && studentActiveSection === "home" && (
              <div className="absolute -right-32 sm:-right-40 top-16 sm:top-20 transform rotate-6 scale-75 sm:scale-100 w-60 sm:w-72 h-[400px] sm:h-[500px] bg-background border-6 sm:border-8 border-gray-800 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-xl">
                <div className="h-6 bg-gray-800"></div>
                <div className="p-3 sm:p-4 bg-primary text-primary-foreground flex justify-between items-center">
                  <h3 className="font-semibold text-sm sm:text-base text-white">Weekly Timetable</h3>
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="p-3 sm:p-4 h-[calc(100%-96px)] overflow-y-auto space-y-3">
                  {studentData.weeklySlots.map((day, i) => (
                    <div key={i}>
                      <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">{day.day}</h4>
                      <div className="space-y-1 sm:space-y-2">
                        {day.slots.map((slot, si) => (
                          <div key={si} className="p-2 rounded-md border hover:border-primary transition-colors">
                            <div className="font-medium text-xs sm:text-sm">{slot.subj}</div>
                            <div className="text-muted-foreground text-[10px] sm:text-xs">{slot.time}</div>
                            <div className="flex justify-between text-[8px] sm:text-[10px] text-muted-foreground mt-1">
                              <span>{slot.teacher}</span>
                              <span>{slot.room}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-12 sm:h-16 border-t bg-background"></div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
