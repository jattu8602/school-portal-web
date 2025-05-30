'use client'

import Link from 'next/link'
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
  CheckCircle,
  Play,
  Users,
  BarChart,
  Smartphone,
  Calendar,
  Clock,
  Award,
  UserCheck,
  Monitor,
  Star,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  HeadphonesIcon,
} from 'lucide-react'
import LazySection from '@/app/components/LazySection'
import PerformanceMonitor from '@/app/components/PerformanceMonitor'

// Floating attendance icons with better positioning
function FloatingAttendanceIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-10"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 12}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${6 + (i % 3)}s`,
          }}
        >
          {i % 4 === 0 ? (
            <UserCheck className="w-8 h-8 text-black" />
          ) : i % 4 === 1 ? (
            <Smartphone className="w-8 h-8 text-black" />
          ) : i % 4 === 2 ? (
            <BarChart className="w-8 h-8 text-black" />
          ) : (
            <Monitor className="w-8 h-8 text-black" />
          )}
        </div>
      ))}
    </div>
  )
}

// Enhanced Demo Preview Component
function DemoPreview() {
  return (
    <div className="relative w-full max-w-[320px] sm:max-w-md mx-auto">
      {/* Main Demo Screen */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-24 h-24 sm:w-32 sm:h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-24 sm:h-24 border border-white/20 rounded-full"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">PresentSir</h3>
              <p className="text-gray-300 text-xs sm:text-sm">Live Demo</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">LIVE</span>
            </div>
          </div>

          {/* Demo Features */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/20">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    Smart Attendance
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Real-time tracking
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-300">Present Today:</span>
                <span className="text-green-400 font-bold">245 students</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/20">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    Analytics Dashboard
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Comprehensive insights
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-300">Attendance Rate:</span>
                <span className="text-blue-400 font-bold">94.2%</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/20">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    Mobile Access
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    iOS & Android apps
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-300">Active Users:</span>
                <span className="text-purple-400 font-bold">1,247</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-3 -right-3 w-8 h-8 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
        <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="absolute -bottom-3 -left-3 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  )
}

// Feature Cards Component
function FeatureCards() {
  const features = [
    {
      icon: Users,
      title: 'Smart Attendance Tracking',
      description:
        'Automated attendance with QR codes, biometric integration, and offline sync capabilities.',
      highlight: '99.9% Accuracy',
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description:
        'Real-time dashboards, attendance patterns, and automated report generation.',
      highlight: 'Real-time Insights',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description:
        'Enterprise-grade security with GDPR compliance and data encryption.',
      highlight: 'Bank-level Security',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description:
        'Native iOS and Android apps with offline functionality and push notifications.',
      highlight: 'Cross-platform',
    },
  ]

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 group"
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <feature.icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <h3 className="text-lg sm:text-xl font-bold">
                    {feature.title}
                  </h3>
                  <span className="px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {feature.highlight}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Demo Benefits Component
function DemoBenefits() {
  const benefits = [
    'Personalized walkthrough of the PresentSir platform',
    'Live demonstration of attendance tracking features',
    'Custom analytics and reporting showcase',
    'Mobile app demonstration on your device',
    'Integration possibilities with your existing systems',
    'Q&A session with our product specialists',
    'Custom implementation roadmap for your institution',
    'Pricing and deployment timeline discussion',
  ]

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Play className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">What You'll Experience</h3>
            <p className="text-gray-600">
              Comprehensive 30-minute demo session
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700 leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Stats Component
function DemoStats() {
  const stats = [
    { icon: Clock, value: '30', label: 'Minutes Demo', color: 'bg-blue-500' },
    {
      icon: Calendar,
      value: '24h',
      label: 'Response Time',
      color: 'bg-green-500',
    },
    {
      icon: Star,
      value: '4.9',
      label: 'Customer Rating',
      color: 'bg-yellow-500',
    },
    {
      icon: HeadphonesIcon,
      value: '24/7',
      label: 'Support Available',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-white border-gray-200 text-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <CardContent className="p-6">
            <div
              className={`w-14 h-14 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <stat.icon className="h-7 w-7 text-white" />
            </div>
            <div className="text-3xl font-black mb-2">{stat.value}</div>
            <div className="text-gray-600 text-sm font-medium">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function RequestDemo() {
  return (
    <div className="min-h-screen bg-white text-black relative">
      <PerformanceMonitor />
      <FloatingAttendanceIcons />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl py-8 md:py-16">
        {/* Hero Section */}
        <section className="container px-4 sm:px-6 py-8 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 md:mb-6">
                Experience PresentSir
                <span className="block text-gray-600">in Action</span>
              </h1>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full animate-ping" />
            </div>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8">
              See how our comprehensive attendance management system can
              transform your institution with cutting-edge technology and
              innovative solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 text-green-700 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Free 30-min Demo</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">No Setup Required</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 text-purple-700 rounded-full">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Available Worldwide</span>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Preview Section - Lazy loaded */}
        <LazySection className="container px-4 sm:px-6 pb-8 md:pb-16">
          <div className="flex justify-center mb-12 md:mb-16">
            <DemoPreview />
          </div>
        </LazySection>

        {/* Features Section - Lazy loaded */}
        <LazySection className="container px-4 sm:px-6 pb-8 md:pb-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Why Choose PresentSir?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make us the leading attendance
              management solution
            </p>
          </div>
          <FeatureCards />
        </LazySection>

        {/* Stats Section - Lazy loaded */}
        <LazySection className="container px-4 sm:px-6 pb-8 md:pb-16">
          <DemoStats />
        </LazySection>

        {/* Main Content Section - Lazy loaded */}
        <LazySection className="container px-4 sm:px-6 pb-8 md:pb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Demo Benefits */}
            <div className="space-y-6 md:space-y-8">
              <DemoBenefits />

              {/* Testimonial */}
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base md:text-lg">
                        Dr. Priya Sharma
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        Principal, Delhi Public School
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic text-base md:text-lg leading-relaxed">
                    "PresentSir transformed our attendance management
                    completely. The demo showed us exactly how it would work for
                    our 2,000+ students. Implementation was seamless!"
                  </blockquote>
                  <div className="flex items-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Demo Form */}
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                    Request Your Free Demo
                  </h2>
                  <p className="text-base md:text-lg text-gray-600">
                    Fill out the form below and our team will contact you within
                    24 hours to schedule your personalized demonstration.
                  </p>
                </div>

                <form className="space-y-4 md:space-y-6">
                  <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        First Name *
                      </label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        className="bg-white border-gray-300 text-black h-12 md:h-12 min-h-[48px] touch-manipulation"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Last Name *
                      </label>
                      <Input
                        id="last-name"
                        placeholder="Smith"
                        className="bg-white border-gray-300 text-black h-12 md:h-12 min-h-[48px] touch-manipulation"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Work Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@school.edu"
                      className="bg-white border-gray-300 text-black h-12 md:h-12 min-h-[48px] touch-manipulation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 1234567890"
                      className="bg-white border-gray-300 text-black h-12 md:h-12 min-h-[48px] touch-manipulation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="institution"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Institution Name *
                    </label>
                    <Input
                      id="institution"
                      placeholder="ABC School"
                      className="bg-white border-gray-300 text-black h-12 md:h-12 min-h-[48px] touch-manipulation"
                      required
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="role"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Your Role *
                      </label>
                      <Select>
                        <SelectTrigger
                          id="role"
                          className="bg-white border-gray-300 text-black h-12 md:h-12 min-h-[48px] touch-manipulation"
                        >
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="principal">Principal</SelectItem>
                          <SelectItem value="administrator">
                            Administrator
                          </SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="it-manager">IT Manager</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="institution-size"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Institution Size *
                      </label>
                      <Select>
                        <SelectTrigger
                          id="institution-size"
                          className="bg-white border-gray-300 text-black h-12 md:h-12 min-h-[48px] touch-manipulation"
                        >
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="less-than-100">
                            Less than 100 students
                          </SelectItem>
                          <SelectItem value="100-500">
                            100-500 students
                          </SelectItem>
                          <SelectItem value="501-1000">
                            501-1000 students
                          </SelectItem>
                          <SelectItem value="1001-5000">
                            1001-5000 students
                          </SelectItem>
                          <SelectItem value="more-than-5000">
                            More than 5000 students
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Tell us about your needs
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Describe your current attendance challenges and what you'd like to see in the demo..."
                      rows={4}
                      className="bg-white border-gray-300 text-black min-h-[96px] touch-manipulation"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 h-12 md:h-14 text-base md:text-lg font-semibold group min-h-[48px] touch-manipulation"
                  >
                    Request Demo
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600">
                      By submitting this form, you agree to our{' '}
                      <Link
                        href="/privacy-policy"
                        className="text-black hover:underline font-medium inline-block min-h-[44px] py-1 touch-manipulation"
                      >
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/terms-of-service"
                        className="text-black hover:underline font-medium inline-block min-h-[44px] py-1 touch-manipulation"
                      >
                        Terms of Service
                      </Link>
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      🔒 Your information is secure and will never be shared
                      with third parties
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </LazySection>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        }
      `}</style>
    </div>
  )
}
