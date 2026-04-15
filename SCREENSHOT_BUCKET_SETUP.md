# Payment Screenshot Bucket Setup Guide

## Issue
The screenshot link is not being shared in WhatsApp messages because the Supabase storage bucket is not properly configured.

## Solution Steps

### 1. Create the Payment Screenshots Bucket in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **partfnocmqpukobukhra**
3. Navigate to **Storage** in the left sidebar
4. Click **Create a new bucket**
5. Fill in the details:
   - **Name**: `payment-screenshots`
   - **Public bucket**: ✅ **ENABLE THIS** (must be checked for public URLs)
6. Click **Create bucket**

### 2. Set Bucket Policies (RLS)

1. Go to **Storage** → **payment-screenshots** bucket
2. Click **Policies** tab
3. Click **New Policy** and select **authenticated users can upload**
4. This will allow authenticated uploads

### 3. Verify Configuration

After creating the bucket:
- ✅ Bucket name: `payment-screenshots`
- ✅ Public access: ENABLED
- ✅ Path: `bookings/` (automatically created on first upload)

### 4. Test Upload

1. Open the booking form
2. Upload a payment screenshot
3. Check browser console (F12) for upload logs
4. You should see: `✅ Public URL generated: https://...`

## What Will Happen

Once configured:
1. ✅ Screenshot uploads to: `https://{project-id}.supabase.co/storage/v1/object/public/payment-screenshots/bookings/{filename}`
2. ✅ Link automatically added to WhatsApp message
3. ✅ Owner receives clickable image link
4. ✅ Screenshot opens directly in WhatsApp

## Error Messages Help

- **"Bucket does not exist"** → Create bucket following Step 1
- **"404 not found"** → Bucket is private, enable public access
- **"Upload failed"** → Check RLS policies in Step 2
- **"Could not generate public URL"** → Verify bucket is public

## Environment Variables Needed

Already configured in `.env`:
```
VITE_SUPABASE_URL=https://partfnocmqpukobukhra.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

If missing, add to `.env.local`
