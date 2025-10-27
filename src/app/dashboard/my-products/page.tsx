'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function MyProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    if (!user) return
    setLoadingProducts(true)

    // First get user's artisan profile
    const { data: artisanProfile } = await supabase
      .from('artisan_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!artisanProfile) {
      setLoadingProducts(false)
      return
    }

    // Then fetch products using artisan_id
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('artisan_id', artisanProfile.id)
      .order('created_at', { ascending: false })

    if (data) {
      setProducts(data)
    }

    setLoadingProducts(false)
  }

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      alert('Failed to delete product')
      return
    }

    alert('Product deleted successfully!')
    fetchProducts()
  }

  if (loading || loadingProducts) {
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
      <div className="border-b py-8" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/dashboard" className="text-sm mb-4 inline-block" style={{ color: '#926829' }}>
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
            My Products
          </h1>
          <p className="text-gray-600 mt-2">Manage your handcrafted creations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#926829' }}>
              No Products Yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start selling by adding your first product!
            </p>
            <Link href="/dashboard/add-product">
              <button className="px-8 py-4 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
                      style={{ backgroundColor: '#926829' }}>
                Add Your First Product
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#926829' }}>
                {products.length} Product{products.length !== 1 ? 's' : ''}
              </h2>
              <Link href="/dashboard/add-product">
                <button className="px-6 py-3 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        style={{ backgroundColor: '#926829' }}>
                  + Add Product
                </button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl"
                     style={{ borderColor: '#e8dfd0' }}>
                  {/* Product Image */}
                  <div className="relative h-56 bg-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-6xl">
                        🎨
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1" style={{ color: '#926829' }}>
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-xl font-bold" style={{ color: '#926829' }}>
                          ₹{product.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="text-xl font-bold" style={{ color: '#926829' }}>
                          {product.stock}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/dashboard/edit-product/${product.id}`} className="flex-1">
                        <button className="w-full py-2 border-2 rounded-lg font-semibold text-sm transition-all duration-300"
                                style={{ borderColor: '#926829', color: '#926829' }}>
                          ✏️ Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
