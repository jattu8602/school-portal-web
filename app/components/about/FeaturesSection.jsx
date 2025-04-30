import { Check } from "lucide-react"

export default function FeaturesSection() {
  return (
    <div className="mt-0 rounded-b-lg border-x border-b bg-white p-6">
      <h2 className="text-xl font-semibold">Platform Features</h2>
      <p className="text-sm text-gray-500">Discover all the powerful tools Present Sir offers</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Class Management"
          features={[
            "Organize students by class and section",
            "Assign multiple teachers to specific classes",
            "Track class-wise performance metrics",
            "Manage student records efficiently",
          ]}
        />
        <FeatureCard
          title="Attendance Tracking"
          features={[
            "Mark daily attendance with real-time updates",
            "Generate detailed attendance reports",
            "Track attendance patterns over time",
            "Send instant notifications to parents",
          ]}
        />
        <FeatureCard
          title="Timetable Management"
          features={[
            "Create class-specific timetables",
            "Assign subjects and teachers to periods",
            "Handle special schedules and events",
            "View teacher workload distribution",
          ]}
        />
        <FeatureCard
          title="Examination & Grading"
          features={[
            "Record and manage student marks",
            "Generate report cards and transcripts",
            "Analyze performance with visual charts",
            "Track subject-wise progress",
          ]}
        />
        <FeatureCard
          title="Fee Management"
          features={[
            "Generate fee schedules & invoices",
            "Track payments and dues",
            "Support multiple payment methods",
            "Generate financial reports",
          ]}
        />
        <FeatureCard
          title="Communication Tools"
          features={[
            "Send announcements and notices",
            "Parent-teacher messaging system",
            "Event calendar and reminders",
            "Email and SMS notifications",
          ]}
        />
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4">Product Roadmap</h3>
        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">Present Sir Mobile App</h4>
            <p className="mt-1 text-sm text-gray-600">
              Coming soon - A dedicated mobile application for teachers and parents to access all features on the go, including instant notifications and attendance tracking.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">Advanced Analytics Dashboard</h4>
            <p className="mt-1 text-sm text-gray-600">
              In development - Comprehensive analytics tools providing insights into student performance, attendance trends, and financial metrics.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium">Online Learning Integration</h4>
            <p className="mt-1 text-sm text-gray-600">
              Planned - Seamless integration with online learning platforms, allowing schools to manage both physical and virtual classrooms from a single dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, features }) {
  return (
    <div className="rounded-lg border p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium">{title}</h3>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-0.5 flex-shrink-0 text-green-500">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}