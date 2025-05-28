'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Home,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  HelpCircle,
  Users,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'

// Floating attendance cards component
function FloatingAttendanceCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        >
          <div className="w-16 h-10 bg-black rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Mobile device mockup
function MobileDeviceMockup() {
  return (
    <div className="relative">
      <div className="w-64 h-96 bg-black rounded-3xl p-2 shadow-2xl">
        <div className="w-full h-full bg-white rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs font-bold">PresentSir</div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="mt-4 h-12 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              Mark Attendance
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-ping"></div>
    </div>
  )
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black overflow-hidden relative">
      <FloatingAttendanceCards />

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Mobile Device Mockup */}
        <div className="flex-1 flex items-center justify-center p-8">
          <MobileDeviceMockup />
        </div>

        {/* Right side - Content */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 space-y-8">
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl lg:text-8xl font-black mb-4 tracking-tight">
                4<span className="text-gray-600">0</span>4
              </h1>
              <h2 className="text-2xl lg:text-4xl font-bold mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
                The page you're looking for has vanished into the digital void.
                Let's get you back on track.
              </p>
            </div>

            {/* Search functionality */}
            <Card className="bg-white border-gray-200 shadow-lg p-6">
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search for what you need
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search our site..."
                    className="bg-white border-gray-300 text-black flex-1"
                  />
                  <Button
                    variant="outline"
                    className="border-gray-300 text-black hover:bg-gray-100"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/">
                <Button className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg font-semibold">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border-gray-300 text-black hover:bg-gray-100 h-12 text-lg"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Popular links */}
            <Card className="bg-white border-gray-200 shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
              <div className="space-y-3">
                <Link
                  href="/contact-sales"
                  className="block text-gray-600 hover:text-gray-700 transition-colors border-b border-gray-200 pb-2"
                >
                  Contact Sales Team
                </Link>
                <Link
                  href="/request-demo"
                  className="block text-gray-600 hover:text-gray-700 transition-colors border-b border-gray-200 pb-2"
                >
                  Request a Demo
                </Link>
                <Link
                  href="/privacy-policy"
                  className="block text-gray-600 hover:text-gray-700 transition-colors border-b border-gray-200 pb-2"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="block text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </Card>

            {/* Contact options */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="bg-white border-gray-200 shadow-lg p-4 flex-1">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email Support</p>
                    <p className="text-black font-medium">help@presentsir.in</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-white border-gray-200 shadow-lg p-4 flex-1">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Call Us</p>
                    <p className="text-black font-medium">+91 1234 567 890</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating help button */}
      <div className="fixed bottom-8 right-8">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-black text-white hover:bg-gray-800 shadow-2xl animate-pulse"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
