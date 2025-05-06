'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if the app is already installed in different ways
    const checkIfInstalled = () => {
      // Method 1: Check standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }

      // Method 2: Check if installed via iOS "Add to Home Screen"
      if (window.navigator.standalone === true) {
        setIsInstalled(true)
        return
      }

      // Method 3: Check if app is in fullscreen mode (another indicator of installation)
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        setIsInstalled(true)
        return
      }
    }

    // Handle beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault()
      setPromptInstall(e)
      setSupportsPWA(true)
    }

    checkIfInstalled()
    window.addEventListener('beforeinstallprompt', handler)

    // Also check when app becomes visible (might have been installed in between)
    window.addEventListener('visibilitychange', checkIfInstalled)

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      console.log('PWA was installed')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('visibilitychange', checkIfInstalled)
    }
  }, [])

  const onClick = (evt) => {
    evt.preventDefault()
    if (!promptInstall) {
      return
    }
    promptInstall.prompt()

    // Wait for the user to respond to the prompt
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setIsInstalled(true)
      } else {
        console.log('User dismissed the install prompt')
      }
    })
  }

  if (!supportsPWA || isInstalled) {
    return null
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        onClick={onClick}
        className="bg-black hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2"
        aria-label="Install App"
      >
        <Download size={20} className="md:mr-2" />
        <span className="hidden md:inline">Install App</span>
      </Button>
    </div>
  )
}