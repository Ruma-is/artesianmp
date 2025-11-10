'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { verifyUPIPayment } from '@/lib/utils/upiPayment'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    handlePaymentCallback()
  }, [])

  const handlePaymentCallback = async () => {
    try {
      const paymentId = searchParams.get('paymentId') || searchParams.get('merchantTransactionId')
      const orderId = searchParams.get('orderId')
      const transactionId = searchParams.get('transactionId') || searchParams.get('providerReferenceId')

      if (!paymentId || !orderId) {
        setStatus('failed')
        setMessage('Invalid payment information')
        return
      }

      console.log('🔍 Verifying PhonePe payment:', { paymentId, orderId })

      // Verify payment with PhonePe gateway
      const verification = await verifyUPIPayment(paymentId)

      if (!verification.success) {
        setStatus('failed')
        setMessage('Payment verification failed. Please contact support.')
        return
      }

      if (verification.status === 'success') {
        // Update order payment status in database
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'completed',
            status: 'confirmed',
            transaction_id: transactionId || paymentId,
            paid_at: new Date().toISOString(),
            payment_gateway: 'phonepe',
          })
          .eq('id', orderId)

        if (error) {
          console.error('❌ Failed to update order:', error)
          setStatus('failed')
          setMessage('Payment successful but order update failed. Please contact support.')
          return
        }

        console.log('✅ Payment verified and order updated')
        setStatus('success')
        setMessage('Payment successful! Your order has been confirmed.')
        
        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          router.push('/orders')
        }, 3000)
      } else if (verification.status === 'failed') {
        setStatus('failed')
        setMessage('Payment failed. Please try again.')
        
        // Update order status to failed
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
          })
          .eq('id', orderId)
      } else {
        setStatus('failed')
        setMessage('Payment is still pending. Please check back later.')
      }

    } catch (error) {
      console.error('❌ Payment callback error:', error)
      setStatus('failed')
      setMessage('An error occurred while processing your payment.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-2" style={{ borderColor: '#e8dfd0' }}>
          {/* Loading/Verifying State */}
          {status === 'verifying' && (
            <>
              <div className="text-7xl mb-6 animate-bounce">⏳</div>
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#926829' }}>
                Verifying Payment
              </h1>
              <div className="w-24 h-1.5 mx-auto rounded-full mb-6 animate-pulse" style={{ backgroundColor: '#926829' }}></div>
              <p className="text-lg text-gray-600 mb-6">{message}</p>
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#926829', animationDelay: '0s' }}></div>
                <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#926829', animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#926829', animationDelay: '0.4s' }}></div>
              </div>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="text-7xl mb-6 animate-bounce">✅</div>
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#10b981' }}>
                Payment Successful!
              </h1>
              <div className="w-24 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: '#10b981' }}></div>
              <p className="text-lg text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">Redirecting to your orders...</p>
              <button
                onClick={() => router.push('/orders')}
                className="px-8 py-4 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                style={{ backgroundColor: '#926829' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                View My Orders
              </button>
            </>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <>
              <div className="text-7xl mb-6">❌</div>
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#ef4444' }}>
                Payment Failed
              </h1>
              <div className="w-24 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: '#ef4444' }}></div>
              <p className="text-lg text-gray-600 mb-8">{message}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push('/orders')}
                  className="flex-1 px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border-2"
                  style={{ color: '#926829', borderColor: '#926829' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#926829'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#926829'
                  }}>
                  View Orders
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="flex-1 px-6 py-4 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  style={{ backgroundColor: '#926829' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5621')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}>
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
