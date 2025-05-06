
import { Inter } from "next/font/google"
import "@/app/globals.css"
import InstallPWA from './components/InstallPWA'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PresentSir",
  description:
    "Streamline attendance, manage classes, track performance, and more with our comprehensive school management system.",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: '#4f46e5',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <InstallPWA />
      </body>
    </html>
  )
}