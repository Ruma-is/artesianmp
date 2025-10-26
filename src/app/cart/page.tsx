'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemove = (id: string) => {
    setRemovingId(id)
    setTimeout(() => {
      removeFromCart(id)
      setRemovingId(null)
    }, 300)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-subtle">🛒</div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
            Your Cart is Empty
          </h2>
          <div className="w-24 h-1.5 mx-auto rounded-full mb-6 animate-expand-center" style={{ backgroundColor: '#926829' }}></div>
          <p className="text-xl text-gray-600 mb-8">
            Discover handcrafted treasures and start your collection!
          </p>
          <Link href="/products">
            <button className="px-10 py-4 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center gap-2 mx-auto"
                    style={{ backgroundColor: '#926829' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
              <span>Browse Products</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const shippingCost = totalPrice > 1000 ? 0 : 50

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Header Section */}
      <div className="border-b py-8" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                Shopping Cart
              </h1>
              <p className="text-gray-600 text-lg">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Link href="/products">
              <button className="px-6 py-3 border-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      style={{ borderColor: '#926829', color: '#926829' }}>
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border-2 transition-all duration-300 animate-slide-up ${
                  removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ 
                  borderColor: '#e8dfd0',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-32 h-32 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden group">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover transform group-hover:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-5xl">🎨</div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                         style={{ backgroundColor: 'rgba(146, 104, 41, 0.9)' }}>
                      ✨
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2 text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">Handcrafted by Ravi Kumar</p>
                    <p className="font-bold text-2xl mb-4" style={{ color: '#926829' }}>
                      ₹{item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 border-2 rounded-lg p-1" style={{ borderColor: '#e8dfd0' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-md font-bold transition-all duration-200 hover:scale-110 flex items-center justify-center"
                          style={{ backgroundColor: '#f5efe6', color: '#926829' }}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="font-bold min-w-[40px] text-center text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md font-bold transition-all duration-200 hover:scale-110 flex items-center justify-center"
                          style={{ backgroundColor: '#f5efe6', color: '#926829' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="ml-auto px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        style={{ color: '#dc2626' }}
                      >
                        <span>🗑️</span>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-3xl" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 sticky top-24 animate-scale-in" 
                 style={{ borderColor: '#e8dfd0' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b-2" style={{ borderColor: '#e8dfd0' }}>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                {totalPrice < 1000 && (
                  <p className="text-sm text-gray-500 italic">
                    💡 Add ₹{1000 - totalPrice} more for free shipping!
                  </p>
                )}
              </div>

              <div className="flex justify-between font-bold text-2xl mb-6 pb-6 border-b-2" style={{ borderColor: '#e8dfd0' }}>
                <span>Total</span>
                <span style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  ₹{totalPrice + shippingCost}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b-2" style={{ borderColor: '#e8dfd0' }}>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs text-gray-600 font-medium">Secure</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🚚</div>
                  <p className="text-xs text-gray-600 font-medium">Fast Ship</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">↩️</div>
                  <p className="text-xs text-gray-600 font-medium">Returns</p>
                </div>
              </div>

              <Link href="/checkout">
                <button className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#926829' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </button>
              </Link>

              <p className="text-center text-xs text-gray-500 mt-4">
                All prices include applicable taxes
              </p>
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="mt-12 p-8 rounded-2xl text-center animate-fade-in" style={{ backgroundColor: '#926829' }}>
          <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Support Traditional Artisans
          </h3>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto">
            Every purchase helps preserve ancient crafts and supports rural communities across India
          </p>
        </div>
      </div>
    </div>
  )
}
