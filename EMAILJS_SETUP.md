# EmailJS Setup Guide for Sikara Mahal Booking System

## Step-by-Step Setup

### 1. Create EmailJS Account
- Go to https://www.emailjs.com/
- Sign up for free account
- Confirm your email

### 2. Add Email Service
1. Go to **Email Services** in the dashboard
2. Click **Add Service**
3. Select your email provider:
   - Gmail (recommended)
   - Outlook
   - Custom (SMTP)
4. Connect your email account

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Set Template Name: `booking_confirmation`
4. Use this template content:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
      .section { margin: 20px 0; }
      .label { font-weight: bold; color: #333; }
      .value { color: #666; margin-left: 10px; }
      .price-section { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
      .total { font-size: 20px; font-weight: bold; color: #667eea; }
      .advance { color: #e74c3c; font-weight: bold; }
      .selections { background: #f0f0f0; padding: 10px; border-radius: 5px; }
      .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🏛️ Sikara Mahal Booking Confirmation</h1>
      </div>

      <div class="section">
        <h2>Booking Details</h2>
        <p><span class="label">Name:</span> {{customer_name}}</p>
        <p><span class="label">Email:</span> {{to_email}}</p>
        <p><span class="label">Phone:</span> {{customer_phone}}</p>
        <p><span class="label">Event Date:</span> {{event_date}}</p>
      </div>

      <div class="section">
        <h2>Hall Booking</h2>
        <p><span class="label">Duration:</span> {{hall_duration}}</p>
        <p><span class="label">Timing:</span> {{hall_timing}}</p>
      </div>

      <div class="section">
        <h2>Selected Services</h2>
        <div class="selections">
          {{selections}}
        </div>
      </div>

      <div class="price-section">
        <h2>Price Summary</h2>
        <p><span class="label">Subtotal:</span> {{subtotal}}</p>
        <p><span class="label">Discount (10%):</span> {{discount}}</p>
        <p class="total">Total Amount: {{total_amount}}</p>
        <p class="advance">Advance Payment (10%): {{advance_amount}}</p>
        <p><span class="label">Transaction ID:</span> {{transaction_id}}</p>
      </div>

      <div class="section">
        <h3>Next Steps:</h3>
        <ol>
          <li>We will confirm your booking within 24 hours</li>
          <li>You will receive a confirmation message on WhatsApp</li>
          <li>For any queries, contact us on +91 96986 78450</li>
        </ol>
      </div>

      <div class="footer">
        <p>Thank you for choosing Sikara Mahal A/C Wedding Hall!</p>
        <p>Email: sikaratechnology@gmail.com | Phone: +91 96986 78450</p>
      </div>
    </div>
  </body>
</html>
```

### 4. Get Your Credentials

In the template editor, you'll see:
- **Service ID**: `service_xxxxx`
- **Template ID**: `template_xxxxx`
- **Public Key**: Copy from Account Settings → API Keys

### 5. Update emailService.ts

Replace the placeholders in `src/lib/emailService.ts`:

```typescript
const SERVICE_ID = 'service_YOUR_SERVICE_ID'; // Example: service_a1b2c3d4e5f6g7h8
const TEMPLATE_ID = 'template_YOUR_TEMPLATE_ID'; // Example: template_x9y8z7w6v5u4t3s2
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Example: Y1a2b3c4d5e6f7g8h9i0
```

### 6. Test the Connection

```bash
npm run dev
```

Try submitting a booking form and check:
- ✅ Email arrives in inbox
- ✅ WhatsApp link opens
- ✅ Toast notifications appear

## Features Implemented

✅ **Dual Channel Delivery:**
- Email sent to customer with confirmation
- WhatsApp link opens automatically

✅ **Beautiful Email Template:**
- Professional HTML design
- All booking details included
- Price summary with advance payment

✅ **Error Handling:**
- Graceful fallback if email fails
- Still opens WhatsApp
- Toast notifications for user feedback

✅ **Security:**
- Public key only (no server needed)
- EmailJS handles authentication
- CORS-enabled

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check service/template IDs, verify email service is connected |
| WhatsApp not opening | Clear browser cache, try WhatsApp Web link |
| Button not responding | Check browser console for errors, verify all fields filled |
| Rate limit on emails | EmailJS free plan: 200/month. Upgrade if needed |

## Security Note

Your Public Key is safe to expose in client-side code. It only allows sending via your authorized template. Sensitive operations use the API Key which should stay on backend.
