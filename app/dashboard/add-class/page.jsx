'use client'

import { useState, useEffect } from 'react'
import { Pencil, Plus, Users, X, Save } from "lucide-react"
import { auth, db } from '../../../lib/firebase'
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy, where, getDoc, writeBatch } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useToast } from '../../context/ToastContext'
import StudentManagement from '../../components/dashboard/StudentManagement'

export default function ClassesPage() {
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { showToast } = useToast()

  // Form state for adding a class
  const [classFormData, setClassFormData] = useState({
    name: '',
    section: '',
    classTeacher: '',
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
        fetchTeachers(currentUser.uid)
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
      showToast('Failed to fetch classes', 'error')
    }
  }

  const fetchTeachers = async (schoolId) => {
    try {
      const teachersCol = collection(db, 'schools', schoolId, 'teachers')
      const teachersSnapshot = await getDocs(teachersCol)

      const teachersList = teachersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTeachers(teachersList)
    } catch (err) {
      console.error('Error fetching teachers:', err)
      showToast('Failed to fetch teachers', 'error')
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
        totalStudents: 0,
        boys: 0,
        girls: 0,
        roomNumber: classFormData.roomNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Reset form and close modal
      setClassFormData({
        name: '',
        section: '',
        classTeacher: '',
        roomNumber: ''
      })
      setShowAddClassModal(false)
      fetchClasses(user.uid)
      showToast(`Class ${classFormData.name} ${classFormData.section} added successfully`, 'success')
    } catch (err) {
      console.error('Error adding class:', err)
      showToast(`Failed to add class: ${err.message}`, 'error')
    }
  }

  const openAddStudentsModal = async (classData) => {
    setSelectedClass(classData)

    try {
      // Fetch existing students to determine the next roll number
      const existingStudentsRef = collection(db, 'schools', auth.currentUser.uid, 'students');
      const existingStudentsQuery = query(existingStudentsRef, where('classId', '==', classData.id));
      const existingStudentsSnapshot = await getDocs(existingStudentsQuery);

      // Extract all existing roll numbers
      const existingRollNumbers = existingStudentsSnapshot.docs.map(doc => doc.data().rollNo);

      // Calculate the next available roll number
      let startRollNo = 1;
      if (existingRollNumbers.length > 0) {
        // Find the maximum roll number and add 1
        startRollNo = Math.max(...existingRollNumbers) + 1;
      }

      // Initialize student form with the next available roll number
      setStudentFormData({
        startRollNo,
        students: [{ name: '', rollNo: startRollNo, username: '', gender: 'male' }]
      })
    } catch (err) {
      console.error('Error fetching existing students:', err);
      // Fallback to starting with roll number 1
      setStudentFormData({
        startRollNo: 1,
        students: [{ name: '', rollNo: 1, username: '', gender: 'male' }]
      })
    }

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
    // When changing roll number, check if it's already taken by another student in the form
    if (field === 'rollNo') {
      const rollNo = parseInt(value);
      const isDuplicate = studentFormData.students.some(
        (student, i) => i !== index && student.rollNo === rollNo
      );

      if (isDuplicate) {
        showToast(`Roll number ${rollNo} is already used in this form. Each student needs a unique roll number.`, 'warning');
      }
    }

    const updatedStudents = [...studentFormData.students];
    updatedStudents[index] = {
      ...updatedStudents[index],
      [field]: field === 'rollNo' ? parseInt(value) : value
    };
    setStudentFormData(prev => ({
      ...prev,
      students: updatedStudents
    }));
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

      // Check for duplicate roll numbers within the form
      const rollNumbers = studentFormData.students.map(s => s.rollNo)
      const uniqueRollNumbers = [...new Set(rollNumbers)]

      if (rollNumbers.length !== uniqueRollNumbers.length) {
        showToast('Each student must have a unique roll number', 'error')
        return
      }

      // Check for duplicate roll numbers in the class
      const existingStudentsRef = collection(db, 'schools', user.uid, 'students')
      const existingStudentsQuery = query(
        existingStudentsRef,
        where('classId', '==', selectedClass.id)
      )
      const existingStudentsSnapshot = await getDocs(existingStudentsQuery)
      const existingRollNumbers = existingStudentsSnapshot.docs.map(doc => doc.data().rollNo)

      // Check for conflicts with existing roll numbers
      const hasConflict = studentFormData.students.some(student =>
        existingRollNumbers.includes(student.rollNo)
      )

      if (hasConflict) {
        showToast('Some roll numbers already exist in this class', 'error')
        return
      }

      // Add students to Firestore
      let successCount = 0
      let maleCount = 0
      let femaleCount = 0

      for (const student of studentFormData.students) {
        if (!student.name) continue // Skip empty names

        const password = generatePassword()
        const username = student.username || student.name.toLowerCase().replace(/\s+/g, '.') + student.rollNo

        // Count gender for stats
        if (student.gender === 'male') {
          maleCount++
        } else if (student.gender === 'female') {
          femaleCount++
        }

        try {
          // Create student document with classId and className
          const studentId = `${selectedClass.id}_${student.rollNo}`
          await setDoc(doc(db, 'schools', user.uid, 'students', studentId), {
            name: student.name,
            rollNo: student.rollNo,
            username: username,
            password: password,
            gender: student.gender,
            classId: selectedClass.id,
            className: selectedClass.name,
            section: selectedClass.section,
            createdAt: serverTimestamp()
          })
          successCount++
        } catch (err) {
          console.error(`Error adding student ${student.name}:`, err)
          showToast(`Failed to add student ${student.name}: ${err.message}`, 'error')
        }
      }

      // Update class stats
      try {
        const classRef = doc(db, 'schools', user.uid, 'classes', selectedClass.id)
        const classDoc = await getDoc(classRef)

        if (classDoc.exists()) {
          const classData = classDoc.data()
          await setDoc(classRef, {
            ...classData,
            totalStudents: (classData.totalStudents || 0) + successCount,
            boys: (classData.boys || 0) + maleCount,
            girls: (classData.girls || 0) + femaleCount,
            updatedAt: serverTimestamp()
          }, { merge: true })
        }
      } catch (err) {
        console.error('Error updating class stats:', err)
        showToast('Failed to update class statistics', 'warning')
      }

      // Close modal and refresh data
      setShowAddStudentsModal(false)
      fetchClasses(user.uid)
      showToast(`Added ${successCount} students to ${selectedClass.name} ${selectedClass.section}`, 'success')
    } catch (err) {
      console.error('Error adding students:', err)
      showToast(`Failed to add students: ${err.message}`, 'error')
    }
  }

  const deleteClass = async (classId) => {
    if (!confirm('Are you sure you want to delete this class? This will also remove all students associated with this class.')) return

    try {
      // Delete the class
      await deleteDoc(doc(db, 'schools', user.uid, 'classes', classId))

      // Find and delete students in this class
      const studentsRef = collection(db, 'schools', user.uid, 'students')
      const studentsQuery = query(studentsRef, where('classId', '==', classId))
      const studentsSnapshot = await getDocs(studentsQuery)

      // Delete each student
      const deletePromises = studentsSnapshot.docs.map(doc =>
        deleteDoc(doc.ref)
      )

      // Get all teachers
      const teachersRef = collection(db, 'schools', user.uid, 'teachers')
      const teachersSnapshot = await getDocs(teachersRef)

      // Update each teacher to remove this class from their subjects
      const teacherUpdatePromises = teachersSnapshot.docs.map(async (teacherDoc) => {
        const teacherData = teacherDoc.data()
        if (teacherData.subjects) {
          // Filter out the deleted class from subjects
          const updatedSubjects = teacherData.subjects.filter(
            subject => subject.classId !== classId
          )

          // Update the classSubjects map
          const classSubjects = {}
          updatedSubjects.forEach(subject => {
            classSubjects[subject.classId] = subject.subjectName
          })

          // Update teacher document
          await setDoc(teacherDoc.ref, {
            subjects: updatedSubjects,
            classSubjects: classSubjects,
            updatedAt: serverTimestamp()
          }, { merge: true })
        }
      })

      // Wait for all operations to complete
      await Promise.all([...deletePromises, ...teacherUpdatePromises])

      // Refresh classes
      fetchClasses(user.uid)
      showToast('Class deleted successfully', 'success')
    } catch (err) {
      console.error('Error deleting class:', err)
      showToast(`Failed to delete class: ${err.message}`, 'error')
    }
  }

  const handleStudentsAdded = async (successCount, maleCount, femaleCount) => {
    try {
      if (!user || !selectedClass) return;

      // Update class stats
      const classRef = doc(db, 'schools', user.uid, 'classes', selectedClass.id);
      await setDoc(classRef, {
        totalStudents: (selectedClass.totalStudents || 0) + successCount,
        boys: (selectedClass.boys || 0) + maleCount,
        girls: (selectedClass.girls || 0) + femaleCount,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Refresh classes list
      await fetchClasses(user.uid);
      showToast(`Added ${successCount} students successfully`, 'success');
    } catch (err) {
      console.error('Error updating class stats:', err);
      showToast('Failed to update class statistics', 'error');
    }
  };

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
                    Class Teacher <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="classTeacher"
                    value={classFormData.classTeacher}
                    onChange={handleClassFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.fullName}>
                        {teacher.fullName} - {teacher.subject}
                      </option>
                    ))}
                  </select>
                  {teachers.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">
                      No teachers available. Please add teachers first.
                    </p>
                  )}
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
                  disabled={teachers.length === 0}
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
          <StudentManagement
            classData={selectedClass}
            onClose={() => setShowAddStudentsModal(false)}
            onSuccess={handleStudentsAdded}
          />
        </div>
      )}
    </div>
  )
}

function ClassCard({ classData, onAddStudents, onDelete }) {
  const [showViewStudentsModal, setShowViewStudentsModal] = useState(false);
  const [showViewTeachersModal, setShowViewTeachersModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teacherFormData, setTeacherFormData] = useState({
    teacherId: '',
    subjectName: ''
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      console.log('Fetching students for class:', classData.id);

      // Get all students where classId matches
      const studentsRef = collection(db, 'schools', user.uid, 'students');
      const studentsQuery = query(studentsRef, where('classId', '==', classData.id));
      const studentsSnapshot = await getDocs(studentsQuery);

      console.log('Students found:', studentsSnapshot.size);

      // Process results and convert to array
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by roll number
      studentsData.sort((a, b) => Number(a.rollNo) - Number(b.rollNo));

      console.log('Processed student data:', studentsData);
      setStudents(studentsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      // First, get all teachers from the school
      const allTeachersRef = collection(db, 'schools', user.uid, 'teachers');
      const allTeachersSnapshot = await getDocs(allTeachersRef);
      const allTeachersData = allTeachersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllTeachers(allTeachersData);

      // Filter teachers who teach in this class
      const teachersForClass = allTeachersData.filter(teacher => {
        // Check if this teacher has subjects for this class
        if (teacher.subjects) {
          return teacher.subjects.some(subject => subject.classId === classData.id);
        }
        return false;
      });

      // Get subject information for each teacher
      const teachersWithSubjects = teachersForClass.map(teacher => {
        const classSubject = teacher.subjects.find(s => s.classId === classData.id);
        return {
          ...teacher,
          subjectName: classSubject ? classSubject.subjectName : '',
          isClassTeacher: teacher.fullName === classData.classTeacher
        };
      });

      // Sort: class teacher first, then alphabetically by name
      teachersWithSubjects.sort((a, b) => {
        if (a.isClassTeacher && !b.isClassTeacher) return -1;
        if (!a.isClassTeacher && b.isClassTeacher) return 1;
        return a.fullName.localeCompare(b.fullName);
      });

      setTeachers(teachersWithSubjects);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setLoading(false);
    }
  };

  const handleViewStudents = async () => {
    setShowViewStudentsModal(true);
    await fetchStudents();
  };

  const handleViewTeachers = async () => {
    setShowViewTeachersModal(true);
    await fetchTeachers();
  };

  const handleAddTeacher = () => {
    setShowAddTeacherModal(true);
    fetchTeachers(); // This will update allTeachers list
  };

  const handleTeacherFormChange = (e) => {
    const { name, value } = e.target;
    setTeacherFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTeacher = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      // Validate form
      if (!teacherFormData.teacherId || !teacherFormData.subjectName.trim()) {
        alert('Please select a teacher and enter a subject name');
        setLoading(false);
        return;
      }

      // Find the selected teacher
      const selectedTeacher = allTeachers.find(t => t.id === teacherFormData.teacherId);
      if (!selectedTeacher) {
        alert('Selected teacher not found');
        setLoading(false);
        return;
      }

      // Check if teacher already teaches in this class
      const existingSubject = selectedTeacher.subjects?.find(s => s.classId === classData.id);

      // Prepare the updated subjects array
      let updatedSubjects = selectedTeacher.subjects || [];

      if (existingSubject) {
        // Update existing subject
        updatedSubjects = updatedSubjects.map(s =>
          s.classId === classData.id
            ? { ...s, subjectName: teacherFormData.subjectName }
            : s
        );
      } else {
        // Add new subject
        updatedSubjects.push({
          classId: classData.id,
          className: `${classData.name} ${classData.section}`,
          subjectName: teacherFormData.subjectName
        });
      }

      // Update the classSubjects map
      const classSubjects = {};
      updatedSubjects.forEach(subject => {
        classSubjects[subject.classId] = subject.subjectName;
      });

      // Update teacher in Firestore
      await setDoc(doc(db, 'schools', user.uid, 'teachers', selectedTeacher.id), {
        subjects: updatedSubjects,
        classSubjects: classSubjects,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Reset form and close modal
      setTeacherFormData({
        teacherId: '',
        subjectName: ''
      });
      setShowAddTeacherModal(false);

      // Refresh teachers list
      await fetchTeachers();
      setLoading(false);
    } catch (err) {
      console.error('Error adding teacher to class:', err);
      alert('Failed to add teacher to class: ' + err.message);
      setLoading(false);
    }
  };

  const removeTeacherFromClass = async (teacherId) => {
    try {
      if (!confirm('Are you sure you want to remove this teacher from the class?')) return;

      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      // Find the teacher
      const teacherRef = doc(db, 'schools', user.uid, 'teachers', teacherId);
      const teacherDoc = await getDoc(teacherRef);

      if (teacherDoc.exists()) {
        const teacherData = teacherDoc.data();
        const updatedSubjects = (teacherData.subjects || []).filter(
          subject => subject.classId !== classData.id
        );

        // Update the classSubjects map
        const classSubjects = {};
        updatedSubjects.forEach(subject => {
          classSubjects[subject.classId] = subject.subjectName;
        });

        // Update teacher in Firestore
        await setDoc(teacherRef, {
          subjects: updatedSubjects,
          classSubjects: classSubjects,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Refresh teachers list
        await fetchTeachers();
      }

      setLoading(false);
    } catch (err) {
      console.error('Error removing teacher from class:', err);
      alert('Failed to remove teacher from class: ' + err.message);
      setLoading(false);
    }
  };

  const handleAddStudents = () => {
    setShowAddStudentsModal(true);
  };

  const handleStudentsAdded = (successCount, maleCount, femaleCount) => {
    // Update class stats
    const classRef = doc(db, 'schools', auth.currentUser.uid, 'classes', classData.id);
    setDoc(classRef, {
      totalStudents: (classData.totalStudents || 0) + successCount,
      boys: (classData.boys || 0) + maleCount,
      girls: (classData.girls || 0) + femaleCount,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Refresh students list
    fetchStudents();
  };

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
        <button
          className="flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50"
          onClick={handleViewStudents}
        >
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

      <div className="mt-2">
        <button
          className="w-full flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50"
          onClick={handleViewTeachers}
        >
          <Users className="mr-1 h-3 w-3" />
          View Teachers
        </button>
      </div>

      {/* View Students Modal */}
      {showViewStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Students in {classData.name} {classData.section}</h3>
              <button
                onClick={() => setShowViewStudentsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{student.rollNo}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{student.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{student.username}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">{student.gender}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className="font-mono">{student.password}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No students found in this class. Add students to see them here.
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewStudentsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teachers Modal */}
      {showViewTeachersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Teachers for {classData.name} {classData.section}</h3>
              <button
                onClick={() => setShowViewTeachersModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <button
                onClick={handleAddTeacher}
                className="flex items-center justify-center rounded-lg border border-primary-500 bg-primary-50 text-primary-700 px-4 py-2 text-sm font-medium hover:bg-primary-100"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Teacher to Class
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : teachers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className={teacher.isClassTeacher ? "bg-green-50" : ""}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{teacher.fullName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{teacher.subjectName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {teacher.isClassTeacher ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Class Teacher
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Subject Teacher
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{teacher.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                          {!teacher.isClassTeacher && (
                            <button
                              onClick={() => removeTeacherFromClass(teacher.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Remove from class"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No teachers found for this class. Add teachers to see them here.
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewTeachersModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher to Class Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Teacher to {classData.name} {classData.section}</h3>
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
                    Select Teacher <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="teacherId"
                    value={teacherFormData.teacherId}
                    onChange={handleTeacherFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select a teacher</option>
                    {allTeachers.map((teacher) => (
                      <option
                        key={teacher.id}
                        value={teacher.id}
                        disabled={teacher.fullName === classData.classTeacher} // Disable if already class teacher
                      >
                        {teacher.fullName} - {teacher.subject}
                        {teacher.fullName === classData.classTeacher ? ' (Class Teacher)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Taught in This Class <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subjectName"
                    value={teacherFormData.subjectName}
                    onChange={handleTeacherFormChange}
                    placeholder="e.g. Mathematics, Biology, etc."
                    className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
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
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2 inline" />
                  )}
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
