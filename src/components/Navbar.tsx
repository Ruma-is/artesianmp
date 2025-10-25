'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function Navbar() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition">
            Artisan Marketplace
          </Link>

          <div className="flex gap-6 items-center">
            <Link 
              href="/"
              className={`hover:text-orange-600 transition ${
                isActive('/') ? 'text-orange-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Home
            </Link>

            <Link 
              href="/products"
              className={`hover:text-orange-600 transition ${
                isActive('/products') ? 'text-orange-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Products
            </Link>

            <Link 
              href="/dashboard"
              className={`hover:text-orange-600 transition ${
                isActive('/dashboard') ? 'text-orange-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Dashboard
            </Link>

            <Link 
              href="/cart"
              className={`relative hover:text-orange-600 transition ${
                isActive('/cart') ? 'text-orange-600 font-semibold' : 'text-gray-700'
              }`}
            >
              🛒 Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-orange-600 transition"
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
