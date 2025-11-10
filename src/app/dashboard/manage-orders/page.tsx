'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name?: string
  product_image?: string
  quantity: number
  unit_price: number
  total_price: number
}

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
  order_items?: OrderItem[]
}

export default function ManageOrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    revenue: 0
  })

  useEffect(() => {
    if (user) {
      fetchSellerOrders()
    }
  }, [user])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchTerm])

  const fetchSellerOrders = async () => {
    if (!user) return
    
    setDataLoading(true)
    
    try {
      // First, get all products owned by this user
      const { data: userProducts, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('artisan_id', user.id)

      if (productsError) throw productsError

      if (!userProducts || userProducts.length === 0) {
        console.log('No products found for this seller')
        setOrders([])
        setDataLoading(false)
        return
      }

      const productIds = userProducts.map(p => p.id)

      // Get order items for these products
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('product_id', productIds)

      if (itemsError) throw itemsError

      if (!orderItems || orderItems.length === 0) {
        console.log('No orders found for your products')
        setOrders([])
        setDataLoading(false)
        return
      }

      // Get unique order IDs
      const orderIds = [...new Set(orderItems.map(item => item.order_id))]

      // Fetch full order details
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .in('id', orderIds)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Combine orders with their items
      const ordersWithItems = ordersData.map(order => ({
        ...order,
        order_items: orderItems.filter(item => item.order_id === order.id)
      }))

      console.log('✅ Fetched', ordersWithItems.length, 'orders for seller')
      setOrders(ordersWithItems)
      calculateStats(ordersWithItems)
      
    } catch (error) {
      console.error('❌ Error fetching seller orders:', error)
      setOrders([])
    }
    
    setDataLoading(false)
  }

  const calculateStats = (ordersList: Order[]) => {
    const stats = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'pending').length,
      shipped: ordersList.filter(o => o.status === 'shipped').length,
      delivered: ordersList.filter(o => o.status === 'delivered').length,
      revenue: ordersList.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    }
    setStats(stats)
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳'
      case 'confirmed': return '✓'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '📦'
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-2xl font-semibold" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
            Loading orders...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login?redirect=/dashboard/manage-orders')
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Header Section */}
      <div className="border-b py-8 md:py-12" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="animate-fade-in">
            <Link href="/dashboard">
              <button className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors">
                ← Back to Dashboard
              </button>
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              📦 Manage Orders
            </h1>
            <div className="w-20 md:w-24 h-1 md:h-1.5 rounded-full mb-3" style={{ backgroundColor: '#926829' }}></div>
            <p className="text-base md:text-lg text-gray-600">
              Track and update orders for your products
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 animate-slide-up" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: '#926829' }}>{stats.total}</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl md:text-3xl font-bold text-orange-500">{stats.pending}</p>
          </div>

          {/* Shipped */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
            <div className="text-3xl mb-2">🚚</div>
            <p className="text-sm text-gray-600 mb-1">Shipped</p>
            <p className="text-2xl md:text-3xl font-bold text-purple-500">{stats.shipped}</p>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.3s' }}>
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm text-gray-600 mb-1">Delivered</p>
            <p className="text-2xl md:text-3xl font-bold text-green-500">{stats.delivered}</p>
          </div>

          {/* Revenue */}
          <div className="col-span-2 lg:col-span-1 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.4s' }}>
            <div className="text-3xl mb-2">💰</div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">₹{stats.revenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 mb-6 animate-slide-up" style={{ borderColor: '#e8dfd0', animationDelay: '0.5s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by order number or tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all font-semibold"
                style={{ 
                  borderColor: '#e8dfd0',
                  color: '#926829',
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
                <option value="all">All Orders</option>
                <option value="pending">⏳ Pending</option>
                <option value="confirmed">✓ Confirmed</option>
                <option value="shipped">🚚 Shipped</option>
                <option value="delivered">✅ Delivered</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 p-12 text-center animate-fade-in" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
              No Orders Found
            </h3>
            <p className="text-gray-600">
              {statusFilter !== 'all' 
                ? `No ${statusFilter} orders at the moment.`
                : 'No orders have been placed for your products yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] animate-slide-up"
                style={{ 
                  borderColor: '#e8dfd0',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                          Order #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </p>
                      </div>
                      <span 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm md:text-base capitalize"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        <span>{getStatusIcon(order.status)}</span>
                        {order.status}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4" style={{ backgroundColor: '#f5efe6' }}>
                      <p className="text-sm font-semibold text-gray-600 mb-2">Items Ordered:</p>
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 mb-2 last:mb-0">
                          {item.product_image && (
                            <img 
                              src={item.product_image} 
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.product_name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')} = <span className="font-bold">₹{item.total_price.toLocaleString('en-IN')}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                        <p className="font-bold" style={{ color: order.tracking_number ? '#926829' : '#9ca3af' }}>
                          {order.tracking_number || 'Not assigned'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Courier</p>
                        <p className="font-semibold text-gray-700">
                          {order.ship_provider || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <div className="text-center lg:text-right mb-2">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl md:text-3xl font-bold" style={{ color: '#926829' }}>
                        ₹{order.total_amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <Link href={`/dashboard/manage-orders/${order.id}/edit`}>
                      <button 
                        className="w-full px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-lg"
                        style={{ backgroundColor: '#926829', minHeight: '48px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
                      >
                        ✏️ Update Order
                      </button>
                    </Link>

                    <Link href={`/orders/${order.id}`}>
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
                        }}
                      >
                        👁️ View Details
                      </button>
                    </Link>
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
