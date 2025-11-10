# 🚀 Complete Setup Checklist

## ✅ Already Done
- [x] UPI credentials added to .env.local
- [x] Payment integration code created
- [x] Checkout process updated
- [x] Payment API routes created
- [x] Payment callback page created

## 📝 Next Steps (Do These Now)

### Step 1: Database Setup (5 minutes)

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click "SQL Editor" in the left sidebar

2. **Run the Complete Setup Script**
   - Open file: `scripts/COMPLETE-SETUP.sql` in VS Code
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" for each part separately:

   **Part 1:** Add payment columns (Lines 9-30)
   ```sql
   ALTER TABLE public.orders
   ADD COLUMN IF NOT EXISTS transaction_id TEXT,
   ...
   ```
   ✅ Should see: "Success. No rows returned"

   **Part 2:** Get your user ID (Lines 36-43)
   ```sql
   SELECT id, email, created_at, email_confirmed_at
   FROM auth.users
   ...
   ```
   ✅ Copy the `id` value from results

   **Part 3:** View current orders (Lines 49-58)
   ```sql
   SELECT order_number, buyer_id, status...
   ```
   ✅ See all orders with their buyer_id

   **Part 4:** Fix orphaned orders (Lines 68-71)
   ```sql
   UPDATE public.orders
   SET buyer_id = 'PASTE_YOUR_USER_ID_HERE'
   ```
   ⚠️ Replace 'YOUR_USER_ID_HERE' with your actual user ID from Part 2
   ✅ Should see: "Success. Updated X rows"

   **Part 5:** Verify the fix (Lines 77-95)
   ```sql
   SELECT order_number, buyer_id...
   ```
   ✅ All orders should now have YOUR buyer_id

### Step 2: Restart Development Server (1 minute)

Open terminal in VS Code and run:
```bash
# Stop the current server (Ctrl+C if running)
# Then restart it
npm run dev
```

This loads the new UPI credentials from .env.local

### Step 3: Test Order Creation (2 minutes)

1. **Go to your app:** http://localhost:3000
2. **Browse products:** /products
3. **Add item to cart**
4. **Go to checkout:** /checkout
5. **Fill shipping details:**
   - Full Name: Test User
   - Address: 123 Test Street
   - Pincode: 110001
6. **Click "Place Order"**
7. **Watch browser console** for logs:
   ```
   🛒 Creating order for user: <your-id>
   ✅ Order created successfully!
   ✅ Buyer ID: <your-id>
   💳 Initiating payment gateway...
   ```

### Step 4: Verify Orders Page (1 minute)

1. **Go to:** http://localhost:3000/orders
2. **Check browser console:**
   ```
   🔍 Fetching orders for user: <your-id>
   ✅ Number of orders found: X
   ```
3. **You should now see ALL your orders**, including the 4 that were missing!

### Step 5: Configure Payment Gateway (Optional - For Production)

When you're ready to go live, update these files:

**File:** `src/app/api/payment/create/route.ts` (Line 32)
- Replace `YOUR_PAYMENT_GATEWAY_API_URL` with your actual payment gateway URL

**File:** `src/app/api/payment/verify/route.ts` (Line 30)  
- Replace `YOUR_PAYMENT_GATEWAY_API_URL` with your verification URL

**Currently:** System uses fallback UPI link (works fine for testing)

## 🎯 Success Criteria

After completing the steps above, you should have:

✅ Payment tracking columns in database
✅ All 4 missing orders visible in /orders page  
✅ New orders created with correct buyer_id
✅ Orders showing in both UI and database
✅ Payment flow working (with fallback UPI link)

## 🐛 Troubleshooting

**Orders still not showing?**
- Check browser console for errors
- Verify you're logged in with the same account
- Run Part 5 of COMPLETE-SETUP.sql to verify buyer_id

**Payment not working?**
- Check if dev server restarted after adding .env.local
- Check browser console for error messages
- Verify .env.local has UPI credentials

**Database errors?**
- Make sure you're running SQL in Supabase SQL Editor
- Check table permissions
- Verify orders table exists

## 📞 Need Help?

Check these files for reference:
- `scripts/COMPLETE-SETUP.sql` - Database setup script
- `PAYMENT-SETUP-GUIDE.md` - Detailed payment guide
- `DEBUG-ORDERS.md` - Order debugging guide

---

**Ready to start? Begin with Step 1: Database Setup! 🚀**
