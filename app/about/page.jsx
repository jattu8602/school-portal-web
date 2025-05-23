'use client'

import { useState } from 'react'
import {
  MessageCircle,
  FileText,
  Video,
  HelpCircle,
  Github,
  Linkedin,
  Instagram,
  Twitter,
} from 'lucide-react'
import AboutSection from '@/components/about/AboutSection.jsx'
import FeaturesSection from '@/components/about/FeaturesSection.jsx'
import SupportSection from '@/components/about/SupportSection.jsx'
import FaqSection from '@/components/about/FaqSection.jsx'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('about')
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">About Present Sir</h1>
          <p className="text-sm text-gray-500">
            Learn more about our platform and the team behind it
          </p>
        </div>
        <button className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium">
          <MessageCircle className="mr-2 h-4 w-" />
          Contact Support
        </button>
      </div>

      <div className="mt-6 flex space-x-2 border-b bg-white rounded-t-lg px-4">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'about'
              ? 'border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>

        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'features'
              ? 'border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('features')}
        >
          Features
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'support'
              ? 'border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('support')}
        >
          Support
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'faq'
              ? 'border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
      </div>

      {activeTab === 'about' && <AboutSection />}

      {activeTab === 'team' && (
        <div className="mt-0 rounded-b-lg border-x border-b bg-[#0f1219] p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">
              The Talented People Behind the Scenes of the Organization
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {teamMembers.map((member, index) => (
                <TeamCard key={index} member={member} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'features' && <FeaturesSection />}
      {activeTab === 'support' && <SupportSection />}
      {activeTab === 'faq' && <FaqSection />}
    </div>
  )
}
