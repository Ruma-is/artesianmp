'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)

  const isActive = (path: string) => pathname === path

  const isAuthPage = pathname?.startsWith('/auth/')

  // Close navbar on route change
  useEffect(() => {
    setVisible(false)
  }, [pathname])

  // Click outside to close (only when auth pages and visible)
  useEffect(() => {
    if (!isAuthPage || !visible) return
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      if (navRef.current && !navRef.current.contains(target) && triggerRef.current && !triggerRef.current.contains(target)) {
        setVisible(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [isAuthPage, visible])

  // If not an auth page, show the normal sticky navbar
  if (!isAuthPage) {
    return (
      <nav className="shadow-lg sticky top-0 z-50 backdrop-blur-sm animate-slide-down" style={{ backgroundColor: 'rgba(146, 104, 41, 0.98)' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-100 transition-all duration-300 hover:scale-105 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              Artisan Marketplace
            </Link>

            <div className="flex gap-8 items-center">
              <Link 
                href="/"
                className={`transition-all duration-300 hover:scale-110 relative group ${isActive('/') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}>
                Home
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              <Link 
                href="/products"
                className={`transition-all duration-300 hover:scale-110 relative group ${isActive('/products') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}>
                Products
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/products') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              <Link 
                href="/dashboard"
                className={`transition-all duration-300 hover:scale-110 relative group ${isActive('/dashboard') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}>
                Dashboard
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/dashboard') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              <Link 
                href="/cart"
                className={`relative transition-all duration-300 hover:scale-110 group ${isActive('/cart') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}>
                🛒 Cart
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/cart') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce-subtle shadow-lg" style={{ color: '#926829' }}>
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                href="/auth/login"
                className="text-gray-100 hover:text-white transition-all duration-300 hover:scale-110"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="bg-white px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-md hover:shadow-xl hover:scale-105 transform"
                style={{ color: '#926829' }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // For auth pages: hidden by default, reveal when clicking the top tab
  return (
    <>
      {/* Clickable top tab - visible on auth pages */}
      <div
        ref={triggerRef}
        role="button"
        aria-label="Open navigation"
        onClick={() => setVisible((v) => !v)}
        className="fixed top-4 left-4 z-50 cursor-pointer select-none transition-all duration-300 hover:scale-110 animate-pulse-subtle"
        style={{ width: 'auto' }}
      >
        <div className={`px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 transition-all duration-300 ${visible ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}
             style={{ backgroundColor: 'white', color: '#926829' }}>
          <span className="text-lg">☰</span>
          <span className="font-medium">Menu</span>
        </div>
      </div>

      <nav
        ref={navRef}
        className={`shadow-lg fixed top-0 left-0 right-0 z-50 transform transition-all duration-500 ease-out backdrop-blur-sm ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        style={{ backgroundColor: 'rgba(146, 104, 41, 0.98)' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-100 transition-all duration-300 hover:scale-105 tracking-wide animate-fade-in" style={{ fontFamily: 'Georgia, serif' }}>
              Artisan Marketplace
            </Link>

            <div className="flex gap-8 items-center">
              <Link 
                href="/"
                className={`transition-all duration-300 hover:scale-110 relative group animate-slide-in ${isActive('/') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}
                style={{ animationDelay: '0.1s' }}>
                Home
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              <Link 
                href="/products"
                className={`transition-all duration-300 hover:scale-110 relative group animate-slide-in ${isActive('/products') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}
                style={{ animationDelay: '0.15s' }}>
                Products
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/products') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              <Link 
                href="/dashboard"
                className={`transition-all duration-300 hover:scale-110 relative group animate-slide-in ${isActive('/dashboard') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}
                style={{ animationDelay: '0.2s' }}>
                Dashboard
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/dashboard') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              <Link 
                href="/cart"
                className={`relative transition-all duration-300 hover:scale-110 group animate-slide-in ${isActive('/cart') ? 'text-white font-semibold' : 'text-gray-100 hover:text-white'}`}
                style={{ animationDelay: '0.25s' }}>
                🛒 Cart
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive('/cart') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce-subtle shadow-lg" style={{ color: '#926829' }}>
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                href="/auth/login"
                className="text-gray-100 hover:text-white transition-all duration-300 hover:scale-110 animate-slide-in"
                style={{ animationDelay: '0.3s' }}
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="bg-white px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-md hover:shadow-xl hover:scale-105 transform animate-slide-in"
                style={{ color: '#926829', animationDelay: '0.35s' }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
