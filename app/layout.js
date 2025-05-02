import './globals.css'
import { Inter } from 'next/font/google'

// Import Firebase initialization
import '../lib/firebase'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'School Portal',
  description: 'Manage teachers and students in your school',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  )
}
