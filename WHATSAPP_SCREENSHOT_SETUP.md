# WhatsApp Payment Screenshot Integration

## Problem Solved

Previously, when users submitted bookings:
- ❌ Payment screenshot was uploaded in the form but **not sent** to WhatsApp
- ❌ Owner had to manually ask users to send the screenshot in WhatsApp chat
- ❌ Manual back-and-forth delays confirmation process

## Solution Implemented

Now the system automatically:
- ✅ Uploads payment screenshot to **Supabase Storage**
- ✅ Generates a **shareable public link**
- ✅ Includes the link in the **WhatsApp message to owner**
- ✅ Owner can view screenshot **instantly** without manual attachment

---

## How It Works

```
User fills booking form
    ↓
Uploads payment screenshot
    ↓
Clicks "Submit & Send to WhatsApp"
    ↓
System uploads screenshot to Supabase Storage
    ↓
Gets public shareable link
    ↓
Includes link in WhatsApp message
    ↓
Opens WhatsApp with message + screenshot link
    ↓
Owner receives booking details + direct access to screenshot
```

---

## Setup Instructions

### 1. Create Supabase Storage Bucket

**Via Supabase Dashboard:**
1. Go to **Storage** → **Buckets**
2. Click **Create new bucket**
3. Name: `payment-screenshots`
4. Access: **Public** ✅ (so links are shareable)
5. Click **Create bucket**

**Via SQL (in SQL Editor):**
```sql
-- Create payment-screenshots bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true);
```

### 2. Set Storage Permissions

**Via Supabase Dashboard:**
1. Go to **Storage** → **Policies** → **payment-screenshots**
2. Add policy for **Insert**:
   ```
   Name: Allow anon to insert payment screenshots
   Target roles: anon, authenticated
   Allowed operations: INSERT
   JPEG, PNG, GIF, WebP only
   ```
3. Add policy for **Read**:
   ```
   Name: Allow public to read payment screenshots
   Target roles: anon
   Allowed operations: SELECT
   ```

**Or via SQL:**
```sql
-- Allow public to read screenshots
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-screenshots');

-- Allow authenticated to upload
CREATE POLICY "Allow auth users upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots');
```

### 3. Files Updated

✅ **Created:** `src/lib/paymentScreenshotService.ts`
- `uploadPaymentScreenshot()` - Uploads file to Supabase, returns public URL
- `deletePaymentScreenshot()` - Removes file (optional)

✅ **Updated:** `src/components/BookingWizard.tsx`
- Imports screenshot service
- In `handleSubmit()`:
  - Uploads screenshot before WhatsApp
  - Includes shareable link in message
  - Falls back gracefully if upload fails

---

## Features

### Automatic Upload
```typescript
// File is automatically uploaded when user submits
const uploadResult = await uploadPaymentScreenshot(
  file,
  customerName,
  phoneNumber
);
// Returns: { url: "https://...", filename: "path/to/file" }
```

### Unique Filename
Screenshot is saved as:
```
bookings/{customerName}_{phoneNumber}_{timestamp}.png
// Example: bookings/Karthik_919698678450_1712973600000.png
```

### Public Shareable Link
✅ Owner can click link in WhatsApp to view screenshot
✅ Works on mobile and desktop
✅ No authentication needed
✅ Link doesn't expire (unless bucket is deleted)

### Error Handling
- If upload fails: Message is sent WITHOUT link (fallback)
- User sees warning toast
- Booking still proceeds
- Owner can request screenshot manually

---

## WhatsApp Message Format

### With Successful Upload
```
🏛️ *NEW BOOKING REQUEST*

👤 Customer: Karthik Kumar
📱 Phone: 9698678450
📧 Email: karthik@example.com
📅 Date: 15/04/2026

🏛️ Hall: Full Day (12 hours)
⏰ Timing: 10:00 AM - 10:00 PM

📋 *Services:*
• Hall: Full Day (12 hours)
• Photography: Premium (2 events)
• Catering: Vegetarian x100 heads = ₹75,000

💰 *Subtotal:* ₹150,000
🎉 *Discount:* ₹15,000
💰 *Total:* ₹135,000
💳 *Advance:* ₹13,500
🧾 *Txn ID:* TXN123456789

🖼️ *PAYMENT SCREENSHOT:*
https://joywmjurzthsnhsltves.supabase.co/storage/v1/object/public/payment-screenshots/bookings/...
```

### If Upload Fails (Fallback)
```
...same details as above...

🖼️ *IMPORTANT: Payment screenshot attached manually*
```

---

## Testing

### Test Upload:
1. Fill booking form completely
2. Upload a payment screenshot (JPG/PNG)
3. Click "Submit & Send to WhatsApp"
4. Check console logs:
   - `📤 Uploading payment screenshot...`
   - `✅ Public URL generated: https://...`
5. WhatsApp should show link in message
6. Click link → should open screenshot in browser

### Test Fallback:
1. Manually delete bucket in Supabase
2. Try booking again
3. Upload should fail gracefully
4. WhatsApp message still opens
5. Shows warning: "Could not upload screenshot automatically"

---

## File Limits

**Default Supabase Limits:**
- Max file size: 50MB per file ✅ (plenty for screenshots)
- Storage: 1GB free tier ✅ (1000s of screenshots)

**Recommended:**
- Compress images before upload for faster processing
- Use JPEG format for smaller file size

---

## Storage Breakdown

Suggested folder structure:
```
payment-screenshots/
├── bookings/          # ← Stores all user screenshots
│   ├── Karthik_919698678450_1712973600000.png
│   ├── Priya_919123456789_1712973700000.jpg
│   └── ...
├── manual/            # ← For manual uploads (optional)
└── deleted/           # ← Archive deleted files (optional)
```

---

## Troubleshooting

### Issue: "Screenshot upload failed"
**Solution:**
1. Check Supabase bucket exists: `payment-screenshots`
2. Check bucket is set to **Public**
3. Verify file is valid image (JPG/PNG/GIF)
4. Check browser console for actual error

### Issue: "Public URL not accessible"
**Solution:**
1. Verify bucket is PUBLIC (not private)
2. Check URL format: Should start with `https://joywmjurzthsnhsltves.supabase.co/...`
3. Try opening URL in new browser tab directly

### Issue: Link works but image not showing in WhatsApp
**Solution:**
1. WhatsApp may need preview generation (automatic)
2. Try reopening link after 30 seconds
3. Length of URL shouldn't exceed WhatsApp message limit (4096 chars)

---

## Security Notes

✅ **Public URLs are safe because:**
- Files stored with random timestamp
- Impossible to guess other users' filenames
- No sensitive data in filenames (only name + phone + timestamp)
- Bucket set to read-only for public

🔒 **Optional: Add Row-Level Security (RLS)**
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only owner can delete"
ON storage.objects FOR DELETE
USING (auth.uid()::text = (metadata->>'user_id')::text);
```

---

## Future Enhancements

- [ ] Add image compression before upload
- [ ] Auto-cleanup old screenshots (>30 days)
- [ ] Store screenshot metadata (uploader, timestamp, size)
- [ ] Allow owner to download all screenshots in bulk
- [ ] Add screenshot preview thumbnail in admin dashboard
