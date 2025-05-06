'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Check, ExternalLink } from 'lucide-react'

export default function PermanentInstallButton({ className = "" }) {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [buttonText, setButtonText] = useState("Install App")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check installation status
    const checkIfInstalled = () => {
      // Check if marked as installed in localStorage
      if (localStorage.getItem('pwa-installed') === 'true') {
        setIsInstalled(true)
        setButtonText("Open App")
        return true;
      }

      // Standard install detection methods
      if (window.matchMedia('(display-mode: standalone)').matches ||
          window.matchMedia('(display-mode: fullscreen)').matches ||
          window.matchMedia('(display-mode: minimal-ui)').matches ||
          window.navigator.standalone === true) {
        setIsInstalled(true)
        setButtonText("Open App")
        localStorage.setItem('pwa-installed', 'true')
        return true;
      }

      return false;
    };

    // Capture install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setPromptInstall(e);
      setSupportsPWA(true);
      setButtonText("Install App");
    };

    // Handle app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setButtonText("Open App");
      localStorage.setItem('pwa-installed', 'true');
    };

    // Initialize
    const init = async () => {
      checkIfInstalled();
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      setIsLoading(false);
    };

    init();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = () => {
    if (isInstalled) {
      // App is installed, try to open it
      if ('standalone' in window.navigator && window.navigator.standalone === false) {
        // iOS specific handling
        alert("This app is already installed. Look for PresentSir on your home screen.");
      } else {
        // For Android/desktop, try to redirect to the app's URL
        const appUrl = window.location.origin + '?source=pwa';
        window.open(appUrl, '_blank');
      }
    } else if (promptInstall) {
      // Show installation prompt
      promptInstall.prompt();

      promptInstall.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setButtonText("Open App");
          localStorage.setItem('pwa-installed', 'true');
        }
      });
    } else {
      // No install prompt available, show manual instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (isIOS) {
        alert('To install this app: tap the share button below, then "Add to Home Screen"');
      } else {
        alert('To install, open this page in Chrome and tap the menu button, then "Install app" or "Add to Home Screen"');
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      className={`${className} flex items-center justify-center gap-2`}
      variant={isInstalled ? "outline" : "default"}
    >
      {isInstalled ? (
        <>
          <ExternalLink size={16} />
          <span>{buttonText}</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>{buttonText}</span>
        </>
      )}
    </Button>
  );
}