# Quick Start: Email + WhatsApp Booking System

## 🚀 Installation (5 Minutes)

### Step 1: Install Package
```bash
npm install @emailjs/browser
```

### Step 2: Set Up EmailJS
1. Go to https://www.emailjs.com/
2. Sign up (free account)
3. Create a **Service** (connect your Gmail or Outlook)
4. Create an **Email Template** (use the one from `EMAILJS_SETUP.md`)
5. Copy your credentials:
   - Service ID: `service_xxxxx`
   - Template ID: `template_xxxxx`
   - Public Key: (from Account → API Keys)

### Step 3: Add Credentials
Update `src/lib/emailService.ts` line 3-5:
```typescript
const SERVICE_ID = 'service_a1b2c3d4e5f6g7h8';      // Paste here
const TEMPLATE_ID = 'template_x9y8z7w6v5u4t3s2';   // Paste here
const PUBLIC_KEY = 'Y1a2b3c4d5e6f7g8h9i0';         // Paste here
```

### Step 4: Test
```bash
npm run dev
```

Go to booking form → Fill all fields (Email is now required!) → Submit

**Expected Results:**
- ✅ Booking email arrives in inbox
- ✅ WhatsApp opens in new tab
- ✅ Toast notification shows success

---

## 📋 What You Get

### Email Features
- Professional HTML template
- Customer info
- Event details
- All selected services
- Price breakdown
- Payment info
- Links to contact

### Button Behavior
```
Before Click:        "Submit & Send to WhatsApp & Email"
During:              "Sending..." (disabled, spinner)
After Email:         Toast: "✅ Booking confirmation sent to email!"
What Happens:        WhatsApp opens automatically
```

### Form Changes
- Email field is now **required** (marked with *)
- Validation checks email before submission
- Clear error messages shown to user

---

## 📝 Files Changed

### New Files Created
1. `src/lib/emailService.ts` - Email sending service
2. `EMAILJS_SETUP.md` - Detailed setup guide
3. `EMAIL_WHATSAPP_IMPLEMENTATION.md` - Implementation details

### Modified Files
1. `src/components/BookingWizard.tsx`
   - Added email import
   - Added sending state
   - Updated handleSubmit()
   - Updated button UI
   - Made email required

---

## 🧪 Testing Scenarios

### Scenario 1: Happy Path
```
1. Fill form with valid data ✓
2. Click submit
3. See "Sending..." spinner
4. Receive confirmation email ✓
5. WhatsApp opens ✓
6. Form resets ✓
Result: SUCCESS ✅
```

### Scenario 2: Email Service Down
```
1. Fill form with valid data ✓
2. Click submit
3. See warning: "Email sending failed..."
4. WhatsApp still opens ✓
5. User can still contact via message
Result: GRACEFUL FALLBACK ✅
```

### Scenario 3: Missing Email
```
1. Fill form WITHOUT email
2. Click submit
3. Error: "Email is required..." ✓
4. Form doesn't submit
Result: VALIDATION WORKS ✅
```

---

## 🔍 Verification Checklist

After installation, verify:

- [ ] `npm install` completed without errors
- [ ] Credentials added to `emailService.ts`
- [ ] Email field shows required asterisk (*)
- [ ] Submit button says "...Send to WhatsApp & Email"
- [ ] Test form submission received email
- [ ] WhatsApp link opens after email
- [ ] Toast notifications appear
- [ ] Email has correct formatting
- [ ] All booking details in email
- [ ] Price summary shows correctly

---

## 💡 Tips & Tricks

### Want to customize email template?
Edit your template in EmailJS dashboard:
https://dashboard.emailjs.com/templates

### Test email without WhatsApp?
Change `WHATSAPP_LINK` in `BookingWizard.tsx` to enable console logging

### Debug email sending?
Check browser console (F12):
```javascript
// You'll see:
"Email sent successfully: {response details}"
// Or
"Failed to send email: {error details}"
```

### Rate limiting?
EmailJS free plan: **200 emails/month**
Plan - 1000/month: https://www.emailjs.com/pricing/

---

## ⚠️ Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| "Cannot find module '@emailjs/browser'" | Run `npm install @emailjs/browser` |
| Email not sending | Check Service ID & Template ID in emailService.ts |
| WhatsApp not opening | Clear cache, check phone number format |
| Button stays "Sending..." | Check console for errors, refresh page |
| Email template looks broken | Update HTML template in EmailJS dashboard |

---

## 📞 Support

For issues:
1. Check browser Developer Tools (F12) → Console
2. Check EmailJS Dashboard → Error Logs
3. Verify all credentials in `emailService.ts`
4. See `EMAILJS_SETUP.md` for detailed troubleshooting

---

## 🎉 Features Implemented

✅ **Dual Communication Channel**
- Email: Professional, formatted, documented
- WhatsApp: Instant, personal, direct

✅ **Zero Backend Required**
- Uses EmailJS (no server needed)
- Secure public key approach
- CORS-enabled out of box

✅ **Production Ready**
- Error handling
- Loading states
- User feedback (toasts)
- Form validation

✅ **Professional Design**
- Beautiful email template
- Responsive layout
- Clear typography
- Brand colors

---

## 🚀 Next Steps

1. Install EmailJS package
2. Set up account & credentials
3. Add credentials to code
4. Test with real submission
5. Deploy to production
6. Monitor email delivery

**Estimated time: 10-15 minutes**

Need help? Check `EMAILJS_SETUP.md` for detailed instructions!
