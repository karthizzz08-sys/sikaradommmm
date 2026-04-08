import { motion } from 'framer-motion';
import { useBookingStore, BookingRecord } from '@/lib/bookingStore';
import { formatPrice } from '@/lib/bookingData';
import { Download, CheckCircle2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

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
  doc.text(`Event Date: ${b.date}`, 15, y); y += 6;
  doc.text(`Status: Successfully Booked`, 15, y); y += 10;

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
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(`• ${s}`, 20, y); y += 5;
  });

  y += 5;
  // Payment
  doc.setDrawColor(139, 69, 19);
  doc.line(15, y, pageWidth - 15, y); y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Payment Summary', 15, y); y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Amount:`, 20, y);
  doc.text(formatPrice(b.totalAmount), pageWidth - 20, y, { align: 'right' }); y += 6;
  if (b.discount > 0) {
    doc.setTextColor(220, 50, 50);
    doc.text(`10% Discount:`, 20, y);
    doc.text(`-${formatPrice(b.discount)}`, pageWidth - 20, y, { align: 'right' }); y += 6;
    doc.setTextColor(0, 0, 0);
  }
  doc.text(`Advance Paid (10%):`, 20, y);
  doc.text(formatPrice(b.advanceAmount), pageWidth - 20, y, { align: 'right' }); y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(`Balance Due:`, 20, y);
  doc.text(formatPrice(b.totalAmount - b.discount - b.advanceAmount), pageWidth - 20, y, { align: 'right' }); y += 12;

  // Contact
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('WhatsApp: +91 96986 78450', pageWidth / 2, y, { align: 'center' }); y += 6;
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing Sikara Mahal!', pageWidth / 2, y, { align: 'center' });

  doc.save(`Sikara_Booking_${b.customerName.replace(/\s+/g, '_')}_${b.id}.pdf`);
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
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent text-primary flex items-center gap-1 w-fit">
                  <CheckCircle2 className="w-3 h-3" />
                  Successfully Booked
                </span>
              </div>
              <ul className="text-xs sm:text-sm text-foreground space-y-1 mb-3">
                {b.selections.map((s, i) => (
                  <li key={i} className="break-words">• {s}</li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm border-t border-border pt-3">
                <span>Total: <strong className="text-primary">{formatPrice(b.totalAmount)}</strong></span>
                {b.discount > 0 && <span>Discount: <strong className="text-destructive">-{formatPrice(b.discount)}</strong></span>}
                <span>Advance: <strong>{formatPrice(b.advanceAmount)}</strong></span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateBookingPDF(b)}
                  className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-1.5 text-primary hover:text-primary mt-1 sm:mt-0"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingHistory;
