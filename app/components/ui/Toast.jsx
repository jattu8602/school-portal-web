'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function Toast({
  message,
  type = 'success',
  duration = 5000,
  onClose
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message || !isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className={`fixed top-4 right-4 z-50 shadow-lg border-l-4 ${getTypeStyles()} p-4 rounded-md flex items-start max-w-sm`} role="alert">
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 mr-2">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          if (onClose) onClose()
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts = [], removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(index)}
        />
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])

    // Auto remove toast after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { toasts, addToast, removeToast }
}