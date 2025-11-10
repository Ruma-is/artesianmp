# 📦 Order Tracking Guide

## How to Add Tracking Information to Orders

### Option 1: Through Supabase Dashboard (Quick & Easy)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Click "Table Editor" in the sidebar

2. **Navigate to Orders Table**
   - Click on the `orders` table
   - Find the order you want to update

3. **Add Tracking Info**
   - Click on the row you want to edit
   - Update these fields:
     - `tracking_number`: Enter the tracking ID (e.g., "TRK123456789")
     - `ship_provider`: Enter the courier name (e.g., "Blue Dart", "Delhivery", "India Post")
     - `status`: Update to "shipped" or "delivered"
   - Click "Save"

4. **Refresh Orders Page**
   - The buyer will now see the tracking information
   - They can click "Track Package" to search for the tracking number

---

## Option 2: Create an Artisan Dashboard (Future Enhancement)

Would you like me to create an artisan/seller dashboard where you can:
- View all orders placed for your products
- Update order status (pending → shipped → delivered)
- Add tracking numbers
- Manage inventory
- View analytics

This would require creating:
- `/dashboard/orders` - View all orders for your products
- `/dashboard/orders/[id]/edit` - Update tracking info
- Backend logic to check if user is the product owner

---

## Quick SQL to Update an Order

If you want to update via SQL:

```sql
-- Update tracking info for a specific order
UPDATE orders 
SET 
  tracking_number = 'TRK123456789',
  ship_provider = 'Blue Dart',
  status = 'shipped'
WHERE order_number = 'ORD-1761508129597-HDC0NEG13';
```

---

## Testing Tracking Display

To test the tracking feature, update one of your existing orders:

```sql
-- Add tracking to your existing order
UPDATE orders 
SET 
  tracking_number = 'TEST123456789',
  ship_provider = 'Blue Dart',
  status = 'shipped'
WHERE id = (SELECT id FROM orders LIMIT 1);
```

Then refresh your orders page and click "View Details" to see the tracking section!

---

## Would You Like Me To Create?

1. **Simple Admin Panel** - Basic page to update tracking for your orders
2. **Full Artisan Dashboard** - Complete seller interface with order management
3. **API Endpoint** - Backend API to update orders programmatically

Let me know which approach you prefer! 🚀
