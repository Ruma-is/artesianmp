import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/components/products/AddToCartButton';

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/products" className="text-orange-600 hover:text-orange-700 mb-6 inline-block">
          ← Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt={product.title} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-9xl">🎨</div>
            )}
          </div>

          <div>
            <p className="text-xs text-orange-600 font-semibold uppercase mb-2">HANDMADE</p>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-4">by Ravi Kumar</p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-orange-600">₹{product.price}</span>
            </div>

            <div className="space-y-3">
              <AddToCartButton product={product} />
              <button className="w-full border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 font-semibold">
                Contact Artisan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
