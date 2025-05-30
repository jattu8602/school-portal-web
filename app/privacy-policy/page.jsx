'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Shield,
  Lock,
  Eye,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from 'lucide-react'

// Floating document icons
function FloatingDocuments() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${5 + Math.random() * 2}s`,
          }}
        >
          {i % 3 === 0 ? (
            <Shield className="w-6 h-6 text-black" />
          ) : i % 3 === 1 ? (
            <Lock className="w-6 h-6 text-black" />
          ) : (
            <FileText className="w-6 h-6 text-black" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: FileText,
      title: 'Introduction',
      content:
        'Welcome to PresentSir.in. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and use our attendance management services.',
    },
    {
      icon: Eye,
      title: 'Information We Collect',
      content:
        'We may collect personal information that you voluntarily provide to us when you:',
      list: [
        'Register on our website or create an account',
        'Use our attendance management services',
        'Subscribe to our newsletter or communications',
        'Contact us for support or inquiries',
        'Participate in surveys or feedback forms',
      ],
      additionalContent: 'The personal information we collect may include:',
      additionalList: [
        'Name and contact information',
        'Email address and phone number',
        'Educational institution details',
        'Attendance and academic records',
        'Usage data and preferences',
        'Device and location information (for attendance tracking)',
      ],
    },
    {
      icon: Users,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to:',
      list: [
        'Provide and maintain our attendance management services',
        'Process attendance records and generate reports',
        'Improve our website and service experience',
        'Send notifications regarding attendance and services',
        'Respond to customer service requests and support inquiries',
        'Comply with legal obligations and protect our rights',
        'Analyze usage patterns to enhance our offerings',
      ],
    },
    {
      icon: Shield,
      title: 'Sharing Your Information',
      content:
        'We do not sell, trade, or otherwise transfer your personal information to outside parties, except as described below:',
      list: [
        'Educational Institutions: We share attendance data with authorized school administrators and teachers',
        'Service Providers: We may share information with trusted third-party vendors who perform services on our behalf',
        'Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities',
        'Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred',
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      content:
        'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Our security measures include encryption, secure servers, regular security audits, and compliance with educational data protection standards.',
    },
    {
      icon: Users,
      title: 'Your Rights',
      content:
        'Depending on your location, you may have the following rights regarding your personal information:',
      list: [
        'Access to the personal data we hold about you',
        'Request correction or deletion of your personal data',
        'Object to or restrict the processing of your data',
        'Withdraw consent at any time where processing is based on consent',
        'Data portability rights in certain circumstances',
        'Request attendance record corrections through your institution',
      ],
      additionalContent:
        'To exercise these rights, please contact us at privacy@presentsir.in',
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      <FloatingDocuments />

      <div className="relative z-10 container mx-auto max-w-7xl py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              Privacy
              <span className="block text-gray-600">Policy</span>
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-black rounded-full animate-spin" />
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Effective Date: January 1, 2024
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-black to-gray-600 mx-auto" />
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
                      <ul className="space-y-4 mb-6">
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
                    {section.additionalContent && (
                      <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                        {section.additionalContent}
                      </p>
                    )}
                    {section.additionalList && (
                      <ul className="space-y-4">
                        {section.additionalList.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 bg-gray-600 rounded-full mt-3 flex-shrink-0" />
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

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6" />
                Third-Party Links
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices of these other sites.
                We encourage you to read their privacy policies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Policy Updates
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated effective date. We
                encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-white border-gray-200 mt-16 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
            <p className="text-gray-600 text-lg mb-8 text-center">
              If you have any questions about this Privacy Policy, please don't
              hesitate to contact us:
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-600 mb-2">Email</p>
                <p className="text-black font-semibold text-lg">
                  privacy@presentsir.in
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-600 mb-2">Phone</p>
                <p className="text-black font-semibold text-lg">
                  +91 1234 567 890
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
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
            transform: translateY(-10px) rotate(2deg);
          }
        }

        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
