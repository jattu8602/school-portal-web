'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, getDocs, addDoc, doc, serverTimestamp } from 'firebase/firestore'
import Button from '../../components/ui/Button'

export default function ClassesPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [activeTab, setActiveTab] = useState('All Classes')
  const router = useRouter()

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
      const classesRef = collection(db, 'schools', schoolId, 'classes')
      const classesSnapshot = await getDocs(classesRef)
      const classesList = classesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setClasses(classesList)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const handleAddClass = () => {
    router.push('/dashboard/classes/add')
  }

  const filterClasses = (classType) => {
    if (classType === 'All Classes') return classes
    return classes.filter(cls => cls.level === classType)
  }

  const getStudentCounts = (classData) => {
    const boys = classData.boysCount || 0
    const girls = classData.girlsCount || 0
    return {
      total: boys + girls,
      boys,
      girls
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500">Manage your school classes, teachers, and students.</p>
        </div>
        <Button onClick={handleAddClass}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Class
        </Button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['All Classes', 'Primary', 'Secondary'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterClasses(activeTab).map((classItem) => {
          const studentCounts = getStudentCounts(classItem)
          return (
            <div key={classItem.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Class {classItem.name}</h2>
                  <button className="text-gray-400 hover:text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Teacher: {classItem.teacher || 'Not assigned'}</p>
                  <div className="flex justify-between text-sm">
                    <span>Total Students:</span>
                    <span className="font-medium">{studentCounts.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Boys:</span>
                    <span className="font-medium">{studentCounts.boys}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Girls:</span>
                    <span className="font-medium">{studentCounts.girls}</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => router.push(`/dashboard/classes/${classItem.id}/students`)}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    View Students
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/classes/${classItem.id}/add-student`)}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}