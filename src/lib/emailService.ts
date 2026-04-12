import emailjs from '@emailjs/browser';

// ✅ Your real credentials
const SERVICE_ID = 'service_rqtqbjr';
const TEMPLATE_ID = 'template_mprsf89';
const PUBLIC_KEY = '5O0l6CWJU-uYv3w1c';

// Initialize on first use
let initialized = false;

export const initEmailJS = () => {
  if (!initialized) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
};

interface EmailPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  hallDuration: string;
  hallStartTime?: string;
  hallEndTime?: string;
  selections: string;
  subtotal: string;
  discount: string;
  total: string;
  advanceAmount: string;
  transactionId: string;
}

export const sendBookingEmail = async (payload: EmailPayload): Promise<boolean> => {
  try {
    console.log('📧 Starting email send process...');
    initEmailJS();

    const templateParams = {
      to_email: payload.customerEmail,
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      event_date: payload.eventDate,
      hall_duration: payload.hallDuration,
      hall_timing: payload.hallStartTime && payload.hallEndTime 
        ? `${payload.hallStartTime} - ${payload.hallEndTime}`
        : 'Not Selected',
      selections: payload.selections,
      subtotal: payload.subtotal,
      discount: payload.discount,
      total_amount: payload.total,
      advance_amount: payload.advanceAmount,
      transaction_id: payload.transactionId,
    };

    console.log('📤 Sending email with params:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      text: error.text,
    });
    return false;
  }
};
