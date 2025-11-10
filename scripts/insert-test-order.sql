-- =====================================================
-- INSERT TEST ORDER FOR TESTING
-- =====================================================

-- Step 1: Get your user ID
SELECT 
  id as user_id, 
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Copy your user_id from above, then run this:
-- (Replace 'YOUR_USER_ID_HERE' with actual UUID)

DO $$
DECLARE
  v_order_id UUID;
  v_buyer_id UUID := 'YOUR_USER_ID_HERE'; -- ⚠️ REPLACE THIS!
BEGIN
  -- Insert order
  INSERT INTO public.orders (
    order_number,
    buyer_id,
    total_amount,
    shipping_fee,
    tax_amount,
    status,
    payment_status,
    payment_method,
    shipping_address,
    notes
  ) VALUES (
    'ORD-TEST-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_buyer_id,
    2550.00,
    50.00,
    0,
    'pending',
    'completed',
    'upi',
    '{"full_name": "Test User", "address": "123 Main Street, Apartment 4B, Mumbai, Maharashtra", "pincode": "400001"}'::jsonb,
    'This is a test order for development'
  )
  RETURNING id INTO v_order_id;

  -- Insert order items
  INSERT INTO public.order_items (
    order_id,
    product_name,
    product_description,
    quantity,
    unit_price,
    total_price
  ) VALUES 
    (
      v_order_id,
      'Handcrafted Wooden Lamp',
      'Beautiful handmade wooden lamp with intricate carvings',
      2,
      1225.00,
      2450.00
    ),
    (
      v_order_id,
      'Ceramic Coaster Set',
      'Set of 4 handpainted ceramic coasters',
      1,
      100.00,
      100.00
    );

  RAISE NOTICE 'Test order created with ID: %', v_order_id;
END $$;

-- Step 3: Verify the order was created
SELECT 
  o.order_number,
  o.total_amount,
  o.status,
  o.created_at,
  COUNT(oi.id) as item_count
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.id
WHERE o.buyer_id = 'YOUR_USER_ID_HERE' -- ⚠️ REPLACE THIS!
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 5;

-- Step 4: View order items
SELECT 
  o.order_number,
  oi.product_name,
  oi.quantity,
  oi.unit_price,
  oi.total_price
FROM public.orders o
JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.buyer_id = 'YOUR_USER_ID_HERE' -- ⚠️ REPLACE THIS!
ORDER BY o.created_at DESC;

-- =====================================================
-- CLEANUP (if you want to delete test orders)
-- =====================================================

-- Delete all test orders
-- DELETE FROM public.orders WHERE order_number LIKE 'ORD-TEST-%';
