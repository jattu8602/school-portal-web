'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function PermanentInstallButton({ size = "md", className = "" }) {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const captureInstallPrompt = (e) => {
      e.preventDefault()
      setPromptInstall(e)
      setSupportsPWA(true)
    }

    const checkIfInstalled = () => {
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('pwa-installed') === 'true') {
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

  // Don't render button if installed
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