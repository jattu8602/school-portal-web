import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FaqSection() {
  return (
    <div className="mt-0 rounded-b-lg border-x border-b bg-white p-6">
      <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
      <p className="text-sm text-gray-500">Find answers to common questions about Present Sir</p>

      <div className="mt-6 space-y-4">
        <FaqItem
          question="How do I add a new class to my school?"
          answer="To add a new class, navigate to the 'Add Class Details' section from the sidebar, then click on the 'Add Class' button in the top right corner. Fill in the required details such as class name, section, and assign a class teacher. You can then add students to this class and assign subject teachers."
        />
        <FaqItem
          question="Can multiple teachers teach different subjects in the same class?"
          answer="Yes, Present Sir fully supports multiple teachers teaching different subjects in the same class. When adding teachers, you can specify which subjects they teach in which classes. This flexibility allows for specialized subject teaching while maintaining clear organization in the system."
        />
        <FaqItem
          question="How does the real-time attendance system work?"
          answer="Our attendance system works in real-time using Firebase's real-time database. When a teacher marks a student present, absent, or late, this information is instantly updated in the database and reflected across all users viewing that information. Parents can receive immediate notifications about their child's attendance status through our notification system."
        />
        <FaqItem
          question="Can I export attendance reports?"
          answer="Yes, you can export attendance reports in various formats including CSV and Excel. Navigate to the Attendance section, select the class and date range, then click on the 'Export' button. You can use these reports for your records or for further analysis in other applications."
        />
        <FaqItem
          question="How do I set up fee schedules for different classes?"
          answer="To set up fee schedules, go to the Manage Fees section, click on 'Create Fee Structure', select the class, and add the fee components with their respective amounts and due dates. You can create different fee structures for different classes and track payments against these schedules."
        />
        <FaqItem
          question="Is there a mobile app available for Present Sir?"
          answer="We are currently developing mobile applications for both Android and iOS platforms. These apps will allow teachers to take attendance on-the-go, and parents to view their children's attendance and performance from their smartphones. Sign up for our newsletter to be notified when the mobile apps are launched."
        />
        <FaqItem
          question="Can I customize the platform for my school's specific needs?"
          answer="Yes, Present Sir offers various customization options. You can configure class structures, attendance categories, grading systems, and more according to your school's requirements. For more advanced customizations, please contact our support team."
        />
        <FaqItem
          question="Is my data secure on Present Sir?"
          answer="Absolutely. We implement industry-standard security measures including data encryption, regular backups, and strict access controls to ensure your school's data remains secure and private. We are compliant with data protection regulations and never share your data with third parties without explicit consent."
        />
      </div>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border hover:shadow-sm transition-shadow">
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-medium">{question}</h3>
        <span className="text-gray-500">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      {isOpen && (
        <div className="border-t p-4">
          <p className="text-sm text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  )
}