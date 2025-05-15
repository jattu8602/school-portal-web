"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Users, BookOpen, Calendar, FileText, MessageSquare, Bell } from "lucide-react"

export default function TeacherDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teacherData, setTeacherData] = useState(null)
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [banner, setBanner] = useState(null)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalAssignments: 0,
    totalAnnouncements: 0,
    classes: 0,
    students: 0,
    assignments: 0,
    events: 0
  })

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          router.push('/auth/teacher/login')
          return
        }

        const { schoolId, id: teacherId } = userData

        // Fetch teacher data
        const teacherDoc = await getDoc(doc(db, 'schools', schoolId, 'teachers', teacherId))
        if (teacherDoc.exists()) {
          setTeacherData(teacherDoc.data())
        }

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

        // Fetch students in teacher's classes
        const classIds = classesData.map(c => c.id)
        const studentsQuery = query(
          collection(db, 'schools', schoolId, 'students'),
          where('classId', 'in', classIds)
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setStudents(studentsData)

        // Fetch active banner
        try {
          console.log("Fetching banners for teacher, school ID:", schoolId);

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
          totalStudents: studentsData.length,
          totalClasses: classesData.length,
          totalAssignments: 0, // You can fetch this if needed
          totalAnnouncements: 0, // You can fetch this if needed
          classes: classesData.length,
          students: studentsData.length,
          assignments: 0,
          events: 0
        })

      } catch (error) {
        console.error("Error fetching teacher data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherData()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      {banner && (
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Hello, {teacherData?.fullName || teacherData?.name}</h2>
            <p className="text-gray-600">{banner.description}</p>
          </div>
          {banner.imageUrl && (
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="absolute right-0 bottom-0 w-1/3 h-full object-cover opacity-20"
            />
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.classes}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground">Total students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignments}</div>
            <p className="text-xs text-muted-foreground">Pending assignments</p>
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

      {/* Classes and Students Tabs */}
      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          {classes.map((classData) => (
            <Card key={classData.id}>
              <CardHeader>
                <CardTitle>{classData.name}</CardTitle>
                <CardDescription>
                  {classData.description || `Class ${classData.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="font-medium">
                      {students.filter(s => s.classId === classData.id).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Schedule</span>
                    <span className="font-medium">{classData.schedule || 'Not set'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>
                  Class: {classes.find(c => c.id === student.classId)?.name || 'Unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Roll Number</span>
                    <span className="font-medium">{student.rollNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Username</span>
                    <span className="font-medium">{student.username}</span>
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