'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    activeProducts: 0,
    soldProducts: 0,
    totalEarnings: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalOrders: 0
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    // First get user's artisan profile
    const { data: artisanProfile } = await supabase
      .from('artisan_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    // Then fetch products using artisan_id
    if (artisanProfile) {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('artisan_id', artisanProfile.id)
        .order('created_at', { ascending: false })

      if (productsData) {
        setProducts(productsData)
        setStats(prev => ({
          ...prev,
          activeProducts: productsData.length
        }))
      }
    }

    // Fetch user's orders (as buyer)
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersData) {
      setOrders(ordersData)
      const pending = ordersData.filter(o => o.status === 'pending').length
      const delivered = ordersData.filter(o => o.status === 'delivered').length
      
      setStats(prev => ({
        ...prev,
        pendingOrders: pending,
        deliveredOrders: delivered,
        totalOrders: ordersData.length
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-6xl animate-bounce">⏳</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Header Section */}
      <div className="border-b py-12" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-fade-in text-center">
            <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              Welcome to Your Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage your orders and products in one place
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* My Orders Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 p-8 transition-all duration-300 transform hover:scale-105 animate-slide-up" 
               style={{ borderColor: '#e8dfd0' }}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce-subtle">📦</div>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                My Orders
              </h2>
              <div className="w-20 h-1.5 mx-auto rounded-full mb-4" style={{ backgroundColor: '#926829' }}></div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6" style={{ backgroundColor: '#f5efe6' }}>
              {stats.totalOrders > 0 ? (
                <>
                  <p className="text-gray-600 text-lg text-center mb-2">
                    You have {stats.totalOrders} order{stats.totalOrders !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    {stats.pendingOrders} pending • {stats.deliveredOrders} delivered
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-lg text-center mb-2">
                    You have no orders yet
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    Start shopping for beautiful handcrafted items!
                  </p>
                </>
              )}
            </div>

            <Link href={stats.totalOrders > 0 ? "/orders" : "/products"}>
              <button className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#926829' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                <span>{stats.totalOrders > 0 ? 'View Orders' : 'Browse Products'}</span>
                <span>→</span>
              </button>
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>{stats.pendingOrders}</div>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>{stats.deliveredOrders}</div>
                <p className="text-xs text-gray-600">Delivered</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>{stats.totalOrders}</div>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>

          {/* My Products Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 p-8 transition-all duration-300 transform hover:scale-105 animate-slide-up" 
               style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>🎨</div>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                My Products
              </h2>
              <div className="w-20 h-1.5 mx-auto rounded-full mb-4" style={{ backgroundColor: '#926829' }}></div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6" style={{ backgroundColor: '#f5efe6' }}>
              {products.length > 0 ? (
                <>
                  <p className="text-gray-600 text-lg text-center mb-2">
                    You have {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    Keep adding more handcrafted items!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-lg text-center mb-2">
                    Start selling your products!
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    Share your handcrafted creations with the world
                  </p>
                </>
              )}
            </div>

            <div className="space-y-6">
              <Link href="/dashboard/my-products">
                <button className="w-full py-3 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mb-6"
                        style={{ borderColor: '#926829', color: '#926829' }}>
                  <span>View My Products</span>
                  <span>→</span>
                </button>
              </Link>
              
              <Link href="/dashboard/add-product">
                <button className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#926829' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                  <span>Add Product</span>
                  <span>+</span>
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>{stats.activeProducts}</div>
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>{stats.soldProducts}</div>
                <p className="text-xs text-gray-600">Sold</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>₹{stats.totalEarnings}</div>
                <p className="text-xs text-gray-600">Earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" 
               style={{ borderColor: '#e8dfd0' }}>
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: '#926829' }}>Secure Payments</h3>
            <p className="text-sm text-gray-600">Safe and encrypted transactions</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" 
               style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: '#926829' }}>Fast Delivery</h3>
            <p className="text-sm text-gray-600">Quick shipping across India</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" 
               style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
            <div className="text-4xl mb-3">💎</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: '#926829' }}>Quality Assured</h3>
            <p className="text-sm text-gray-600">Handpicked artisan products</p>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="p-8 rounded-2xl text-center animate-fade-in" style={{ backgroundColor: '#926829' }}>
          <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Support Traditional Artisans
          </h3>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-6">
            Every purchase helps preserve ancient crafts and supports rural communities across India
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products">
              <button className="px-8 py-3 bg-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      style={{ color: '#926829' }}>
                Shop Now
              </button>
            </Link>
            <Link href="/about">
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
