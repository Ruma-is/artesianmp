import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    const clientId = process.env.NEXT_PUBLIC_UPI_CLIENT_ID
    const clientSecret = process.env.UPI_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      )
    }

    console.log('🔍 Verifying PhonePe payment:', paymentId)

    // PhonePe Status Check API - Using UAT/Sandbox for testing
    // Switch to production after testing: https://api.phonepe.com/apis/hermes/pg/v1/status
    const phonePeStatusUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status'
    
    const merchantId = clientId
    const saltKey = clientSecret
    const saltIndex = "1"
    const merchantTransactionId = paymentId

    // Generate X-VERIFY header for status check
    const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex')
    const xVerifyHeader = `${sha256Hash}###${saltIndex}`

    // Call PhonePe Status API
    const verificationResponse = await fetch(
      `${phonePeStatusUrl}/${merchantId}/${merchantTransactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerifyHeader,
          'X-MERCHANT-ID': merchantId,
        },
      }
    )

    if (!verificationResponse.ok) {
      const errorData = await verificationResponse.json()
      console.error('❌ PhonePe verification failed:', errorData)
      
      return NextResponse.json(
        { error: 'Payment verification failed', details: errorData },
        { status: 500 }
      )
    }

    const verificationData = await verificationResponse.json()

    console.log('✅ PhonePe payment verified!')
    console.log('📱 Status:', verificationData)

    // PhonePe status mapping
    // SUCCESS, FAILED, PENDING
    const phonepeStatus = verificationData.code === 'PAYMENT_SUCCESS' ? 'success' : 
                         verificationData.code === 'PAYMENT_ERROR' ? 'failed' : 'pending'

    return NextResponse.json({
      success: true,
      status: phonepeStatus,
      paymentId: paymentId,
      amount: verificationData.data?.amount ? verificationData.data.amount / 100 : 0,
      transactionId: verificationData.data?.transactionId || paymentId,
      phonepeCode: verificationData.code,
      phonepeMessage: verificationData.message,
    })

  } catch (error) {
    console.error('❌ Payment verification error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to verify payment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
