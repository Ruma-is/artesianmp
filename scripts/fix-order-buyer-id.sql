-- =====================================================
-- UPDATE ORDERS TO MATCH CURRENT USER
-- =====================================================

-- Step 1: Find your current user ID
SELECT 
  id as user_id, 
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Copy your user_id from above, then run this to see current orders:
-- (Replace 'YOUR_USER_ID' with your actual user ID)

SELECT 
  id,
  order_number,
  buyer_id,
  total_amount,
  status,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 10;

-- Step 3: Update ALL orders to use your user ID
-- ⚠️ IMPORTANT: Replace 'YOUR_NEW_USER_ID' with your actual user ID from Step 1

UPDATE public.orders
SET buyer_id = 'YOUR_NEW_USER_ID'  -- ⚠️ REPLACE THIS!
WHERE buyer_id IS NOT NULL;

-- Step 4: Verify the update worked
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
-- DONE! Now refresh your orders page
-- =====================================================
