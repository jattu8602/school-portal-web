'use client'

import { useState, useEffect } from 'react'
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { addTeacher } from '../../../lib/auth'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function TeacherManagement({ schoolId }) {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newTeacherEmail, setNewTeacherEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [addingTeacher, setAddingTeacher] = useState(false)
  const [newTeacherPassword, setNewTeacherPassword] = useState('')

  const fetchTeachers = async () => {
    if (!schoolId) return

    setLoading(true)
    try {
      const teachersRef = collection(db, 'schools', schoolId, 'teachers')
      const teachersSnapshot = await getDocs(teachersRef)
      const teachersList = teachersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTeachers(teachersList)
    } catch (error) {
      console.error('Error fetching teachers:', error)
      setError('Failed to load teachers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [schoolId])

  const handleAddTeacher = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setAddingTeacher(true)

    if (!newTeacherEmail || !newTeacherEmail.includes('@')) {
      setError('Please enter a valid email address')
      setAddingTeacher(false)
      return
    }

    try {
      const result = await addTeacher(newTeacherEmail, schoolId)

      if (result.success) {
        setNewTeacherPassword(result.password)
        setSuccess(`Teacher added successfully! Password: ${result.password}`)
        setNewTeacherEmail('')
        fetchTeachers()
      } else {
        setError(result.error || 'Failed to add teacher. Please try again.')
      }
    } catch (error) {
      console.error('Error adding teacher:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setAddingTeacher(false)
    }
  }

  const handleRemoveTeacher = async (teacherEmail) => {
    if (!confirm('Are you sure you want to remove this teacher?')) return

    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'teachers', teacherEmail))
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherEmail))
      setSuccess('Teacher removed successfully')
    } catch (error) {
      console.error('Error removing teacher:', error)
      setError('Failed to remove teacher. Please try again.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Teachers</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Teacher'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <p className="text-sm text-green-700">{success}</p>
          {newTeacherPassword && (
            <div className="mt-2">
              <p className="text-sm font-medium">Temporary Password:</p>
              <code className="bg-gray-100 px-2 py-1 rounded">
                {newTeacherPassword}
              </code>
              <p className="text-xs mt-1 text-gray-500">
                Please share this password with the teacher securely.
              </p>
            </div>
          )}
        </div>
      )}

      {isAdding && (
        <form
          onSubmit={handleAddTeacher}
          className="mb-8 bg-gray-50 p-4 rounded-md"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Teacher
          </h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                label="Teacher Email"
                type="email"
                id="teacherEmail"
                name="teacherEmail"
                placeholder="Enter teacher's email address"
                required
                value={newTeacherEmail}
                onChange={(e) => setNewTeacherEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={addingTeacher}>
              {addingTeacher ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading teachers...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No teachers added yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Added On
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {teacher.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {teacher.createdAt
                        ? new Date(
                            teacher.createdAt.seconds * 1000
                          ).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveTeacher(teacher.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
