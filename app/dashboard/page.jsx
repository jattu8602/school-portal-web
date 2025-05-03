"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore"
import BannerSlideshow from "../components/dashboard/BannerSlideshow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Eye, Users, BookOpen, Wallet, Calendar } from "lucide-react"

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("teachers")
  const [showDebug, setShowDebug] = useState(false)
  const [banners, setBanners] = useState([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    feeCollection: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          await fetchSchoolInfo(currentUser.uid)
          await fetchBanners(currentUser.uid)
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      } else {
        router.push("/auth/signin")
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchSchoolInfo = async (schoolId) => {
    try {
      // Get school document
      const schoolDoc = await getDoc(doc(db, "schools", schoolId))

      if (!schoolDoc.exists()) {
        console.error("School document not found")
        return
      }

      // In a real app, fetch these stats from Firestore collections
      // This is just a placeholder for now
      setStats({
        totalStudents: 120,
        totalTeachers: 12,
        totalClasses: 8,
        feeCollection: 24000,
      })
    } catch (error) {
      console.error("Error fetching school info:", error)
    }
  }

  const fetchBanners = async (schoolId) => {
    try {
      console.log("Fetching banners for school ID:", schoolId);

      // Check if the school document exists first
      const schoolDocRef = doc(db, "schools", schoolId);
      const schoolDoc = await getDoc(schoolDocRef);

      if (!schoolDoc.exists()) {
        console.error("School document not found");
        setBanners(getDefaultBanners());
        return;
      }

      // Create banners subcollection reference
      const bannersCollectionRef = collection(db, "schools", schoolId, "banners");

      // Check if the collection exists by trying to get documents
      try {
        const bannersQuery = query(bannersCollectionRef, orderBy("createdAt", "desc"), limit(5));
        const bannersSnapshot = await getDocs(bannersQuery);

        if (bannersSnapshot.empty) {
          console.log("No banners found, using defaults");
          setBanners(getDefaultBanners());
          return;
        }

        const fetchedBanners = [];
        bannersSnapshot.forEach((doc) => {
          fetchedBanners.push({
            id: doc.id,
            ...doc.data()
          });
        });

        console.log("Fetched banners:", fetchedBanners);
        setBanners(fetchedBanners);
      } catch (error) {
        // If permission error, use default banners
        console.error("Error fetching banners:", error.message);
        setBanners(getDefaultBanners());
      }
    } catch (error) {
      console.error("Error in fetchBanners:", error.message);
      setBanners(getDefaultBanners());
    }
  };

  const getDefaultBanners = () => {
    return [
      {
        id: "1",
        type: "image",
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        title: "Welcome to Our School",
        description: "Providing quality education since 1995",
        tags: ["Announcement"],
        buttonText: "Learn More",
        buttonLink: "/about",
        createdAt: new Date(),
      },
      {
        id: "2",
        type: "image",
        url: "https://res.cloudinary.com/demo/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1547634631/samples/landscapes/architecture-signs.jpg",
        title: "Annual Sports Day",
        description: "Join us on December 15th for our annual sports event",
        tags: ["Event"],
        buttonText: "Register Now",
        buttonLink: "/events/sports-day",
        createdAt: new Date(),
      },
      {
        id: "3",
        type: "image",
        url: "https://res.cloudinary.com/demo/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1547634631/samples/landscapes/nature-mountains.jpg",
        title: "New Science Lab",
        description: "Explore our newly renovated science laboratory",
        tags: ["Facility"],
        buttonText: "View Photos",
        buttonLink: "/facilities/science-lab",
        createdAt: new Date(),
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      name: "Add New Class",
      href: "/dashboard/add-class",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Create a new class section",
    },
    {
      name: "Take Attendance",
      href: "/dashboard/attendance",
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "Mark today's attendance",
    },
    {
      name: "Manage Timetable",
      href: "/dashboard/timetable",
      icon: <Calendar className="h-6 w-6 text-primary" />,
      description: "Update class schedules",
    },
    {
      name: "Collect Fees",
      href: "/dashboard/manage-fees",
      icon: <Wallet className="h-6 w-6 text-primary" />,
      description: "Record fee payments",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>

          {/* Banner Management Section */}
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">School Banners</h2>
              <div className="flex flex-wrap gap-2">
                {banners.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/preview-banners")}
                    className="flex items-center h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
                  >
                    <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>View All</span>
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/dashboard/add-banner")}
                  className="flex items-center h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Add Banner</span>
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[200px] sm:h-[300px] md:h-[400px]">
                  <BannerSlideshow banners={banners} />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Students</p>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    <p className="text-sm text-muted-foreground mt-1">+5 new this month</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Classes</p>
                    <p className="text-2xl font-bold">{stats.totalClasses}</p>
                    <p className="text-sm text-muted-foreground mt-1">Class 5 - 12</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Teachers</p>
                    <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                    <p className="text-sm text-muted-foreground mt-1">All subjects covered</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Fee Collection</p>
                    <p className="text-2xl font-bold">₹{stats.feeCollection}</p>
                    <p className="text-sm text-muted-foreground mt-1">This month</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">{action.icon}</div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{action.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activities */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white">Attendance marked for Class 10</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">By Amit Kumar • 10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white">New timetable created for Class 8</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">By Priya Sharma • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white">Fee collected from 5 students</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">By Raj Verma • Yesterday, 5:30 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
