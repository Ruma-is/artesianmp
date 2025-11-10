# UPI Payment Gateway Integration Guide

## Overview
This guide explains how to integrate your UPI payment gateway credentials with the Artisan Marketplace checkout process.

## Credentials Setup

Your payment gateway credentials have been added to `.env.local`:

```bash
NEXT_PUBLIC_UPI_CLIENT_ID=M23HPCTW5HTAV_2511091723
UPI_CLIENT_SECRET=OWI3YTQ0OTEtYzMyNS00NGIwLTljY2QtODgzN2E5MjM4ODg0
```

## Database Setup

### Step 1: Add Payment Tracking Columns
Run the SQL script in Supabase SQL Editor:

```bash
# Open file: scripts/add-payment-columns.sql
# Copy and run in Supabase SQL Editor
```

This adds the following columns to your `orders` table:
- `transaction_id` - Stores payment gateway transaction ID
- `paid_at` - Timestamp when payment was completed
- `payment_gateway` - Which gateway was used (default: 'upi')
- `payment_details` - Additional payment info (JSON)

## Payment Gateway API Configuration

### Step 2: Update API Endpoints

You need to update the payment gateway API URLs in these files:

#### File: `src/app/api/payment/create/route.ts`

Replace `YOUR_PAYMENT_GATEWAY_API_URL` with your actual payment gateway endpoint:

```typescript
// Line 32-34: Update this URL
const paymentGatewayResponse = await fetch('YOUR_PAYMENT_GATEWAY_API_URL', {
```

**Common Payment Gateways:**
- **PhonePe**: `https://api.phonepe.com/apis/hermes/pg/v1/pay`
- **Paytm**: `https://securegw.paytm.in/theia/api/v1/initiateTransaction`
- **Razorpay**: `https://api.razorpay.com/v1/orders`
- **Cashfree**: `https://api.cashfree.com/pg/orders`

#### File: `src/app/api/payment/verify/route.ts`

Replace `YOUR_PAYMENT_GATEWAY_API_URL` with your verification endpoint:

```typescript
// Line 30: Update this URL
const verificationResponse = await fetch(
  `YOUR_PAYMENT_GATEWAY_API_URL/verify/${paymentId}`,
```

### Step 3: Customize API Request/Response Format

Different payment gateways have different API formats. Update the request body in `create/route.ts` to match your gateway's requirements.

**Example for PhonePe:**
```typescript
body: JSON.stringify({
  merchantId: clientId,
  merchantTransactionId: orderId,
  merchantUserId: customerEmail,
  amount: amount * 100, // in paise
  callbackUrl: callbackUrl,
  mobileNumber: "9999999999",
  paymentInstrument: {
    type: "UPI_INTENT"
  }
}),
```

**Example for Paytm:**
```typescript
body: JSON.stringify({
  body: {
    requestType: "Payment",
    mid: clientId,
    orderId: orderId,
    callbackUrl: callbackUrl,
    txnAmount: {
      value: amount.toString(),
      currency: "INR"
    },
    userInfo: {
      custId: customerEmail
    }
  },
  head: {
    signature: generateChecksum(...) // You'll need to implement this
  }
}),
```

## Payment Flow

### How It Works:

1. **User Checkout**
   - User fills shipping information
   - Clicks "Place Order"
   - Order is created in database with `status='pending'` and `payment_status='pending'`

2. **Payment Initiation**
   - Frontend calls `initiateUPIPayment()` utility
   - Utility calls `/api/payment/create` with order details
   - API calls your payment gateway
   - Gateway returns payment URL
   - User is redirected to payment page

3. **Payment Completion**
   - User completes payment on gateway page
   - Gateway redirects to `/payment/callback` with payment details
   - Callback page verifies payment with gateway
   - Order status updated to `confirmed` and `payment_status='completed'`
   - User redirected to `/orders` page

4. **Payment Verification**
   - `/api/payment/verify` checks payment status with gateway
   - Updates order record in database
   - Shows success/failure message

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── create/
│   │       │   └── route.ts          # Create payment
│   │       └── verify/
│   │           └── route.ts          # Verify payment
│   ├── checkout/
│   │   └── page.tsx                  # Checkout page
│   └── payment/
│       └── callback/
│           └── page.tsx              # Payment callback handler
└── lib/
    └── utils/
        └── upiPayment.ts             # Payment utilities
```

## Testing the Integration

### Test Mode (Without Actual Gateway)

The code includes a fallback to direct UPI link if payment gateway is not fully configured:

```typescript
// Fallback UPI link
const upiLink = `upi://pay?pa=rumurumi72@okhdfcbank&pn=Artisan%20Marketplace&am=2500&cu=INR&tn=Order%20ORD-123`
```

### Test with Real Gateway

1. **Create Test Order:**
   ```bash
   # Add items to cart
   # Go to /checkout
   # Fill details and submit
   ```

2. **Check Console Logs:**
   ```
   🛒 Creating order for user: <user-id>
   ✅ Order created successfully!
   💳 Initiating payment gateway...
   ✅ Payment gateway initiated successfully!
   ```

3. **Complete Payment:**
   - You'll be redirected to payment gateway
   - Complete the payment (use test cards if in sandbox mode)
   - You'll be redirected back to `/payment/callback`

4. **Verify in Database:**
   ```sql
   SELECT 
     order_number,
     payment_status,
     status,
     transaction_id,
     paid_at
   FROM orders
   ORDER BY created_at DESC
   LIMIT 5;
   ```

## Environment Variables

Make sure these are set in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change in production

# UPI Payment Gateway
NEXT_PUBLIC_UPI_CLIENT_ID=M23HPCTW5HTAV_2511091723
UPI_CLIENT_SECRET=OWI3YTQ0OTEtYzMyNS00NGIwLTljY2QtODgzN2E5MjM4ODg0
```

## Webhook Setup (Optional but Recommended)

For production, set up webhooks to handle payment notifications from your gateway:

1. Create `/api/payment/webhook/route.ts`
2. Configure webhook URL in payment gateway dashboard
3. Verify webhook signatures for security
4. Update order status based on webhook events

## Security Considerations

✅ **Implemented:**
- Client secret stored in environment variables (server-side only)
- User authentication verification before payment
- Payment verification on callback
- HTTPS for production (required for payment gateways)

⚠️ **TODO for Production:**
- Implement webhook signature verification
- Add rate limiting on payment APIs
- Set up proper error logging and monitoring
- Use proper checksum/signature generation for gateway requests
- Implement payment retry mechanism
- Add payment timeout handling

## Troubleshooting

### Payment Gateway Returns Error

1. Check console logs for error details
2. Verify credentials in `.env.local`
3. Check if API URLs are correct
4. Verify request format matches gateway documentation

### Payment Callback Not Working

1. Ensure `NEXT_PUBLIC_APP_URL` is set correctly
2. Check if callback URL is whitelisted in gateway dashboard
3. Verify payment gateway redirects to correct URL
4. Check browser console for errors

### Order Created But Payment Status Not Updated

1. Check `/payment/callback` page logs
2. Verify payment verification API is working
3. Check database permissions
4. Ensure transaction_id column exists in orders table

## Next Steps

1. ✅ Run `scripts/add-payment-columns.sql` in Supabase
2. ⚠️ Update payment gateway API URLs in `create/route.ts` and `verify/route.ts`
3. ⚠️ Customize API request/response format for your gateway
4. ✅ Test with a real order
5. ⚠️ Set up webhooks for production
6. ⚠️ Add proper error handling and logging
7. ⚠️ Test in sandbox/test mode before going live

## Support

If you need help:
1. Check payment gateway documentation
2. Review console logs for detailed error messages
3. Check Supabase logs for database errors
4. Verify all environment variables are set correctly

---

**Status:** ✅ Code Integrated | ⚠️ Gateway Configuration Needed
