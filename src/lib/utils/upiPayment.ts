// UPI Payment Gateway Integration
// This handles payment processing with the UPI gateway

interface PaymentRequest {
  orderId: string
  orderNumber: string
  amount: number
  customerName: string
  customerEmail?: string
  callbackUrl: string
}

interface PaymentResponse {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  error?: string
}

/**
 * Initialize UPI payment with the payment gateway
 * @param request Payment request details
 * @returns Payment response with payment URL or error
 */
export async function initiateUPIPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const clientId = process.env.NEXT_PUBLIC_UPI_CLIENT_ID

    if (!clientId) {
      throw new Error('UPI payment credentials not configured')
    }

    console.log('💳 Initiating UPI payment:', {
      orderId: request.orderId,
      orderNumber: request.orderNumber,
      amount: request.amount,
    })

    // Call payment gateway API endpoint (server-side handles secret)
    const response = await fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: request.orderId,
        orderNumber: request.orderNumber,
        amount: request.amount,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        callbackUrl: request.callbackUrl,
        currency: 'INR',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Payment API error:', errorText)
      throw new Error(`Payment API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    
    console.log('✅ Payment initiated successfully:', data)
    
    return {
      success: true,
      paymentId: data.paymentId,
      paymentUrl: data.paymentUrl,
    }
  } catch (error) {
    console.error('❌ Payment initiation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    }
  }
}

/**
 * Verify UPI payment status
 * @param paymentId Payment ID to verify
 * @returns Payment verification result
 */
export async function verifyUPIPayment(paymentId: string): Promise<{
  success: boolean
  status?: 'success' | 'failed' | 'pending'
  error?: string
}> {
  try {
    const response = await fetch(`/api/payment/verify?paymentId=${paymentId}`)
    
    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    const data = await response.json()
    
    return {
      success: true,
      status: data.status,
    }
  } catch (error) {
    console.error('❌ Payment verification failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    }
  }
}
