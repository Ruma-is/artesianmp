'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// === Mock data for development ===
const initialOrders = [
  {
    id: 1,
    product: "Handcrafted Lamp",
    quantity: 2,
    status: "pending",
    tracking_number: "",
    ship_provider: "",
    shipped_at: null,
    buyer_id: "mock-user-1",
    created_at: new Date().toISOString(),
    total_amount: 2500
  },
  {
    id: 2,
    product: "Ceramic Vase",
    quantity: 1,
    status: "shipped",
    tracking_number: "TRK123456789",
    ship_provider: "Blue Dart",
    shipped_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    buyer_id: "mock-user-1",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    total_amount: 1800
  },
  {
    id: 3,
    product: "Woven Basket",
    quantity: 3,
    status: "delivered",
    tracking_number: "TRK987654321",
    ship_provider: "Delhivery",
    shipped_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    buyer_id: "mock-user-1",
    created_at: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    total_amount: 4200
  },
  {
    id: 4,
    product: "Embroidered Cushion Cover",
    quantity: 4,
    status: "pending",
    tracking_number: "",
    ship_provider: "",
    shipped_at: null,
    buyer_id: "mock-user-1",
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    total_amount: 3200
  },
  {
    id: 5,
    product: "Wooden Wall Art",
    quantity: 1,
    status: "shipped",
    tracking_number: "TRK456789123",
    ship_provider: "India Post",
    shipped_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    buyer_id: "mock-user-1",
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    total_amount: 5500
  }
];

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>(initialOrders) // Initialize with mock data
  const [stats, setStats] = useState({
    activeProducts: 0,
    soldProducts: 0,
    totalEarnings: 0,
    pendingOrders: initialOrders.filter(o => o.status === 'pending').length,
    deliveredOrders: initialOrders.filter(o => o.status === 'delivered').length,
    totalOrders: initialOrders.length
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

    // === COMMENT OUT THIS SECTION TO USE MOCK DATA ===
    // Fetch user's orders (as buyer) from Supabase
    /* 
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
    */
    // === UNCOMMENT ABOVE TO USE REAL SUPABASE DATA ===
    
    // Currently using mock data (initialOrders) set in state initialization
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-4xl md:text-6xl animate-bounce">⏳</div>
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
      <div className="border-b py-6 md:py-12" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="animate-fade-in text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              Welcome to Your Dashboard
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Manage your orders and products in one place
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* My Orders Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl border-2 p-6 md:p-8 transition-all duration-300 transform hover:scale-105 animate-slide-up" 
               style={{ borderColor: '#e8dfd0' }}>
            <div className="text-center mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 animate-bounce-subtle">📦</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                My Orders
              </h2>
              <div className="w-16 md:w-20 h-1 md:h-1.5 mx-auto rounded-full mb-3 md:mb-4" style={{ backgroundColor: '#926829' }}></div>
            </div>
            
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: '#f5efe6' }}>
              {stats.totalOrders > 0 ? (
                <>
                  <p className="text-gray-600 text-base md:text-lg text-center mb-2">
                    You have {stats.totalOrders} order{stats.totalOrders !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 text-center">
                    {stats.pendingOrders} pending • {stats.deliveredOrders} delivered
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-base md:text-lg text-center mb-2">
                    You have no orders yet
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 text-center">
                    Start shopping for beautiful handcrafted items!
                  </p>
                </>
              )}
            </div>

            <Link href={stats.totalOrders > 0 ? "/orders" : "/products"}>
              <button className="w-full py-3 md:py-4 text-white rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#926829', minHeight: '44px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                <span>{stats.totalOrders > 0 ? 'View Orders' : 'Browse Products'}</span>
                <span>→</span>
              </button>
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#926829' }}>{stats.pendingOrders}</div>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#926829' }}>{stats.deliveredOrders}</div>
                <p className="text-xs text-gray-600">Delivered</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#926829' }}>{stats.totalOrders}</div>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>

          {/* My Products Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl border-2 p-6 md:p-8 transition-all duration-300 transform hover:scale-105 animate-slide-up" 
               style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <div className="text-center mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>🎨</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                My Products
              </h2>
              <div className="w-16 md:w-20 h-1 md:h-1.5 mx-auto rounded-full mb-3 md:mb-4" style={{ backgroundColor: '#926829' }}></div>
            </div>
            
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: '#f5efe6' }}>
              {products.length > 0 ? (
                <>
                  <p className="text-gray-600 text-base md:text-lg text-center mb-2">
                    You have {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 text-center">
                    Keep adding more handcrafted items!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-base md:text-lg text-center mb-2">
                    Start selling your products!
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 text-center">
                    Share your handcrafted creations with the world
                  </p>
                </>
              )}
            </div>

            <div className="space-y-4 md:space-y-6">
              <Link href="/dashboard/my-products">
                <button className="w-full py-3 border-2 rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 md:hover:scale-105 flex items-center justify-center gap-2"
                        style={{ borderColor: '#926829', color: '#926829', minHeight: '44px' }}>
                  <span>View My Products</span>
                  <span>→</span>
                </button>
              </Link>
              
              <Link href="/dashboard/add-product">
                <button className="w-full py-3 md:py-4 text-white rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#926829', minHeight: '44px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                  <span>Add Product</span>
                  <span>+</span>
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#926829' }}>{stats.activeProducts}</div>
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#926829' }}>{stats.soldProducts}</div>
                <p className="text-xs text-gray-600">Sold</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#926829' }}>₹{stats.totalEarnings}</div>
                <p className="text-xs text-gray-600">Earnings</p>
              </div>
            </div>
          </div>

          {/* Manage Orders Card (Seller) */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl border-2 p-6 md:p-8 transition-all duration-300 transform hover:scale-105 animate-slide-up" 
               style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
            <div className="text-center mb-4 md:mb-6">
              <div className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>📊</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                Manage Orders
              </h2>
              <div className="w-16 md:w-20 h-1 md:h-1.5 mx-auto rounded-full mb-3 md:mb-4" style={{ backgroundColor: '#926829' }}></div>
            </div>
            
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6" style={{ backgroundColor: '#f5efe6' }}>
              <p className="text-gray-600 text-base md:text-lg text-center mb-2">
                Update tracking & status
              </p>
              <p className="text-xs md:text-sm text-gray-500 text-center">
                Manage orders for your products
              </p>
            </div>

            <Link href="/dashboard/manage-orders">
              <button className="w-full py-3 md:py-4 text-white rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#926829', minHeight: '44px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                <span>Manage Orders</span>
                <span>→</span>
              </button>
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-orange-500">⏳</div>
                <p className="text-xs text-gray-600 mt-1">Update Tracking</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-500">✅</div>
                <p className="text-xs text-gray-600 mt-1">Mark Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white rounded-lg md:rounded-xl p-5 md:p-6 text-center border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" 
               style={{ borderColor: '#e8dfd0' }}>
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">🔒</div>
            <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2" style={{ color: '#926829' }}>Secure Payments</h3>
            <p className="text-xs md:text-sm text-gray-600">Safe and encrypted transactions</p>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-5 md:p-6 text-center border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" 
               style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">🚚</div>
            <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2" style={{ color: '#926829' }}>Fast Delivery</h3>
            <p className="text-xs md:text-sm text-gray-600">Quick shipping across India</p>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl p-5 md:p-6 text-center border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" 
               style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">💎</div>
            <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2" style={{ color: '#926829' }}>Quality Assured</h3>
            <p className="text-xs md:text-sm text-gray-600">Handpicked artisan products</p>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="p-6 md:p-8 rounded-xl md:rounded-2xl text-center animate-fade-in" style={{ backgroundColor: '#926829' }}>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Support Traditional Artisans
          </h3>
          <p className="text-sm md:text-base lg:text-lg text-gray-100 max-w-2xl mx-auto mb-4 md:mb-6 px-2">
            Every purchase helps preserve ancient crafts and supports rural communities across India
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link href="/products">
              <button className="w-full sm:w-auto px-6 md:px-8 py-3 bg-white rounded-lg font-semibold transition-all duration-300 transform active:scale-95 md:hover:scale-105"
                      style={{ color: '#926829', minHeight: '44px' }}>
                Shop Now
              </button>
            </Link>
            <Link href="/about">
              <button className="w-full sm:w-auto px-6 md:px-8 py-3 border-2 border-white text-white rounded-lg font-semibold transition-all duration-300 transform active:scale-95 md:hover:scale-105"
                      style={{ minHeight: '44px' }}>
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
