'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  Scale,
  User,
  Shield,
  AlertTriangle,
  Gavel,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from 'lucide-react'

// Floating legal icons
function FloatingLegalIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-15"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${6 + Math.random() * 2}s`,
          }}
        >
          {i % 4 === 0 ? (
            <Scale className="w-5 h-5 text-black" />
          ) : i % 4 === 1 ? (
            <Gavel className="w-5 h-5 text-black" />
          ) : i % 4 === 2 ? (
            <Shield className="w-5 h-5 text-black" />
          ) : (
            <FileText className="w-5 h-5 text-black" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function TermsOfService() {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content:
        'By accessing or using PresentSir.in, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website or attendance management services. Your continued use of our platform constitutes acceptance of any updates to these terms.',
    },
    {
      icon: User,
      title: 'Use of the Website and Services',
      content:
        'You agree to use our website and attendance management services for lawful purposes only. You must not:',
      list: [
        'Violate any applicable laws, regulations, or third-party rights',
        'Infringe upon the intellectual property rights of others',
        'Interfere with or disrupt the website, servers, or networks',
        'Attempt to gain unauthorized access to any part of our system',
        'Use our services for any fraudulent or malicious activities',
        'Upload or transmit viruses, malware, or other harmful code',
        'Manipulate attendance records or data without authorization',
      ],
    },
    {
      icon: Shield,
      title: 'Account Registration and Security',
      content:
        'To access our attendance management features, you may need to register for an account. You agree to:',
      list: [
        'Provide accurate, current, and complete information during registration',
        'Keep your account information up to date and accurate',
        'Maintain the security and confidentiality of your login credentials',
        'Accept responsibility for all activities that occur under your account',
        'Notify us immediately of any unauthorized use of your account',
        'Use the attendance system only for legitimate educational purposes',
      ],
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      content:
        'All content on PresentSir.in, including but not limited to text, graphics, logos, images, software, and design elements, is the property of PresentSir.in or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.',
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content:
        'PresentSir.in shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the website or attendance management services. Our total liability shall not exceed the amount paid by you for our services in the twelve months preceding the claim.',
    },
    {
      icon: Shield,
      title: 'Data Protection and Privacy',
      content:
        'You acknowledge that our attendance management services involve the collection and processing of personal data. By using our services, you consent to our data processing practices as outlined in our Privacy Policy. We are committed to protecting student privacy and complying with applicable data protection laws.',
    },
    {
      icon: Gavel,
      title: 'Termination',
      content:
        'We reserve the right to terminate or suspend your access to the website and services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service, is harmful to other users, or is otherwise objectionable. Upon termination, your right to use our services will cease immediately.',
    },
    {
      icon: Globe,
      title: 'Governing Law',
      content:
        'These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India. If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.',
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      <FloatingLegalIcons />

      <div className="relative z-10 container mx-auto max-w-7xl py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              Terms of
              <span className="block text-gray-600">Service</span>
            </h1>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-black rounded-full animate-pulse" />
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
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                      {section.content}
                    </p>
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

        {/* Additional Important Information */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6" />
                Changes to Terms
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may modify these Terms of Service at any time to reflect
                changes in our services, legal requirements, or business
                practices.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Changes will be effective upon posting to the website. Your
                continued use of our services after any changes constitutes
                acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6" />
                Service Availability
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to maintain high availability of our attendance
                management services, but we do not guarantee uninterrupted
                access.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We may temporarily suspend services for maintenance, updates, or
                other operational reasons with or without notice.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-white border-gray-200 mt-16 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Questions About Our Terms?
            </h2>
            <p className="text-gray-600 text-lg mb-8 text-center">
              For any questions regarding these Terms of Service, please contact
              us:
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-600 mb-2">Email</p>
                <p className="text-black font-semibold text-lg">
                  legal@presentsir.in
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
            transform: translateY(-8px) rotate(1deg);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
