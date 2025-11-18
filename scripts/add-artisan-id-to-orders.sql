-- =====================================================
-- ADD ARTISAN_ID COLUMN TO ORDERS TABLE
-- =====================================================
-- This script adds artisan_id column to orders table
-- to track which artisan/seller the order belongs to
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Add artisan_id column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS artisan_id UUID;

-- Add foreign key constraint to artisan_profiles
ALTER TABLE public.orders
ADD CONSTRAINT fk_orders_artisan
FOREIGN KEY (artisan_id) 
REFERENCES public.artisan_profiles(id)
ON DELETE SET NULL;

-- Create index on artisan_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_artisan_id 
ON public.orders(artisan_id);

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND column_name = 'artisan_id';
