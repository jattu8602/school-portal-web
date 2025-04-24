'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { addStudent } from '../../../lib/auth'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function StudentManagement({ schoolId }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [addingStudent, setAddingStudent] = useState(false)
  const [newStudentPassword, setNewStudentPassword] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    username: '',
  })

  const fetchStudents = async () => {
    if (!schoolId) return

    setLoading(true)
    try {
      const studentsRef = collection(db, 'schools', schoolId, 'students')
      const studentsSnapshot = await getDocs(studentsRef)
      const studentsList = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setStudents(studentsList)
    } catch (error) {
      console.error('Error fetching students:', error)
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [schoolId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setAddingStudent(true)

    if (!formData.rollNo || !formData.name || !formData.username) {
      setError('Please fill in all fields')
      setAddingStudent(false)
      return
    }

    try {
      const result = await addStudent(
        formData.rollNo,
        formData.name,
        formData.username,
        schoolId
      )

      if (result.success) {
        setNewStudentPassword(result.password)
        setSuccess(`Student added successfully! Password: ${result.password}`)
        setFormData({
          rollNo: '',
          name: '',
          username: '',
        })
        fetchStudents()
      } else {
        setError(result.error || 'Failed to add student. Please try again.')
      }
    } catch (error) {
      console.error('Error adding student:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setAddingStudent(false)
    }
  }

  const handleRemoveStudent = async (rollNo) => {
    if (!confirm('Are you sure you want to remove this student?')) return

    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'students', rollNo))
      setStudents(students.filter((student) => student.id !== rollNo))
      setSuccess('Student removed successfully')
    } catch (error) {
      console.error('Error removing student:', error)
      setError('Failed to remove student. Please try again.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Students</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Student'}
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
          {newStudentPassword && (
            <div className="mt-2">
              <p className="text-sm font-medium">Temporary Password:</p>
              <code className="bg-gray-100 px-2 py-1 rounded">
                {newStudentPassword}
              </code>
              <p className="text-xs mt-1 text-gray-500">
                Please share this password with the student securely.
              </p>
            </div>
          )}
        </div>
      )}

      {isAdding && (
        <form
          onSubmit={handleAddStudent}
          className="mb-8 bg-gray-50 p-4 rounded-md"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Student
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Roll Number"
              id="rollNo"
              name="rollNo"
              placeholder="Enter roll number"
              required
              value={formData.rollNo}
              onChange={handleInputChange}
            />

            <Input
              label="Full Name"
              id="name"
              name="name"
              placeholder="Enter student's full name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />

            <Input
              label="Username"
              id="username"
              name="username"
              placeholder="Enter username"
              required
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={addingStudent}>
              {addingStudent ? 'Adding...' : 'Add Student'}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No students added yet</p>
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
                  Roll Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
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
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.rollNo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {student.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
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
