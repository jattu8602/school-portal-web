import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Store the auth state in memory
let authUser = null
let authStateListeners = []

// Initialize the auth state listener
onAuthStateChanged(auth, (user) => {
  authUser = user
  // Notify all listeners of the auth state change
  authStateListeners.forEach((listener) => listener(user))
})

export const getAuthUser = () => authUser

export const subscribeToAuthState = (listener) => {
  authStateListeners.push(listener)
  // Return unsubscribe function
  return () => {
    authStateListeners = authStateListeners.filter((l) => l !== listener)
  }
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!authUser
}

// Get user token
export const getUserToken = async () => {
  if (!authUser) return null
  return await authUser.getIdToken()
}

// Handle session expiration
export const handleSessionExpiration = async () => {
  try {
    if (authUser) {
      const token = await authUser.getIdToken(true)
      return token
    }
    return null
  } catch (error) {
    console.error('Session expired:', error)
    return null
  }
}
