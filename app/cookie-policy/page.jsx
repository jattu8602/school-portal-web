'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Cookie,
  Shield,
  Eye,
  Settings,
  Users,
  FileText,
  CheckCircle,
} from 'lucide-react'

// Floating cookie icons
function FloatingCookieIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
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
          {i % 4 === 0 ? (
            <Cookie className="w-4 h-4 text-black" />
          ) : i % 4 === 1 ? (
            <Shield className="w-4 h-4 text-black" />
          ) : i % 4 === 2 ? (
            <Settings className="w-4 h-4 text-black" />
          ) : (
            <Eye className="w-4 h-4 text-black" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CookiePolicy() {
  const sections = [
    {
      icon: Cookie,
      title: 'What Are Cookies?',
      content:
        'Cookies are small text files stored on your device when you visit a website. They help us understand user behavior, remember preferences, and improve your experience on our attendance management platform.',
    },
    {
      icon: Eye,
      title: 'How We Use Cookies',
      content: 'We use cookies to:',
      list: [
        'Remember your login details and attendance preferences',
        'Understand how you navigate and use our website',
        'Personalize your experience and content',
        'Provide relevant notifications and recommendations',
        'Analyze website performance and user behavior',
        'Maintain session security for attendance data',
      ],
    },
    {
      icon: Shield,
      title: 'Types of Cookies We Use',
      list: [
        'Essential Cookies: Necessary for the website to function properly and securely',
        'Performance Cookies: Collect anonymous information about how you use our website',
        'Functionality Cookies: Remember your preferences and personalize your experience',
        'Analytics Cookies: Help us understand attendance system usage patterns',
      ],
    },
    {
      icon: Users,
      title: 'Third-Party Cookies',
      content:
        'We may allow trusted third-party service providers to place cookies on your device for analytics, enhanced functionality, and security purposes. These partners follow strict privacy guidelines and educational data protection standards.',
    },
    {
      icon: Settings,
      title: 'Managing Cookies',
      content:
        'You have full control over cookies through your browser settings. You can accept, reject, or delete cookies at any time. Please note that disabling certain cookies may affect website functionality and attendance tracking features.',
    },
    {
      icon: FileText,
      title: 'Policy Updates',
      content:
        'We may update this Cookie Policy periodically to reflect changes in our practices or legal requirements. Any changes will be posted on this page with an updated effective date.',
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      <FloatingCookieIcons />

      <div className="relative z-10 container mx-auto max-w-7xl py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              Cookie
              <span className="block text-gray-600">Policy</span>
            </h1>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full animate-bounce" />
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Effective Date: January 1, 2024
          </p>
          <div className="w-24 h-1 bg-black mx-auto" />
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <Card
              key={index}
              className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-lg"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-6 text-black">
                      {index + 1}. {section.title}
                    </h2>
                    {section.content && (
                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        {section.content}
                      </p>
                    )}
                    {section.list && (
                      <ul className="space-y-4">
                        {section.list.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-lg leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="bg-white border-gray-200 mt-16 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Questions About Our Cookie Policy?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              If you have any questions about our use of cookies or this policy,
              we're here to help.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-600 mb-2">Email</p>
                <p className="text-black font-semibold text-lg">
                  privacy@presentsir.in
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Phone</p>
                <p className="text-black font-semibold text-lg">
                  +91 1234 567 890
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Address</p>
                <p className="text-black font-semibold text-lg">
                  New Delhi, India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors text-lg font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(2deg);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
