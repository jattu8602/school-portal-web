'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore'
import { ArrowUpDown, Search, Filter, BarChart3, Download, ChevronDown, AlertCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

// Sample historical marks data structure (to be replaced with actual data from Firestore)
const SAMPLE_HISTORICAL_DATA = {
  "class5A_2023": [
    {
      studentId: "student1",
      name: "John Smith",
      rollNo: 1,
      previousClass: "Class 4",
      previousYear: "2022-2023",
      subjects: {
        Mathematics: { marks: 85, maxMarks: 100 },
        Science: { marks: 78, maxMarks: 100 },
        English: { marks: 92, maxMarks: 100 },
        "Social Studies": { marks: 88, maxMarks: 100 },
        Hindi: { marks: 75, maxMarks: 100 }
      }
    },
    {
      studentId: "student2",
      name: "Jane Doe",
      rollNo: 2,
      previousClass: "Class 4",
      previousYear: "2022-2023",
      subjects: {
        Mathematics: { marks: 92, maxMarks: 100 },
        Science: { marks: 88, maxMarks: 100 },
        English: { marks: 95, maxMarks: 100 },
        "Social Studies": { marks: 91, maxMarks: 100 },
        Hindi: { marks: 89, maxMarks: 100 }
      }
    },
    {
      studentId: "student3",
      name: "Arjun Patel",
      rollNo: 3,
      previousClass: "Class 4",
      previousYear: "2022-2023",
      subjects: {
        Mathematics: { marks: 65, maxMarks: 100 },
        Science: { marks: 72, maxMarks: 100 },
        English: { marks: 68, maxMarks: 100 },
        "Social Studies": { marks: 74, maxMarks: 100 },
        Hindi: { marks: 78, maxMarks: 100 }
      }
    },
    {
      studentId: "student4",
      name: "Priya Singh",
      rollNo: 4,
      previousClass: "Class 4",
      previousYear: "2022-2023",
      subjects: {
        Mathematics: { marks: 78, maxMarks: 100 },
        Science: { marks: 82, maxMarks: 100 },
        English: { marks: 85, maxMarks: 100 },
        "Social Studies": { marks: 80, maxMarks: 100 },
        Hindi: { marks: 88, maxMarks: 100 }
      }
    },
    {
      studentId: "student5",
      name: "Samuel Johnson",
      rollNo: 5,
      previousClass: "Class 4",
      previousYear: "2022-2023",
      subjects: {
        Mathematics: { marks: 45, maxMarks: 100 },
        Science: { marks: 55, maxMarks: 100 },
        English: { marks: 62, maxMarks: 100 },
        "Social Studies": { marks: 58, maxMarks: 100 },
        Hindi: { marks: 50, maxMarks: 100 }
      }
    }
  ],
};

export default function MarksDetailsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [historicalMarks, setHistoricalMarks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ field: 'rollNo', direction: 'ascending' })
  const [filterConfig, setFilterConfig] = useState({ minPercentage: 0, maxPercentage: 100 })
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  // Colors for performance indicators
  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800'
    if (percentage >= 75) return 'bg-blue-100 text-blue-800'
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800'
    if (percentage >= 40) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  // Get performance label based on percentage
  const getPerformanceLabel = (percentage) => {
    if (percentage >= 90) return 'Excellent'
    if (percentage >= 75) return 'Very Good'
    if (percentage >= 60) return 'Good'
    if (percentage >= 40) return 'Average'
    return 'Needs Improvement'
  }

  // Authentication effect
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

  // Load classes from Firestore
  const loadClasses = async (schoolId) => {
    try {
      setLoading(true)
      const classesCollection = collection(db, 'schools', schoolId, 'classes')
      const classesQuery = query(classesCollection, orderBy('name'))
      const classesSnapshot = await getDocs(classesQuery)

      const classesData = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setClasses(classesData)
      setLoading(false)

      if (classesData.length === 0) {
        showToast('No classes found. Please add classes first.', 'info')
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      showToast(`Failed to load classes: ${error.message}`, 'error')
      setLoading(false)
    }
  }

  // Load students for the selected class
  const loadStudents = async (classId) => {
    if (!classId || !user) return

    try {
      setLoading(true)
      const studentsCollection = collection(db, 'schools', user.uid, 'students')
      const studentsQuery = query(
        studentsCollection,
        where('classId', '==', classId),
        orderBy('rollNo')
      )
      const studentsSnapshot = await getDocs(studentsQuery)

      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setStudents(studentsData)

      // Load historical marks for the class
      try {
        // Attempt to load from public JSON file first
        const response = await fetch(`/marks-details/${classId.split('_')[0]}.json`)
        if (response.ok) {
          const data = await response.json()
          setHistoricalMarks(data || [])
          showToast(`Loaded historical marks for ${classId}`, 'success')
        } else {
          // Fallback to sample data
          const classKey = `${classId}_2023`
          setHistoricalMarks(SAMPLE_HISTORICAL_DATA[classKey] || [])

          if (!SAMPLE_HISTORICAL_DATA[classKey]) {
            showToast(`No historical marks found for ${classId}`, 'info')
          }
        }
      } catch (error) {
        console.error('Error loading marks JSON:', error)
        // Fallback to sample data
        const classKey = `${classId}_2023`
        setHistoricalMarks(SAMPLE_HISTORICAL_DATA[classKey] || [])
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading students:', error)
      showToast(`Failed to load students: ${error.message}`, 'error')
      setLoading(false)
    }
  }

  // Handle class change
  const handleClassChange = (e) => {
    const classId = e.target.value
    setSelectedClass(classId)
    loadStudents(classId)
  }

  // Calculate total and percentage for a student
  const calculateStudentStats = (student) => {
    if (!student.subjects) return { total: 0, percentage: 0, maxTotal: 0 }

    let total = 0
    let maxTotal = 0

    Object.values(student.subjects).forEach(subject => {
      total += subject.marks
      maxTotal += subject.maxMarks
    })

    const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0

    return { total, maxTotal, percentage }
  }

  // Sorting logic
  const requestSort = (field) => {
    let direction = 'ascending'
    if (sortConfig.field === field && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ field, direction })
  }

  // Apply sorting and filtering
  const sortedAndFilteredMarks = useMemo(() => {
    // Filter first
    let filteredMarks = historicalMarks.filter(student => {
      // Search filter
      const nameMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
      const rollNoMatch = student.rollNo.toString().includes(searchQuery)

      // Percentage filter
      const { percentage } = calculateStudentStats(student)
      const percentageMatch =
        percentage >= filterConfig.minPercentage &&
        percentage <= filterConfig.maxPercentage

      return (nameMatch || rollNoMatch) && percentageMatch
    })

    // Then sort
    return [...filteredMarks].sort((a, b) => {
      if (sortConfig.field === 'name') {
        return sortConfig.direction === 'ascending'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }

      if (sortConfig.field === 'rollNo') {
        return sortConfig.direction === 'ascending'
          ? a.rollNo - b.rollNo
          : b.rollNo - a.rollNo
      }

      if (sortConfig.field === 'percentage') {
        const percentageA = calculateStudentStats(a).percentage
        const percentageB = calculateStudentStats(b).percentage
        return sortConfig.direction === 'ascending'
          ? percentageA - percentageB
          : percentageB - percentageA
      }

      // Default sort by roll number
      return a.rollNo - b.rollNo
    })
  }, [historicalMarks, searchQuery, sortConfig, filterConfig])

  // Get the available subjects from the data
  const availableSubjects = useMemo(() => {
    if (historicalMarks.length === 0) return []

    const firstStudent = historicalMarks[0]
    return firstStudent?.subjects ? Object.keys(firstStudent.subjects) : []
  }, [historicalMarks])

  // Export marks as CSV
  const exportMarksCSV = () => {
    if (sortedAndFilteredMarks.length === 0) {
      showToast('No data to export', 'warning')
      return
    }

    let csvContent = "Roll No,Name,Previous Class,Previous Year"

    // Add subjects to header
    availableSubjects.forEach(subject => {
      csvContent += `,${subject}`
    })

    csvContent += ",Total,Percentage,Performance\n"

    // Add student data
    sortedAndFilteredMarks.forEach(student => {
      const { total, percentage } = calculateStudentStats(student)
      csvContent += `${student.rollNo},${student.name},${student.previousClass},${student.previousYear}`

      // Add subject marks
      availableSubjects.forEach(subject => {
        const mark = student.subjects[subject]?.marks || 0
        csvContent += `,${mark}`
      })

      csvContent += `,${total},${percentage}%,${getPerformanceLabel(percentage)}\n`
    })

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `marks_${selectedClass}_historical.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('Marks exported successfully!', 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Student Historical Marks</h1>
        <p className="text-gray-600">View and analyze previous academic performance of students</p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Class Selection */}
          <div>
            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={handleClassChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.section}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Student
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by name or roll no"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Button */}
          <div className="flex items-end">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilterPanel ? 'Hide Filters' : 'Show Filters'}
            </button>

            <button
              onClick={exportMarksCSV}
              disabled={sortedAndFilteredMarks.length === 0}
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Percentage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="min-percentage" className="block text-xs text-gray-500 mb-1">
                  Minimum Percentage
                </label>
                <input
                  type="range"
                  id="min-percentage"
                  min="0"
                  max="100"
                  step="5"
                  value={filterConfig.minPercentage}
                  onChange={(e) => setFilterConfig({...filterConfig, minPercentage: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm">{filterConfig.minPercentage}%</span>
              </div>
              <div>
                <label htmlFor="max-percentage" className="block text-xs text-gray-500 mb-1">
                  Maximum Percentage
                </label>
                <input
                  type="range"
                  id="max-percentage"
                  min="0"
                  max="100"
                  step="5"
                  value={filterConfig.maxPercentage}
                  onChange={(e) => setFilterConfig({...filterConfig, maxPercentage: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm">{filterConfig.maxPercentage}%</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2">
              <div
                onClick={() => setFilterConfig({minPercentage: 0, maxPercentage: 100})}
                className="cursor-pointer px-3 py-1 text-xs rounded bg-gray-200 text-center hover:bg-gray-300"
              >
                All
              </div>
              <div
                onClick={() => setFilterConfig({minPercentage: 90, maxPercentage: 100})}
                className="cursor-pointer px-3 py-1 text-xs rounded bg-green-100 text-green-800 text-center hover:bg-green-200"
              >
                Excellent (≥90%)
              </div>
              <div
                onClick={() => setFilterConfig({minPercentage: 75, maxPercentage: 89})}
                className="cursor-pointer px-3 py-1 text-xs rounded bg-blue-100 text-blue-800 text-center hover:bg-blue-200"
              >
                Very Good (75-89%)
              </div>
              <div
                onClick={() => setFilterConfig({minPercentage: 60, maxPercentage: 74})}
                className="cursor-pointer px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-800 text-center hover:bg-yellow-200"
              >
                Good (60-74%)
              </div>
              <div
                onClick={() => setFilterConfig({minPercentage: 0, maxPercentage: 59})}
                className="cursor-pointer px-3 py-1 text-xs rounded bg-red-100 text-red-800 text-center hover:bg-red-200"
              >
                Below 60%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Marks Table Section */}
      {selectedClass ? (
        sortedAndFilteredMarks.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('rollNo')}
                    >
                      <div className="flex items-center">
                        Roll No
                        {sortConfig.field === 'rollNo' && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'descending' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        Student Name
                        {sortConfig.field === 'name' && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'descending' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous Class
                    </th>

                    {/* Subject Columns */}
                    {availableSubjects.map(subject => (
                      <th key={subject} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {subject}
                      </th>
                    ))}

                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('percentage')}
                    >
                      <div className="flex items-center">
                        Percentage
                        {sortConfig.field === 'percentage' && (
                          <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'descending' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAndFilteredMarks.map((student) => {
                    const { total, percentage } = calculateStudentStats(student)
                    const performanceColor = getPerformanceColor(percentage)

                    return (
                      <tr key={student.studentId} className="hover:bg-gray-50">
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.rollNo}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.name}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.previousClass} ({student.previousYear})
                        </td>

                        {/* Subject Marks */}
                        {availableSubjects.map(subject => {
                          const subjectData = student.subjects[subject] || { marks: 0, maxMarks: 100 }
                          const subjectPercentage = Math.round((subjectData.marks / subjectData.maxMarks) * 100)
                          const subjectColor = getPerformanceColor(subjectPercentage)

                          return (
                            <td key={`${student.studentId}-${subject}`} className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subjectColor}`}>
                                  {subjectData.marks}/{subjectData.maxMarks}
                                </span>
                              </div>
                            </td>
                          )
                        })}

                        {/* Percentage */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="w-16 bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${percentage >= 90 ? 'bg-green-600' : percentage >= 75 ? 'bg-blue-600' : percentage >= 60 ? 'bg-yellow-400' : percentage >= 40 ? 'bg-orange-500' : 'bg-red-600'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="mt-1 block">{percentage}%</span>
                        </td>

                        {/* Performance */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${performanceColor}`}>
                            {getPerformanceLabel(percentage)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Historical Marks Found</h3>
            <p className="text-gray-500">
              There are no historical marks available for the selected class.
            </p>
          </div>
        )
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Class</h3>
          <p className="text-gray-500">
            Please select a class from the dropdown to view historical marks of students.
          </p>
        </div>
      )}

      {/* Mobile View Enhancement */}
      <div className="md:hidden mt-4 bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Rotate your device horizontally for a better view of the marks table.
        </p>
      </div>

      {/* Legend */}
      {sortedAndFilteredMarks.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
              <span className="text-xs">90-100%: Excellent</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
              <span className="text-xs">75-89%: Very Good</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
              <span className="text-xs">60-74%: Good</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              <span className="text-xs">40-59%: Average</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
              <span className="text-xs">Below 40%: Needs Improvement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
