'use client'

import { useState, useEffect } from 'react'
import { Pencil, Plus, Users, X, Save, Trash2 } from "lucide-react"
import { auth, db } from '../../../lib/firebase'
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function TeachersPage() {
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const router = useRouter()

  // Form state for adding a teacher
  const [teacherFormData, setTeacherFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    gender: 'male'
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchTeachers(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchTeachers = async (schoolId) => {
    try {
      const teachersCol = collection(db, 'schools', schoolId, 'teachers')
      const teachersQuery = query(teachersCol, orderBy('fullName'))
      const teachersSnapshot = await getDocs(teachersQuery)

      const teachersData = teachersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTeachers(teachersData)
    } catch (err) {
      console.error('Error fetching teachers:', err)
    }
  }

  const handleTeacherFormChange = (e) => {
    const { name, value } = e.target
    setTeacherFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generatePassword = () => {
    // Generate a random 8 character password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleSubmitTeacher = async (e) => {
    e.preventDefault()

    try {
      if (!user) return

      // Validate email format
      if (!teacherFormData.email.includes('@')) {
        alert('Please enter a valid email address')
        return
      }

      // Generate a password for the teacher
      const password = generatePassword()

      // Generate a unique ID from email
      const teacherId = teacherFormData.email.toLowerCase().replace(/[^a-z0-9]/g, '')

      // Check if the teacher already exists
      const teacherRef = doc(db, 'schools', user.uid, 'teachers', teacherId)

      // Save teacher to Firestore
      await setDoc(teacherRef, {
        fullName: teacherFormData.fullName,
        email: teacherFormData.email.toLowerCase(),
        phone: teacherFormData.phone,
        subject: teacherFormData.subject,
        qualification: teacherFormData.qualification,
        gender: teacherFormData.gender,
        password: password,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Reset form and close modal
      setTeacherFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        gender: 'male'
      })
      setShowAddTeacherModal(false)
      fetchTeachers(user.uid)
    } catch (err) {
      console.error('Error adding teacher:', err)
      alert('Failed to add teacher: ' + err.message)
    }
  }

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher)
    setTeacherFormData({
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone || '',
      subject: teacher.subject || '',
      qualification: teacher.qualification || '',
      gender: teacher.gender || 'male'
    })
    setShowEditTeacherModal(true)
  }

  const handleUpdateTeacher = async (e) => {
    e.preventDefault()

    try {
      if (!user || !selectedTeacher) return

      // Validate email format
      if (!teacherFormData.email.includes('@')) {
        alert('Please enter a valid email address')
        return
      }

      // Update teacher in Firestore
      await setDoc(doc(db, 'schools', user.uid, 'teachers', selectedTeacher.id), {
        fullName: teacherFormData.fullName,
        email: teacherFormData.email.toLowerCase(),
        phone: teacherFormData.phone,
        subject: teacherFormData.subject,
        qualification: teacherFormData.qualification,
        gender: teacherFormData.gender,
        updatedAt: serverTimestamp()
      }, { merge: true })

      // Reset form and close modal
      setTeacherFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        gender: 'male'
      })
      setShowEditTeacherModal(false)
      setSelectedTeacher(null)
      fetchTeachers(user.uid)
    } catch (err) {
      console.error('Error updating teacher:', err)
      alert('Failed to update teacher: ' + err.message)
    }
  }

  const deleteTeacher = async (teacherId) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return

    try {
      await deleteDoc(doc(db, 'schools', user.uid, 'teachers', teacherId))
      fetchTeachers(user.uid)
    } catch (err) {
      console.error('Error deleting teacher:', err)
      alert('Failed to delete teacher: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <p className="text-sm text-gray-500">Manage your school teachers.</p>
        </div>
        <button
          onClick={() => setShowAddTeacherModal(true)}
          className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onEdit={() => handleEditTeacher(teacher)}
            onDelete={() => deleteTeacher(teacher.id)}
          />
        ))}

        {teachers.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No teachers added yet. Click "Add Teacher" to create your first teacher account.</p>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Teacher</h3>
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTeacher}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={teacherFormData.fullName}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's full name"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={teacherFormData.email}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's email"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={teacherFormData.phone}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's phone number"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={teacherFormData.subject}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter subject taught"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={teacherFormData.qualification}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's qualification"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={teacherFormData.gender}
                    onChange={handleTeacherFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditTeacherModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Teacher</h3>
              <button
                onClick={() => setShowEditTeacherModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeacher}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={teacherFormData.fullName}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's full name"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={teacherFormData.email}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's email"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={teacherFormData.phone}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's phone number"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={teacherFormData.subject}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter subject taught"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={teacherFormData.qualification}
                    onChange={handleTeacherFormChange}
                    placeholder="Enter teacher's qualification"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={teacherFormData.gender}
                    onChange={handleTeacherFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditTeacherModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Update Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TeacherCard({ teacher, onEdit, onDelete }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{teacher.fullName}</h3>
        <div className="flex space-x-2">
          <button
            className="rounded-full p-1 hover:bg-gray-100"
            title="Edit teacher"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
          <button
            className="rounded-full p-1 hover:bg-gray-100"
            title="Delete teacher"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">Subject: {teacher.subject}</p>
      <p className="mt-1 text-sm text-gray-500">Email: {teacher.email}</p>
      {teacher.phone && (
        <p className="mt-1 text-sm text-gray-500">Phone: {teacher.phone}</p>
      )}
      {teacher.qualification && (
        <p className="mt-1 text-sm text-gray-500">Qualification: {teacher.qualification}</p>
      )}

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Login Details:</span>
          <div className="flex-1 text-right">
            <span className="text-xs bg-gray-100 rounded px-2 py-1">
              Password: <span className="font-mono">{teacher.password}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
