import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductGallery from '@/components/products/ProductGallery';
import ProductTabs from '@/components/products/ProductTabs';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  const imageUrl = product.images?.[0];
  const productImages = product.images || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      {/* Breadcrumb Navigation */}
      <div className="border-b" style={{ backgroundColor: '#f5efe6', borderColor: '#e8dfd0' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 font-medium transition-all duration-300 md:hover:gap-3 group text-sm md:text-base"
            style={{ color: '#926829' }}
          >
            <span className="transform md:group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back to Products</span>
          </Link>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
          {/* Dynamic Image Gallery */}
          <ProductGallery images={productImages} title={product.title} />

          {/* Product Details */}
          <div className="animate-slide-in-right">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-bold uppercase mb-3 md:mb-4 animate-fade-in"
                 style={{ backgroundColor: '#f5efe6', color: '#926829' }}>
              <span>🏺</span>
              <span>Traditional Craft</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900 animate-fade-in-delay-1 leading-tight" 
                style={{ fontFamily: 'Georgia, serif' }}>
              {product.title}
            </h1>

            {/* Artisan Info */}
            <div className="flex items-center gap-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b animate-fade-in-delay-1" style={{ borderColor: '#e8dfd0' }}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl"
                   style={{ backgroundColor: '#f5efe6' }}>
                👨‍🎨
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Crafted by</p>
                <p className="font-semibold text-gray-900 text-sm md:text-base">Ravi Kumar</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="text-yellow-500 text-sm md:text-base">⭐⭐⭐⭐⭐</span>
                <span className="text-xs md:text-sm text-gray-600 ml-1">(4.8)</span>
              </div>
            </div>

            {/* Description */}
            <ProductTabs description={product.description || ''} />

            {/* Product Features */}
            <div className="mb-6 md:mb-8 p-4 md:p-6 rounded-xl animate-slide-up" 
                 style={{ backgroundColor: '#f5efe6', animationDelay: '0.3s' }}>
              <h3 className="font-bold mb-3 md:mb-4 text-gray-900 text-base md:text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                Product Highlights
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-start gap-2 md:gap-3 text-gray-700 text-sm md:text-base">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>100% Handcrafted with traditional techniques</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3 text-gray-700 text-sm md:text-base">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Supports rural artisans and communities</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3 text-gray-700 text-sm md:text-base">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Eco-friendly and sustainable materials</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3 text-gray-700 text-sm md:text-base">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Unique piece - no two are exactly alike</span>
                </li>
              </ul>
            </div>

            {/* Price */}
            <div className="mb-6 md:mb-8 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-xs md:text-sm text-gray-600 mb-2">Price</p>
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  ₹{product.price}
                </span>
                <span className="text-gray-500 line-through text-lg md:text-xl">₹{Math.round(product.price * 1.3)}</span>
                <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold text-white" style={{ backgroundColor: '#22c55e' }}>
                  Save 23%
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-2">Inclusive of all taxes • Free shipping</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 md:space-y-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <AddToCartButton product={product} />
              
              <button className="w-full border-2 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 shadow-md md:hover:shadow-xl group flex items-center justify-center gap-2 text-sm md:text-base"
                      style={{ borderColor: '#926829', color: '#926829', minHeight: '44px' }}>
                <span>💬</span>
                <span>Contact Artisan</span>
                <span className="transform md:group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>

              <button className="w-full px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 md:hover:scale-105 border-2 border-gray-300 text-gray-700 md:hover:border-gray-400 flex items-center justify-center gap-2 text-sm md:text-base"
                      style={{ minHeight: '44px' }}>
                <span>❤️</span>
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8 pt-6 md:pt-8 border-t animate-fade-in-delay-2" style={{ borderColor: '#e8dfd0' }}>
              <div className="text-center">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">🔒</div>
                <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">🚚</div>
                <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">↩️</div>
                <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Artisan Story Section */}
        <div className="mt-12 md:mt-20 p-6 md:p-10 rounded-2xl shadow-xl animate-fade-in" 
             style={{ backgroundColor: '#926829' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              The Artisan's Story
            </h2>
            <div className="w-16 md:w-24 h-1.5 bg-white mx-auto rounded-full mb-4 md:mb-6"></div>
            <p className="text-base md:text-lg lg:text-xl text-gray-100 leading-relaxed mb-4 md:mb-6">
              Each piece is carefully crafted by skilled artisans who have mastered their craft over years of dedication. 
              By purchasing this product, you're not just buying a beautiful item – you're supporting traditional craftsmanship, 
              preserving cultural heritage, and empowering rural communities.
            </p>
            <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-xs md:text-sm text-gray-200">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-xs md:text-sm text-gray-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-xs md:text-sm text-gray-200">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12 md:mt-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
              You May Also Like
            </h2>
            <div className="w-16 md:w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: '#926829' }}></div>
          </div>
          <div className="text-center text-gray-600 py-8 md:py-12 px-4">
            <p className="text-sm md:text-base mb-4 md:mb-6">Discover more handcrafted treasures from our artisans</p>
            <Link href="/products">
              <button className="px-6 md:px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 shadow-lg md:hover:shadow-xl text-sm md:text-base"
                      style={{ backgroundColor: '#926829', minHeight: '44px' }}>
                Browse All Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
