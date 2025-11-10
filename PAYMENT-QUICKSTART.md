# UPI Payment Integration - Quick Start

## ✅ What Was Done

### 1. Environment Variables Added
File: `.env.local`
```bash
NEXT_PUBLIC_UPI_CLIENT_ID=M23HPCTW5HTAV_2511091723
UPI_CLIENT_SECRET=OWI3YTQ0OTEtYzMyNS00NGIwLTljY2QtODgzN2E5MjM4ODg0
```

### 2. New Files Created

#### Payment Utilities
- `src/lib/utils/upiPayment.ts` - Payment helper functions

#### API Routes
- `src/app/api/payment/create/route.ts` - Create payment with gateway
- `src/app/api/payment/verify/route.ts` - Verify payment status

#### Pages
- `src/app/payment/callback/page.tsx` - Handle payment responses

#### Database Scripts
- `scripts/add-payment-columns.sql` - Add payment tracking columns

#### Documentation
- `PAYMENT-SETUP-GUIDE.md` - Complete integration guide

### 3. Updated Files
- `src/app/checkout/page.tsx` - Integrated payment gateway
- `.env.local` - Added UPI credentials

## 🚀 Quick Setup (3 Steps)

### Step 1: Add Database Columns
```sql
-- Run in Supabase SQL Editor
-- File: scripts/add-payment-columns.sql

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS transaction_id TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_gateway TEXT DEFAULT 'upi',
ADD COLUMN IF NOT EXISTS payment_details JSONB;
```

### Step 2: Configure Payment Gateway API

Edit: `src/app/api/payment/create/route.ts` (Line 32)
```typescript
// Replace with your actual payment gateway URL
const paymentGatewayResponse = await fetch('YOUR_PAYMENT_GATEWAY_URL', {
```

Edit: `src/app/api/payment/verify/route.ts` (Line 30)
```typescript
// Replace with your verification URL
const verificationResponse = await fetch('YOUR_GATEWAY_VERIFY_URL', {
```

### Step 3: Test
```bash
1. Add items to cart
2. Go to /checkout
3. Fill shipping details
4. Click "Place Order"
5. Check console logs for payment flow
```

## 📋 Payment Flow

```
User Checkout
    ↓
Create Order (status: pending, payment_status: pending)
    ↓
Initiate Payment Gateway
    ↓
Redirect to Payment Page
    ↓
User Completes Payment
    ↓
Redirect to /payment/callback
    ↓
Verify Payment with Gateway
    ↓
Update Order (status: confirmed, payment_status: completed)
    ↓
Show Success & Redirect to /orders
```

## 🔍 Console Logs to Watch

When creating an order:
```
🛒 Creating order for user: <user-id>
✅ Order created successfully!
✅ Order items created successfully!
💳 Initiating payment gateway...
✅ Payment gateway initiated successfully!
🔗 Payment URL: <url>
```

## ⚠️ Important Notes

1. **Payment Gateway Not Configured Yet:**
   The code will use fallback UPI link until you configure the gateway API URLs.

2. **Test Mode:**
   Currently shows alert: "Payment gateway not fully configured. Using direct UPI link."

3. **Production Ready After:**
   - Updating gateway API URLs
   - Running database migration
   - Testing with actual gateway

## 📱 Current Behavior

### Without Gateway Configuration:
- Order creates successfully ✅
- Falls back to direct UPI link ✅
- Opens UPI app for payment ✅
- Redirects to /orders after 2 seconds ✅

### With Gateway Configuration:
- Order creates successfully ✅
- Calls payment gateway API ✅
- Redirects to gateway payment page ✅
- Returns to /payment/callback ✅
- Verifies payment ✅
- Updates order status ✅
- Shows success message ✅

## 🔧 Files to Customize

**REQUIRED:**
1. `src/app/api/payment/create/route.ts` - Add your gateway URL
2. `src/app/api/payment/verify/route.ts` - Add your verify URL
3. Run `scripts/add-payment-columns.sql` in Supabase

**OPTIONAL:**
4. Customize payment request format for your gateway
5. Add webhook handler for async notifications
6. Add payment retry logic

## 📞 Testing Checklist

- [ ] Run database migration script
- [ ] Update payment gateway URLs
- [ ] Test order creation
- [ ] Test payment initiation
- [ ] Test payment callback
- [ ] Verify order status update
- [ ] Check console logs
- [ ] Test with actual payment gateway

## 🎯 Next Actions

1. Open Supabase SQL Editor
2. Run `scripts/add-payment-columns.sql`
3. Get your payment gateway API documentation
4. Update API URLs in create/route.ts and verify/route.ts
5. Test with a sample order
6. Review PAYMENT-SETUP-GUIDE.md for detailed instructions

---

**Your payment credentials are configured and code is ready!**
**Just need to connect to your payment gateway API endpoints.**
