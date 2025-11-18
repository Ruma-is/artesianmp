-- =====================================================
-- FIX ORDER_ITEMS ARTISAN_ID
-- =====================================================
-- This script updates all order_items to have the correct artisan_id
-- from their associated products
-- Run this in Supabase SQL Editor
-- =====================================================

-- Update order_items.artisan_id from products table
UPDATE public.order_items oi
SET artisan_id = p.artisan_id
FROM public.products p
WHERE oi.product_id = p.id
  AND oi.artisan_id IS NULL;

-- Verify the update
SELECT 
  COUNT(*) as total_items,
  COUNT(artisan_id) as items_with_artisan,
  COUNT(*) - COUNT(artisan_id) as items_without_artisan
FROM public.order_items;

-- Show sample of updated items
SELECT 
  oi.id,
  oi.order_id,
  oi.product_id,
  oi.artisan_id,
  p.title as product_name,
  p.artisan_id as product_artisan_id
FROM public.order_items oi
LEFT JOIN public.products p ON oi.product_id = p.id
LIMIT 10;
