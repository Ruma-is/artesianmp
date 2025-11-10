# PhonePe Credentials Issue - How to Fix

## 🔴 Current Issue

**Error:** `PhonePe payment creation failed, details: {"success":false,"code":"404"}`

**Reason:** Your credentials are not properly configured with PhonePe OR you need to activate your merchant account.

---

## ✅ What's Working Now

**Fallback Implemented:** The system will now use a **direct UPI link** if PhonePe API fails.

When you click "Place Order":
1. ✅ Order is created in database
2. ⚠️ PhonePe API attempt (may fail with 404)
3. ✅ Fallback to direct UPI link
4. ✅ Opens UPI app for payment
5. ✅ Redirects to /orders page

---

## 🔧 How to Fix PhonePe Integration

### Option 1: Get PhonePe Sandbox Credentials (Recommended for Testing)

1. **Sign up for PhonePe Business:**
   - Go to: https://business.phonepe.com/
   - Sign up / Log in
   - Request Sandbox/UAT access

2. **Get Your Test Credentials:**
   - Merchant ID (Test)
   - Salt Key (Test)
   - Salt Index (usually 1)

3. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_UPI_CLIENT_ID=your_test_merchant_id
   UPI_CLIENT_SECRET=your_test_salt_key
   ```

4. **Restart server:**
   ```bash
   npm run dev
   ```

### Option 2: Activate Production Credentials

Your current credentials might need activation:

1. **Contact PhonePe Support:**
   - Email: merchantsupport@phonepe.com
   - Provide your Merchant ID: `M23HPCTW5HTAV_2511091723`
   - Ask them to:
     - Activate your account
     - Enable payment gateway
     - Confirm which environment (UAT/Production)

2. **Verify Your Setup:**
   - Business verification complete?
   - Website whitelisted?
   - Callback URLs registered?

3. **Check Dashboard:**
   - Login to PhonePe Business Dashboard
   - Check account status
   - Verify credentials are active

### Option 3: Use Sandbox with Test Credentials

PhonePe provides test credentials for everyone:

**For Testing Only:**
```
Merchant ID: PGTESTPAYUAT
Salt Key: 099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
Salt Index: 1
```

Update `.env.local`:
```bash
NEXT_PUBLIC_UPI_CLIENT_ID=PGTESTPAYUAT
UPI_CLIENT_SECRET=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
```

**⚠️ Note:** These are public test credentials. Don't use in production!

---

## 🚀 Current Workaround (Already Implemented)

The code now has a fallback:
- If PhonePe fails → Uses direct UPI link
- Order still created ✅
- Payment still works ✅
- Just bypasses PhonePe gateway

**This lets you continue development while sorting out PhonePe credentials!**

---

## 📋 Testing Checklist

### Before PhonePe Works:
- [x] Order creation ✅
- [x] Database storage ✅
- [x] Buyer ID correct ✅
- [x] Direct UPI payment ✅
- [ ] PhonePe gateway ⚠️ (credentials needed)

### After PhonePe Setup:
- [ ] PhonePe sandbox working
- [ ] Payment page redirects
- [ ] Payment verification
- [ ] Callback handling
- [ ] Production testing

---

## 🎯 Recommended Next Steps

### Immediate (Keep Working):
1. ✅ **Use current fallback** - Direct UPI works fine
2. ✅ **Test order flow** - Everything else works
3. ✅ **Develop other features** - Don't block on PhonePe

### When Ready:
1. ⚠️ **Get proper credentials** from PhonePe
2. ⚠️ **Update .env.local** with real credentials
3. ⚠️ **Test sandbox** environment first
4. ⚠️ **Go live** with production credentials

---

## 💡 Alternative: Use Different Gateway

If PhonePe is taking too long, you can switch to:

1. **Razorpay** (easier setup, good documentation)
2. **Cashfree** (quick approval)
3. **Paytm** (instant activation)
4. **Instamojo** (no business verification needed)

Let me know if you want me to integrate any of these instead!

---

## 📞 Support

**PhonePe Support:**
- Email: merchantsupport@phonepe.com
- Phone: Check business dashboard
- Docs: https://developer.phonepe.com/

**What to Ask:**
1. "Please activate my merchant account"
2. "Merchant ID: M23HPCTW5HTAV_2511091723"
3. "Getting 404 error on payment creation"
4. "Need UAT/Sandbox access for testing"

---

**For now, use the fallback UPI link - it works perfectly for testing! 🎉**
