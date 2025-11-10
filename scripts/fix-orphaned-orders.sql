-- =====================================================
-- FIX ORPHANED ORDERS - Quick Fix Script
-- =====================================================
-- This script helps fix orders that were created with the wrong buyer_id
--
-- INSTRUCTIONS:
-- 1. Run Step 1 to find your current user ID
-- 2. Copy your user ID 
-- 3. Replace 'YOUR_USER_ID_HERE' in Step 2 with your actual ID
-- 4. Run Step 2 to update the orders
-- 5. Run Step 3 to verify
-- =====================================================

-- STEP 1: Find your current user ID
-- Copy the 'id' value from the result
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================

-- STEP 2: Update orphaned orders to your account
-- ⚠️ IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID from Step 1

UPDATE public.orders
SET buyer_id = 'YOUR_USER_ID_HERE'  -- ⚠️ REPLACE THIS!
WHERE buyer_id IS NOT NULL
  AND buyer_id != 'YOUR_USER_ID_HERE';  -- ⚠️ REPLACE THIS TOO!

-- =====================================================

-- STEP 3: Verify the update worked
-- All orders should now have your buyer_id
SELECT 
  order_number,
  buyer_id,
  status,
  total_amount,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- ALTERNATIVE: Update only specific orders by order number
-- =====================================================

-- If you only want to update specific orders, use this instead:
/*
UPDATE public.orders
SET buyer_id = 'YOUR_USER_ID_HERE'  -- ⚠️ REPLACE THIS!
WHERE order_number IN (
  'ORD-1762783997785-S4X4K3O7H',
  'ORD-1762783708954-K91ABYQND',
  'ORD-1762781586359-3X6ZE8POZ',
  'ORD-1761508330596-5PCX7415Y'
  -- Add more order numbers if needed
);
*/

-- =====================================================
-- CLEANUP: Delete test/orphaned orders (OPTIONAL)
-- =====================================================
-- ⚠️ WARNING: This permanently deletes orders!
-- Only use this to remove test data you don't need

/*
-- First, find orders to delete
SELECT id, order_number, buyer_id, total_amount, status
FROM public.orders
WHERE status = 'pending'
  AND created_at < NOW() - INTERVAL '7 days';

-- Delete order items first (due to foreign key)
DELETE FROM public.order_items
WHERE order_id IN (
  SELECT id FROM public.orders
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '7 days'
);

-- Then delete the orders
DELETE FROM public.orders
WHERE status = 'pending'
  AND created_at < NOW() - INTERVAL '7 days';
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count orders by buyer_id
SELECT 
  buyer_id,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue
FROM public.orders
GROUP BY buyer_id
ORDER BY order_count DESC;

-- See all orders with buyer details
SELECT 
  o.order_number,
  o.buyer_id,
  u.email as buyer_email,
  o.status,
  o.total_amount,
  o.created_at
FROM public.orders o
LEFT JOIN auth.users u ON o.buyer_id = u.id
ORDER BY o.created_at DESC
LIMIT 20;

-- =====================================================
-- DONE! Refresh your /orders page to see all orders
-- =====================================================
