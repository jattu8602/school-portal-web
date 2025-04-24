import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Hard-code the Firebase config for testing
const firebaseConfig = {
  apiKey: 'AIzaSyC6-KFXqY9Gf7YCYVEQpTSOVfl6iXSXKQ8',
  authDomain: 'vite-contact-b0a7a.firebaseapp.com',
  projectId: 'vite-contact-b0a7a',
  storageBucket: 'vite-contact-b0a7a.appspot.com', // Fixed storage bucket URL
  messagingSenderId: '715182976493',
  appId: '1:715182976493:web:5b44c8bc7a7ba04be7cbe4',
}

// Log the config for debugging
console.log('Firebase config being used:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
})

// Initialize Firebase
const app = initializeApp(firebaseConfig)
console.log('Firebase app initialized:', app.name)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
