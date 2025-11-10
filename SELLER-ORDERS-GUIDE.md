# 📦 Seller Order Management Dashboard - User Guide

## 🎯 Overview

The Seller Order Management Dashboard allows artisans to track and manage orders for their products. This includes updating order status, adding tracking information, and viewing order analytics.

---

## 🚀 Features

### 1. **Dashboard Integration**
- New "Manage Orders" card on the main dashboard (`/dashboard`)
- Quick access to order management features
- Visual indicators for pending actions

### 2. **Orders List Page** (`/dashboard/manage-orders`)
**Features:**
- ✅ View all orders for your products
- ✅ Real-time statistics (Total, Pending, Shipped, Delivered, Revenue)
- ✅ Search by order number or tracking number
- ✅ Filter by status (All, Pending, Confirmed, Shipped, Delivered, Cancelled)
- ✅ Color-coded status badges
- ✅ View order items with images
- ✅ Quick access to edit each order

**Statistics Displayed:**
- 📊 Total Orders
- ⏳ Pending Orders
- 🚚 Shipped Orders
- ✅ Delivered Orders
- 💰 Total Revenue

### 3. **Order Edit Page** (`/dashboard/manage-orders/[id]/edit`)
**Update Fields:**
- **Order Status**: Pending → Confirmed → Shipped → Delivered
- **Tracking Number**: Add courier tracking ID
- **Shipping Provider**: Select from popular Indian couriers
  - Blue Dart
  - Delhivery
  - DTDC
  - India Post
  - FedEx
  - Ekart
  - Shadowfax
- **Payment Status**: Pending → Completed → Failed → Refunded

**Additional Features:**
- View order details and shipping address
- See order items and amounts
- Save changes with validation
- Success message confirmation
- Auto-redirect after saving

---

## 📱 How to Use

### **For Sellers (Artisans):**

#### Step 1: Access Your Orders
1. Go to `/dashboard`
2. Click on the **"Manage Orders"** card
3. You'll see all orders containing your products

#### Step 2: View Order Details
- Each order card shows:
  - Order number and date
  - Status badge (color-coded)
  - Items ordered with images
  - Current tracking info
  - Total amount

#### Step 3: Update an Order
1. Click **"✏️ Update Order"** button
2. Update the following:
   - **Status**: Change to reflect current order state
   - **Tracking Number**: Enter the courier tracking ID
   - **Shipping Provider**: Select the courier service
   - **Payment Status**: Update if needed
3. Click **"✅ Save Changes"**
4. You'll see a success message and be redirected

#### Step 4: Search & Filter
- Use the search bar to find specific orders
- Filter by status using the dropdown
- Results update in real-time

---

## 🔧 Technical Details

### **Database Queries**

The system uses a smart query to fetch only relevant orders:

```typescript
// 1. Get seller's products
const { data: userProducts } = await supabase
  .from('products')
  .select('id')
  .eq('artisan_id', user.id)

// 2. Get order items for these products
const { data: orderItems } = await supabase
  .from('order_items')
  .select('*')
  .in('product_id', productIds)

// 3. Get full order details
const { data: ordersData } = await supabase
  .from('orders')
  .select('*')
  .in('id', orderIds)
```

### **Update Query**

```typescript
await supabase
  .from('orders')
  .update({
    status,
    tracking_number,
    ship_provider,
    payment_status,
    updated_at: new Date().toISOString()
  })
  .eq('id', orderId)
```

---

## 🎨 Design Features

### **Color Scheme**
- Primary Brown: `#926829`
- Cream Background: `#faf8f5`
- Light Accent: `#f5efe6`
- Borders: `#e8dfd0`

### **Status Colors**
- ⏳ Pending: `#f59e0b` (Orange)
- ✓ Confirmed: `#3b82f6` (Blue)
- 🚚 Shipped: `#8b5cf6` (Purple)
- ✅ Delivered: `#10b981` (Green)
- ❌ Cancelled: `#ef4444` (Red)

### **Mobile Optimization**
- 44px minimum touch targets
- 48px button heights
- Responsive grid layouts
- Stacked forms on mobile
- Touch-friendly interactions

---

## 📊 Workflow Example

### **Typical Order Flow:**

1. **Customer Places Order**
   - Order created in database
   - Status: `pending`
   - No tracking info

2. **Seller Confirms Order**
   - Go to Manage Orders
   - Click "Update Order"
   - Change status to `confirmed`
   - Save changes

3. **Seller Ships Order**
   - Get tracking number from courier
   - Update order:
     - Status: `shipped`
     - Tracking Number: `TRK123456789`
     - Ship Provider: `Blue Dart`
   - Save changes

4. **Customer Tracks Order**
   - Views order on `/orders/[id]`
   - Sees tracking number
   - Can click "Track Package"

5. **Order Delivered**
   - Seller marks status as `delivered`
   - Customer can see delivery confirmation

---

## 🔐 Security & Permissions

### **Current Implementation:**
- Sellers can only see orders for **their own products**
- Users must be logged in to access dashboard
- Each order is linked to product ownership via `artisan_id`

### **Future Enhancements:**
- Role-based access control (RBAC)
- Order ownership verification
- Activity logging for updates
- Email notifications on status changes

---

## 🚀 Quick Start Guide

### **First Time Setup:**

1. **Create Products First**
   ```
   /dashboard/add-product
   ```
   - You need products before you can have orders

2. **Wait for Orders**
   - Customers browse `/products`
   - Add to cart and checkout
   - Orders appear in your dashboard

3. **Manage Orders**
   ```
   /dashboard/manage-orders
   ```
   - View all incoming orders
   - Update tracking as you ship

### **Daily Workflow:**

**Morning:**
- Check `/dashboard/manage-orders`
- Review pending orders
- Confirm orders you can fulfill

**After Shipping:**
- Update each order with tracking info
- Mark status as "shipped"
- Select courier service

**After Delivery:**
- Mark orders as "delivered"
- Check for new pending orders

---

## 🐛 Troubleshooting

### **No Orders Showing**
**Problem:** Dashboard shows "No orders found"

**Solutions:**
1. Check if you have products listed
2. Verify your products have the correct `artisan_id`
3. Check if any orders exist in the database
4. Look for console errors in browser DevTools

### **Can't Update Order**
**Problem:** Save button doesn't work

**Solutions:**
1. Check internet connection
2. Verify you're logged in
3. Ensure order belongs to your product
4. Check browser console for errors

### **Tracking Not Showing**
**Problem:** Tracking number not visible to customer

**Solutions:**
1. Verify you saved the tracking number
2. Check spelling and format
3. Ensure status is set to "shipped"
4. Refresh the customer's order page

---

## 📞 Support

For technical issues:
1. Check browser console (F12)
2. Verify Supabase connection
3. Check database table structure
4. Review RLS policies

---

## 🎉 Tips for Success

1. **Update Promptly**: Customers love quick tracking updates
2. **Accurate Tracking**: Double-check tracking numbers
3. **Choose Right Courier**: Select the actual courier used
4. **Communicate**: Add notes if needed (future feature)
5. **Monitor Pending**: Check daily for new orders

---

## 🔮 Future Features (Roadmap)

- [ ] Bulk order updates
- [ ] Email notifications to customers
- [ ] Order notes/comments
- [ ] Print shipping labels
- [ ] Export order data (CSV/PDF)
- [ ] Order analytics dashboard
- [ ] Automated status updates from courier APIs
- [ ] Customer messaging system
- [ ] Return/refund management
- [ ] Multi-language support

---

## ✅ Completed Features

- [x] Seller orders list page
- [x] Order statistics dashboard
- [x] Search and filter orders
- [x] Update order status
- [x] Add tracking information
- [x] Select shipping provider
- [x] Update payment status
- [x] View order details
- [x] Mobile-responsive design
- [x] Real-time data from Supabase
- [x] Color-coded status badges
- [x] Dashboard integration

---

**Built with ❤️ for Indian Artisans**

*Preserving traditional crafts through modern technology*
