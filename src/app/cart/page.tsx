'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link href="/products">
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow flex gap-4">
                <div className="relative w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover rounded" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">🎨</div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-semibold min-w-[30px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">₹50</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-orange-600">₹{totalPrice + 50}</span>
              </div>
              <Link href="/checkout">
                <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-semibold">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
