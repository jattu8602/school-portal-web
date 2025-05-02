"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, FileText, MessageCircle, BarChart2, User, CheckCircle, X, Clock, Calendar, Bell } from "lucide-react"

export default function MobileAppShowcase() {
  const [activeTab, setActiveTab] = useState("teacher")

  return (
    <div>
      <Tabs defaultValue="teacher" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="teacher">Teacher App</TabsTrigger>
            <TabsTrigger value="student">Student App</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="teacher" className="flex justify-center">
          <div className="relative">
            {/* Phone mockup */}
            <div className="w-72 h-[600px] bg-background border-8 border-gray-800 rounded-[40px] overflow-hidden shadow-xl">
              {/* Status bar */}
              <div className="h-6 bg-gray-800"></div>

              {/* App content */}
              <div className="h-[calc(100%-96px)] overflow-y-auto">
                {/* App header */}
                <div className="p-4 bg-primary text-primary-foreground">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">PresentSir Teacher</h3>
                    <Bell className="h-5 w-5" />
                  </div>
                </div>

                {/* Main content */}
                <div className="p-4">
                  {/* Welcome section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold">Welcome, Mrs. Sharma</h4>
                    <p className="text-sm text-muted-foreground">Tuesday, May 1, 2025</p>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium text-sm">Take Attendance</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Mark attendance for your classes</p>
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="font-medium text-sm">Sync Device</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Connect to attendance device</p>
                    </div>
                  </div>

                  {/* Today's classes */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Today's Classes</h4>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Physics - Grade 10A</h5>
                            <p className="text-xs text-muted-foreground">9:00 AM - 10:00 AM</p>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                            Completed
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Chemistry - Grade 11B</h5>
                            <p className="text-xs text-muted-foreground">11:30 AM - 12:30 PM</p>
                          </div>
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                            Upcoming
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Physics - Grade 9C</h5>
                            <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
                          </div>
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                            Upcoming
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance summary */}
                  <div>
                    <h4 className="font-medium mb-3">Attendance Summary</h4>
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Present:</span>
                        <span className="text-sm font-medium">42 students</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Absent:</span>
                        <span className="text-sm font-medium">3 students</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-sm">Leave:</span>
                        <span className="text-sm font-medium">1 student</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: "91%" }}></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-xs text-muted-foreground">91% attendance rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom navigation */}
              <div className="h-20 border-t bg-background flex items-center justify-around px-2">
                <div className="flex flex-col items-center">
                  <Home className="h-6 w-6 text-primary" />
                  <span className="text-xs mt-1">Home</span>
                </div>
                <div className="flex flex-col items-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Assignments</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Chats</span>
                </div>
                <div className="flex flex-col items-center">
                  <BarChart2 className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Results</span>
                </div>
                <div className="flex flex-col items-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Profile</span>
                </div>
              </div>
            </div>

            {/* Attendance taking screen */}
            {activeTab === "teacher" && (
              <div className="absolute -right-40 top-20 w-72 h-[500px] bg-background border-8 border-gray-800 rounded-[40px] overflow-hidden shadow-xl transform rotate-6">
                <div className="h-6 bg-gray-800"></div>
                <div className="p-4 bg-primary text-primary-foreground">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Take Attendance</h3>
                    <span className="text-xs">09:15 AM</span>
                  </div>
                  <p className="text-sm">Physics - Grade 10A</p>
                </div>

                <div className="p-4 h-[calc(100%-96px)] overflow-y-auto">
                  <div className="space-y-3">
                    {["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Gupta", "Vikram Singh"].map(
                      (student, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="text-primary font-medium">{student.charAt(0)}</span>
                            </div>
                            <span className="text-sm">{student}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                      Save Attendance
                    </button>
                  </div>
                </div>

                <div className="h-20 border-t bg-background"></div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="student" className="flex justify-center">
          <div className="relative">
            {/* Phone mockup */}
            <div className="w-72 h-[600px] bg-background border-8 border-gray-800 rounded-[40px] overflow-hidden shadow-xl">
              {/* Status bar */}
              <div className="h-6 bg-gray-800"></div>

              {/* App content */}
              <div className="h-[calc(100%-96px)] overflow-y-auto">
                {/* App header */}
                <div className="p-4 bg-primary text-primary-foreground">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">PresentSir Student</h3>
                    <Bell className="h-5 w-5" />
                  </div>
                </div>

                {/* Main content */}
                <div className="p-4">
                  {/* Welcome section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold">Welcome, Rahul</h4>
                    <p className="text-sm text-muted-foreground">Tuesday, May 1, 2025</p>
                  </div>

                  {/* Attendance card */}
                  <div className="bg-card border rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-3">Your Attendance</h4>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">This Month:</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall:</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full mt-3">
                      <div className="h-full bg-primary rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  {/* Today's timetable */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Today's Timetable</h4>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Physics</h5>
                            <p className="text-xs text-muted-foreground">9:00 AM - 10:00 AM</p>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                            Completed
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">Mathematics</h5>
                            <p className="text-xs text-muted-foreground">11:30 AM - 12:30 PM</p>
                          </div>
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                            Upcoming
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">English</h5>
                            <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
                          </div>
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                            Upcoming
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignments */}
                  <div>
                    <h4 className="font-medium mb-3">Pending Assignments</h4>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium">Physics Assignment</h5>
                        <p className="text-xs text-muted-foreground mb-2">Due: May 5, 2025</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                            Pending
                          </span>
                          <button className="text-xs text-primary">View Details</button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium">Mathematics Quiz</h5>
                        <p className="text-xs text-muted-foreground mb-2">Due: May 3, 2025</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                            Pending
                          </span>
                          <button className="text-xs text-primary">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom navigation */}
              <div className="h-20 border-t bg-background flex items-center justify-around px-2">
                <div className="flex flex-col items-center">
                  <Home className="h-6 w-6 text-primary" />
                  <span className="text-xs mt-1">Home</span>
                </div>
                <div className="flex flex-col items-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Assignments</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Chats</span>
                </div>
                <div className="flex flex-col items-center">
                  <BarChart2 className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Results</span>
                </div>
                <div className="flex flex-col items-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs mt-1">Profile</span>
                </div>
              </div>
            </div>

            {/* Timetable screen */}
            {activeTab === "student" && (
              <div className="absolute -right-40 top-20 w-72 h-[500px] bg-background border-8 border-gray-800 rounded-[40px] overflow-hidden shadow-xl transform rotate-6">
                <div className="h-6 bg-gray-800"></div>
                <div className="p-4 bg-primary text-primary-foreground">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Weekly Timetable</h3>
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-4 h-[calc(100%-96px)] overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Monday</h4>
                      <div className="space-y-2">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md text-xs">
                          <div className="font-medium">Mathematics</div>
                          <div className="text-muted-foreground">9:00 AM - 10:00 AM</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-xs">
                          <div className="font-medium">Physics</div>
                          <div className="text-muted-foreground">11:30 AM - 12:30 PM</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm">Tuesday</h4>
                      <div className="space-y-2">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md text-xs">
                          <div className="font-medium">English</div>
                          <div className="text-muted-foreground">9:00 AM - 10:00 AM</div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md text-xs">
                          <div className="font-medium">Chemistry</div>
                          <div className="text-muted-foreground">11:30 AM - 12:30 PM</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm">Wednesday</h4>
                      <div className="space-y-2">
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-xs">
                          <div className="font-medium">Physics</div>
                          <div className="text-muted-foreground">9:00 AM - 10:00 AM</div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md text-xs">
                          <div className="font-medium">Mathematics</div>
                          <div className="text-muted-foreground">11:30 AM - 12:30 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-20 border-t bg-background"></div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
