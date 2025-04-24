'use client'

import { useState } from 'react'
import { db } from '../../../lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  deleteDoc,
  query,
  limit,
} from 'firebase/firestore'
import Button from '../ui/Button'

export default function TestFirebase() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testWrite = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Write a test document to Firestore
      const testCol = collection(db, 'test_collection')
      const testDoc = await addDoc(testCol, {
        timestamp: serverTimestamp(),
        message: 'Test document',
        random: Math.random().toString(36).substring(7),
      })

      setResult(`Successfully wrote document with ID: ${testDoc.id}`)

      // Clean up the test document to avoid cluttering the database
      setTimeout(async () => {
        try {
          await deleteDoc(testDoc)
          setResult((prev) => `${prev}\nTest document deleted successfully.`)
        } catch (err) {
          console.error('Error deleting test document:', err)
        }
      }, 5000)
    } catch (err) {
      console.error('Error writing test document:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testRead = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Read test from Firestore
      const schoolsCol = collection(db, 'schools')
      const q = query(schoolsCol, limit(5))
      const schoolsSnapshot = await getDocs(q)

      setResult(
        `Successfully read from Firestore. Found ${schoolsSnapshot.docs.length} schools.\n` +
          `First few school IDs: ${schoolsSnapshot.docs
            .map((doc) => doc.id)
            .join(', ')
            .substring(0, 100)}`
      )
    } catch (err) {
      console.error('Error reading from Firestore:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-md shadow my-4">
      <h2 className="text-lg font-bold mb-4">Firebase Test Tools</h2>

      <div className="flex space-x-4 mb-4">
        <Button onClick={testWrite} disabled={loading}>
          {loading ? 'Testing...' : 'Test Write Access'}
        </Button>

        <Button onClick={testRead} disabled={loading}>
          {loading ? 'Testing...' : 'Test Read Access'}
        </Button>
      </div>

      {result && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <p className="text-sm text-green-700 whitespace-pre-line">{result}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-2">
        <p>
          Use these buttons to verify that your Firebase connection is working
          properly.
        </p>
      </div>
    </div>
  )
}
