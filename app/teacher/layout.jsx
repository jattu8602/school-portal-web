"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, BookOpen, MessageSquare, User, Bell, LogOut, Home } from "lucide-react"

export default function TeacherLayout({ children }) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(pathname)

  const menuItems = [
    { icon: <Calendar className="h-6 w-6" />, label: "Attendance", href: "/teacher/attendance" },
    { icon: <BookOpen className="h-6 w-6" />, label: "Assignments", href: "/teacher/assignments" },
    { icon: <Home className="h-6 w-6" />, label: "Home", href: "/teacher/home" },
    { icon: <MessageSquare className="h-6 w-6" />, label: "Chats", href: "/teacher/chats" },
    { icon: <User className="h-6 w-6" />, label: "Profile", href: "/teacher/profile" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 ${
                  pathname === item.href ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
                onClick={() => setActiveTab(item.href)}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}