'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Define Order type
interface Order {
  id: string
  order_number?: string | null
  status: string | null
  total_amount: number | null
  tracking_number?: string | null
  ship_provider?: string | null
  shipping_address?: any | null
  buyer_id?: string | null
  created_at?: string | null
  updated_at?: string | null
  notes?: string | null
  payment_method?: string | null
  payment_status?: string | null
  razorpay_order_id?: string | null
  shipping_fee?: number | null
  tax_amount?: number | null
  [key: string]: any
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string | undefined
  const supabase = createClient()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        setOrder(data)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [id, supabase])

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b'
      case 'confirmed': return '#3b82f6'
      case 'shipped': return '#8b5cf6'
      case 'delivered': return '#10b981'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳'
      case 'confirmed': return '✓'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '📦'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-2xl font-semibold" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-6">😔</div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
            Order Not Found
          </h2>
          <div className="w-24 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: '#926829' }}></div>
          <p className="text-lg text-gray-600 mb-8">
            The order you're looking for doesn't exist
          </p>
          <Link href="/orders">
            <button 
              className="px-8 py-4 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: '#926829', minHeight: '48px' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
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
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="animate-fade-in">
            <Link href="/orders">
              <button className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors">
                ← Back to Orders
              </button>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                  Order #{order.order_number || order.id}
                </h1>
                <p className="text-base md:text-lg text-gray-600">
                  Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getStatusIcon(order.status)}</span>
                <span 
                  className="px-6 py-3 rounded-xl text-lg font-bold text-white capitalize shadow-lg"
                  style={{ backgroundColor: getStatusColor(order.status) }}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8 animate-slide-up" style={{ borderColor: '#e8dfd0' }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#e8dfd0' }}>
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-lg" style={{ color: '#926829' }}>
                    ₹{((order.total_amount || 0) - (order.shipping_fee || 0) - (order.tax_amount || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
                
                {order.shipping_fee && order.shipping_fee > 0 && (
                  <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#e8dfd0' }}>
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-semibold">₹{order.shipping_fee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {order.tax_amount && order.tax_amount > 0 && (
                  <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: '#e8dfd0' }}>
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹{order.tax_amount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-4 bg-gray-50 rounded-xl px-4" style={{ backgroundColor: '#f5efe6' }}>
                  <span className="text-xl font-bold" style={{ color: '#926829' }}>Total Amount</span>
                  <span className="text-2xl md:text-3xl font-bold" style={{ color: '#926829' }}>
                    ₹{order.total_amount?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                Shipping Address
              </h2>
              
              {order.shipping_address ? (
                <div className="bg-gray-50 rounded-xl p-6" style={{ backgroundColor: '#f5efe6' }}>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-bold text-lg" style={{ color: '#926829' }}>
                        {order.shipping_address.full_name || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="font-semibold text-gray-700">
                        {order.shipping_address.address || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Pincode</p>
                      <p className="font-semibold text-gray-700">
                        {order.shipping_address.pincode || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </div>

            {/* Notes Card */}
            {order.notes && (
              <div className="bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  Order Notes
                </h2>
                <div className="bg-gray-50 rounded-xl p-6" style={{ backgroundColor: '#f5efe6' }}>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tracking & Payment */}
          <div className="space-y-6">
            {/* Tracking Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
              <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                📦 Tracking Info
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  {order.tracking_number ? (
                    <p className="font-bold text-lg break-all" style={{ color: '#926829' }}>
                      {order.tracking_number}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Not assigned yet</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Provider</p>
                  {order.ship_provider ? (
                    <p className="font-semibold flex items-center gap-2">
                      <span>🚚</span>
                      {order.ship_provider}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Not specified</p>
                  )}
                </div>

                {order.tracking_number && (
                  <button 
                    className="w-full mt-4 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-lg"
                    style={{ backgroundColor: '#926829', minHeight: '48px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
                    onClick={() => window.open(`https://www.google.com/search?q=${order.tracking_number}`, '_blank')}>
                    Track Package 🔍
                  </button>
                )}
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
              <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                💳 Payment Info
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-semibold capitalize">
                    {order.payment_method || 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <span 
                    className="inline-block px-4 py-2 rounded-lg font-bold text-white capitalize text-sm"
                    style={{ 
                      backgroundColor: order.payment_status === 'completed' ? '#10b981' : '#f59e0b' 
                    }}>
                    {order.payment_status || 'pending'}
                  </span>
                </div>

                {order.razorpay_order_id && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                    <p className="font-mono text-xs break-all text-gray-600">
                      {order.razorpay_order_id}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.3s' }}>
              <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                Actions
              </h2>
              
              <div className="space-y-3">
                <Link href="/orders">
                  <button 
                    className="w-full px-6 py-3 rounded-xl font-bold border-2 transition-all duration-300 transform active:scale-95 hover:scale-105"
                    style={{ color: '#926829', borderColor: '#926829', minHeight: '48px' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#926829'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#926829'
                    }}>
                    ← All Orders
                  </button>
                </Link>
                
                <button 
                  className="w-full px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#926829', minHeight: '48px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
                  onClick={() => window.print()}>
                  🖨️ Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
