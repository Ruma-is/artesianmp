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
        <div className="text-center animate-fade-in px-4">
          <div className="text-4xl md:text-6xl mb-4">😔</div>
          <p className="text-lg md:text-xl text-gray-600">Error loading products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg text-center transform active:scale-95 md:hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0' }}>
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#926829' }}>{products.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Products Available</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg text-center transform active:scale-95 md:hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0', animationDelay: '0.1s' }}>
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#926829' }}>100%</div>
            <div className="text-xs md:text-sm text-gray-600">Handmade</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg text-center transform active:scale-95 md:hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0', animationDelay: '0.2s' }}>
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#926829' }}>⭐ 4.8</div>
            <div className="text-xs md:text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-lg text-center transform active:scale-95 md:hover:scale-105 transition-all duration-300 animate-scale-in border-2" style={{ borderColor: '#e8dfd0', animationDelay: '0.3s' }}>
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#926829' }}>✓</div>
            <div className="text-xs md:text-sm text-gray-600">Quality Assured</div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map((product, index) => {
            const imageUrl = product.images?.[0];

            return (
              <div 
                key={product.id} 
                className="group bg-white rounded-xl md:rounded-2xl overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-500 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-2 animate-slide-up"
                style={{ 
                  borderColor: '#e8dfd0',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Image */}
                <div className="relative h-48 md:h-64 lg:h-72 bg-gray-100 overflow-hidden">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={product.title} 
                      fill 
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-5xl md:text-6xl lg:text-8xl animate-bounce-subtle">🎨</div>
                    </div>
                  )}
                  
                  {/* Overlay Badge */}
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                       style={{ backgroundColor: 'rgba(146, 104, 41, 0.9)' }}>
                    ✨ HANDMADE
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 md:pb-6">
                    <Link href={`/products/${product.id}`}>
                      <button className="px-4 md:px-6 py-2 md:py-3 bg-white rounded-lg font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-sm md:text-base"
                              style={{ color: '#926829', minHeight: '40px' }}>
                        View Details →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-opacity-80 transition-all"
                      style={{ fontFamily: 'Georgia, serif' }}>
                    {product.title}
                  </h3>

                  {/* Artisan */}
                  <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-600">
                    <span className="text-sm">👨‍🎨</span>
                    <p className="text-xs md:text-sm">by Ravi Kumar</p>
                  </div>

                  {/* Description Preview */}
                  {product.description && (
                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Price</div>
                      <span className="text-xl md:text-2xl font-bold" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                        ₹{product.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Rating</div>
                      <div className="text-yellow-500 font-semibold text-sm md:text-base">⭐ 4.8</div>
                    </div>
                  </div>

                  {/* Quick View Link - Desktop */}
                  <Link href={`/products/${product.id}`}>
                    <button className="hidden md:block w-full mt-3 md:mt-4 px-4 py-2 md:py-3 rounded-lg font-semibold text-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 shadow-md hover:shadow-lg text-sm md:text-base"
                            style={{ backgroundColor: '#926829', minHeight: '44px' }}>
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
          <div className="text-center py-12 md:py-20 animate-fade-in px-4">
            <div className="text-5xl md:text-6xl lg:text-8xl mb-4 md:mb-6 animate-bounce-subtle">🔍</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              No Products Found
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Check back soon for new handcrafted treasures from our artisans!
            </p>
            <Link href="/">
              <button className="px-6 md:px-8 py-3 bg-white border-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform active:scale-95 md:hover:scale-105"
                      style={{ borderColor: '#926829', color: '#926829', minHeight: '44px' }}>
                Back to Home
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-12 md:mt-20 py-12 md:py-16 relative overflow-hidden" style={{ backgroundColor: '#926829' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-5xl md:text-7xl lg:text-9xl animate-float">💝</div>
          <div className="absolute bottom-10 left-10 text-5xl md:text-7xl lg:text-9xl animate-float-delayed">🎁</div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 animate-fade-in" style={{ fontFamily: 'Georgia, serif' }}>
            Can't Find What You're Looking For?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-100 mb-6 md:mb-8 animate-fade-in-delay-1 px-4">
            Connect with our artisans for custom handcrafted creations made just for you
          </p>
          <Link href="/auth/signup">
            <button className="px-8 md:px-10 py-3 md:py-4 bg-white rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform active:scale-95 md:hover:scale-110 md:hover:-translate-y-2 animate-scale-in text-base md:text-lg"
                    style={{ color: '#926829', animationDelay: '0.3s', minHeight: '44px' }}>
              Request Custom Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}