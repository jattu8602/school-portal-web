'use client'

import { useState } from 'react'
import { X, Plus, Save, Download, Upload } from "lucide-react"
import { collection, setDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../../../lib/firebase'
import * as XLSX from 'xlsx'

export default function TeacherManagement({ schoolId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [teachers, setTeachers] = useState([{
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    qualification: '',
    gender: 'male'
  }])

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleTeacherChange = (index, field, value) => {
    const updatedTeachers = [...teachers]
    updatedTeachers[index] = {
      ...updatedTeachers[index],
      [field]: value
    }
    setTeachers(updatedTeachers)
  }

  const addTeacherRow = () => {
    setTeachers([
      ...teachers,
      {
        fullName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        qualification: '',
        gender: 'male'
      }
    ])
  }

  const removeTeacherRow = (index) => {
    if (teachers.length === 1) return
    setTeachers(teachers.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = auth.currentUser
      if (!user) throw new Error('No user logged in')

      // Check for duplicate emails in the form
      const emails = teachers.map(t => t.email.toLowerCase())
      const uniqueEmails = new Set(emails)
      if (uniqueEmails.size !== emails.length) {
        throw new Error('Duplicate email addresses found in the form')
      }

      // Check for existing teachers with same emails
      const existingTeachersRef = collection(db, 'schools', user.uid, 'teachers')
      const existingTeachersSnapshot = await getDocs(existingTeachersRef)
      const existingEmails = existingTeachersSnapshot.docs.map(doc => doc.data().email.toLowerCase())

      const duplicateEmails = emails.filter(email => existingEmails.includes(email))
      if (duplicateEmails.length > 0) {
        throw new Error(`Teachers with these emails already exist: ${duplicateEmails.join(', ')}`)
      }

      // Add teachers to Firestore
      let successCount = 0
      for (const teacher of teachers) {
        if (!teacher.fullName || !teacher.email || !teacher.subject || !teacher.gender) continue

        const password = generatePassword()
        const teacherId = teacher.email.toLowerCase()

        await setDoc(doc(db, 'schools', user.uid, 'teachers', teacherId), {
          fullName: teacher.fullName,
          email: teacher.email.toLowerCase(),
          phoneNumber: teacher.phoneNumber || '',
          subject: teacher.subject,
          qualification: teacher.qualification || '',
          gender: teacher.gender,
          password: password,
          createdAt: serverTimestamp()
        })
        successCount++
      }

      onSuccess(successCount)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadDummyExcel = () => {
    const dummyData = [
      {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        subject: 'Mathematics',
        qualification: 'M.Sc. Mathematics',
        gender: 'male'
      },
      {
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+1987654321',
        subject: 'Physics',
        qualification: 'Ph.D. Physics',
        gender: 'female'
      }
    ]

    const ws = XLSX.utils.json_to_sheet(dummyData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers')
    XLSX.writeFile(wb, 'teacher_template.xlsx')
  }

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          // Validate data
          if (jsonData.length === 0) {
            throw new Error('Excel file is empty')
          }

          // Check required fields
          const requiredFields = ['fullName', 'email', 'subject', 'gender']
          const missingFields = jsonData.some(row =>
            requiredFields.some(field => !row[field])
          )

          if (missingFields) {
            throw new Error('Missing required fields in Excel file')
          }

          // Validate email format
          const invalidEmails = jsonData.filter(row => !row.email.includes('@'))
          if (invalidEmails.length > 0) {
            throw new Error('Invalid email format found in the Excel file')
          }

          // Update teachers state with Excel data
          setTeachers(jsonData.map(row => ({
            fullName: row.fullName,
            email: row.email.toLowerCase(),
            phoneNumber: row.phoneNumber || '',
            subject: row.subject,
            qualification: row.qualification || '',
            gender: row.gender.toLowerCase()
          })))
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add Teachers</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-4 flex space-x-4">
        <button
          onClick={downloadDummyExcel}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </button>
        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          Upload Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={teacher.fullName}
                      onChange={(e) => handleTeacherChange(index, 'fullName', e.target.value)}
                      className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Full name"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="email"
                      value={teacher.email}
                      onChange={(e) => handleTeacherChange(index, 'email', e.target.value)}
                      className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Email address"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="tel"
                      value={teacher.phoneNumber}
                      onChange={(e) => handleTeacherChange(index, 'phoneNumber', e.target.value)}
                      className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Phone number (optional)"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={teacher.subject}
                      onChange={(e) => handleTeacherChange(index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Subject"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={teacher.qualification}
                      onChange={(e) => handleTeacherChange(index, 'qualification', e.target.value)}
                      className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Qualification (optional)"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={teacher.gender}
                      onChange={(e) => handleTeacherChange(index, 'gender', e.target.value)}
                      className="w-full px-2 py-1 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeTeacherRow(index)}
                      className="text-red-600 hover:text-red-900"
                      title="Remove teacher"
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
          onClick={addTeacherRow}
          className="mt-4 flex items-center text-primary-600 hover:text-primary-700"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Another Teacher
        </button>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
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
            Save Teachers
          </button>
        </div>
      </form>
    </div>
  )
}
