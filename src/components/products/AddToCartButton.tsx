'use client'

import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-orange-600 text-white hover:bg-orange-700'
      }`}
    >
      {added ? '✓ Added to Cart!' : 'Add to Cart'}
    </button>
  )
}
