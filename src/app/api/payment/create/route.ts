import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      orderId,
      orderNumber,
      amount,
      customerName,
      customerEmail,
      callbackUrl,
      currency = 'INR',
    } = body

    // Get credentials from environment (server-side only)
    const clientId = process.env.NEXT_PUBLIC_UPI_CLIENT_ID
    const clientSecret = process.env.UPI_CLIENT_SECRET

    // Validate required fields
    if (!clientId || !clientSecret) {
      console.error('❌ Missing payment credentials')
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      )
    }

    if (!orderId || !amount || !customerName) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    console.log('🔐 Creating payment with PhonePe gateway:', {
      orderId,
      orderNumber,
      amount,
      customerName,
    })

    console.log('🔑 Credentials check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientIdLength: clientId?.length,
    })

    // **MOCK MODE FOR TESTING** - Since PhonePe credentials don't work without activation
    // This simulates a successful PhonePe payment for development/testing
    const ENABLE_MOCK_MODE = true // Set to false when you have real activated credentials

    if (ENABLE_MOCK_MODE && clientId === 'PHONEPEPGUAT') {
      console.log('🧪 MOCK MODE: Simulating PhonePe payment for testing')
      
      const mockTransactionId = `MOCK${Date.now()}`
      const mockPaymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/mock?orderId=${orderId}&amount=${amount}&txnId=${mockTransactionId}`
      
      console.log('✅ Mock payment created successfully')
      console.log('🔗 Mock payment URL:', mockPaymentUrl)
      
      return NextResponse.json({
        success: true,
        paymentId: mockTransactionId,
        paymentUrl: mockPaymentUrl,
        message: 'Mock payment created for testing',
        isMock: true
      })
    }

    // **REAL PHONEPE API CALL** - Only when mock mode is disabled
    // PhonePe Business API Configuration
    const merchantId = clientId
    const saltKey = clientSecret
    const saltIndex = "1"
    
    // Generate unique merchant transaction ID
    const merchantTransactionId = `MT${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    
    // PhonePe API endpoint - Using UAT environment
    // UAT endpoint for testing with PHONEPEPGUAT credentials
    const phonePeApiUrl = 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
    const apiEndpoint = '/apis/hermes/pg/v1/pay' // Full path for X-VERIFY hash
    
    // Prepare PhonePe payment request
    const paymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `USER${orderId.substring(0, 8)}`,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?orderId=${orderId}&merchantTransactionId=${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: callbackUrl,
      mobileNumber: "9999999999", // Optional: can be made dynamic
      paymentInstrument: {
        type: "PAY_PAGE" // This shows all payment options including UPI
      }
    }

    // Encode payload to Base64
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
    
    // Generate X-VERIFY header (SHA256 hash)
    // Format: SHA256(base64_payload + api_endpoint + salt_key) + ### + salt_index
    const stringToHash = base64Payload + apiEndpoint + saltKey
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex')
    const xVerifyHeader = `${sha256Hash}###${saltIndex}`

    console.log('📱 PhonePe Request Details:', {
      merchantId,
      merchantTransactionId,
      amount: amount * 100,
      redirectUrl: paymentPayload.redirectUrl,
      hashedString: stringToHash.substring(0, 50) + '...',
    })

    // Call PhonePe API
    const paymentGatewayResponse = await fetch(phonePeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
      },
      body: JSON.stringify({
        request: base64Payload
      }),
    })

    if (!paymentGatewayResponse.ok) {
      const errorText = await paymentGatewayResponse.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      
      console.error('❌ PhonePe API error:')
      console.error('Status:', paymentGatewayResponse.status)
      console.error('Response:', errorData)
      
      return NextResponse.json(
        { 
          error: 'PhonePe payment creation failed', 
          details: errorData,
          status: paymentGatewayResponse.status
        },
        { status: 500 }
      )
    }

    const paymentData = await paymentGatewayResponse.json()

    console.log('✅ PhonePe API Response Received!')
    console.log('📱 Success:', paymentData.success)
    console.log('📱 Code:', paymentData.code)
    console.log('📱 Full Response:', JSON.stringify(paymentData, null, 2))

    // Check if PhonePe returned success
    if (!paymentData.success) {
      console.error('❌ PhonePe returned unsuccessful response')
      return NextResponse.json(
        { 
          error: 'PhonePe payment failed', 
          details: paymentData,
          message: paymentData.message || 'Payment creation unsuccessful'
        },
        { status: 400 }
      )
    }

    // PhonePe returns the payment URL in the response
    const paymentUrl = paymentData.data?.instrumentResponse?.redirectInfo?.url

    if (!paymentUrl) {
      console.error('❌ No payment URL in response:', paymentData)
      return NextResponse.json(
        { 
          error: 'No payment URL received', 
          details: paymentData
        },
        { status: 500 }
      )
    }

    console.log('✅ Payment URL obtained:', paymentUrl)

    return NextResponse.json({
      success: true,
      paymentId: merchantTransactionId,
      paymentUrl: paymentUrl,
      orderId: orderId,
      merchantTransactionId: merchantTransactionId,
    })

  } catch (error) {
    console.error('❌ Payment creation error:', error)
    
    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: String(error)
      },
      { status: 500 }
    )
  }
}
