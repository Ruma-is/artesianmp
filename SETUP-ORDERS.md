# Setting Up Orders in Supabase

## Step 1: Create Database Tables

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `mowjiiznqsbomqjhrmdf`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the SQL Script**
   - Open the file: `scripts/create-orders-table.sql`
   - Copy ALL the content
   - Paste it into the SQL Editor
   - Click "RUN" button

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables:
     - `orders`
     - `order_items`

## Step 2: Test Your Orders

### Option A: Place a Real Order
1. Start your app: `npm run dev`
2. Browse products at `http://localhost:3001/products`
3. Add items to cart
4. Go to checkout
5. Fill in shipping details
6. Complete the order
7. Check your orders at `http://localhost:3001/orders`

### Option B: Insert Test Data (Optional)
Run this in Supabase SQL Editor to add a test order:

```sql
-- Get your user ID first
SELECT id, email FROM auth.users;

-- Insert a test order (replace YOUR_USER_ID with actual ID from above)
INSERT INTO public.orders (
  order_number,
  buyer_id,
  total_amount,
  shipping_fee,
  status,
  payment_status,
  payment_method,
  shipping_address
) VALUES
  (
    'ORD-TEST-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    'YOUR_USER_ID',  -- Replace this!
    2500.00,
    50.00,
    'pending',
    'pending',
    'upi',
    '{"full_name": "Test User", "address": "123 Test Street, Mumbai", "pincode": "400001"}'::jsonb
  )
RETURNING *;

-- Insert order items (replace ORDER_ID with the ID from above)
INSERT INTO public.order_items (
  order_id,
  product_name,
  quantity,
  unit_price,
  total_price
) VALUES
  (
    'ORDER_ID',  -- Replace this!
    'Handcrafted Test Lamp',
    2,
    1225.00,
    2450.00
  );
```

## Step 3: Verify Everything Works

1. **Visit Orders Page**
   - Go to: `http://localhost:3001/orders`
   - You should see your orders (or mock data if no orders exist)

2. **Check Dashboard**
   - Go to: `http://localhost:3001/dashboard`
   - Should show order statistics

3. **View Order Details**
   - Click on any order
   - Should show full order details including product info

## How It Works

### Data Flow:
1. **Checkout** → Creates order in `orders` table
2. **Checkout** → Creates items in `order_items` table
3. **Orders Page** → Fetches from Supabase and displays
4. **Fallback** → Shows mock data if no real orders exist

### Files Modified:
- ✅ `/src/app/orders/page.tsx` - Now fetches real data
- ✅ `/src/app/checkout/page.tsx` - Saves product names
- ✅ `/scripts/create-orders-table.sql` - Database schema

### What's Protected:
- ✅ Users can only see their own orders (RLS enabled)
- ✅ Order data is secured with Row Level Security
- ✅ Product info is saved as snapshot (in case product is deleted)

## Troubleshooting

### "No orders showing"
- Check if you placed an order successfully
- Look in browser console for errors
- Verify tables exist in Supabase

### "Permission denied"
- Make sure you ran the SQL script completely
- Check RLS policies in Supabase
- Verify you're logged in

### "Error fetching orders"
- Check browser console for details
- Verify Supabase credentials in `.env.local`
- Make sure tables have correct permissions

## Next Steps

Once orders are working:
1. Add order tracking functionality
2. Add email notifications
3. Create admin panel for artisans to update order status
4. Add order cancellation feature

---

**Need Help?**
Check the browser console (F12) for error messages!
