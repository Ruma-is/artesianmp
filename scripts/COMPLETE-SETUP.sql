-- =====================================================
-- COMPLETE DATABASE SETUP - Run All Steps
-- =====================================================
-- This script sets up payment tracking and fixes orphaned orders
-- Copy and paste each section into Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PART 1: ADD PAYMENT TRACKING COLUMNS
-- =====================================================

-- Add payment tracking columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS transaction_id TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_gateway TEXT DEFAULT 'upi',
ADD COLUMN IF NOT EXISTS payment_details JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON public.orders(transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- Verify payment columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'orders'
  AND column_name IN ('transaction_id', 'paid_at', 'payment_gateway', 'payment_details')
ORDER BY ordinal_position;

-- =====================================================
-- PART 2: CHECK YOUR USER ID
-- =====================================================

-- Find your current user ID - COPY the 'id' value from results
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- PART 3: VIEW ALL ORDERS (BEFORE FIX)
-- =====================================================

-- See all orders with their buyer_id
SELECT 
  order_number,
  buyer_id,
  status,
  payment_status,
  total_amount,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- PART 4: FIX ORPHANED ORDERS
-- =====================================================
-- ⚠️ INSTRUCTIONS:
-- 1. Copy your user ID from PART 2 above
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual user ID
-- 3. Run the UPDATE query
-- =====================================================

-- UPDATE ALL ORDERS TO YOUR ACCOUNT
UPDATE public.orders
SET buyer_id = 'YOUR_USER_ID_HERE'  -- ⚠️ PASTE YOUR USER ID HERE!
WHERE buyer_id IS NOT NULL;

-- =====================================================
-- PART 5: VERIFY THE FIX
-- =====================================================

-- Check that all orders now have your buyer_id
SELECT 
  order_number,
  buyer_id,
  status,
  payment_status,
  total_amount,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 20;

-- Count orders by buyer_id (should show only your ID now)
SELECT 
  buyer_id,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue
FROM public.orders
GROUP BY buyer_id
ORDER BY order_count DESC;

-- =====================================================
-- PART 6: VIEW ORDERS WITH USER EMAIL
-- =====================================================

-- See all orders with buyer email
SELECT 
  o.order_number,
  o.buyer_id,
  u.email as buyer_email,
  o.status,
  o.payment_status,
  o.total_amount,
  o.created_at
FROM public.orders o
LEFT JOIN auth.users u ON o.buyer_id = u.id
ORDER BY o.created_at DESC
LIMIT 20;

-- =====================================================
-- DONE! Now refresh your /orders page to see all orders
-- =====================================================
