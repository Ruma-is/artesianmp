'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  buyer_id: string | null
  status: string
  total_amount: number
  tracking_number?: string | null
  ship_provider?: string | null
  payment_status?: string | null
  shipping_address?: any
  created_at: string | null
  [key: string]: any
}

export default function EditOrderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string
  const supabase = createClient()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form fields
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipProvider, setShipProvider] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')

  useEffect(() => {
    if (user && orderId) {
      fetchOrder()
    }
  }, [user, orderId])

  const fetchOrder = async () => {
    if (!user || !orderId) return
    
    setDataLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error

      if (data) {
        setOrder(data)
        setStatus(data.status || 'pending')
        setTrackingNumber(data.tracking_number || '')
        setShipProvider((data as any).ship_provider || '')
        setPaymentStatus(data.payment_status || 'pending')
      }
      
    } catch (error) {
      console.error('❌ Error fetching order:', error)
    }
    
    setDataLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!order) return
    
    setSaving(true)
    setSuccessMessage('')
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          tracking_number: trackingNumber || null,
          ship_provider: shipProvider || null,
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)

      if (error) throw error

      setSuccessMessage('✅ Order updated successfully!')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/manage-orders')
      }, 2000)
      
    } catch (error) {
      console.error('❌ Error updating order:', error)
      alert('Failed to update order. Please try again.')
    }
    
    setSaving(false)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b'
      case 'confirmed': return '#3b82f6'
      case 'shipped': return '#8b5cf6'
      case 'delivered': return '#10b981'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-2xl font-semibold" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
            Loading order...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login?redirect=/dashboard/manage-orders')
    return null
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-6">😔</div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
            Order Not Found
          </h2>
          <Link href="/dashboard/manage-orders">
            <button 
              className="px-8 py-4 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#926829', minHeight: '48px' }}
            >
              ← Back to Orders
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Header Section */}
      <div className="border-b py-8 md:py-12" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="animate-fade-in">
            <Link href="/dashboard/manage-orders">
              <button className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors">
                ← Back to Manage Orders
              </button>
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              ✏️ Update Order
            </h1>
            <div className="w-20 md:w-24 h-1 md:h-1.5 rounded-full mb-3" style={{ backgroundColor: '#926829' }}></div>
            <p className="text-base md:text-lg text-gray-600">
              Order #{order.order_number}
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 animate-fade-in">
            <p className="text-green-800 font-bold text-center">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Order Info Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8 animate-slide-up" style={{ borderColor: '#e8dfd0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
              Order Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="font-bold text-lg" style={{ color: '#926829' }}>{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="font-bold text-lg" style={{ color: '#926829' }}>₹{order.total_amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-semibold text-gray-700">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <span 
                  className="inline-block px-4 py-2 rounded-lg font-bold text-white capitalize text-sm"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Update Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
              Update Details
            </h2>
            
            <div className="space-y-6">
              {/* Order Status */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Order Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all font-semibold"
                  style={{ 
                    borderColor: '#e8dfd0',
                    minHeight: '44px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#926829'
                    e.target.style.boxShadow = '0 0 0 3px rgba(146, 104, 41, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8dfd0'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✓ Confirmed</option>
                  <option value="shipped">🚚 Shipped</option>
                  <option value="delivered">✅ Delivered</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Update the current status of this order</p>
              </div>

              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., TRK123456789"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#e8dfd0',
                    minHeight: '44px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#926829'
                    e.target.style.boxShadow = '0 0 0 3px rgba(146, 104, 41, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8dfd0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">Enter the courier tracking number</p>
              </div>

              {/* Shipping Provider */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Shipping Provider
                </label>
                <select
                  value={shipProvider}
                  onChange={(e) => setShipProvider(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#e8dfd0',
                    minHeight: '44px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#926829'
                    e.target.style.boxShadow = '0 0 0 3px rgba(146, 104, 41, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8dfd0'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="">Select courier...</option>
                  <option value="Blue Dart">🔵 Blue Dart</option>
                  <option value="Delhivery">📦 Delhivery</option>
                  <option value="DTDC">🚚 DTDC</option>
                  <option value="India Post">📮 India Post</option>
                  <option value="FedEx">✈️ FedEx</option>
                  <option value="Ekart">🛒 Ekart</option>
                  <option value="Shadowfax">⚡ Shadowfax</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Select the courier service</p>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#e8dfd0',
                    minHeight: '44px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#926829'
                    e.target.style.boxShadow = '0 0 0 3px rgba(146, 104, 41, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8dfd0'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="completed">✅ Completed</option>
                  <option value="failed">❌ Failed</option>
                  <option value="refunded">💰 Refunded</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Update payment status if needed</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Card (Read-only) */}
          {order.shipping_address && (
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                Shipping Address
              </h2>
              <div className="bg-gray-50 rounded-xl p-6" style={{ backgroundColor: '#f5efe6' }}>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-bold text-lg">{order.shipping_address.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-semibold text-gray-700">{order.shipping_address.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pincode</p>
                    <p className="font-semibold text-gray-700">{order.shipping_address.pincode || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#926829', minHeight: '48px' }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#7a5621')}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#926829')}
            >
              {saving ? '💾 Saving...' : '✅ Save Changes'}
            </button>

            <Link href="/dashboard/manage-orders" className="flex-1">
              <button
                type="button"
                className="w-full px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 transform active:scale-95 hover:scale-105"
                style={{ color: '#926829', borderColor: '#926829', minHeight: '48px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#926829'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#926829'
                }}
              >
                ← Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
