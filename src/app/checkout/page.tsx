'use client'


import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()


  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    pincode: ''
  })


  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl">Loading...</p>
        </div>
      </div>
    )
  }


  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/login?redirect=/checkout')
    return null
  }


  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <Link href="/products" className="text-orange-600 hover:text-orange-700 underline">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    setFormLoading(true)


    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      console.log('Creating order for user:', user.id)
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          order_number: orderNumber,
          total_amount: totalPrice + 50,
          status: 'pending',
          payment_method: 'upi',
          shipping_address: formData
        })
        .select()
        .single()


      if (error) {
        console.error('Order creation error:', error)
        alert(`Database Error: ${error.message}\nCode: ${error.code}\nDetails: ${error.details || 'None'}`)
        throw error
      }


      console.log('Order created successfully:', data.id)


      // Insert order items
      const orderItems = items.map(item => ({
        order_id: data.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }))


      console.log('Inserting order items:', orderItems)


      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        
      if (itemsError) {
        console.error('Order items error:', itemsError)
        alert(`Order Items Error: ${itemsError.message}\nCode: ${itemsError.code}`)
        throw itemsError
      }


      console.log('Order items inserted successfully')


      const totalAmount = totalPrice + 50
      const upiId = 'rumurumi72@okhdfcbank'
      const merchantName = 'Artisan Marketplace'
      const orderId = data.id.substring(0, 8)
      
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR&tn=Order%20${orderId}`
      
      window.location.href = upiLink
      
      setTimeout(() => {
        clearCart()
        router.push(`/orders/${data.id}`)
      }, 2000)


    } catch (error) {
      console.error('Order failed:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>


        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="House no, Street, City, State"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter 6-digit pincode"
                  />
                </div>


                <div className="pt-4 border-t">
                  <h3 className="font-bold mb-3">Payment Method</h3>
                  <div className="p-4 border-2 border-orange-500 rounded-lg bg-orange-50">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="radio" checked readOnly className="mr-3 w-5 h-5" />
                        <div>
                          <p className="font-semibold text-lg">UPI Payment</p>
                          <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                      <span className="text-4xl">📱</span>
                    </label>
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 mt-6"
                >
                  {formLoading ? 'Processing...' : 'Pay with UPI'}
                </button>
              </form>
            </div>
          </div>


          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.title} × {item.quantity}</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>


              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">₹50</span>
                </div>
              </div>


              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-600">₹{totalPrice + 50}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 