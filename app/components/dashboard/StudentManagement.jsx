'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, doc, deleteDoc, setDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../../../lib/firebase'
import { addStudent } from '../../../lib/auth'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { X, Plus, Save, Download, Upload } from "lucide-react"
import * as XLSX from 'xlsx'

export default function StudentManagement({ classData, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [students, setStudents] = useState([{ name: '', rollNo: 1, username: '', gender: 'male' }])

  const generateUniqueUsername = (name, rollNo) => {
    // Get school code from class ID (assuming format: schoolCode_className_section)
    const schoolCode = classData.id.split('_')[0];

    // Clean name: remove special characters and convert to lowercase
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Create username format: schoolCode.className.section.name.rollNo
    return `${schoolCode}.${classData.name.toLowerCase()}.${classData.section.toLowerCase()}.${cleanName}.${rollNo}`;
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index] = {
      ...updatedStudents[index],
      [field]: field === 'rollNo' ? parseInt(value) : value
    };
    setStudents(updatedStudents);
  };

  const addStudentRow = () => {
    const lastRollNo = students[students.length - 1].rollNo;
    setStudents([
      ...students,
      { name: '', rollNo: lastRollNo + 1, username: '', gender: 'male' }
    ]);
  };

  const removeStudentRow = (index) => {
    if (students.length === 1) return;
    setStudents(students.filter((_, i) => i !== index));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Validate roll numbers are sequential
      const rollNumbers = students.map(s => s.rollNo).sort((a, b) => a - b);
      for (let i = 1; i < rollNumbers.length; i++) {
        if (rollNumbers[i] !== rollNumbers[i-1] + 1) {
          throw new Error('Roll numbers must be sequential');
        }
      }

      // Check for duplicate roll numbers
      const uniqueRollNumbers = new Set(rollNumbers);
      if (uniqueRollNumbers.size !== rollNumbers.length) {
        throw new Error('Duplicate roll numbers found');
      }

      // Check for existing students with same roll numbers
      const existingStudentsRef = collection(db, 'schools', user.uid, 'students');
      const existingStudentsQuery = query(
        existingStudentsRef,
        where('classId', '==', classData.id)
      );
      const existingStudentsSnapshot = await getDocs(existingStudentsQuery);
      const existingRollNumbers = existingStudentsSnapshot.docs.map(doc => doc.data().rollNo);

      const hasConflict = students.some(student =>
        existingRollNumbers.includes(student.rollNo)
      );

      if (hasConflict) {
        throw new Error('Some roll numbers already exist in this class');
      }

      // Add students to Firestore
      let successCount = 0;
      let maleCount = 0;
      let femaleCount = 0;

      for (const student of students) {
        if (!student.name || !student.gender) continue;

        const password = generatePassword();
        const username = student.username || generateUniqueUsername(
          student.name,
          student.rollNo
        );

        if (student.gender === 'male') maleCount++;
        else if (student.gender === 'female') femaleCount++;

        const studentId = `${classData.id}_${student.rollNo}`;
        await setDoc(doc(db, 'schools', user.uid, 'students', studentId), {
          name: student.name,
          rollNo: student.rollNo,
          username: username,
          password: password,
          gender: student.gender,
          classId: classData.id,
          className: classData.name,
          section: classData.section,
          createdAt: serverTimestamp()
        });
        successCount++;
      }

      onSuccess(successCount, maleCount, femaleCount);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadDummyExcel = () => {
    const dummyData = [
      {
        rollNo: 1,
        name: 'John Doe',
        username: 'school.class1.a.johndoe.1', // Example format
        gender: 'male'
      },
      {
        rollNo: 2,
        name: 'Jane Smith',
        username: 'school.class1.a.janesmith.2',
        gender: 'female'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(dummyData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'student_template.xlsx');
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Validate data
          if (jsonData.length === 0) {
            throw new Error('Excel file is empty');
          }

          // Check required fields
          const requiredFields = ['rollNo', 'name', 'gender'];
          const missingFields = jsonData.some(row =>
            requiredFields.some(field => !row[field])
          );

          if (missingFields) {
            throw new Error('Missing required fields in Excel file');
          }

          // Validate roll numbers are sequential
          const rollNumbers = jsonData.map(row => row.rollNo).sort((a, b) => a - b);
          for (let i = 1; i < rollNumbers.length; i++) {
            if (rollNumbers[i] !== rollNumbers[i-1] + 1) {
              throw new Error('Roll numbers must be sequential');
            }
          }

          // Update students state with Excel data
          setStudents(jsonData.map(row => ({
            rollNo: row.rollNo,
            name: row.name,
            username: row.username || '',
            gender: row.gender.toLowerCase()
          })));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add Students to {classData.name} {classData.section}</h3>
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
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">Roll No</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
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
            Save Students
          </button>
        </div>
      </form>
    </div>
  );
}
