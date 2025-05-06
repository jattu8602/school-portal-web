'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [forceShow, setForceShow] = useState(false)

  useEffect(() => {
    // Try to retrieve the install prompt and show install button
    const captureInstallPrompt = (e) => {
      e.preventDefault()
      setPromptInstall(e)
      setSupportsPWA(true)
      console.log('PWA install prompt captured')
    }

    // Check if the app is already installed in different ways
    const checkIfInstalled = () => {
      // First check localStorage to see if we previously marked it as installed
      if (typeof window !== 'undefined' && localStorage.getItem('pwa-installed') === 'true') {
        setIsInstalled(true)
        return true
      }

      // Method 1: Check standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        // Save the status so we remember for next time
        localStorage.setItem('pwa-installed', 'true')
        return true
      }

      // Method 2: Check if installed via iOS "Add to Home Screen"
      if (window.navigator.standalone === true) {
        setIsInstalled(true)
        localStorage.setItem('pwa-installed', 'true')
        return true
      }

      // Method 3: Check if app is in fullscreen mode (another indicator of installation)
      if (window.matchMedia('(display-mode: fullscreen)').matches) {
        setIsInstalled(true)
        localStorage.setItem('pwa-installed', 'true')
        return true
      }

      // Method 4: Check minimal-ui mode (another PWA display mode)
      if (window.matchMedia('(display-mode: minimal-ui)').matches) {
        setIsInstalled(true)
        localStorage.setItem('pwa-installed', 'true')
        return true
      }

      // Method 5: Check if this is a PWA context based on URL
      if (window.location.href.includes('?source=pwa') ||
          document.referrer.includes('?source=pwa')) {
        setIsInstalled(true)
        localStorage.setItem('pwa-installed', 'true')
        return true
      }

      return false
    }

    // Force show the button if requested in localStorage
    if (typeof window !== 'undefined') {
      // Check if the user requested to explicitly show the install button
      const shouldForce = localStorage.getItem('force-pwa-install') === 'true'
      setForceShow(shouldForce)

      // Clear this after reading once
      if (shouldForce) {
        localStorage.removeItem('force-pwa-install')
      }
    }

    // Initial check
    const isCurrentlyInstalled = checkIfInstalled()

    // If not installed, listen for the beforeinstallprompt event
    if (!isCurrentlyInstalled) {
      window.addEventListener('beforeinstallprompt', captureInstallPrompt)

      // Also check when app becomes visible (might have been installed in between)
      window.addEventListener('visibilitychange', checkIfInstalled)
    }

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      // Mark as installed in localStorage for future visits
      if (typeof window !== 'undefined') {
        localStorage.setItem('pwa-installed', 'true')
      }
      console.log('PWA was installed')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt)
      window.removeEventListener('visibilitychange', checkIfInstalled)
    }
  }, [])

  const onClick = (evt) => {
    evt.preventDefault()

    // If we have a prompt, show it
    if (promptInstall) {
      promptInstall.prompt()

      // Wait for the user to respond to the prompt
      promptInstall.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
          setIsInstalled(true)
          localStorage.setItem('pwa-installed', 'true')
        } else {
          console.log('User dismissed the install prompt')
        }
      })
    } else {
      // No prompt available - show instructions for manual install
      if (typeof window !== 'undefined') {
        // Force show install button on next page load
        localStorage.setItem('force-pwa-install', 'true')

        // Check if iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

        if (isIOS) {
          alert('To install this app: tap the share button below, then "Add to Home Screen"')
        } else {
          alert('To install, open this page in Chrome and tap the menu button, then "Install app" or "Add to Home Screen"')
        }

        // Refresh to trigger the browser's install prompt
        window.location.reload()
      }
    }
  }

  // Provide a way for users to reset the installation status (for development)
  const resetInstallStatus = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pwa-installed')
      window.location.reload()
    }
  }

  // Show button if:
  // 1. Browser supports PWA and it's not installed, OR
  // 2. Force show is enabled (user explicitly wanted to see it)
  if ((!supportsPWA || isInstalled) && !forceShow) {
    return null
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        onClick={onClick}
        className="bg-black hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 md:w-auto md:h-auto md:px-4 md:py-2"
        aria-label="Install App"
      >
        <Download size={24} className="md:mr-2" />
        <span className="hidden md:inline">Install App</span>
      </Button>
    </div>
  )
}