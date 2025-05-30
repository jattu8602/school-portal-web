'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
  Mail,
  Phone,
  Clock,
  Users,
  Award,
  Shield,
  Smartphone,
  Tablet,
  CheckCircle,
  UserCheck,
} from 'lucide-react'
import Link from 'next/link'

// Floating attendance devices
function FloatingDevices() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        >
          {i % 3 === 0 ? (
            <Smartphone className="w-8 h-8 text-black" />
          ) : i % 3 === 1 ? (
            <Tablet className="w-8 h-8 text-black" />
          ) : (
            <UserCheck className="w-8 h-8 text-black" />
          )}
        </div>
      ))}
    </div>
  )
}

// Attendance Dashboard Mockup
function AttendanceDashboard() {
  return (
    <div className="relative">
      <div className="w-80 h-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Today's Attendance</h3>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Present</span>
            </div>
            <span className="text-lg font-bold text-green-600">245</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-red-600"></div>
              <span className="text-sm font-medium">Absent</span>
            </div>
            <span className="text-lg font-bold text-red-600">12</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium">Late</span>
            </div>
            <span className="text-lg font-bold text-yellow-600">8</span>
          </div>
        </div>
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  )
}

export default function ContactSales() {
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      <FloatingDevices />

      <div className="relative z-10 container mx-auto max-w-7xl py-12 md:py-16">
        {/* Header Section */}
        <div className="mx-auto max-w-4xl space-y-6 text-center mb-16">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Contact Our
              <span className="block text-gray-600">Sales Team</span>
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-black rounded-full animate-pulse" />
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Transform your educational institution with PresentSir's
            cutting-edge attendance management technology. Our experts are ready
            to craft the perfect solution for your needs.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 group shadow-lg">
            <CardContent className="flex flex-col items-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Email Us</h3>
                <p className="text-gray-600 mb-6">
                  Direct line to our sales specialists
                </p>
                <a
                  href="mailto:sales@presentsir.in"
                  className="text-black font-semibold hover:text-gray-700 transition-colors text-lg"
                >
                  sales@presentsir.in
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 group shadow-lg">
            <CardContent className="flex flex-col items-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Call Us</h3>
                <p className="text-gray-600 mb-6">
                  Immediate assistance available
                </p>
                <a
                  href="tel:+911234567890"
                  className="text-black font-semibold hover:text-gray-700 transition-colors text-lg"
                >
                  +91 1234 567 890
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 group shadow-lg">
            <CardContent className="flex flex-col items-center p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                <p className="text-gray-600 mb-6">
                  Always here when you need us
                </p>
                <p className="text-black font-semibold">Mon-Fri: 9AM-6PM IST</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-600 text-lg">
                  Ready to revolutionize your institution's attendance
                  management? Let's start the conversation.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="first-name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      First Name
                    </label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      className="bg-white border-gray-300 text-black h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last-name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Last Name
                    </label>
                    <Input
                      id="last-name"
                      placeholder="Smith"
                      className="bg-white border-gray-300 text-black h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Work Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@school.edu"
                    className="bg-white border-gray-300 text-black h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 1234567890"
                    className="bg-white border-gray-300 text-black h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="institution"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Institution Name
                  </label>
                  <Input
                    id="institution"
                    placeholder="ABC School"
                    className="bg-white border-gray-300 text-black h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inquiry-type"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Inquiry Type
                  </label>
                  <Select>
                    <SelectTrigger
                      id="inquiry-type"
                      className="bg-white border-gray-300 text-black h-12"
                    >
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="pricing">
                        Pricing Information
                      </SelectItem>
                      <SelectItem value="product">
                        Product Information
                      </SelectItem>
                      <SelectItem value="implementation">
                        Implementation Support
                      </SelectItem>
                      <SelectItem value="partnership">
                        Partnership Opportunities
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your specific attendance management needs and challenges"
                    rows={4}
                    className="bg-white border-gray-300 text-black"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg font-semibold"
                >
                  Send Message
                </Button>

                <p className="text-center text-sm text-gray-600">
                  By submitting, you agree to our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-black hover:underline"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/terms-of-service"
                    className="text-black hover:underline"
                  >
                    Terms of Service
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <AttendanceDashboard />
            </div>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">
                  Why Choose PresentSir?
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Leading the digital transformation in education with
                  innovative attendance management solutions that deliver real
                  results.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: Users,
                      title: 'Smart Attendance Tracking',
                      desc: 'Automated attendance with offline capabilities',
                    },
                    {
                      icon: Award,
                      title: 'Comprehensive Analytics',
                      desc: 'Detailed insights and performance reports',
                    },
                    {
                      icon: Shield,
                      title: 'Secure & Reliable',
                      desc: 'Enterprise-grade security for your data',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">
                  Trusted by Leading Institutions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Delhi Public School',
                    'Ryan International',
                    'DAV Public School',
                    'Kendriya Vidyalaya',
                  ].map((school, index) => (
                    <div
                      key={index}
                      className="h-20 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-black font-semibold text-center px-2">
                        {school}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
