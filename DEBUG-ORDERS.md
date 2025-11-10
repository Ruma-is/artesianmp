# Orders Debug Guide

## Problem
Orders are created but not showing up for the current user because they have a different `buyer_id` than the currently logged-in user.

## What Was Fixed

### 1. Checkout Process (`src/app/checkout/page.tsx`)
**Fixed Issues:**
- ✅ Added user authentication verification before creating orders
- ✅ Using `supabase.auth.getUser()` to get the current authenticated user
- ✅ Verifying user ID matches between context and current session
- ✅ Using verified `currentUser.id` for `buyer_id` field
- ✅ Clearing cart immediately after successful order creation (not in setTimeout)
- ✅ Redirecting to orders page before opening UPI payment
- ✅ Better error handling and logging
- ✅ Removed problematic setTimeout that caused confusion

### 2. Orders Page (`src/app/orders/page.tsx`)
**Fixed Issues:**
- ✅ Removed unused `mockOrders` array that was confusing
- ✅ Added user authentication verification in fetchOrders
- ✅ Using `supabase.auth.getUser()` to verify current user
- ✅ Enhanced logging to show exactly what's being queried
- ✅ Better error messages and debugging output

## How to Debug Existing Orders

### Step 1: Check Current User ID
Open browser console on the orders page and look for:
```
🔍 Fetching orders for user:
   User ID: <your-current-user-id>
   Email: <your-email>
```

### Step 2: Check Database Orders
Run this query in Supabase SQL Editor:
```sql
-- See all orders with their buyer_id
SELECT 
  id,
  order_number,
  buyer_id,
  total_amount,
  status,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 20;
```

### Step 3: Find Orphaned Orders
Look for orders with order numbers like:
- ORD-1762783997785-S4X4K3O7H
- ORD-1762783708954-K91ABYQND
- ORD-1762781586359-3X6ZE8POZ
- ORD-1761508330596-5PCX7415Y

These orders exist but their `buyer_id` doesn't match your current user ID.

### Step 4: Check All User Accounts
```sql
-- See all user accounts
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

## Fixing Existing Orders

### Option 1: Update Orders to Current User (Recommended)
```sql
-- First, get your current user ID from Step 1 above
-- Then run this to update ALL orders to your current account:

UPDATE public.orders
SET buyer_id = 'YOUR_CURRENT_USER_ID_HERE'  -- ⚠️ Replace with actual ID
WHERE buyer_id IS NOT NULL;

-- Verify the update:
SELECT order_number, buyer_id, status, total_amount
FROM public.orders
ORDER BY created_at DESC
LIMIT 10;
```

### Option 2: Update Specific Orders Only
```sql
-- Update only specific order numbers:
UPDATE public.orders
SET buyer_id = 'YOUR_CURRENT_USER_ID_HERE'  -- ⚠️ Replace with actual ID
WHERE order_number IN (
  'ORD-1762783997785-S4X4K3O7H',
  'ORD-1762783708954-K91ABYQND',
  'ORD-1762781586359-3X6ZE8POZ',
  'ORD-1761508330596-5PCX7415Y'
);
```

### Option 3: Delete Wrong Orders
```sql
-- ⚠️ CAREFUL! This deletes orders permanently
-- Only use if you want to remove test orders

-- First delete order_items (foreign key constraint)
DELETE FROM public.order_items
WHERE order_id IN (
  SELECT id FROM public.orders
  WHERE buyer_id != 'YOUR_CURRENT_USER_ID_HERE'
);

-- Then delete the orders
DELETE FROM public.orders
WHERE buyer_id != 'YOUR_CURRENT_USER_ID_HERE';
```

## Testing the Fix

### Test 1: Create a New Order
1. Add items to cart
2. Go to checkout
3. Fill in shipping details
4. Click "Place Order"
5. Check browser console for logs:
   - Should see: `🛒 Creating order for user: <your-id>`
   - Should see: `✅ Order created successfully!`
   - Should see: `✅ Buyer ID: <your-id>`

### Test 2: Verify Order Shows Up
1. Go to `/orders` page
2. Check browser console:
   - Should see: `✅ Number of orders found: X` (where X > 0)
   - Your new order should appear in the list

### Test 3: Check Database
```sql
-- Should show your new order with correct buyer_id
SELECT 
  order_number,
  buyer_id,
  status,
  total_amount,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 5;
```

## Prevention

The fixes ensure that:
1. ✅ Orders always use the currently authenticated user's ID
2. ✅ User authentication is verified before order creation
3. ✅ User ID mismatch is detected and prevents order creation
4. ✅ Cart is cleared immediately after successful order creation
5. ✅ Better logging helps identify issues quickly

## Common Issues

### Issue: "No orders found" but I just created one
**Solution:** Check browser console logs. The order might have been created with a different buyer_id due to session issues.

### Issue: Session expired error
**Solution:** Log out and log back in to refresh the session.

### Issue: Orders show different buyer_id in database
**Solution:** Use Option 1 or 2 above to fix the buyer_id values.

## Need More Help?

1. Check browser console logs for detailed error messages
2. Check Supabase logs in your dashboard
3. Run the SQL queries above to inspect the data
4. Make sure you're logged in with the same account that created the orders
