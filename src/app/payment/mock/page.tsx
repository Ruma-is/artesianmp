'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, Suspense } from 'react'

function MockPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const txnId = searchParams.get('txnId')

  const handleGoToOrders = async () => {
    if (!orderId) {
      router.push('/orders')
      return
    }

    setIsProcessing(true)

    try {
      const supabase = createClient()

      console.log('🔄 Updating payment status for order:', orderId)

      // First, try updating basic fields that should exist
      const { error: basicError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
        })
        .eq('id', orderId)

      if (basicError) {
        console.error('❌ Error updating basic payment status:', basicError)
        console.error('Full error details:', JSON.stringify(basicError, null, 2))
      } else {
        console.log('✅ Payment status updated to PAID')
        console.log('✅ Order status updated to CONFIRMED')

        // Try to update additional payment tracking fields (if columns exist)
        if (txnId) {
          const { error: extendedError } = await supabase
            .from('orders')
            .update({
              transaction_id: txnId,
              paid_at: new Date().toISOString(),
              payment_gateway: 'phonepe_mock'
            } as any)
            .eq('id', orderId)

          if (extendedError) {
            console.warn('⚠️ Could not update extended payment fields (columns may not exist)')
            console.warn('💡 Run scripts/add-payment-columns.sql in Supabase to enable full tracking')
          } else {
            console.log('✅ Extended payment tracking updated')
          }
        }
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error)
    } finally {
      setIsProcessing(false)
      router.push('/orders')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-4" style={{ borderColor: '#926829' }}>
        {/* PhonePe Logo Simulation */}
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">💳</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#5f259f' }}>
            PhonePe Payment Gateway
          </h1>
          <p className="text-sm text-gray-500">(Mock/Test Mode)</p>
        </div>

        {/* Payment Details */}
        <div className="bg-purple-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-xl" style={{ color: '#926829' }}>₹{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-xs">{orderId?.substring(0, 20)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-xs">{txnId}</span>
            </div>
          </div>
        </div>

        {/* Success Animation */}
        <div className="mb-6">
          <div className="text-6xl mb-3 animate-pulse">✅</div>
          <h2 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 text-sm">This is a simulated payment for testing purposes</p>
        </div>

        {/* Manual redirect button */}
        <button
          onClick={handleGoToOrders}
          disabled={isProcessing}
          className="w-full py-3 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{ backgroundColor: '#926829' }}
          onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.backgroundColor = '#7a5621')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#926829')}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin inline-block mr-2">⏳</span>
              Processing...
            </>
          ) : (
            'Complete Payment & Go to Orders →'
          )}
        </button>

        {/* Info Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <p className="text-xs text-gray-600">
            <span className="font-bold">ℹ️ Testing Mode:</span> This is a simulated PhonePe payment page.
            In production, this would be the real PhonePe payment gateway after merchant activation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">⏳</div>
          <h1 className="text-3xl font-bold" style={{ color: '#926829' }}>Loading...</h1>
        </div>
      </div>
    }>
      <MockPaymentContent />
    </Suspense>
  )
}
