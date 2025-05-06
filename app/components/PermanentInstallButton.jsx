'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'

export default function PermanentInstallButton({ size = "md", className = "" }) {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)

  useEffect(() => {
    const captureInstallPrompt = (e) => {
      e.preventDefault()
      setPromptInstall(e)
      setSupportsPWA(true)
    }

    const checkIfInstalled = () => {
      if (typeof window !== 'undefined') {
        // Check if it's marked as installed but verify with actual display mode
        if (localStorage.getItem('pwa-installed') === 'true') {
          // If it's marked as installed but not in standalone mode,
          // the user might have uninstalled it
          const isActuallyInstalled =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches;

          if (!isActuallyInstalled) {
            // The app is not actually installed, show the reset button
            setShowResetButton(true);
            return false;
          }

          setIsInstalled(true)
          return true
        }

        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches) {
          setIsInstalled(true)
          localStorage.setItem('pwa-installed', 'true')
          return true
        }
      }
      return false
    }

    const isCurrentlyInstalled = checkIfInstalled()

    if (!isCurrentlyInstalled) {
      window.addEventListener('beforeinstallprompt', captureInstallPrompt)
      window.addEventListener('visibilitychange', checkIfInstalled)
    }

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('pwa-installed', 'true')
      }
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt)
      window.removeEventListener('visibilitychange', checkIfInstalled)
    }
  }, [])

  const handleInstall = (evt) => {
    evt.preventDefault()

    if (promptInstall) {
      promptInstall.prompt()
      promptInstall.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true)
          localStorage.setItem('pwa-installed', 'true')
        }
      })
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('force-pwa-install', 'true')

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

        if (isIOS) {
          alert('To install this app: tap the share button below, then "Add to Home Screen"')
        } else {
          alert('To install, open this page in Chrome and tap the menu button, then "Install app" or "Add to Home Screen"')
        }
      }
    }
  }

  const resetInstallStatus = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pwa-installed')
      setIsInstalled(false)
      setShowResetButton(false)
      window.location.reload() // Reload to allow browser to trigger install prompt again
    }
  }

  // If the reset button should be shown, show it instead of nothing
  if (showResetButton) {
    return (
      <Button
        onClick={resetInstallStatus}
        size={size}
        className={className}
      >
        <RefreshCw className="mr-2" size={18} /> Reinstall App
      </Button>
    )
  }

  // Don't render button if installed and not showing reset button
  if (isInstalled) {
    return null
  }

  return (
    <Button
      onClick={handleInstall}
      size={size}
      className={className}
    >
      <Download className="mr-2" size={18} /> Install App
    </Button>
  )
}