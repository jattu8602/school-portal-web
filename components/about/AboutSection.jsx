'use client'
import TeamSection from '../TeamSection'

export default function AboutSection() {
  return (
    <div className="mt-0 rounded-b-lg border-x border-b bg-white p-6">
      <h2 className="text-xl font-semibold">Welcome to Present Sir</h2>
      <p className="text-sm text-gray-500">
        The ultimate school management solution
      </p>

      {/* Team Section */}
      <section className="mt-8">
        <TeamSection />
      </section>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Our Story</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Present Sir was founded with a simple mission: to transform the way
          schools manage their day-to-day operations, especially attendance
          tracking. We recognize that teachers spend valuable time on
          administrative tasks that could be better utilized for education. Our
          platform streamlines these processes, freeing educators to focus on
          what matters most - teaching and nurturing students.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          The idea for Present Sir was born out of our founder's experience in
          the education sector, where he witnessed firsthand the challenges
          faced by schools in managing attendance, tracking student performance,
          and communicating with parents. By leveraging technology, we've
          created an intuitive platform that addresses these pain points while
          being accessible to schools of all sizes.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-6 md:grid-cols-3">
        <div className="text-center">
          <h3 className="text-3xl font-bold">500+</h3>
          <p className="text-sm text-gray-500">Schools using our platform</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold">50,000+</h3>
          <p className="text-sm text-gray-500">Students managed</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold">5,000+</h3>
          <p className="text-sm text-gray-500">Teachers empowered</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium">Our Mission</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          At Present Sir, we believe that every educational institution deserves
          access to powerful, intuitive management tools. Our mission is to
          streamline administrative processes, enhance communication between
          stakeholders, and provide valuable insights through data analytics,
          ultimately contributing to better educational outcomes for students.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium">What Makes Us Different</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700">
              Real-time Attendance Tracking
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Our attendance system works in real-time, allowing parents to
              receive instant notifications when their children arrive at school
              or miss classes.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-700">
              User-Friendly Interface
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              We've designed our platform with simplicity in mind, ensuring that
              users of all technical abilities can navigate and utilize the
              system effectively.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-700">
              Comprehensive Reporting
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Generate detailed reports on attendance, academic performance, and
              fee collection to make data-driven decisions.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-700">
              Integrated Communication
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Our platform connects parents, teachers, and administrators
              through a unified communication system, enhancing collaboration.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-lg font-medium">Our Values</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🚀</div>
            <h4 className="font-medium">Innovation</h4>
            <p className="mt-1 text-sm text-gray-600">
              We constantly innovate to provide cutting-edge solutions for
              educational institutions.
            </p>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-2">🤝</div>
            <h4 className="font-medium">Reliability</h4>
            <p className="mt-1 text-sm text-gray-600">
              We build dependable systems that schools can trust day in and day
              out.
            </p>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="font-medium">Simplicity</h4>
            <p className="mt-1 text-sm text-gray-600">
              We believe that powerful technology should also be simple and
              accessible.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Our Team
            </h2>
            <TeamSection />
          </section> */}
    </div>
  )
}
