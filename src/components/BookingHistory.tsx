import { motion } from 'framer-motion';
import { useBookingStore, BookingRecord } from '@/lib/bookingStore';
import { hallDurations, formatPrice, formatPriceForPdf, formatTimeToAmPm } from '@/lib/bookingData';
import { Download, CheckCircle2, ClipboardList, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

const WHATSAPP_NUMBER = '919698678450';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const generateBookingPDF = (b: BookingRecord) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(139, 69, 19);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SIKARA MAHAL', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('A/C Luxury Wedding Hall - Booking Receipt', pageWidth / 2, 28, { align: 'center' });

  y = 50;
  doc.setTextColor(0, 0, 0);

  // Booking Info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Details', 15, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Booking ID: ${b.id}`, 15, y); y += 6;
  doc.text(`Status: Pending`, 15, y); y += 10;

  // Event Date - Highlighted Box
  doc.setFillColor(220, 237, 200);
  doc.rect(15, y - 2, pageWidth - 30, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 102, 0);
  doc.setFontSize(11);
  doc.text(`EVENT DATE: ${b.date}`, pageWidth / 2, y + 7, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 18;

  const hallLabel = b.hallDuration ? hallDurations.find(d => d.id === b.hallDuration)?.label ?? b.hallDuration : 'Not Selected';
  const hallStart = b.hallStartTime ? formatTimeToAmPm(b.hallStartTime) : 'Not Selected';
  const hallEnd = b.hallEndTime ? formatTimeToAmPm(b.hallEndTime) : 'Not Selected';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Hall: ${hallLabel}`, 15, y); y += 6;
  doc.text(`Start Time: ${hallStart}`, 15, y); y += 6;
  doc.text(`End Time: ${hallEnd}`, 15, y); y += 10;

  // Customer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Customer Details', 15, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${b.customerName}`, 15, y); y += 6;
  doc.text(`Phone: ${b.phone}`, 15, y); y += 10;

  // Selections
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Selected Packages', 15, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  b.selections.forEach(s => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.text(`• ${s}`, 20, y); y += 5;
  });

  y += 5;
  // Payment Section
  doc.setDrawColor(139, 69, 19);
  doc.line(15, y, pageWidth - 15, y); y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PRICE DETAILS', 15, y); y += 10;

  // Price table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const subtotal = b.totalAmount + b.discount;
  
  doc.text(`Subtotal Amount:`, 20, y);
  doc.text(formatPriceForPdf(subtotal), pageWidth - 20, y, { align: 'right' }); y += 7;
  
  if (b.discount > 0) {
    // Discount applied box
    doc.setFillColor(200, 255, 200);
    doc.rect(15, y - 2, pageWidth - 30, 18, 'F');
    doc.setTextColor(0, 100, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('10% DISCOUNT APPLIED', pageWidth / 2, y + 3, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Discount Amount: -${formatPriceForPdf(b.discount)}`, pageWidth / 2, y + 9, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 22;
  }

  // Highlight box for Total
  doc.setFillColor(255, 245, 200);
  doc.rect(15, y - 2, pageWidth - 30, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`TOTAL AMOUNT:`, 20, y + 5);
  doc.setTextColor(139, 69, 19);
  doc.text(formatPriceForPdf(b.totalAmount), pageWidth - 20, y + 5, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Advance Paid (10%):`, 20, y);
  doc.setTextColor(0, 100, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPriceForPdf(b.advanceAmount), pageWidth - 20, y, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 7;

  doc.text(`Balance Due:`, 20, y);
  doc.setTextColor(200, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPriceForPdf(b.totalAmount - b.discount - b.advanceAmount), pageWidth - 20, y, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 12;

  // Footer
  doc.setDrawColor(139, 69, 19);
  doc.line(15, y, pageWidth - 15, y); y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('WhatsApp: +91 96986 78450', pageWidth / 2, y, { align: 'center' }); y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('Thank you for choosing Sikara Mahal!', pageWidth / 2, y, { align: 'center' });

  doc.save(`Sikara_Booking_${b.customerName.replace(/\s+/g, '_')}_${b.id}.pdf`);
};

const handleWhatsAppClick = () => {
  try {
    window.open(WHATSAPP_LINK, '_blank');
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    window.location.href = WHATSAPP_LINK;
  }
};

const BookingHistory = () => {
  const { bookingHistory, customerPhone } = useBookingStore();

  const userBookings = customerPhone
    ? bookingHistory.filter(b => b.phone === customerPhone)
    : bookingHistory;

  if (userBookings.length === 0) return null;

  return (
    <section id="history" className="py-12 sm:py-20 px-3 sm:px-4 bg-secondary/30">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <ClipboardList className="inline w-4 h-4 mr-1" /> History
          </span>
          <h2 className="section-title mt-2 text-xl sm:text-2xl">Your Booking History</h2>
        </motion.div>

        <div className="space-y-4">
          {userBookings.map((b) => (
            <div key={b.id} className="glass-card p-4 sm:p-6">
              <div className="flex flex-col gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground truncate">{b.customerName}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">📅 {b.date} • 📱 {b.phone}</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">⏰ {b.hallStartTime ? formatTimeToAmPm(b.hallStartTime) : 'Start: Not Selected'} - {b.hallEndTime ? formatTimeToAmPm(b.hallEndTime) : 'End: Not Selected'}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent text-primary flex items-center gap-1 w-fit">
                  <CheckCircle2 className="w-3 h-3" />
                  Pending
                </span>
              </div>
              <ul className="text-xs sm:text-sm text-foreground space-y-1 mb-3">
                {b.selections.map((s, i) => (
                  <li key={i} className="break-words">• {s}</li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm border-t border-border pt-3">
                <span>Subtotal: <strong className="text-foreground">{formatPrice(b.totalAmount + b.discount)}</strong></span>
                {b.discount > 0 && (
                  <>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-xs">10% OFF</span>
                    <span>Discount: <strong className="text-green-600">-{formatPrice(b.discount)}</strong></span>
                  </>
                )}
                <span>Total: <strong className="text-primary">{formatPrice(b.totalAmount)}</strong></span>
                <span>Advance: <strong>{formatPrice(b.advanceAmount)}</strong></span>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateBookingPDF(b)}
                    className="flex items-center justify-center gap-1.5 text-primary hover:text-primary"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="gradient-violet text-primary-foreground flex items-center justify-center gap-1.5"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact on WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingHistory;
