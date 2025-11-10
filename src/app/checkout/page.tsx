'use client'

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { initiateUPIPayment } from '@/lib/utils/upiPayment'
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4 animate-bounce-slow">⏳</div>
          <p className="text-xl md:text-2xl font-semibold" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>Loading...</p>
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-6xl md:text-7xl lg:text-8xl mb-4 md:mb-6 animate-bounce-subtle">🛒</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
            Your Cart is Empty
          </h2>
          <div className="w-20 md:w-24 h-1.5 mx-auto rounded-full mb-4 md:mb-6 animate-expand-center" style={{ backgroundColor: '#926829' }}></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
            Add some handcrafted items to proceed with checkout
          </p>
          <Link href="/products">
            <button className="px-8 md:px-10 py-3 md:py-4 text-white rounded-xl font-semibold transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 shadow-lg md:hover:shadow-2xl text-sm md:text-base"
                    style={{ backgroundColor: '#926829', minHeight: '44px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // Verify user is still authenticated
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !currentUser) {
        console.error('❌ Authentication error:', authError)
        alert('Your session has expired. Please log in again.')
        router.push('/auth/login?redirect=/checkout')
        return
      }

      // Double-check that the user ID matches
      if (currentUser.id !== user?.id) {
        console.error('❌ User ID mismatch!')
        console.error('Context user:', user?.id)
        console.error('Current user:', currentUser.id)
        alert('Authentication error. Please log in again.')
        router.push('/auth/login?redirect=/checkout')
        return
      }

      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      console.log('🛒 Creating order for user:', currentUser.id)
      console.log('🛒 User email:', currentUser.email)
      console.log('🛒 Order number:', orderNumber)
      
      // Prepare shipping address as JSON
      const shippingAddress = {
        full_name: formData.fullName,
        address: formData.address,
        pincode: formData.pincode
      }

      // Create order in database with verified user ID
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: currentUser.id,  // Use verified current user ID
          order_number: orderNumber,
          total_amount: totalPrice + 50,
          shipping_fee: 50,
          tax_amount: 0,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'upi',
          shipping_address: shippingAddress
        })
        .select()
        .single()

      if (orderError) {
        console.error('❌ Order creation error:', orderError)
        alert(`Failed to create order: ${orderError.message}`)
        setFormLoading(false)
        return
      }
      
      console.log('✅ Order created successfully!')
      console.log('✅ Order ID:', orderData.id)
      console.log('✅ Order Number:', orderData.order_number)
      console.log('✅ Buyer ID:', orderData.buyer_id)

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        
      if (itemsError) {
        console.error('❌ Order items error:', itemsError)
        alert(`Failed to add order items: ${itemsError.message}`)
        setFormLoading(false)
        return
      }

      console.log('✅ Order items created successfully!')

      // Clear cart immediately after successful order creation
      clearCart()

      // Use Direct UPI Payment (PhonePe gateway requires merchant onboarding)
      const totalAmount = totalPrice + 50
      const upiId = 'rumurumi72@okhdfcbank'
      const merchantName = 'Artisan Marketplace'
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR&tn=Order%20${orderNumber}`
      
      console.log('� Using Direct UPI Payment')
      console.log('📱 UPI ID:', upiId)
      console.log('� Amount:', totalAmount)
      
      alert(`Order created successfully!\n\nOrder Number: ${orderNumber}\n\nTotal: ₹${totalAmount}\n\nOpening UPI payment...`)
      
      // Open UPI app
      window.location.href = upiLink
      
      // Redirect to orders after small delay
      setTimeout(() => {
        router.push('/orders')
      }, 2000)

    } catch (error) {
      console.error('❌ Order failed:', error)
      alert('Failed to create order. Please try again.')
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Header Section */}
      <div className="border-b py-5 md:py-6" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              Secure Checkout
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Complete your order and support traditional artisans</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
          {/* Checkout Form - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg border-2 animate-slide-up" style={{ borderColor: '#e8dfd0' }}>
              <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6 pb-3 md:pb-4 border-b" style={{ borderColor: '#e8dfd0' }}>
                <span className="text-2xl md:text-3xl">🚚</span>
                <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                  Shipping Information
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#926829' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none text-base"
                    style={{ borderColor: '#e8dfd0', minHeight: '44px' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#926829' }}>
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none text-base"
                    style={{ borderColor: '#e8dfd0' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                    placeholder="House no, Street, City, State"
                  />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#926829' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none text-base"
                    style={{ borderColor: '#e8dfd0', minHeight: '44px' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                    placeholder="Enter 6-digit pincode"
                  />
                </div>

                <div className="pt-3 md:pt-4 border-t-2 animate-fade-in" style={{ borderColor: '#e8dfd0', animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <span className="text-xl md:text-2xl">💳</span>
                    <h3 className="font-bold text-base md:text-lg" style={{ color: '#926829' }}>Payment Method</h3>
                  </div>
                  <div className="p-4 md:p-5 border-2 rounded-xl transition-all duration-300 md:hover:shadow-md" 
                       style={{ borderColor: '#926829', backgroundColor: '#f5efe6' }}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2 md:gap-3">
                        <input type="radio" checked readOnly className="w-4 h-4 md:w-5 md:h-5 accent-[#926829]" />
                        <div>
                          <p className="font-bold text-base md:text-lg" style={{ color: '#926829' }}>UPI Payment</p>
                          <p className="text-xs md:text-sm text-gray-600">Google Pay, PhonePe, Paytm & more</p>
                        </div>
                      </div>
                      <span className="text-3xl md:text-4xl">📱</span>
                    </label>
                  </div>
                  
                  <div className="mt-3 md:mt-4 p-3 rounded-lg" style={{ backgroundColor: '#fff9e6' }}>
                    <p className="text-xs text-gray-600 flex items-center gap-2">
                      <span>🔒</span>
                      <span>Your payment is secured with 256-bit encryption</span>
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3 md:py-4 text-white rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 shadow-lg md:hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-5 md:mt-6 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#926829', minHeight: '48px' }}
                  onMouseEnter={(e) => !formLoading && (e.currentTarget.style.backgroundColor = '#7a5621')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
                >
                  {formLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{totalPrice + 50} with UPI</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="bg-white p-3 md:p-4 rounded-lg shadow border text-center" style={{ borderColor: '#e8dfd0' }}>
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">🔒</div>
                <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
              </div>
              <div className="bg-white p-3 md:p-4 rounded-lg shadow border text-center" style={{ borderColor: '#e8dfd0' }}>
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">✅</div>
                <p className="text-xs font-semibold text-gray-700">100% Authentic</p>
              </div>
              <div className="bg-white p-3 md:p-4 rounded-lg shadow border text-center" style={{ borderColor: '#e8dfd0' }}>
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">↩️</div>
                <p className="text-xs font-semibold text-gray-700">Easy Returns</p>
              </div>
            </div>

            <div className="mt-4 md:mt-5 p-3 md:p-4 rounded-lg" style={{ backgroundColor: '#f5efe6' }}>
              <p className="text-xs text-gray-600 text-center">
                💡 All prices include applicable taxes
              </p>
            </div>
          </div>

          {/* Order Summary - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg border-2 lg:sticky lg:top-24 animate-scale-in" 
                 style={{ borderColor: '#e8dfd0' }}>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5 pb-3 md:pb-4 border-b" style={{ borderColor: '#e8dfd0' }}>
                <span className="text-xl md:text-2xl">📦</span>
                <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                  Order Summary
                </h2>
              </div>

              <div className="space-y-2 md:space-y-3 mb-3 md:mb-4 pb-3 md:pb-4 border-b" style={{ borderColor: '#e8dfd0' }}>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-xs md:text-sm">
                    <span>{item.title} × {item.quantity}</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-3 md:mb-4 pb-3 md:pb-4 border-b text-sm md:text-base" style={{ borderColor: '#e8dfd0' }}>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">₹50</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-base md:text-lg">
                <span>Total</span>
                <span style={{ color: '#926829' }}>₹{totalPrice + 50}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
