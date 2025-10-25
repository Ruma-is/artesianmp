export default function ProductsPage() {
  const dummyProducts = [
    { id: 1, name: "Handwoven Basket", price: 999, artisan: "Ravi Kumar" },
    { id: 2, name: "Ceramic Vase", price: 1499, artisan: "Meera Devi" },
    { id: 3, name: "Wooden Sculpture", price: 2499, artisan: "Arjun Singh" },
    { id: 4, name: "Silk Scarf", price: 799, artisan: "Lakshmi Bai" },
    { id: 5, name: "Clay Pottery Set", price: 1299, artisan: "Ramesh Yadav" },
    { id: 6, name: "Handpainted Canvas", price: 3499, artisan: "Kavita Sharma" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Browse Products</h1>
        <p className="text-gray-600 mb-8">Discover authentic handcrafted items from talented artisans</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {dummyProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-gray-200">
              <div className="bg-gradient-to-br from-orange-200 to-orange-100 h-48"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">by {product.artisan}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
