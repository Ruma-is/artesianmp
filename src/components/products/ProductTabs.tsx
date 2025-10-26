'use client'

import { useState } from 'react'

interface ProductTabsProps {
  description: string
}

export default function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description')

  const tabs = [
    { id: 'description' as const, label: 'Description', icon: '📝' },
    { id: 'details' as const, label: 'Details', icon: '📋' },
    { id: 'reviews' as const, label: 'Reviews', icon: '⭐' }
  ]

  return (
    <div className="mt-12 animate-fade-in-delay-2">
      {/* Tab Headers */}
      <div className="flex gap-2 border-b-2 mb-6" style={{ borderColor: '#e8dfd0' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-all duration-300 relative ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? '#926829' : 'transparent',
              borderRadius: '8px 8px 0 0'
            }}
          >
            <span className="flex items-center gap-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 animate-expand-center" 
                   style={{ backgroundColor: '#926829' }}></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white rounded-xl shadow-lg border-2 min-h-[200px]" style={{ borderColor: '#e8dfd0' }}>
        {activeTab === 'description' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              About This Product
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {description || 'A beautiful handcrafted piece made with traditional techniques passed down through generations. Each item is unique and tells its own story of craftsmanship, culture, and dedication.'}
            </p>
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f5efe6' }}>
              <p className="text-sm text-gray-600">
                💡 <strong>Note:</strong> Due to the handmade nature of this product, slight variations in color, texture, and design may occur, making each piece truly one-of-a-kind.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              Product Specifications
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#e8dfd0' }}>
                <span className="font-semibold text-gray-700">Material:</span>
                <span className="text-gray-600">Premium Natural Materials</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#e8dfd0' }}>
                <span className="font-semibold text-gray-700">Crafting Time:</span>
                <span className="text-gray-600">3-5 Days</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#e8dfd0' }}>
                <span className="font-semibold text-gray-700">Origin:</span>
                <span className="text-gray-600">India</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#e8dfd0' }}>
                <span className="font-semibold text-gray-700">Care Instructions:</span>
                <span className="text-gray-600">Handle with care, clean gently</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#e8dfd0' }}>
                <span className="font-semibold text-gray-700">Sustainability:</span>
                <span className="text-gray-600">100% Eco-friendly</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
              Customer Reviews
            </h3>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2" style={{ color: '#926829' }}>4.8</div>
              <div className="text-yellow-500 text-2xl mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600">Based on 127 reviews</p>
            </div>
            
            {/* Sample Reviews */}
            <div className="space-y-4 mt-6">
              {[
                { name: 'Priya S.', rating: 5, text: 'Absolutely beautiful craftsmanship! Worth every penny.', date: '2 days ago' },
                { name: 'Rahul M.', rating: 5, text: 'Amazing quality and fast delivery. Highly recommended!', date: '1 week ago' },
                { name: 'Anjali K.', rating: 4, text: 'Lovely product, exactly as described. Great support from artisan.', date: '2 weeks ago' }
              ].map((review, idx) => (
                <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: '#e8dfd0', backgroundColor: '#faf8f5' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                    <div className="text-yellow-500">
                      {'⭐'.repeat(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
