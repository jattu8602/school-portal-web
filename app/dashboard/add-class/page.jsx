'use client'

import { useState, useEffect } from 'react'
import { Pencil, Plus, Users, X, Save } from "lucide-react"
import { auth, db } from '../../../lib/firebase'
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function ClassesPage() {
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Form state for adding a class
  const [classFormData, setClassFormData] = useState({
    name: '',
    section: '',
    classTeacher: '',
    totalStudents: '',
    boys: '',
    girls: '',
    roomNumber: ''
  })

  // State for bulk student addition
  const [studentFormData, setStudentFormData] = useState({
    startRollNo: 1,
    students: [{ name: '', rollNo: 1, username: '', gender: 'male' }]
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchClasses(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchClasses = async (schoolId) => {
    try {
      const classesCol = collection(db, 'schools', schoolId, 'classes')
      const classesQuery = query(classesCol, orderBy('name'))
      const classesSnapshot = await getDocs(classesQuery)

      const classesData = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setClasses(classesData)
    } catch (err) {
      console.error('Error fetching classes:', err)
    }
  }

  const handleClassFormChange = (e) => {
    const { name, value } = e.target
    setClassFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitClass = async (e) => {
    e.preventDefault()

    try {
      if (!user) return

      // Create a unique class ID
      const classId = `${classFormData.name}_${classFormData.section}`.replace(/\s+/g, '_').toLowerCase()

      // Save class to Firestore
      await setDoc(doc(db, 'schools', user.uid, 'classes', classId), {
        name: classFormData.name,
        section: classFormData.section,
        classTeacher: classFormData.classTeacher,
        totalStudents: parseInt(classFormData.totalStudents) || 0,
        boys: parseInt(classFormData.boys) || 0,
        girls: parseInt(classFormData.girls) || 0,
        roomNumber: classFormData.roomNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Reset form and close modal
      setClassFormData({
        name: '',
        section: '',
        classTeacher: '',
        totalStudents: '',
        boys: '',
        girls: '',
        roomNumber: ''
      })
      setShowAddClassModal(false)
      fetchClasses(user.uid)
    } catch (err) {
      console.error('Error adding class:', err)
      alert('Failed to add class: ' + err.message)
    }
  }

  const openAddStudentsModal = (classData) => {
    setSelectedClass(classData)

    // Initialize student form with the first roll number
    const startRollNo = 1
    setStudentFormData({
      startRollNo,
      students: [{ name: '', rollNo: startRollNo, username: '', gender: 'male' }]
    })

    setShowAddStudentsModal(true)
  }

  const addStudentRow = () => {
    const lastRollNo = studentFormData.students[studentFormData.students.length - 1].rollNo
    setStudentFormData(prev => ({
      ...prev,
      students: [
        ...prev.students,
        { name: '', rollNo: lastRollNo + 1, username: '', gender: 'male' }
      ]
    }))
  }

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...studentFormData.students]
    updatedStudents[index] = {
      ...updatedStudents[index],
      [field]: field === 'rollNo' ? parseInt(value) : value
    }
    setStudentFormData(prev => ({
      ...prev,
      students: updatedStudents
    }))
  }

  const removeStudentRow = (index) => {
    if (studentFormData.students.length === 1) return

    const updatedStudents = studentFormData.students.filter((_, i) => i !== index)
    setStudentFormData(prev => ({
      ...prev,
      students: updatedStudents
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

  const handleSubmitStudents = async (e) => {
    e.preventDefault()

    try {
      if (!user || !selectedClass) return

      // Add students to Firestore
      const batch = []
      for (const student of studentFormData.students) {
        if (!student.name) continue // Skip empty names

        const password = generatePassword()
        const username = student.username || student.name.toLowerCase().replace(/\s+/g, '.') + student.rollNo

        // Create student document
        batch.push(
          setDoc(doc(db, 'schools', user.uid, 'students', student.rollNo.toString()), {
            name: student.name,
            rollNo: student.rollNo,
            username: username,
            password: password,
            gender: student.gender,
            classId: selectedClass.id,
            className: selectedClass.name,
            section: selectedClass.section,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        )
      }

      // Execute all operations
      await Promise.all(batch)

      // Update class student count
      const totalStudents = parseInt(selectedClass.totalStudents) + studentFormData.students.length
      const boys = parseInt(selectedClass.boys) + studentFormData.students.filter(s => s.gender === 'male').length
      const girls = parseInt(selectedClass.girls) + studentFormData.students.filter(s => s.gender === 'female').length

      await setDoc(doc(db, 'schools', user.uid, 'classes', selectedClass.id), {
        totalStudents,
        boys,
        girls,
        updatedAt: serverTimestamp()
      }, { merge: true })

      alert(`${studentFormData.students.length} students added successfully!`)
      setShowAddStudentsModal(false)
      fetchClasses(user.uid)
    } catch (err) {
      console.error('Error adding students:', err)
      alert('Failed to add students: ' + err.message)
    }
  }

  const deleteClass = async (classId) => {
    if (!confirm('Are you sure you want to delete this class? This will not delete the associated students.')) return

    try {
      await deleteDoc(doc(db, 'schools', user.uid, 'classes', classId))
      fetchClasses(user.uid)
    } catch (err) {
      console.error('Error deleting class:', err)
      alert('Failed to delete class: ' + err.message)
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
          <h1 className="text-2xl font-semibold">Classes</h1>
          <p className="text-sm text-gray-500">Manage your school classes, teachers, and students.</p>
        </div>
        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </button>
      </div>

      <div className="mt-6 flex space-x-2 border-b">
        <button className="border-b-2 border-gray-900 px-4 py-2 text-sm font-medium">All Classes</button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classData) => (
          <ClassCard
            key={classData.id}
            classData={classData}
            onAddStudents={() => openAddStudentsModal(classData)}
            onDelete={() => deleteClass(classData.id)}
          />
        ))}

        {classes.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No classes added yet. Click "Add Class" to create your first class.</p>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Class</h3>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitClass}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={classFormData.name}
                      onChange={handleClassFormChange}
                      placeholder="e.g. Class 5"
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={classFormData.section}
                      onChange={handleClassFormChange}
                      placeholder="e.g. A"
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Teacher Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="classTeacher"
                    value={classFormData.classTeacher}
                    onChange={handleClassFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Students
                    </label>
                    <input
                      type="number"
                      name="totalStudents"
                      value={classFormData.totalStudents}
                      onChange={handleClassFormChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Boys
                    </label>
                    <input
                      type="number"
                      name="boys"
                      value={classFormData.boys}
                      onChange={handleClassFormChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Girls
                    </label>
                    <input
                      type="number"
                      name="girls"
                      value={classFormData.girls}
                      onChange={handleClassFormChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number/Name
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={classFormData.roomNumber}
                    onChange={handleClassFormChange}
                    placeholder="e.g. Room 101"
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Students Modal */}
      {showAddStudentsModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Students to {selectedClass.name} {selectedClass.section}</h3>
              <button
                onClick={() => setShowAddStudentsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitStudents}>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Add multiple students at once. Passwords will be generated automatically.</p>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">Roll No</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentFormData.students.map((student, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={student.rollNo}
                              onChange={(e) => handleStudentChange(index, 'rollNo', e.target.value)}
                              className="w-16 px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                              min="1"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={student.name}
                              onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                              className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Student name"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={student.username}
                              onChange={(e) => handleStudentChange(index, 'username', e.target.value)}
                              className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Auto-generated if empty"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={student.gender}
                              onChange={(e) => handleStudentChange(index, 'gender', e.target.value)}
                              className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => removeStudentRow(index)}
                              className="text-red-600 hover:text-red-900"
                              title="Remove student"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={addStudentRow}
                  className="mt-4 flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Another Student
                </button>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentsModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ClassCard({ classData, onAddStudents, onDelete }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{classData.name} {classData.section}</h3>
        <div className="flex space-x-2">
          <button className="rounded-full p-1 hover:bg-gray-100" title="Edit class">
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
          <button
            className="rounded-full p-1 hover:bg-gray-100"
            title="Delete class"
            onClick={onDelete}
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">Teacher: {classData.classTeacher}</p>
      {classData.roomNumber && (
        <p className="mt-1 text-sm text-gray-500">Room: {classData.roomNumber}</p>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Total Students:</span>
          <span className="text-sm font-medium">{classData.totalStudents || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Boys:</span>
          <span className="text-sm font-medium">{classData.boys || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Girls:</span>
          <span className="text-sm font-medium">{classData.girls || 0}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50">
          <Users className="mr-1 h-3 w-3" />
          View Students
        </button>
        <button
          onClick={onAddStudents}
          className="flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Students
        </button>
      </div>
    </div>
  )
}
