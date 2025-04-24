'use client'

import Link from 'next/link'
import Button from '../components/ui/Button'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            School Portal Help
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Find answers to common questions about the School Portal
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  How do I add a new teacher?
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  Go to the Dashboard, click on the "Teachers" tab, and then
                  click "Add Teacher". Enter the teacher's email address and a
                  temporary password will be generated.
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  How do I add a new student?
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  Go to the Dashboard, click on the "Students" tab, and then
                  click "Add Student". Fill in the required information (roll
                  number, name, username) and a temporary password will be
                  generated.
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  How can teachers and students log in?
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  Currently, teachers and students can log in through the
                  upcoming mobile application. They will use their
                  email/username and the password provided to them.
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  What is a School Code?
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  A School Code is a unique identifier for your school. You
                  create this when signing up. It can be your school's official
                  code or any unique identifier you prefer.
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  I forgot my password. What can I do?
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  On the sign-in page, click the "Forgot your password?" link
                  and follow the instructions to reset your password.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-500 mb-4">
            Can't find what you're looking for?
          </p>
          <Button>
            <Link href="mailto:support@schoolportal.com">Contact Support</Link>
          </Button>
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="text-primary-600 hover:text-primary-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
