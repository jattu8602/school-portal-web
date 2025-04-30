import { FileText, Video, HelpCircle, MessageCircle, Mail, Phone, MapPin } from "lucide-react"

export default function SupportSection() {
  return (
    <div className="mt-0 rounded-b-lg border-x border-b bg-white p-6">
      <h2 className="text-xl font-semibold">Support Resources</h2>
      <p className="text-sm text-gray-500">Get help and learn how to use Present Sir effectively</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="mr-4 rounded-lg bg-blue-50 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Documentation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive guides and tutorials to help you make the most of Present Sir
              </p>
              <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50">
                View Documentation
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="mr-4 rounded-lg bg-purple-50 p-3">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Video Tutorials</h3>
              <p className="mt-1 text-sm text-gray-500">
                Step-by-step video guides covering all features of the platform
              </p>
              <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50">
                Watch Tutorials
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="mr-4 rounded-lg bg-green-50 p-3">
              <HelpCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Knowledge Base</h3>
              <p className="mt-1 text-sm text-gray-500">
                Find answers to common questions and troubleshooting guides
              </p>
              <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50">
                Browse Knowledge Base
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="mr-4 rounded-lg bg-red-50 p-3">
              <MessageCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Customer Support</h3>
              <p className="mt-1 text-sm text-gray-500">
                Contact our dedicated support team for personalized assistance
              </p>
              <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t pt-8">
        <h3 className="text-lg font-medium mb-6">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="mr-3 flex-shrink-0 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Email</h4>
              <p className="mt-1 text-gray-600">support@presentsir.com</p>
              <p className="text-gray-600">info@presentsir.com</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="mr-3 flex-shrink-0 text-blue-600">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Phone</h4>
              <p className="mt-1 text-gray-600">+91 9876543210</p>
              <p className="text-gray-600">+91 1234567890</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="mr-3 flex-shrink-0 text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Office</h4>
              <p className="mt-1 text-gray-600">123 Tech Park, Sector 15</p>
              <p className="text-gray-600">Noida, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium">Support Hours</h3>
        <p className="mt-2 text-sm text-gray-600">
          Our support team is available Monday through Friday, 9:00 AM to 6:00 PM IST.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          For urgent matters outside of these hours, please email us at urgent@presentsir.com.
        </p>
      </div>
    </div>
  )
}