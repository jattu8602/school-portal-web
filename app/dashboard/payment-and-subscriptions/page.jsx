'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function PaymentAndSubscriptionsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [schoolData, setSchoolData] = useState(null)
  const [activePlan, setActivePlan] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        loadSchoolData(currentUser.uid)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadSchoolData = async (schoolId) => {
    try {
      const schoolRef = doc(db, 'schools', schoolId)
      const schoolSnap = await getDoc(schoolRef)

      if (schoolSnap.exists()) {
        const data = schoolSnap.data()
        setSchoolData(data)
        setActivePlan(data.subscription?.plan || 'free')
      }
    } catch (error) {
      console.error('Error loading school data:', error)
    }
  }

  const subscribeToPlan = async (plan) => {
    if (!user) return

    try {
      // In a real app, you would integrate with a payment gateway here
      // For demo purposes, we'll just update the plan directly

      const subscriptionData = {
        plan: plan,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'active',
        updatedAt: serverTimestamp()
      }

      const schoolRef = doc(db, 'schools', user.uid)
      await setDoc(schoolRef, {
        subscription: subscriptionData,
        updatedAt: serverTimestamp()
      }, { merge: true })

      setActivePlan(plan)
      alert(`Successfully subscribed to ${plan} plan!`)
    } catch (error) {
      console.error('Error subscribing to plan:', error)
      alert('Error subscribing to plan: ' + error.message)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      period: 'month',
      description: 'Basic features for small schools',
      features: [
        'Up to 50 students',
        'Up to 5 teachers',
        'Basic attendance tracking',
        'Basic fee management',
        'Email support'
      ],
      buttonText: 'Current Plan',
      disabled: true
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₹999',
      period: 'month',
      description: 'Enhanced features for growing schools',
      features: [
        'Up to 200 students',
        'Up to 20 teachers',
        'Advanced attendance tracking',
        'Fee management with receipts',
        'Timetable management',
        'Email and chat support'
      ],
      buttonText: 'Subscribe',
      highlight: activePlan === 'basic'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '₹1999',
      period: 'month',
      description: 'Comprehensive solution for established schools',
      features: [
        'Unlimited students',
        'Unlimited teachers',
        'All features from Basic plan',
        'Examination management',
        'Parent portal access',
        'SMS notifications',
        'Priority support'
      ],
      buttonText: 'Subscribe',
      highlight: activePlan === 'premium'
    }
  ]

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
      <h1 className="text-3xl font-bold mb-2">Payment & Subscriptions</h1>
      <p className="text-gray-600 mb-8">Choose the right plan for your school's needs</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all ${
              plan.highlight
                ? 'border-primary-500 transform scale-105 shadow-lg'
                : 'border-transparent'
            }`}
          >
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
              <p className="mt-2 text-gray-600">{plan.description}</p>
            </div>

            <div className="px-6 py-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  onClick={() => subscribeToPlan(plan.id)}
                  disabled={activePlan === plan.id || plan.disabled}
                  className={`w-full px-4 py-2 rounded-md text-center ${
                    activePlan === plan.id
                      ? 'bg-green-100 text-green-800 font-medium'
                      : plan.disabled
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {activePlan === plan.id ? 'Current Plan' : plan.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schoolData?.subscription ? (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(schoolData.subscription.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {schoolData.subscription.plan.charAt(0).toUpperCase() + schoolData.subscription.plan.slice(1)} Plan
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schoolData.subscription.plan === 'free'
                      ? '₹0'
                      : schoolData.subscription.plan === 'basic'
                        ? '₹999'
                        : '₹1999'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 hover:text-primary-900">
                    <a href="#">Download</a>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
