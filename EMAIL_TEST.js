// 🧪 Email Service Diagnostic Test
// Copy this to browser console to test EmailJS connection

import { sendBookingEmail } from './src/lib/emailService';

async function testEmailService() {
  console.log('🧪 Testing EmailJS Email Service...\n');

  const testPayload = {
    customerName: 'Test Customer',
    customerEmail: 'karthi2006.web@gmail.com', // 👈 CHANGE THIS TO YOUR EMAIL
    customerPhone: '9698678450',
    eventDate: '20 April 2026',
    hallDuration: '4 Hours',
    hallStartTime: '10:00 AM',
    hallEndTime: '2:00 PM',
    selections: '• Hall Booking\n• Photography Package',
    subtotal: '₹25,000',
    discount: '₹2,500',
    total: '₹22,500',
    advanceAmount: '₹2,250',
    transactionId: 'TEST_TXN_12345'
  };

  console.log('📧 Sending test email with payload:');
  console.log(testPayload);
  console.log('\n⏳ Waiting for response...\n');

  try {
    const result = await sendBookingEmail(testPayload);
    
    if (result) {
      console.log('✅ EMAIL SENT SUCCESSFULLY!');
      console.log('📬 Check your email inbox in a few seconds');
    } else {
      console.error('❌ Email sending failed');
      console.error('Check EmailJS credentials in emailService.ts');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testEmailService();
