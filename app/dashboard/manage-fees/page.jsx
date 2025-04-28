'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, setDoc, getDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore'

export default function ManageFeesPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [feeData, setFeeData] = useState({
    amount: '',
    dueDate: '',
    month: '',
    category: 'Tuition',
    description: '',
  })
  const [feeHistory, setFeeHistory] = useState([])
  const [feeCategories] = useState([
    'Tuition',
    'Transportation',
    'Library',
    'Laboratory',
    'Sports',
    'Examination',
    'Other'
  ])
  const [months] = useState([
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ])
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
      setSelectedStudent('')
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  const loadFeeHistory = async () => {
    if (!selectedStudent || !user) return

    try {
      const feesCollection = collection(db, 'schools', user.uid, 'fees')
      const feesQuery = query(
        feesCollection,
        where('studentId', '==', selectedStudent),
        orderBy('timestamp', 'desc')
      )
      const feesSnapshot = await getDocs(feesQuery)

      const feesData = feesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'N/A'
      }))

      setFeeHistory(feesData)
    } catch (error) {
      console.error('Error loading fee history:', error)
    }
  }

  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass, user])

  useEffect(() => {
    if (selectedStudent) {
      loadFeeHistory()
    }
  }, [selectedStudent, user])

  const handleFeeDataChange = (e) => {
    const { name, value } = e.target
    setFeeData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const collectFee = async () => {
    if (!user || !selectedStudent || !feeData.amount || !feeData.month) {
      alert('Please fill in all required fields')
      return
    }

    try {
      // Get student details
      const studentRef = doc(db, 'schools', user.uid, 'students', selectedStudent)
      const studentSnap = await getDoc(studentRef)
      const studentData = studentSnap.data()

      // Generate receipt ID
      const receiptId = `FEE-${Date.now()}`

      // Save fee record
      const feeRef = doc(db, 'schools', user.uid, 'fees', receiptId)
      await setDoc(feeRef, {
        receiptId,
        studentId: selectedStudent,
        studentName: studentData.name,
        rollNo: studentData.rollNo,
        classId: selectedClass,
        amount: parseFloat(feeData.amount),
        dueDate: feeData.dueDate,
        month: feeData.month,
        category: feeData.category,
        description: feeData.description,
        paymentStatus: 'Paid',
        timestamp: serverTimestamp()
      })

      alert(`Fee collected successfully. Receipt ID: ${receiptId}`)

      // Reset form
      setFeeData({
        amount: '',
        dueDate: '',
        month: '',
        category: 'Tuition',
        description: '',
      })

      // Reload fee history
      loadFeeHistory()
    } catch (error) {
      console.error('Error collecting fee:', error)
      alert('Error collecting fee: ' + error.message)
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
      <h1 className="text-3xl font-bold mb-8">Fee Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Collect Fees</h2>

          <div className="space-y-4 mb-6">
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

            {selectedClass && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.rollNo} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedStudent && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Category
                  </label>
                  <select
                    name="category"
                    value={feeData.category}
                    onChange={handleFeeDataChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {feeCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    name="month"
                    value={feeData.month}
                    onChange={handleFeeDataChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={feeData.amount}
                    onChange={handleFeeDataChange}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={feeData.dueDate}
                    onChange={handleFeeDataChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={feeData.description}
                    onChange={handleFeeDataChange}
                    placeholder="Add any notes"
                    rows="3"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={collectFee}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Collect Fee
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Fee History</h2>

          {selectedStudent ? (
            feeHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feeHistory.map((fee) => (
                      <tr key={fee.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {fee.receiptId}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {fee.month}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {fee.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ₹{fee.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {fee.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p>No fee records found for this student.</p>
              </div>
            )
          ) : (
            <div className="text-center py-4">
              <p>Select a student to view fee history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
