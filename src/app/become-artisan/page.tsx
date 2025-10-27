'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BecomeArtisanPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [formLoading, setFormLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    businessName: '',
    bio: '',
    phone: '',
    city: '',
    state: ''
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-6xl animate-bounce">⏳</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login?redirect=/become-artisan')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // Check if artisan profile already exists
      const { data: existing } = await supabase
        .from('artisan_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existing) {
        alert('You are already an artisan!')
        router.push('/dashboard/add-product')
        return
      }

      // Create artisan profile
      const { error } = await supabase
        .from('artisan_profiles')
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          bio: formData.bio,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          verified: false
        })

      if (error) {
        console.error('Error creating artisan profile:', error)
        alert(`Failed to create artisan profile: ${error.message}`)
        return
      }

      alert('🎉 Congratulations! You are now an artisan!')
      router.push('/dashboard/add-product')
      
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create artisan profile. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="border-b py-8" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/dashboard" className="text-sm mb-4 inline-block" style={{ color: '#926829' }}>
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
            Become an Artisan
          </h1>
          <p className="text-gray-600 mt-2">Join our community of talented craftspeople</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg border-2 p-8" style={{ borderColor: '#e8dfd0' }}>
          
          {/* Welcome Message */}
          <div className="text-center mb-8 pb-8 border-b-2" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#926829' }}>
              Start Your Selling Journey
            </h2>
            <p className="text-gray-600">
              Fill in your details to create your artisan profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Business/Shop Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#e8dfd0' }}
                placeholder="e.g., Handmade Crafts by Priya"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                About You & Your Craft *
              </label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#e8dfd0' }}
                placeholder="Tell buyers about your craft, experience, and what makes your products special..."
                onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#e8dfd0' }}
                placeholder="e.g., +91 98765 43210"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#e8dfd0' }}
                  placeholder="e.g., Jaipur"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#e8dfd0' }}
                  placeholder="e.g., Rajasthan"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>📌 Note:</strong> Your artisan profile will be reviewed by our team. 
                You can start adding products immediately, but they will be visible after approval.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#926829' }}
                onMouseEnter={(e) => !formLoading && (e.currentTarget.style.backgroundColor = '#7a5621')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
              >
                {formLoading ? 'Creating Profile...' : 'Become an Artisan 🎨'}
              </button>
              
              <Link href="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300"
                  style={{ borderColor: '#926829', color: '#926829' }}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 text-center border-2" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-3xl mb-2">🏪</div>
            <h3 className="font-bold mb-1" style={{ color: '#926829' }}>Your Own Shop</h3>
            <p className="text-sm text-gray-600">Manage your products and orders</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center border-2" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-bold mb-1" style={{ color: '#926829' }}>Reach Buyers</h3>
            <p className="text-sm text-gray-600">Sell across India</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center border-2" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-bold mb-1" style={{ color: '#926829' }}>Earn More</h3>
            <p className="text-sm text-gray-600">Direct sales, better prices</p>
          </div>
        </div>
      </div>
    </div>
  )
}
