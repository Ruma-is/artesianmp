'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react' // ✅ ADDED: useEffect
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddProductPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [formLoading, setFormLoading] = useState(false)
  
  // ✅ ADDED: Artisan check states
  const [isArtisan, setIsArtisan] = useState(false)
  const [checkingArtisan, setCheckingArtisan] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    images: ['', '', '']
  })

  // ✅ ADDED: Check artisan status when user loads
  useEffect(() => {
    if (user) {
      checkArtisanStatus()
    }
  }, [user])

  // ✅ ADDED: Function to check if user is artisan
  const checkArtisanStatus = async () => {
    if (!user) return
    
    const { data } = await supabase
      .from('artisan_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    setIsArtisan(!!data)
    setCheckingArtisan(false)
  }

  // CHANGED: Added checkingArtisan to loading condition
  if (loading || checkingArtisan) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-6xl animate-bounce">⏳</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login?redirect=/dashboard/add-product')
    return null
  }

  // ✅ ADDED: Show "Become Artisan" page if not artisan
  if (!isArtisan) {
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
            <p className="text-gray-600 mt-2">Start selling your handcrafted products</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-white rounded-2xl shadow-lg border-2 p-12 text-center" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-8xl mb-6">🎨</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#926829' }}>
              You're Not an Artisan Yet
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              To sell products on our platform, you need to create an artisan profile. 
              This helps buyers discover your unique handcrafted items!
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8" style={{ backgroundColor: '#f5efe6' }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: '#926829' }}>
                Benefits of Becoming an Artisan:
              </h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li>✅ List unlimited products</li>
                <li>✅ Reach thousands of buyers</li>
                <li>✅ Manage your shop dashboard</li>
                <li>✅ Track sales and earnings</li>
                <li>✅ Get discovered by art lovers</li>
              </ul>
            </div>

            <Link href="/become-artisan">
              <button className="px-10 py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      style={{ backgroundColor: '#926829' }}>
                Become an Artisan Now 🎨
              </button>
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              Already a buyer? You can be both! Same account works for buying and selling.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const imageUrls = formData.images.filter(img => img.trim() !== '')
      
      if (imageUrls.length === 0) {
        alert('Please add at least one product image URL')
        setFormLoading(false)
        return
      }

      // First, check if user has an artisan profile
      let { data: artisanProfile } = await supabase
        .from('artisan_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      // If no artisan profile exists, create one
      if (!artisanProfile) {
        const { data: newProfile, error: profileError } = await supabase
          .from('artisan_profiles')
          .insert({
            user_id: user.id,
            business_name: 'My Shop',
            verified: false
          })
          .select()
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          alert(`Failed to create artisan profile: ${profileError.message}`)
          setFormLoading(false)
          return
        }

        artisanProfile = newProfile
      }

      // Now insert the product with the artisan_id
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: imageUrls,
          artisan_id: artisanProfile.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating product:', error)
        alert(`Failed to create product: ${error.message}`)
        return
      }

      alert('Product added successfully!')
      router.push('/dashboard')
      
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add product. Please try again.')
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
            Add New Product
          </h1>
          <p className="text-gray-600 mt-2">Share your handcrafted creation with the world</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg border-2 p-8" style={{ borderColor: '#e8dfd0' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#e8dfd0' }}
                placeholder="e.g., Handwoven Bamboo Basket"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                style={{ borderColor: '#e8dfd0' }}
                placeholder="Describe your product, materials used, craftsmanship details..."
                onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#e8dfd0' }}
                  placeholder="999"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#e8dfd0' }}
                  placeholder="10"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Product Images (URLs) *
              </label>
              <p className="text-xs text-gray-600 mb-3">Add up to 3 image URLs. At least one is required.</p>
              
              {formData.images.map((img, index) => (
                <input
                  key={index}
                  type="url"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none mb-3"
                  style={{ borderColor: '#e8dfd0' }}
                  placeholder={`Image URL ${index + 1}${index === 0 ? ' (Required)' : ' (Optional)'}`}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              ))}
              
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use image hosting services like Imgur, Cloudinary, or direct image URLs
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
                {formLoading ? 'Adding Product...' : 'Add Product ✨'}
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
      </div>
    </div>
  )
}
