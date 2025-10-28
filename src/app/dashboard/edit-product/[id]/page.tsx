'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditProductPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const [formLoading, setFormLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    images: ['', '', '']
  })

  useEffect(() => {
    if (user && params.id) {
      fetchProduct()
    }
  }, [user, params.id])

  const fetchProduct = async () => {
    const productId = Array.isArray(params.id) ? params.id[0] : params.id
    
    if (!productId) {
      alert('Invalid product ID')
      router.push('/dashboard/my-products')
      return
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) {
      alert('Product not found')
      router.push('/dashboard/my-products')
      return
    }

    if (data) {
      const images = Array.isArray(data.images) ? data.images : []
      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        stock: data.stock_quantity?.toString() || '',
        images: [
          images[0] || '',
          images[1] || '',
          images[2] || ''
        ]
      })
    }

    setPageLoading(false)
  }

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-5xl md:text-6xl animate-bounce">⏳</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
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
      const productId = Array.isArray(params.id) ? params.id[0] : params.id
      
      if (!productId) {
        alert('Invalid product ID')
        setFormLoading(false)
        return
      }
      
      const imageUrls = formData.images.filter(img => img.trim() !== '')
      
      if (imageUrls.length === 0) {
        alert('Please add at least one product image URL')
        setFormLoading(false)
        return
      }

      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock),
          images: imageUrls
        })
        .eq('id', productId)

      if (error) {
        console.error('Error updating product:', error)
        alert(`Failed to update product: ${error.message}`)
        return
      }

      alert('Product updated successfully!')
      router.push('/dashboard/my-products')
      
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update product. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="border-b py-6 md:py-8" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Link href="/dashboard/my-products" className="text-xs md:text-sm mb-3 md:mb-4 inline-block" style={{ color: '#926829' }}>
            ← Back to My Products
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
            Edit Product
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">Update your product details</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8" style={{ borderColor: '#e8dfd0' }}>
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            
            <div>
              <label className="block text-xs md:text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base"
                style={{ borderColor: '#e8dfd0', minHeight: '44px' }}
                placeholder="e.g., Handwoven Bamboo Basket"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base"
                style={{ borderColor: '#e8dfd0' }}
                placeholder="Describe your product, materials used, craftsmanship details..."
                onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base"
                  style={{ borderColor: '#e8dfd0', minHeight: '44px' }}
                  placeholder="999"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold mb-2" style={{ color: '#926829' }}>
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base"
                  style={{ borderColor: '#e8dfd0', minHeight: '44px' }}
                  placeholder="10"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold mb-2" style={{ color: '#926829' }}>
                Product Images (URLs) *
              </label>
              <p className="text-xs text-gray-600 mb-3">Add up to 3 image URLs. At least one is required.</p>
              
              {formData.images.map((img, index) => (
                <input
                  key={index}
                  type="url"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none mb-3 text-base"
                  style={{ borderColor: '#e8dfd0', minHeight: '44px' }}
                  placeholder={`Image URL ${index + 1}${index === 0 ? ' (Required)' : ' (Optional)'}`}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#926829')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e8dfd0')}
                />
              ))}
              
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use image hosting services like Imgur, Cloudinary, or direct image URLs
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 text-white rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 md:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#926829', minHeight: '48px' }}
                onMouseEnter={(e) => !formLoading && (e.currentTarget.style.backgroundColor = '#7a5621')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
              >
                {formLoading ? 'Updating...' : 'Update Product ✨'}
              </button>
              
              <Link href="/dashboard/my-products" className="flex-1">
                <button
                  type="button"
                  className="w-full border-2 rounded-xl font-bold text-base md:text-lg transition-all duration-300"
                  style={{ borderColor: '#926829', color: '#926829', minHeight: '48px' }}
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
