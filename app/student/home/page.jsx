"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BookOpen, Calendar, FileText, MessageSquare, Users, GraduationCap, Bell } from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  const [classData, setClassData] = useState(null)
  const [teachers, setTeachers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [banner, setBanner] = useState(null)
  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalTeachers: 0,
    attendancePercentage: 0,
    upcomingExams: 0,
    assignments: 0,
    attendance: 0,
    grades: 0,
    events: 0
  })

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          router.push('/auth/student/login')
          return
        }

        const { schoolId, id: studentId } = userData

        // Fetch student data
        const studentDoc = await getDoc(doc(db, 'schools', schoolId, 'students', studentId))
        if (studentDoc.exists()) {
          setStudentData(studentDoc.data())

          // Fetch student's class
          const classDoc = await getDoc(doc(db, 'schools', schoolId, 'classes', studentDoc.data().classId))
          if (classDoc.exists()) {
            setClassData(classDoc.data())
          }

          // Fetch teachers in student's class
          const teachersQuery = query(
            collection(db, 'schools', schoolId, 'teachers'),
            where('classId', 'array-contains', studentDoc.data().classId)
          )
          const teachersSnapshot = await getDocs(teachersQuery)
          const teachersData = teachersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setTeachers(teachersData)

          // Fetch student's assignments
          const assignmentsQuery = query(
            collection(db, 'schools', schoolId, 'assignments'),
            where('classId', '==', studentDoc.data().classId)
          )
          const assignmentsSnapshot = await getDocs(assignmentsQuery)
          const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setAssignments(assignmentsData)

          // Fetch active banner
          try {
            console.log("Fetching banners for student, school ID:", schoolId);

            // Simple query with no complex filters or ordering
            const bannersQuery = query(
              collection(db, 'banners'),
              where('schoolId', '==', schoolId)
            );

            console.log("Executing banners query");
            const bannersSnapshot = await getDocs(bannersQuery);
            console.log(`Found ${bannersSnapshot.size} banners for school ID ${schoolId}`);

            if (!bannersSnapshot.empty) {
              // Process all banners and filter client-side
              const allBanners = [];
              const now = new Date();

              bannersSnapshot.forEach((doc) => {
                const bannerData = doc.data();
                console.log("Banner data:", bannerData);

                if (bannerData.status === 'active') {
                  // Check dates if they exist
                  if (bannerData.startDate && bannerData.endDate) {
                    const startDate = new Date(bannerData.startDate);
                    const endDate = new Date(bannerData.endDate);

                    if (now >= startDate && now <= endDate) {
                      allBanners.push({
                        id: doc.id,
                        ...bannerData
                      });
                    }
                  } else {
                    // If no dates, include by default
                    allBanners.push({
                      id: doc.id,
                      ...bannerData
                    });
                  }
                }
              });

              // Sort and select the most recent banner
              if (allBanners.length > 0) {
                allBanners.sort((a, b) =>
                  new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );

                setBanner(allBanners[0]);
                console.log("Set active banner:", allBanners[0]);
              }
            } else {
              console.log("No banners found for this school");
            }
          } catch (bannerError) {
            console.error("Error fetching banner:", bannerError);
          }

          // Update stats
          setStats({
            totalAssignments: assignmentsData.length,
            totalTeachers: teachersData.length,
            attendancePercentage: 0,
            upcomingExams: 0,
            assignments: assignmentsData.length,
            attendance: 0,
            grades: 0,
            events: 0
          })
        }

      } catch (error) {
        console.error("Error fetching student data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {studentData?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening today</p>
      </div>

      {/* School Banner */}
      {banner && (
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 p-6 mb-8 shadow-lg">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{banner.title}</h2>
              {banner.tags && banner.tags.length > 0 && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {banner.tags[0]}
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{banner.description}</p>
            {banner.buttonText && banner.buttonLink && (
              <a
                href={banner.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {banner.buttonText}
              </a>
            )}
          </div>
          {banner.url && (
            <div className="absolute right-0 bottom-0 w-1/3 h-full">
              {banner.type === 'video' ? (
                <video
                  src={banner.url}
                  className="w-full h-full object-cover opacity-20"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={banner.url}
                  alt={banner.title}
                  className="w-full h-full object-cover opacity-20"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignments}</div>
            <p className="text-xs text-muted-foreground">Pending assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendance}%</div>
            <p className="text-xs text-muted-foreground">Current attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grades</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.grades}</div>
            <p className="text-xs text-muted-foreground">Average grade</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingExams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <p className="text-xs text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Info and Assignments Tabs */}
      <Tabs defaultValue="class" className="space-y-4">
        <TabsList>
          <TabsTrigger value="class">Class Info</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="class" className="space-y-4">
          {/* Class Information */}
          <Card>
            <CardHeader>
              <CardTitle>{classData?.name}</CardTitle>
              <CardDescription>
                {classData?.description || `Class ${classData?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Schedule</span>
                  <span className="font-medium">{classData?.schedule || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Room</span>
                  <span className="font-medium">{classData?.room || 'Not set'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teachers List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{teacher.fullName || teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.subjects?.join(', ') || 'No subjects assigned'}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{teacher.email}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription>
                  Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subject</span>
                    <span className="font-medium">{assignment.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="font-medium">{assignment.status || 'Not submitted'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}