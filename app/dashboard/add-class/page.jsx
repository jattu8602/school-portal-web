'use client'

import { useState } from 'react'
import { auth, db } from '../../../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function AddClass() {
  const [formData, setFormData] = useState({
    className: '',
    teacherName: '',
    teacherEmail: '',
    teacherPhone: '',
    subject: '',
    totalStudents: 0,
    boys: 0,
    girls: 0,
    startRollNumber: 1,
    endRollNumber: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const user = auth.currentUser
      if (!user) throw new Error('You must be logged in to add a class')

      // Add the class to Firestore
      const classRef = await addDoc(collection(db, 'classes'), {
        ...formData,
        schoolId: user.uid,
        createdAt: new Date().toISOString(),
      })

      setSuccess(true)
      setFormData({
        className: '',
        teacherName: '',
        teacherEmail: '',
        teacherPhone: '',
        subject: '',
        totalStudents: 0,
        boys: 0,
        girls: 0,
        startRollNumber: 1,
        endRollNumber: 1,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Class</h1>
        <p className="mt-2 text-gray-600">
          Create a new class and assign a teacher
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Class Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="e.g., Class 5A"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Teacher Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Teacher Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher's Name
                </label>
                <input
                  type="text"
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher's Email
                </label>
                <input
                  type="email"
                  name="teacherEmail"
                  value={formData.teacherEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher's Phone
                </label>
                <input
                  type="tel"
                  name="teacherPhone"
                  value={formData.teacherPhone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Student Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Students
                </label>
                <input
                  type="number"
                  name="totalStudents"
                  value={formData.totalStudents}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boys
                </label>
                <input
                  type="number"
                  name="boys"
                  value={formData.boys}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Girls
                </label>
                <input
                  type="number"
                  name="girls"
                  value={formData.girls}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Roll Number Range */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Roll Number Range</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Roll Number
                </label>
                <input
                  type="number"
                  name="startRollNumber"
                  value={formData.startRollNumber}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Roll Number
                </label>
                <input
                  type="number"
                  name="endRollNumber"
                  value={formData.endRollNumber}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              Class added successfully!
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding Class...' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
