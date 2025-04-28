'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

export default function MarksDetailsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [examTypes, setExamTypes] = useState(['Midterm', 'Final', 'Quiz', 'Assignment'])
  const [selectedExam, setSelectedExam] = useState('')
  const [students, setStudents] = useState([])
  const [marksData, setMarksData] = useState({})
  const [subjects, setSubjects] = useState(['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science', 'Physical Education'])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        loadClasses(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadClasses = async (schoolId) => {
    try {
      const classesCollection = collection(db, 'schools', schoolId, 'classes')
      const classesQuery = query(classesCollection, orderBy('name'))
      const classesSnapshot = await getDocs(classesQuery)

      const classesData = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setClasses(classesData)
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const loadStudents = async () => {
    if (!selectedClass || !user) return

    try {
      const studentsCollection = collection(db, 'schools', user.uid, 'students')
      const studentsSnapshot = await getDocs(studentsCollection)

      const studentsData = studentsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(student => student.classId === selectedClass || !student.classId)

      setStudents(studentsData)

      // Initialize marks data structure
      const initialMarksData = {}
      studentsData.forEach(student => {
        initialMarksData[student.id] = {}
        subjects.forEach(subject => {
          initialMarksData[student.id][subject] = ''
        })
      })

      setMarksData(initialMarksData)
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass, user])

  const handleMarksChange = (studentId, subject, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: value
      }
    }))
  }

  const saveMarks = async () => {
    if (!user || !selectedClass || !selectedExam) return

    try {
      for (const studentId in marksData) {
        const marksRef = doc(
          db,
          'schools',
          user.uid,
          'marks',
          `${selectedClass}_${selectedExam}_${studentId}`
        )

        await setDoc(marksRef, {
          studentId,
          classId: selectedClass,
          examType: selectedExam,
          subjects: marksData[studentId],
          timestamp: new Date()
        })
      }

      alert('Marks saved successfully!')
    } catch (error) {
      console.error('Error saving marks:', error)
      alert('Error saving marks: ' + error.message)
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Marks Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Enter Student Marks</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Exam Type
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select exam type</option>
              {examTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedClass && selectedExam && students.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    {subjects.map(subject => (
                      <th key={subject} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {subject}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name}
                      </td>
                      {subjects.map(subject => (
                        <td key={`${student.id}-${subject}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={marksData[student.id]?.[subject] || ''}
                            onChange={(e) => handleMarksChange(student.id, subject, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <button
                onClick={saveMarks}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Marks
              </button>
            </div>
          </div>
        ) : selectedClass && students.length === 0 ? (
          <div className="text-center py-4">
            <p>No students found for this class. Please add students first.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
