'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  order_number?: string | null
  status: string | null
  total_amount: number | null
  tracking_number?: string | null
  ship_provider?: string | null
  product_name?: string | null
  quantity?: number | null
  created_at?: string | null
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    
    setDataLoading(true)
    
    // Verify current user authentication
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !currentUser) {
      console.error('❌ Authentication error:', authError)
      setOrders([])
      setDataLoading(false)
      return
    }
    
    console.log('🔍 Fetching orders for user:')
    console.log('   User ID:', currentUser.id)
    console.log('   Email:', currentUser.email)
    
    // Fetch orders from database
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', currentUser.id)
      .order('created_at', { ascending: false })

    console.log('🔍 Query executed: buyer_id =', currentUser.id)
    
    if (ordersData && !error) {
      console.log('✅ Successfully fetched orders from Supabase')
      console.log('✅ Number of orders found:', ordersData.length)
      
      if (ordersData.length > 0) {
        console.log('✅ First order details:')
        console.log('   Order Number:', ordersData[0].order_number)
        console.log('   Buyer ID:', ordersData[0].buyer_id)
        console.log('   Status:', ordersData[0].status)
        console.log('   Total:', ordersData[0].total_amount)
      }
      
      // Transform orders with product details placeholder
      const transformedOrders = ordersData.map((order: any) => ({
        ...order,
        product_name: 'Order Item',  // Placeholder until we add product details
        quantity: 1
      }))
      
      setOrders(transformedOrders)
      console.log('✅ Displaying', transformedOrders.length, 'orders')
    } else if (error) {
      console.error('❌ Error fetching orders:', error)
      console.error('❌ Error message:', error.message)
      console.error('❌ Error details:', error.details)
      console.error('❌ Error hint:', error.hint)
      setOrders([])
    } else {
      console.log('ℹ️ No orders found for this user')
      setOrders([])
    }
    
    setDataLoading(false)
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-6xl animate-bounce">⏳</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login?redirect=/orders')
    return null
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'shipped': return '#3b82f6'
      case 'delivered': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      default: return '📦'
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Header Section */}
      <div className="border-b py-8 md:py-12" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              My Orders
            </h1>
            <div className="w-20 md:w-24 h-1 md:h-1.5 mx-auto rounded-full animate-expand-center mb-3" style={{ backgroundColor: '#926829' }}></div>
            <p className="text-base md:text-lg text-gray-600">
              Track and manage your orders
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {orders.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce-subtle">🛍️</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              No Orders Yet
            </h2>
            <div className="w-24 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: '#926829' }}></div>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start shopping for beautiful handcrafted items from talented artisans
            </p>
            <Link href="/products">
              <button 
                className="px-8 py-4 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                style={{ backgroundColor: '#926829', minHeight: '48px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden transform hover:scale-105 animate-slide-up"
                style={{ 
                  borderColor: '#e8dfd0',
                  animationDelay: `${index * 0.1}s`
                }}>
                <div className="p-6 md:p-8">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-6 pb-6 border-b-2" style={{ borderColor: '#e8dfd0' }}>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                        Order #{order.order_number || order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-3xl">{getStatusIcon(order.status)}</span>
                      <span 
                        className="px-4 py-2 rounded-full text-sm md:text-base font-bold text-white capitalize"
                        style={{ backgroundColor: getStatusColor(order.status) }}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6" style={{ backgroundColor: '#f5efe6' }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Product</p>
                        <p className="font-bold text-base md:text-lg" style={{ color: '#926829' }}>
                          {order.product_name || 'Order Item'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Quantity</p>
                        <p className="font-bold text-base md:text-lg" style={{ color: '#926829' }}>
                          {order.quantity} item(s)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="font-bold text-xl md:text-2xl" style={{ color: '#926829' }}>
                          ₹{order.total_amount?.toLocaleString('en-IN') || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tracking</p>
                        <p className="font-semibold text-sm">
                          {order.tracking_number || <span className="text-gray-400">Not assigned</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {order.ship_provider && (
                    <div className="bg-white rounded-lg p-4 mb-6 border-2" style={{ borderColor: '#e8dfd0' }}>
                      <p className="text-sm text-gray-500 mb-1">Shipping Provider</p>
                      <p className="font-bold flex items-center gap-2" style={{ color: '#926829' }}>
                        <span>🚚</span>
                        {order.ship_provider}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/orders/${order.id}`} className="flex-1">
                      <button 
                        className="w-full px-6 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 transform active:scale-95 md:hover:scale-105 border-2 text-base md:text-lg"
                        style={{ 
                          color: '#926829', 
                          borderColor: '#926829',
                          minHeight: '48px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#926829'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#926829'
                        }}>
                        View Details →
                      </button>
                    </Link>
                    {order.tracking_number && (
                      <button 
                        className="flex-1 px-6 py-3 md:py-4 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 shadow-lg hover:shadow-2xl text-base md:text-lg"
                        style={{ 
                          backgroundColor: '#926829',
                          minHeight: '48px'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
                        onClick={() => window.open(`https://www.google.com/search?q=${order.tracking_number}`, '_blank')}>
                        Track Package 📦
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
