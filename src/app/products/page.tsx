import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (error || !products) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl text-gray-600">Error loading products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#926829' }}>{products.length}</div>
            <div className="text-sm text-gray-600">Products Available</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#926829' }}>100%</div>
            <div className="text-sm text-gray-600">Handmade</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#926829' }}>⭐ 4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0', animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#926829' }}>✓</div>
            <div className="text-sm text-gray-600">Quality Assured</div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const imageUrl = product.images?.[0];

            return (
              <div 
                key={product.id} 
                className="group bg-white rounded-2xl overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slide-up"
                style={{ 
                  borderColor: '#e8dfd0',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Image */}
                <div className="relative h-72 bg-gray-100 overflow-hidden">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={product.title} 
                      fill 
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-8xl animate-bounce-subtle">🎨</div>
                    </div>
                  )}
                  
                  {/* Overlay Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                       style={{ backgroundColor: 'rgba(146, 104, 41, 0.9)' }}>
                    ✨ HANDMADE
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <Link href={`/products/${product.id}`}>
                      <button className="px-6 py-3 bg-white rounded-lg font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                              style={{ color: '#926829' }}>
                        View Details →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-opacity-80 transition-all"
                      style={{ fontFamily: 'Georgia, serif' }}>
                    {product.title}
                  </h3>

                  {/* Artisan */}
                  <div className="flex items-center gap-2 mb-4 text-gray-600">
                    <span className="text-sm">👨‍🎨</span>
                    <p className="text-sm">by Ravi Kumar</p>
                  </div>

                  {/* Description Preview */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Price</div>
                      <span className="text-2xl font-bold" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                        ₹{product.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Rating</div>
                      <div className="text-yellow-500 font-semibold">⭐ 4.8</div>
                    </div>
                  </div>

                  {/* Quick View Link - Desktop */}
                  <Link href={`/products/${product.id}`}>
                    <button className="hidden md:block w-full mt-4 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                            style={{ backgroundColor: '#926829' }}>
                      Quick View
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce-subtle">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new handcrafted treasures from our artisans!
            </p>
            <Link href="/">
              <button className="px-8 py-3 bg-white border-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                      style={{ borderColor: '#926829', color: '#926829' }}>
                Back to Home
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-20 py-16 relative overflow-hidden" style={{ backgroundColor: '#926829' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl animate-float">💝</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-float-delayed">🎁</div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in" style={{ fontFamily: 'Georgia, serif' }}>
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-gray-100 mb-8 animate-fade-in-delay-1">
            Connect with our artisans for custom handcrafted creations made just for you
          </p>
          <Link href="/auth/signup">
            <button className="px-10 py-4 bg-white rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 animate-scale-in"
                    style={{ color: '#926829', animationDelay: '0.3s' }}>
              Request Custom Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}