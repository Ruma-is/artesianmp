'use client'

import Link from 'next/link'

export default function DashboardPage() {
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
              <p className="text-gray-600 text-lg text-center mb-2">
                You have no orders yet
              </p>
              <p className="text-sm text-gray-500 text-center">
                Start shopping for beautiful handcrafted items!
              </p>
            </div>

            <Link href="/products">
              <button className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#926829' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                <span>Browse Products</span>
                <span>→</span>
              </button>
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>0</div>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>0</div>
                <p className="text-xs text-gray-600">Delivered</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>0</div>
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
              <p className="text-gray-600 text-lg text-center mb-2">
                Start selling your products!
              </p>
              <p className="text-sm text-gray-500 text-center">
                Share your handcrafted creations with the world
              </p>
            </div>

            <Link href="/dashboard/add-product">
              <button className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#926829' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                <span>Add Product</span>
                <span>+</span>
              </button>
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>0</div>
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>0</div>
                <p className="text-xs text-gray-600">Sold</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#926829' }}>₹0</div>
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
