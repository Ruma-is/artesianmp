import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        total_price,
        products (
          id,
          title,
          images
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    notFound()
  }

  const items = (order.order_items || []).map((item: any) => ({
    id: item.products?.id,
    title: item.products?.title,
    image: item.products?.images?.[0],
    quantity: item.quantity,
    price: item.unit_price
  }))
  const address = order.shipping_address as any

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 rounded-lg shadow mb-6 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase</p>
          <p className="text-sm text-gray-500">Order ID: #{order.id.substring(0, 8).toUpperCase()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="relative w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-3xl">🎨</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-orange-600 font-bold mt-1">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{order.total_amount - 50}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold">₹50</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total Paid</span>
              <span className="text-orange-600">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <div className="text-gray-700">
            <p className="font-semibold">{address.fullName}</p>
            <p className="mt-2">{address.address}</p>
            <p className="mt-1">Pincode: {address.pincode}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Information</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📱</span>
            <div>
              <p className="font-semibold">UPI Payment</p>
              <p className="text-sm text-gray-600">Payment {order.status === 'pending' ? 'Pending' : 'Completed'}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-semibold text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 border-2 border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50 font-semibold text-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
