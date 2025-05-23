'use client'
import TeamSection from "../components/TeamSection";
import Link from "next/link";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-6">Our Team</h1>
          <p className="text-xl text-gray-600 mt-3 max-w-2xl mx-auto">
            Meet the passionate individuals who make Present Sir possible. Our diverse team brings together expertise in education, technology, and design.
          </p>
        </div>

        {/* Main Team Section */}
        <TeamSection />

        {/* Additional Team Info */}
        <div className="mt-16 bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're always looking for talented individuals passionate about education and technology.
            If you're interested in making a difference in how schools operate, we'd love to hear from you.
          </p>
          

        </div>
      </div>
    </div>
  );
}