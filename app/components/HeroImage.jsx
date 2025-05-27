"use client"

import { useEffect, useState } from "react"
import { Check, X, Save, ArrowLeft, SchoolIcon, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function AttendanceTracker() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState("school")
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const { toast } = useToast()

  // Sample data
  const schools = [
    {
      id: 1,
      name: 'Springfield High School',
      classes: [
        {
          id: 1,
          name: 'Physics',
          grade: '10A',
          students: [
            { id: 1, name: 'Aarav Sharma', status: null },
            { id: 2, name: 'Isha Verma', status: null },
            { id: 3, name: 'Rahul Mehra', status: null },
            { id: 4, name: 'Priya Singh', status: null },
            { id: 5, name: 'Karan Patel', status: null },
          ],
        },
        {
          id: 2,
          name: 'Chemistry',
          grade: '10B',
          students: [
            { id: 16, name: 'Aarav Sharma', status: null },
            { id: 17, name: 'Ananya Verma', status: null },
            { id: 18, name: 'Vivaan Mehta', status: null },
            { id: 19, name: 'Isha Reddy', status: null },
            { id: 20, name: 'Krishna Patel', status: null },
            { id: 21, name: 'Saanvi Nair', status: null },
            { id: 22, name: 'Aditya Joshi', status: null },
            { id: 23, name: 'Diya Malhotra', status: null },
            { id: 24, name: 'Rohan Desai', status: null },
            { id: 25, name: 'Meera Gupta', status: null },
            { id: 26, name: 'Yash Raj', status: null },
            { id: 27, name: 'Tanya Singh', status: null },
            { id: 28, name: 'Arjun Yadav', status: null },
            { id: 29, name: 'Priya Das', status: null },
            { id: 30, name: 'Kunal Bhatia', status: null },
          ],
        },
        {
          id: 3,
          name: 'Biology',
          grade: '11A',
          students: [
            { id: 31, name: 'Rahul Kapoor', status: null },
            { id: 32, name: 'Sneha Iyer', status: null },
            { id: 33, name: 'Aman Chauhan', status: null },
            { id: 34, name: 'Ritika Sen', status: null },
            { id: 35, name: 'Neeraj Bansal', status: null },
            { id: 36, name: 'Pooja Shetty', status: null },
            { id: 37, name: 'Varun Saxena', status: null },
            { id: 38, name: 'Nisha Pillai', status: null },
            { id: 39, name: 'Tushar Raina', status: null },
            { id: 40, name: 'Kritika Menon', status: null },
            { id: 41, name: 'Devansh Tyagi', status: null },
            { id: 42, name: 'Aisha Khan', status: null },
          ],
        },
        {
          id: 4,
          name: 'Mathematics',
          grade: '11B',
          students: [
            { id: 46, name: 'Ishaan Rathi', status: null },
            { id: 47, name: 'Kavya Mishra', status: null },
            { id: 48, name: 'Dev Rathore', status: null },
            { id: 49, name: 'Sanya Agarwal', status: null },
            { id: 50, name: 'Aryan Thakur', status: null },
            { id: 51, name: 'Nidhi Kulkarni', status: null },
            { id: 52, name: 'Manav Sinha', status: null },
            { id: 53, name: 'Avni Chatterjee', status: null },
            { id: 54, name: 'Rudra Naik', status: null },
            { id: 55, name: 'Jhanvi Shah', status: null },
            { id: 56, name: 'Parth Jain', status: null },
            { id: 57, name: 'Simran Ahuja', status: null },
            { id: 58, name: 'Aayush Goyal', status: null },
            { id: 59, name: 'Tanvi Sehgal', status: null },
          ],
        },
        {
          id: 5,
          name: 'English',
          grade: '12A',
          students: [
            { id: 61, name: 'Ritik Anand', status: null },
            { id: 62, name: 'Anushka Dey', status: null },
            { id: 63, name: 'Karan Bhardwaj', status: null },
            { id: 64, name: 'Shreya Dubey', status: null },
            { id: 65, name: 'Pranav Chauhan', status: null },
            { id: 66, name: 'Ira Banerjee', status: null },
            { id: 67, name: 'Nikhil Tiwari', status: null },
            { id: 68, name: 'Mahi Lakhani', status: null },
            { id: 69, name: 'Lakshya Sehrawat', status: null },
          ],
        },
      ],
    },
  ]

  useEffect(() => {
    setMounted(true)
    // Auto-select the only school and first class
    if (schools.length === 1) {
      const school = schools[0]
      setSelectedSchool(school)
      if (school.classes.length > 0) {
        const firstClass = school.classes[0]
        setSelectedClass({ ...firstClass })
        setStep("attendance")
      } else {
        setStep("class")
      }
    }
  }, [])

  if (!mounted) return null

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school)
    setStep("class")
  }

  const handleClassSelect = (classItem) => {
    setSelectedClass({ ...classItem })
    setStep("attendance")
  }

  const handleAttendanceChange = (studentId, status) => {
    if (!selectedClass) return

    const updatedStudents = selectedClass.students.map((student) =>
      student.id === studentId ? { ...student, status } : student,
    )

    setSelectedClass({
      ...selectedClass,
      students: updatedStudents,
    })
  }

  const handleReset = () => {
    setStep("school")
    setSelectedSchool(null)
    setSelectedClass(null)
  }

  const handleMarkAllPresent = () => {
    if (!selectedClass) return

    const updatedStudents = selectedClass.students.map((student) => ({
      ...student,
      status: "present",
    }))

    setSelectedClass({
      ...selectedClass,
      students: updatedStudents,
    })

    toast({
      title: "All students marked present",
      description: "You can now mark individual students as absent if needed.",
    })
  }

  const handleSaveAttendance = () => {
    // Check if all students have been marked
    if (selectedClass && selectedClass.students.some((s) => s.status === null)) {
      toast({
        title: "Incomplete attendance",
        description: "Please mark all students as present or absent before saving.",
        variant: "destructive",
      })
      return
    }

    // Show loading toast
    toast({
      title: "Saving attendance...",
      description: "Please wait while we save the attendance records.",
    })

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Attendance saved!",
        description: `Successfully saved attendance for ${selectedClass?.name} - ${selectedClass?.grade}.`,
      })
      setStep("saved")
    }, 1500)
  }

  const handleBack = () => {
    if (step === "class") {
      setStep("school")
      setSelectedSchool(null)
    } else if (step === "attendance") {
      setStep("class")
      setSelectedClass(null)
    } else if (step === "saved") {
      setStep("attendance")
    }
  }

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    if (!selectedClass) return { present: 0, absent: 0, total: 0, presentPercentage: 0 }

    const present = selectedClass.students.filter((s) => s.status === "present").length
    const absent = selectedClass.students.filter((s) => s.status === "absent").length
    const total = selectedClass.students.length
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0

    return { present, absent, total, presentPercentage }
  }

  const stats = getAttendanceStats()

  return (
    <div className="relative w-full max-w-xs sm:max-w-md mx-auto">
      {/* Main Device mockup */}
      <motion.div
        className="relative z-10 bg-card border-4 border-border rounded-xl shadow-xl overflow-hidden transform transition-all"
        initial={{ scale: 0.99, opacity: 1 }}
        animate={{
          scale: 1,
          opacity: 1,
          rotate: 0
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut"
        }}
        style={{ height: "600px" }}
      >
        <div className="p-4 bg-primary">
          <div className="flex justify-between items-center">
            <div className="text-primary-foreground font-semibold">PresentSir Device</div>
            <div className="text-primary-foreground text-sm">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
        <div className="p-4 h-[calc(100%-64px)] overflow-y-auto">
          {step === "school" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Select School</h3>
                <p className="text-sm text-muted-foreground">Choose a school to mark attendance</p>
              </div>
              <div className="space-y-3">
                {schools.map((school) => (
                  <motion.button
                    key={school.id}
                    className="w-full flex items-center justify-between p-3 border rounded-md hover:bg-accent hover:border-primary/50 transition-colors"
                    onClick={() => handleSchoolSelect(school)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <SchoolIcon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{school.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{school.classes.length} classes</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === "class" && selectedSchool && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">{selectedSchool.name}</h3>
                <p className="text-sm text-muted-foreground">Select a class to mark attendance</p>
              </div>
              <div className="space-y-3">
                {selectedSchool.classes.map((classItem) => (
                  <motion.button
                    key={classItem.id}
                    className="w-full flex items-center justify-between p-3 border rounded-md hover:bg-accent hover:border-primary/50 transition-colors"
                    onClick={() => handleClassSelect(classItem)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">
                        {classItem.name} - {classItem.grade}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{classItem.students.length} students</div>
                  </motion.button>
                ))}
              </div>
              <div className="mt-4">
                <motion.button
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={handleBack}
                  whileHover={{ x: -2 }}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Schools
                </motion.button>
              </div>
            </div>
          )}

          {step === "attendance" && selectedClass && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h3 className="font-bold text-lg">Class Attendance</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedClass.name} - {selectedClass.grade}
                </p>
              </div>
              <motion.button
                className="w-full flex items-center justify-center p-2 mb-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                onClick={handleMarkAllPresent}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4 mr-2" /> Mark All Present
              </motion.button>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {selectedClass.students.map((student) => (
                  <motion.div
                    key={student.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <span className="text-primary font-medium">{student.name.charAt(0)}</span>
                      </div>
                      <span>{student.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          student.status === "present"
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        onClick={() => handleAttendanceChange(student.id, "present")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          student.status === "absent"
                            ? "bg-red-500 text-white"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                        onClick={() => handleAttendanceChange(student.id, "absent")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <motion.button
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={handleBack}
                  whileHover={{ x: -2 }}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </motion.button>
                <motion.button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm flex items-center"
                  onClick={handleSaveAttendance}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-4 h-4 mr-1" /> Save Attendance
                </motion.button>
              </div>
            </div>
          )}

          {step === "saved" && selectedClass && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Attendance Saved</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedClass.name} - {selectedClass.grade}
                </p>
              </div>

              <div className="bg-accent p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <div>
                    Present: <span className="font-bold text-green-600">{stats.present}</span>
                  </div>
                  <div>
                    Absent: <span className="font-bold text-red-600">{stats.absent}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-muted rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.presentPercentage}%` }}
                  ></div>
                </div>
                <div className="text-right mt-1 text-sm">{stats.presentPercentage}% attendance</div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {selectedClass.students.map((student) => (
                  <motion.div
                    key={student.id}
                    className={`flex items-center justify-between p-2 border rounded-md ${
                      student.status === "present" ? "bg-green-50" : "bg-red-50"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          student.status === "present" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <span
                          className={`font-medium ${student.status === "present" ? "text-green-600" : "text-red-600"}`}
                        >
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <span>{student.name}</span>
                    </div>
                    <div>
                      {student.status === "present" ? (
                        <span className="text-green-600 font-medium flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Present
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium flex items-center">
                          <X className="w-4 h-4 mr-1" /> Absent
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex justify-between">
                <motion.button
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={handleBack}
                  whileHover={{ x: -2 }}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Edit Attendance
                </motion.button>
                <motion.button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm"
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mark Another Class
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile app mockup */}
      <motion.div
        className="absolute -bottom-8 sm:-bottom-10 -right-8 sm:-right-10 w-36 sm:w-48 h-72 sm:h-96 bg-card border-4 border-border rounded-xl shadow-xl overflow-hidden z-0"
        initial={{ rotate: 6, scale: 0.75 }}
        animate={{
          rotate: [6, 8, 4, 6],
          y: [0, -5, 5, 0],
          scale: [0.75, 0.78, 0.75, 0.78, 0.75],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <div className="p-2 bg-accent">
          <div className="flex justify-between items-center">
            <div className="text-accent-foreground text-xs font-semibold">PresentSir App</div>
            <div className="text-accent-foreground text-xs">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="text-center mb-2">
            <h3 className="font-bold text-xs">Teacher Dashboard</h3>
          </div>
          <div className="space-y-2">
            <div className="bg-muted p-1 rounded-md">
              <div className="text-xs font-medium">Today's Classes</div>
              <div className="text-xs text-muted-foreground">3 classes</div>
            </div>
            <div className="bg-muted p-1 rounded-md">
              <div className="text-xs font-medium">Attendance</div>
              <div className="text-xs text-muted-foreground">
                {step === "saved" ? `${stats.presentPercentage}% present` : "95% present"}
              </div>
            </div>
            <div className="bg-muted p-1 rounded-md">
              <div className="text-xs font-medium">Homework</div>
              <div className="text-xs text-muted-foreground">2 pending</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* School panel mockup */}
      <motion.div
        className="absolute -bottom-6 sm:-bottom-8 -left-8 sm:-left-10 w-36 sm:w-48 h-24 sm:h-32 bg-card border-4 border-border rounded-xl shadow-xl overflow-hidden z-0"
        initial={{ rotate: -6, scale: 0.75 }}
        animate={{
          rotate: [-6, -8, -4, -6],
          y: [0, 5, -5, 0],
          scale: [0.75, 0.78, 0.75, 0.78, 0.75],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <div className="p-1 bg-secondary">
          <div className="text-secondary-foreground text-xs font-semibold">School Panel</div>
        </div>
        <div className="p-2">
          <div className="text-xs font-medium">Attendance Overview</div>
          <div className="flex justify-between mt-1">
            <div className="text-xs">
              Present: <span className="font-medium">{step === "saved" ? `${stats.presentPercentage}%` : "85%"}</span>
            </div>
            <div className="text-xs">
              Absent:{" "}
              <span className="font-medium">{step === "saved" ? `${100 - stats.presentPercentage}%` : "15%"}</span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full mt-1">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "85%" }}
              animate={{ width: step === "saved" ? `${stats.presentPercentage}%` : "85%" }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
