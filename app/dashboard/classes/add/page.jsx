'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, doc, serverTimestamp } from 'firebase/firestore'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function AddClassPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    level: 'Primary',
    teacher: '',
    boysCount: 0,
    girlsCount: 0,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'boysCount' || name === 'girlsCount' ? parseInt(value, 10) || 0 : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!formData.name) {
      setError('Class name is required')
      setIsSubmitting(false)
      return
    }

    try {
      const classesRef = collection(db, 'schools', user.uid, 'classes')
      await addDoc(classesRef, {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      router.push('/dashboard/classes')
    } catch (error) {
      console.error('Error adding class:', error)
      setError('Failed to add class. Please try again.')
      setIsSubmitting(false)
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Class</h1>
        <p className="text-gray-500">Create a new class for your school</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Input
              label="Class Name (e.g. 5A, 6B)"
              id="name"
              name="name"
              placeholder="Enter class name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Level
              </label>
              <select
                name="level"
                id="level"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>

            <Input
              label="Teacher Name"
              id="teacher"
              name="teacher"
              placeholder="Enter teacher name"
              value={formData.teacher}
              onChange={handleInputChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Boys Count"
                id="boysCount"
                name="boysCount"
                type="number"
                min="0"
                placeholder="Enter number of boys"
                value={formData.boysCount}
                onChange={handleInputChange}
              />

              <Input
                label="Girls Count"
                id="girlsCount"
                name="girlsCount"
                type="number"
                min="0"
                placeholder="Enter number of girls"
                value={formData.girlsCount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/classes')}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}