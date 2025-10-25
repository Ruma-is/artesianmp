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
    return <div>Error loading products</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Discover authentic handcrafted items from talented artisans
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const imageUrl = product.images?.[0];

            return (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition">
                {/* Image */}
                <div className="relative h-64 bg-gray-100">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={product.title} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl">🎨</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category Badge */}
                  <p className="text-xs text-orange-600 font-semibold uppercase mb-2">
                    HANDMADE
                  </p>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.title}
                  </h3>

                  {/* Artisan */}
                  <p className="text-sm text-gray-600 mb-3">
                    by Ravi Kumar
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">
                      ₹{product.price}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition text-sm font-medium">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
