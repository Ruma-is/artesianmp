import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Artisan Marketplace
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover authentic handmade products from talented rural artisans across India
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/products">
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
              Browse Products
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* For Buyers */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Buyers</h3>
            <p className="text-gray-600">
              Discover unique handcrafted products and support rural artisans directly
            </p>
          </div>

          {/* For Artisans */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Artisans</h3>
            <p className="text-gray-600">
              Showcase your craftsmanship to a global audience and grow your business
            </p>
          </div>

          {/* AI-Powered */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-Powered</h3>
            <p className="text-gray-600">
              Smart pricing, multilingual support, and personalized recommendations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
