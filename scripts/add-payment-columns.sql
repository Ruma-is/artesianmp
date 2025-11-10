-- =====================================================
-- ADD PAYMENT TRACKING COLUMNS TO ORDERS TABLE
-- =====================================================
-- This script adds columns to track payment information
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Add transaction_id column to store payment gateway transaction ID
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS transaction_id TEXT;

-- Add paid_at column to track when payment was completed
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Add payment_gateway column to track which gateway was used
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_gateway TEXT DEFAULT 'upi';

-- Add payment_details column to store additional payment info (JSON)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_details JSONB;

-- Create index on transaction_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id 
ON public.orders(transaction_id);

-- Create index on payment_status for faster filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON public.orders(payment_status);

-- =====================================================
-- Verify the changes
-- =====================================================

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
-- DONE! Your orders table now supports payment tracking
-- =====================================================
