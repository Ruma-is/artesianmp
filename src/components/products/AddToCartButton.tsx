'use client'

import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    // Redirect to cart page after short delay
    setTimeout(() => {
      router.push('/cart')
    }, 500)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 ${
        added
          ? 'bg-green-600 text-white'
          : 'text-white'
      }`}
      style={{ 
        backgroundColor: added ? '#16a34a' : '#926829'
      }}
      onMouseEnter={(e) => {
        if (!added) {
          e.currentTarget.style.backgroundColor = '#7a5621'
        }
      }}
      onMouseLeave={(e) => {
        if (!added) {
          e.currentTarget.style.backgroundColor = '#926829'
        }
      }}
    >
      {added ? (
        <>
          <span>✓</span>
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <span>🛒</span>
          <span>Add to Cart</span>
        </>
      )}
    </button>
  )
}
