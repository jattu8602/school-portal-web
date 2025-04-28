'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '../../../lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'

export default function Exams() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    examName: '',
    class: '5A',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    totalMarks: 100,
    passingMarks: 35,
  })

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      setLoading(true)
      const user = auth.currentUser
      if (!user) return

      const examsRef = collection(db, 'exams')
      const q = query(examsRef, where('schoolId', '==', user.uid))
      const querySnapshot = await getDocs(q)

      const examsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setExams(examsList)
    } catch (err) {
      console.error('Error fetching exams:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = auth.currentUser
      if (!user) return

      const examData = {
        ...formData,
        schoolId: user.uid,
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, 'exams'), examData)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setFormData({
        examName: '',
        class: '5A',
        subject: '',
        date: '',
        startTime: '',
        endTime: '',
        totalMarks: 100,
        passingMarks: 35,
      })
      fetchExams()
    } catch (err) {
      console.error('Error adding exam:', err)
      setError(err.message)
    }
  }

  const handleDelete = async (examId) => {
    try {
      await deleteDoc(doc(db, 'exams', examId))
      fetchExams()
    } catch (err) {
      console.error('Error deleting exam:', err)
      setError(err.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
        <p className="mt-2 text-gray-600">Schedule and manage exams</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Schedule New Exam</h2>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-md">
              Exam scheduled successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  name="examName"
                  value={formData.examName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="5A">Class 5A</option>
                  <option value="5B">Class 5B</option>
                  <option value="6A">Class 6A</option>
                  <option value="6B">Class 6B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    name="passingMarks"
                    value={formData.passingMarks}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Schedule Exam
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : exams.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No exams scheduled yet
              </div>
            ) : (
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {exam.examName}
                        </h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Class: {exam.class}</p>
                          <p>Subject: {exam.subject}</p>
                          <p>
                            Date: {new Date(exam.date).toLocaleDateString()}
                          </p>
                          <p>
                            Time: {exam.startTime} - {exam.endTime}
                          </p>
                          <p>Total Marks: {exam.totalMarks}</p>
                          <p>Passing Marks: {exam.passingMarks}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
