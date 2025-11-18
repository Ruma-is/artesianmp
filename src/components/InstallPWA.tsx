'use client'

import { useState, useEffect } from 'react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    
    setDeferredPrompt(null)
  }

  if (!showInstall) return null

  return (
    <button
      onClick={handleInstall}
      className="fixed top-20 right-6 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold text-white"
      style={{ 
        backgroundColor: '#926829',
        boxShadow: '0 8px 32px rgba(146, 104, 41, 0.4)'
      }}
    >
      <span>📱</span>
      <span>Install App</span>
    </button>
  )
}
