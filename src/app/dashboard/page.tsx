export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Orders</h2>
            <p className="text-gray-600 mb-4">You have no orders yet.</p>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
              Browse Products
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Products</h2>
            <p className="text-gray-600 mb-4">Start selling your products!</p>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
