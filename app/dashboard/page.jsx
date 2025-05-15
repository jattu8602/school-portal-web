"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, orderBy, limit, getDocs, doc, getDoc, updateDoc, where } from "firebase/firestore"
import { verifySchoolAdmin } from "@/lib/auth"
import BannerSlideshow from "../components/dashboard/BannerSlideshow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  PlusCircle, Eye, Users, BookOpen, Wallet, Calendar,
  ArrowUpRight, Bell, ChevronRight, TrendingUp,
  UserPlus, Clock, CheckCircle, Award
} from "lucide-react"

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showDebug, setShowDebug] = useState(false)
  const [banners, setBanners] = useState([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    feeCollection: 0,
    attendance: 0,
    performance: 0
  })
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const isAdmin = await verifySchoolAdmin(currentUser.uid)
          if (!isAdmin) {
            console.error("User is not a school admin")
            router.push("/auth/signin")
            return
          }

          await fetchSchoolInfo(currentUser.uid)
          try {
            await fetchBanners(currentUser.uid)
          } catch (bannerError) {
            console.error("Error fetching banners:", bannerError)
            setBanners(getDefaultBanners())
          }
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
        attendance: 92,
        performance: 78
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

      // First, get all banners for the school
      try {
        const bannersQuery = query(
          collection(db, 'banners'),
          where('schoolId', '==', schoolId)
        );

        const bannersSnapshot = await getDocs(bannersQuery);
        const fetchedBanners = [];

        bannersSnapshot.forEach((doc) => {
          const bannerData = doc.data();
          // Only include active banners within date range
          if (bannerData.status === 'active') {
            const startDate = new Date(bannerData.startDate);
            const endDate = new Date(bannerData.endDate);
            const currentDate = new Date();

            if (currentDate >= startDate && currentDate <= endDate) {
              fetchedBanners.push({
                id: doc.id,
                title: bannerData.title,
                description: bannerData.description,
                type: bannerData.type,
                url: bannerData.url,
                tags: bannerData.tags || [],
                buttonText: bannerData.buttonText,
                buttonLink: bannerData.buttonLink,
                createdAt: bannerData.createdAt,
                updatedAt: bannerData.updatedAt
              });
            }
          }
        });

        // Sort by createdAt in memory
        fetchedBanners.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (fetchedBanners.length > 0) {
          setBanners(fetchedBanners);
          console.log("Fetched and set banners:", fetchedBanners.length);
        } else {
          console.log("No active banners found, using default banners");
          setBanners(getDefaultBanners());
        }
      } catch (bannerQueryError) {
        console.error("Banner query error:", bannerQueryError);
        // Show default banners if there's an error with the query
        setBanners(getDefaultBanners());
      }
    } catch (error) {
      console.error("Error in fetchBanners:", error.message);
      // Always set default banners on error
      setBanners(getDefaultBanners());
    }
  };

  const getDefaultBanners = () => {
    return [
      {
        id: "1",
        type: "image",
        url: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        url: "https://images.unsplash.com/photo-1671706466693-28fb04684694?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2Nob29sJTIwc3BvcnR8ZW58MHx8MHx8fDA%3D",
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
        url: "https://images.unsplash.com/photo-1705727210721-961cc64a6895?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNjaG9vbCUyMHNjaWVuY2UlMjBsYWJ8ZW58MHx8MHx8fDA%3D",
        title: "New Science Lab",
        description: "Explore our newly renovated science laboratory",
        tags: ["Facility"],
        buttonText: "View Photos",
        buttonLink: "/facilities/science-lab",
        createdAt: new Date(),
      },
    ];
  };

  // Function to update banner colors in Firebase
  const updateBannerColors = useCallback(async (bannerId, colors) => {
    if (!user || colors.length === 0) return;

    try {
      const bannerRef = doc(db, "banners", bannerId);
      await updateDoc(bannerRef, {
        extractedColors: colors,
        updatedAt: new Date().toISOString()
      });
      console.log(`Updated colors for banner ${bannerId} from dashboard`);

      // Update local state to reflect the change without refetching
      setBanners(prev =>
        prev.map(banner =>
          banner.id === bannerId
            ? { ...banner, extractedColors: colors }
            : banner
        )
      );
    } catch (error) {
      console.error("Error updating banner colors:", error);
    }
  }, [user]);

  // Function to handle color extraction from videos
  const handleColorExtraction = useCallback((bannerId, colors) => {
    if (colors.length > 0) {
      updateBannerColors(bannerId, colors);
    }
  }, [updateBannerColors]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
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
      highlight: false,
    },
    {
      name: "Take Attendance",
      href: "/dashboard/attendance",
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "Mark today's attendance",
      highlight: true,
    },
    {
      name: "Manage Timetable",
      href: "/dashboard/timetable",
      icon: <Calendar className="h-6 w-6 text-primary" />,
      description: "Update class schedules",
      highlight: false,
    },
    {
      name: "Collect Fees",
      href: "/dashboard/manage-fees",
      icon: <Wallet className="h-6 w-6 text-primary" />,
      description: "Record fee payments",
      highlight: false,
    },
  ]

  const notifications = [
    {
      id: 1,
      title: "Attendance marked for Class 10",
      person: "Amit Kumar",
      time: "10 minutes ago",
      icon: <Users className="h-5 w-5 text-primary" />,
      type: "attendance"
    },
    {
      id: 2,
      title: "New timetable created for Class 8",
      person: "Priya Sharma",
      time: "2 hours ago",
      icon: <Calendar className="h-5 w-5 text-primary" />,
      type: "schedule"
    },
    {
      id: 3,
      title: "Fee collected from 5 students",
      person: "Raj Verma",
      time: "Yesterday, 5:30 PM",
      icon: <Wallet className="h-5 w-5 text-primary" />,
      type: "payment"
    },
    {
      id: 4,
      title: "New student admission completed",
      person: "Neha Gupta",
      time: "Yesterday, 11:00 AM",
      icon: <UserPlus className="h-5 w-5 text-primary" />,
      type: "enrollment"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "May 15, 2025",
      time: "10:00 AM - 1:00 PM",
      location: "School Auditorium"
    },
    {
      id: 2,
      title: "Science Exhibition",
      date: "May 20, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "School Grounds"
    },
    {
      id: 3,
      title: "Annual Sports Day",
      date: "June 2, 2025",
      time: "8:00 AM - 5:00 PM",
      location: "Sports Complex"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.displayName || 'Admin'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's what's happening with your school today
            </p>
          </div>
          <div className="flex gap-3">

            <Button
              onClick={() => router.push("/dashboard/settings")}
              className="h-10 text-sm"
            >
              School Settings
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Banner Management Section */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">School Announcements</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Manage important announcements and events</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {banners.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard/preview-banners")}
                      className="flex items-center h-10 text-sm"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View All</span>
                    </Button>
                  )}
                  <Button
                    onClick={() => router.push("/dashboard/add-banner")}
                    className="flex items-center h-10 text-sm"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Add Banner</span>
                  </Button>
                </div>
              </div>

              <Card className="overflow-hidden shadow-md border-0 rounded-xl">
                <CardContent className="p-0">
                  <div className="w-full h-80 md:h-96 lg:h-[28rem]">
                    <BannerSlideshow banners={banners} onColorsExtracted={handleColorExtraction} />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Stats Grid */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">School Overview</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                  <CardHeader className="pb-2 pt-5">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium mr-1">+5</Badge>
                          <p className="text-xs text-gray-500 dark:text-gray-400">new this month</p>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                  <CardHeader className="pb-2 pt-5">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Classes</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalClasses}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Class 5 - 12</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                  <CardHeader className="pb-2 pt-5">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Teachers</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTeachers}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All subjects covered</p>
                      </div>
                      <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
                  <CardHeader className="pb-2 pt-5">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee Collection</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats.feeCollection}</p>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium mr-1">+12%</Badge>
                          <p className="text-xs text-gray-500 dark:text-gray-400">vs last month</p>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-0 rounded-xl overflow-hidden lg:col-span-2">
                  <CardHeader className="pb-2 pt-5">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Average Attendance</p>
                          <p className="text-sm font-bold">{stats.attendance}%</p>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${stats.attendance}%` }}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Academic Performance</p>
                          <p className="text-sm font-bold">{stats.performance}%</p>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${stats.performance}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                  >
                    <Card className={`h-full transition-all duration-300 hover:shadow-md border-0 rounded-xl ${
                      action.highlight
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-l-4 border-l-primary'
                        : 'bg-white dark:bg-gray-800'
                    }`}>
                      <CardContent className="p-5">
                        <div className="mb-4 flex items-center justify-center h-12 w-12 bg-primary/10 rounded-full">
                          {action.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{action.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                        <div className="mt-4 text-primary dark:text-primary flex items-center text-sm font-medium">
                          <span>Get started</span>
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="activities" className="space-y-8">
            {/* Recent Activities */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Latest actions across your school</p>
                </div>
                <Button variant="ghost" onClick={() => router.push("/dashboard/all-activities")}>
                  View all
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {notifications.map((item) => (
                  <Card key={item.id} className="shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                            <div className="flex items-center mt-1 sm:mt-0">
                              <Badge
                                className={`mr-2 px-2 py-0.5 text-xs capitalize ${
                                  item.type === 'attendance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                  item.type === 'schedule' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                                  item.type === 'payment' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' :
                                  'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                                }`}
                              >
                                {item.type}
                              </Badge>
                              <Clock className="h-3 w-3 text-gray-400 mr-1" />
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">By {item.person}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="events" className="space-y-8">
            {/* Upcoming Events */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">School events scheduled for this month</p>
                </div>
                <Button variant="outline" onClick={() => router.push("/dashboard/calendar")}>
                  Full Calendar
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="shadow-sm border-0 rounded-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 pb-3">
                      <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <Award className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}