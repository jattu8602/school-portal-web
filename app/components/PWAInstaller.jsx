'use client'

import PermanentInstallButton from './PermanentInstallButton'

export default function PWAInstaller() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <PermanentInstallButton
        className="bg-black hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 md:w-auto md:h-auto md:px-4 md:py-2"
      />
    </div>
  )
}