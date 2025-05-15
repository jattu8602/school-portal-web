"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Home,
  GraduationCap
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Assignments",
    href: "/student/assignments",
    icon: FileText
  },
  {
    name: "Attendance",
    href: "/student/attendance",
    icon: Calendar
  },
  {
    name: "Grades",
    href: "/student/grades",
    icon: BookOpen
  },
  {
    name: "Schedule",
    href: "/student/schedule",
    icon: Calendar
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User
  }
]

// Bottom navigation items for mobile
const bottomNavItems = [
  {
    name: "Assignments",
    href: "/student/assignments",
    icon: FileText
  },
  {
    name: "Attendance",
    href: "/student/attendance",
    icon: Calendar
  },
  {
    name: "Home",
    href: "/student/home",
    icon: Home
  },
  {
    name: "Results",
    href: "/student/grades",
    icon: GraduationCap
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User
  }
]

export default function StudentLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData) {
      router.push('/auth/student/login')
      return
    }
    setUser(userData)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/auth/student/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          <div
            className={cn(
              "fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity",
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div
            className={cn(
              "relative flex w-full max-w-xs flex-1 flex-col bg-white transition-transform",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold">Student Portal</h1>
              </div>
              <nav className="mt-5 space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-4 h-6 w-6 flex-shrink-0",
                        pathname === item.href
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold">Student Portal</h1>
            </div>
            <ScrollArea className="flex-1">
              <nav className="mt-5 space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        pathname === item.href
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <Button
            variant="ghost"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 my-auto">
                {navigation.find(item => item.href === pathname)?.name || "Dashboard"}
              </h2>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="text-sm text-gray-600">
                Welcome, {user.name}
              </div>
            </div>
          </div>
        </div>

        <main className="py-6 pb-20 lg:pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Bottom Navigation for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="grid grid-cols-5 h-16">
            {bottomNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center relative",
                  pathname === item.href
                    ? "text-primary"
                    : "text-gray-600"
                )}
              >
                {item.name === "Home" ? (
                  <div className={cn(
                    "absolute -top-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg",
                    pathname === item.href ? "ring-4 ring-primary/20" : ""
                  )}>
                    <Home className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <item.icon className="h-6 w-6" />
                )}
                <span className={cn(
                  "text-xs mt-1",
                  item.name === "Home" ? "mt-4" : ""
                )}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}