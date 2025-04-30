'use client'

import { createContext, useState, useContext } from 'react'
import { Toast } from '../components/ui/Toast'

const ToastContext = createContext({
  showToast: () => {},
  toasts: [],
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success', duration = 5000) => {
    const id = Date.now()
    const newToast = { id, message, type, duration }

    setToasts(prevToasts => [...prevToasts, newToast])

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {toasts.map(toast => (
          <div key={toast.id} className="animate-enter">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)