import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useBookingStore } from '@/lib/bookingStore';
import { supabase } from '@/integrations/supabase/client';
import {
  hallDurations, photoPackages, decorationItems, eventItems,
  salonPackages, mensGroomingPackages, cateringPackages, cateringAddOns, formatPrice, timeIntervalsOverlap,
  formatTimeToAmPm,
} from '@/lib/bookingData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Upload, MessageCircle, ClipboardList, UserCircle, CreditCard, CheckCircle2, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import paymentQr from '@/assets/payment-qr.jpeg';
import PriceSummary from '@/components/PriceSummary';
import { sendBookingEmail } from '@/lib/emailService';
import { uploadPaymentScreenshot } from '@/lib/paymentScreenshotService';

// WhatsApp configuration
const OWNER_WHATSAPP = import.meta.env.VITE_OWNER_WHATSAPP || '919698678450';
const OWNER_WHATSAPP_LINK = `https://wa.me/${OWNER_WHATSAPP}`;

const BookingWizard = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const store = useBookingStore();

  // Fetch all booked dates for calendar coloring
  useEffect(() => {
    fetchAllBookedDates();
  }, []);

  const fetchAllBookedDates = async () => {
    const { data } = await supabase.from('bookings').select('date');
    if (data) {
      setBookedDates(data.map(d => new Date(d.date + 'T00:00:00')));
    }
  };

  const hallPrice = store.hallDuration
    ? hallDurations.find(d => d.id === store.hallDuration)?.price ?? 0
    : 0;
  const hallTiming = store.hallDuration
    ? hallDurations.find(d => d.id === store.hallDuration)?.timing ?? ''
    : '';
  const photoPrice = store.photoPackageId
    ? (() => {
        const pkg = photoPackages.find(p => p.id === store.photoPackageId);
        return store.photoEventCount === 1 ? pkg?.pricePerEvent ?? 0 : pkg?.priceFor2Events ?? 0;
      })()
    : 0;
  const decorPrice = store.selectedDecorations.reduce((sum, id) => sum + (decorationItems.find(x => x.id === id)?.price ?? 0), 0);
  const salonTotal = store.selectedSalonIds.reduce((sum, id) => sum + (salonPackages.find(x => x.id === id)?.price ?? 0), 0);
  const cateringTotal = store.selectedCatering.reduce((sum, sel) => {
    const pkg = cateringPackages.find(x => x.id === sel.packageId);
    return sum + (pkg ? pkg.pricePerHead * sel.headCount : 0);
  }, 0);
  const eventTotal = store.selectedEventItems.reduce((sum, sel) => {
    const item = eventItems.find(x => x.id === sel.id);
    return sum + (item ? item.basePrice * sel.qty : 0);
  }, 0);
  const cateringAddOnTotal = store.selectedCateringAddOns.reduce((sum, sel) => {
    const addon = cateringAddOns.find(x => x.id === sel.id);
    return sum + (addon ? addon.price * sel.qty : 0);
  }, 0);

  const subtotal = hallPrice + photoPrice + decorPrice + salonTotal + cateringTotal + eventTotal + cateringAddOnTotal;
  const discount = subtotal >= 300000 ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal - discount;
  const advanceAmount = Math.round(grandTotal * 0.1);

  const getSelectionSummary = () => {
    const items: string[] = [];
    if (store.hallDuration) {
      const h = hallDurations.find(d => d.id === store.hallDuration);
      items.push(`Hall: ${h?.label}`);
        if (store.hallDuration === '4hrs') {
        items.push(`Start Time: ${store.hallStartTime ? formatTimeToAmPm(store.hallStartTime) : 'Not Selected'}`);
        items.push(`End Time: ${store.hallEndTime ? formatTimeToAmPm(store.hallEndTime) : 'Not Selected'}`);
      } else {
        items.push(`Timing: ${h?.timing || 'Not Selected'}`);
      }
    }
    if (store.photoPackageId) {
      const p = photoPackages.find(x => x.id === store.photoPackageId);
      items.push(`Photography: ${p?.name} (${store.photoEventCount} event${store.photoEventCount > 1 ? 's' : ''})`);
    }
    store.selectedDecorations.forEach(id => {
      const d = decorationItems.find(x => x.id === id);
      if (d) items.push(`Decoration: ${d.name}`);
    });
    store.selectedSalonIds.forEach(id => {
      const s = salonPackages.find(x => x.id === id);
      if (s) items.push(`Bridal Makeup: ${s.name}`);
    });
    store.selectedSalonIds.forEach(id => {
      const m = mensGroomingPackages.find(x => x.id === id);
      if (m) items.push(`Men's Grooming: ${m.name}`);
    });
    store.selectedCatering.forEach(sel => {
      const c = cateringPackages.find(x => x.id === sel.packageId);
      if (c) items.push(`Catering: ${c.name} x${sel.headCount} heads = ${formatPrice(c.pricePerHead * sel.headCount)}`);
    });
    store.selectedEventItems.forEach(sel => {
      const e = eventItems.find(x => x.id === sel.id);
      if (e) items.push(`Event: ${e.name} x${sel.qty}`);
    });
    return items;
  };

  const validateTimeSelection = () => {
    if (store.hallDuration === '4hrs' && (!store.hallStartTime || !store.hallEndTime)) {
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateTimeSelection()) {
      toast.error('Please select both start and end time for the 4-hour hall booking.');
      // Scroll to hall section
      const hallSection = document.getElementById('hall');
      if (hallSection) {
        hallSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setStep(s => Math.min(3, s + 1));
  };

  const handleSubmit = async () => {
    if (!store.customerName || !store.customerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!store.customerEmail) {
      toast.error('Email is required');
      return;
    }

    if (!store.paymentScreenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }

    if (!validateTimeSelection()) {
      return;
    }

    setIsSubmitting(true);

    const selections = getSelectionSummary();
    const booking = {
      id: Date.now().toString(),
      date: store.eventDate ? format(store.eventDate, 'dd/MM/yyyy') : 'TBD',
      customerName: store.customerName,
      phone: store.customerPhone,
      hallDuration: store.hallDuration ?? '',
      hallHalfMode: store.hallHalfMode,
      hallStartTime: store.hallStartTime,
      hallEndTime: store.hallEndTime,
      totalAmount: grandTotal,
      advanceAmount,
      status: 'confirmed' as const,
      selections,
      discount,
    };
    console.log('Booking payload:', booking);
    store.addBooking(booking);

    const halfDayModeLabel = store.hallHalfMode === 'morning' ? 'Morning' : store.hallHalfMode === 'evening' ? 'Evening' : '';
    const hallLabel = store.hallDuration ? hallDurations.find(d => d.id === store.hallDuration)?.label ?? store.hallDuration : 'Not Selected';
    const hallStartLabel = store.hallStartTime ? formatTimeToAmPm(store.hallStartTime) : 'Not Selected';
    const hallEndLabel = store.hallEndTime ? formatTimeToAmPm(store.hallEndTime) : 'Not Selected';
    const selectionsText = selections.map(s => `• ${s}`).join('\n');

    // Send email to CUSTOMER with booking details
    try {
      console.log('📧 Sending email to customer...');
      const emailSent = await sendBookingEmail({
        customerName: store.customerName,
        customerEmail: store.customerEmail,
        customerPhone: store.customerPhone,
        eventDate: booking.date,
        hallDuration: hallLabel,
        hallStartTime: hallStartLabel,
        hallEndTime: hallEndLabel,
        selections: selectionsText,
        subtotal: formatPrice(subtotal),
        discount: formatPrice(discount),
        total: formatPrice(grandTotal),
        advanceAmount: formatPrice(advanceAmount),
        transactionId: store.transactionId,
      });

      if (emailSent) {
        console.log('✅ Email sent to customer successfully');
        toast.success('✅ Booking confirmation sent to your email!');
      } else {
        console.warn('⚠️ Email sending failed');
        toast.error('❌ Email failed to send');
      }
    } catch (error) {
      console.error('❌ Email error:', error);
      toast.error(`❌ Email error: ${error.message}`);
    }

    // 📤 UPLOAD PAYMENT SCREENSHOT TO SUPABASE
    let screenshotLink = '';
    try {
      console.log('📸 Uploading payment screenshot...');
      console.log('🔍 Screenshot details:', {
        name: store.paymentScreenshot?.name,
        size: `${(store.paymentScreenshot?.size ?? 0 / 1024).toFixed(2)} KB`,
        type: store.paymentScreenshot?.type,
        customerName: store.customerName,
        phoneNumber: store.customerPhone,
      });

      if (!store.paymentScreenshot) {
        throw new Error('Screenshot file is missing');
      }

      const uploadResult = await uploadPaymentScreenshot(
        store.paymentScreenshot,
        store.customerName,
        store.customerPhone
      );

      if (uploadResult) {
        screenshotLink = uploadResult.url;
        console.log('✅ Screenshot uploaded successfully');
        console.log('🔗 Screenshot URL:', screenshotLink);
        toast.success('✅ Payment screenshot uploaded to storage');
      } else {
        console.warn('⚠️ Screenshot upload returned null - Supabase bucket may not exist or may not be public');
        toast.warning('⚠️ Screenshot upload failed - Check browser console and Supabase bucket configuration');
      }
    } catch (error) {
      console.error('❌ Screenshot upload error:', {
        message: error instanceof Error ? error.message : String(error),
        error: error,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        bucketName: 'payment-screenshots',
      });
      toast.error(`⚠️ Screenshot upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Create messages for both OWNER and CUSTOMER
    const servicesCount = getSelectionSummary().length;
    
    // Message to OWNER - with detailed services
    const ownerMsg = 
      `🏛️ *NEW BOOKING REQUEST*\n\n` +
      `👤 Customer: ${store.customerName}\n` +
      `📱 Phone: ${store.customerPhone}\n` +
      `📧 Email: ${store.customerEmail}\n` +
      `📅 Date: ${booking.date}\n` +
      `⏰ Hall: ${hallLabel} (${hallStartLabel} - ${hallEndLabel})\n\n` +
      `📋 *Services Selected:*\n${selectionsText}\n\n` +
      `💰 Advance Amount: ${formatPrice(advanceAmount)}\n` +
      `💰 Total Amount: ${formatPrice(grandTotal)}\n` +
      `🧾 Txn ID: ${store.transactionId || 'Not provided'}\n` +
      (screenshotLink
        ? `\n🖼️ Screenshot: ${screenshotLink}`
        : `\n⚠️ Screenshot: Upload pending`
      );

    // Message to CUSTOMER
    const customerMsg = 
      `🎉 *BOOKING CONFIRMATION*\n\n` +
      `Thank you ${store.customerName}! Your booking request has been received.\n\n` +
      `📅 Event Date: ${booking.date}\n` +
      `🏛️ Hall: ${hallLabel}\n` +
      `⏰ Time: ${hallStartLabel} - ${hallEndLabel}\n` +
      `📋 Services: ${servicesCount} selected\n\n` +
      `💰 Advance Amount: ${formatPrice(advanceAmount)}\n` +
      `💰 Total Amount: ${formatPrice(grandTotal)}\n` +
      `🧾 Booking ID: ${booking.id}\n\n` +
      `✅ We will contact you soon to confirm.\n` +
      `For queries: +91 9698678450`;

    // Send messages to WhatsApp
    try {
      console.log('📱 Opening Owner WhatsApp...');
      
      // Encode message for URL
      const ownerMsgEncoded = encodeURIComponent(ownerMsg);
      
      // Owner phone number
      const ownerPhone = '919698678450';
      
      // Use whatsapp:// protocol to open app directly (not web)
      const ownerWhatsappUrl = `whatsapp://send?phone=${ownerPhone}&text=${ownerMsgEncoded}`;
      
      console.log('🔗 Owner Phone:', ownerPhone);
      console.log('📱 Using WhatsApp protocol to open app directly');
      
      // Show success message
      toast.success('✅ Opening Owner WhatsApp...');
      
      // Open owner WhatsApp chat directly
      setTimeout(() => {
        console.log('📱 Navigating to owner WhatsApp...');
        window.location.href = ownerWhatsappUrl;
      }, 300);
      
    } catch (error) {
      console.error('❌ Error opening WhatsApp:', error);
      toast.error('⚠️ Unable to open WhatsApp. Please ensure WhatsApp is installed.');
      setIsSubmitting(false);
      return;
    }

    // Delay reset to allow WhatsApp to open
    setTimeout(() => {
      store.resetSelections();
      setStep(0);
      setIsSubmitting(false);
    }, 2000);
  };

  const steps = [
    { title: 'Review', icon: ClipboardList },
    { title: 'Details', icon: UserCircle },
    { title: 'Payment', icon: CreditCard },
    { title: 'Confirm', icon: CheckCircle2 },
  ];

  if (grandTotal === 0) {
    return (
      <section id="booking" className="py-20 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="section-title">Book Now</h2>
          <p className="text-muted-foreground mt-4">Please select at least one package above to start your booking.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 px-4">
      <div className="container max-w-2xl mx-auto">
        <h2 className="section-title text-center mb-8">Book Now</h2>

        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => i <= step && setStep(i)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm ${
                    i === step ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg'
                    : i < step ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i < step ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                </button>
                {i < steps.length - 1 && <div className={`w-4 sm:w-8 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-4 sm:p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Your Selections</h3>
                  <p className="text-xs sm:text-sm text-destructive font-semibold">🗑️ Remove from card</p>
                </div>
                <ul className="space-y-3">
                  {store.hallDuration && (
                    <li className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                      <span className="flex items-center gap-2"><span className="text-primary">✓</span> Hall: {hallDurations.find(d => d.id === store.hallDuration)?.label}</span>
                      <button 
                        onClick={() => {
                          const hallLabel = hallDurations.find(d => d.id === store.hallDuration)?.label;
                          if (confirm(`Remove "${hallLabel}" from selections?`)) {
                            store.removeHall();
                            toast.success(`❌ Removed: ${hallLabel}`);
                          }
                        }} 
                        className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition flex-shrink-0" 
                        title="Remove hall"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  )}
                  {store.hallStartTime && (
                    <li className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                      <span className="flex items-center gap-2"><span className="text-primary">✓</span> Start Time: {formatTimeToAmPm(store.hallStartTime)}</span>
                    </li>
                  )}
                  {store.hallEndTime && (
                    <li className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                      <span className="flex items-center gap-2"><span className="text-primary">✓</span> End Time: {formatTimeToAmPm(store.hallEndTime)}</span>
                    </li>
                  )}
                  {store.photoPackageId && (
                    <li className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                      <span className="flex items-center gap-2"><span className="text-primary">✓</span> Photography: {photoPackages.find(x => x.id === store.photoPackageId)?.name} ({store.photoEventCount} event{store.photoEventCount > 1 ? 's' : ''})</span>
                      <button 
                        onClick={() => {
                          const photoName = photoPackages.find(x => x.id === store.photoPackageId)?.name;
                          if (confirm(`Remove "Photography - ${photoName}" from selections?`)) {
                            store.removePhoto();
                            toast.success(`❌ Removed: Photography - ${photoName}`);
                          }
                        }} 
                        className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition flex-shrink-0" 
                        title="Remove photography"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  )}
                  {store.selectedDecorations.map(id => {
                    const d = decorationItems.find(x => x.id === id);
                    return d ? (
                      <li key={id} className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                        <span className="flex items-center gap-2"><span className="text-primary">✓</span> Decoration: {d.name}</span>
                        <button 
                          onClick={() => {
                            if (confirm(`Remove "Decoration - ${d.name}" from selections?`)) {
                              store.removeDecoration(id);
                              toast.success(`❌ Removed: Decoration - ${d.name}`);
                            }
                          }} 
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition flex-shrink-0" 
                          title="Remove decoration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ) : null;
                  })}
                  {store.selectedSalonIds.map(id => {
                    const s = salonPackages.find(x => x.id === id);
                    return s ? (
                      <li key={id} className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                        <span className="flex items-center gap-2"><span className="text-primary">✓</span> Bridal Makeup: {s.name}</span>
                        <button 
                          onClick={() => {
                            if (confirm(`Remove "Bridal Makeup - ${s.name}" from selections?`)) {
                              store.removeSalon(id);
                              toast.success(`❌ Removed: Bridal Makeup - ${s.name}`);
                            }
                          }} 
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition flex-shrink-0" 
                          title="Remove bridal makeup"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ) : null;
                  })}
                  {store.selectedCatering.map(sel => {
                    const c = cateringPackages.find(x => x.id === sel.packageId);
                    return c ? (
                      <li key={sel.packageId} className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                        <span className="flex items-center gap-2"><span className="text-primary">✓</span> Catering: {c.name} x{sel.headCount} heads = {formatPrice(c.pricePerHead * sel.headCount)}</span>
                        <button 
                          onClick={() => {
                            if (confirm(`Remove "Catering - ${c.name} (${sel.headCount} heads)" from selections?`)) {
                              store.removeCatering(sel.packageId);
                              toast.success(`❌ Removed: Catering - ${c.name}`);
                            }
                          }} 
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition flex-shrink-0" 
                          title="Remove catering"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ) : null;
                  })}
                  {store.selectedCateringAddOns.map(sel => {
                    const addon = cateringAddOns.find(x => x.id === sel.id);
                    return addon ? (
                      <li key={sel.id} className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                        <span className="flex items-center gap-2"><span className="text-primary">✓</span> Add-on: {addon.name} x{sel.qty}</span>
                        <button 
                          onClick={() => {
                            if (confirm(`Remove "Add-on - ${addon.name}" from selections?`)) {
                              store.removeCateringAddOn(sel.id);
                              toast.success(`❌ Removed: Add-on - ${addon.name}`);
                            }
                          }} 
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition flex-shrink-0" 
                          title="Remove add-on"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ) : null;
                  })}
                  {store.selectedEventItems.map(sel => {
                    const e = eventItems.find(x => x.id === sel.id);
                    return e ? (
                      <li key={sel.id} className="flex items-center justify-between gap-2 text-foreground text-sm sm:text-base p-3 bg-muted rounded-lg group hover:bg-muted/80 transition">
                        <span className="flex items-center gap-2"><span className="text-primary">✓</span> Event: {e.name} x{sel.qty}</span>
                        <button 
                          onClick={() => {
                            if (confirm(`Remove "Event Item - ${e.name}" from selections?`)) {
                              store.removeEventItem(sel.id);
                              toast.success(`❌ Removed: Event Item - ${e.name}`);
                            }
                          }} 
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition flex-shrink-0" 
                          title="Remove event item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
                {store.eventDate && (
                  <div className="flex justify-between text-sm mt-4 p-3 bg-accent/30 rounded-lg">
                    <span className="text-muted-foreground">Event Date</span>
                    <span className="font-semibold text-foreground">{format(store.eventDate, 'PPP')}</span>
                  </div>
                )}
                
                {/* Price Summary Component */}
                <PriceSummary />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-6">Your Details</h3>
                <div>
                  <label className="text-sm font-semibold text-foreground">Name *</label>
                  <Input value={store.customerName} onChange={e => store.setCustomerName(e.target.value)} placeholder="Enter your full name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Phone *</label>
                  <Input value={store.customerPhone} onChange={e => store.setCustomerPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Email *</label>
                  <Input value={store.customerEmail} onChange={e => store.setCustomerEmail(e.target.value)} placeholder="your@email.com" className="mt-1" required />
                </div>
                {store.eventDate && (
                  <div className="p-4 bg-accent rounded-lg">
                    <p className="text-sm font-semibold text-foreground">📅 Selected Event Date: {format(store.eventDate, 'PPP')}</p>
                    <p className="text-xs text-muted-foreground mt-1">Selected from availability checker</p>
                  </div>
                )}
                {!store.eventDate && (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Select Event Date *</label>
                    <div className="p-4 bg-accent/20 rounded-lg border border-primary/20 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={store.eventDate || undefined}
                        onSelect={(date) => {
                          if (date) {
                            store.setEventDate(date);
                            toast.success(`📅 Date selected: ${format(date, 'PPP')}`);
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-lg"
                        modifiers={{
                          booked: bookedDates,
                        }}
                        modifiersStyles={{
                          booked: { backgroundColor: '#a78bfa', color: '#fff', fontWeight: 'bold' },
                        }}
                      />
                    </div>
                    <div className="flex gap-4 mt-3 text-xs justify-center items-center flex-wrap">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                        <span className="w-3 h-3 rounded bg-gray-400 border border-gray-500" />
                        <span className="text-foreground font-medium">Available</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50">
                        <span className="w-3 h-3 rounded" style={{ backgroundColor: '#a78bfa', borderColor: '#a78bfa' }}></span>
                        <span className="text-foreground font-medium">Booked</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">👉 Pick a date from calendar to proceed</p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">Pay Advance</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Pay <span className="font-bold text-primary">{formatPrice(advanceAmount)}</span> (10% advance) via UPI
                </p>
                <div className="bg-muted rounded-xl p-4 sm:p-6 text-center">
                  <img src={paymentQr} alt="UPI Payment QR Code" className="w-40 sm:w-56 h-auto mx-auto rounded-lg" loading="lazy" width={224} height={280} />
                  <p className="text-sm text-muted-foreground mt-3">Scan to pay via any UPI app</p>
                  <p className="text-xs text-muted-foreground mt-1">UPI ID: s.karthikkumar2008-3@okhdfcbank</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Upload Payment Screenshot *</label>
                  <label className={`mt-2 flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                    store.paymentScreenshot 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600' 
                      : 'bg-muted border-border hover:border-primary'
                  }`}>
                    <Upload className={`w-5 h-5 flex-shrink-0 ${
                      store.paymentScreenshot 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-muted-foreground'
                    }`} />
                    <span className={`text-sm truncate ${
                      store.paymentScreenshot 
                        ? 'text-green-700 dark:text-green-300 font-semibold' 
                        : 'text-muted-foreground'
                    }`}>
                      {store.paymentScreenshot ? `✅ ${store.paymentScreenshot.name}` : 'Click to upload screenshot'}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file) {
                          console.log('📸 File selected:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`, `Type: ${file.type}`);
                          if (!file.type.startsWith('image/')) {
                            toast.error('❌ Please select a valid image file');
                            console.error('❌ Invalid file type:', file.type);
                            return;
                          }
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('❌ File size must be less than 10MB');
                            console.error('❌ File too large:', file.size);
                            return;
                          }
                          store.setPaymentScreenshot(file);
                          toast.success('✅ Screenshot selected!');
                        }
                      }} 
                    />
                  </label>
                  {!store.paymentScreenshot && (
                    <p className="text-xs text-destructive mt-2 font-semibold">⚠️ Screenshot is required to proceed</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Transaction ID <span className="text-muted-foreground">(optional)</span></label>
                  <Input value={store.transactionId} onChange={e => store.setTransactionId(e.target.value)} placeholder="Enter UPI Transaction ID (optional)" className="mt-1" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-6">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Confirm & Send to WhatsApp</h3>
                <div className="text-left bg-muted rounded-xl p-4 sm:p-6 space-y-2 text-sm sm:text-base">
                  <p><span className="font-semibold">Name:</span> {store.customerName}</p>
                  <p><span className="font-semibold">Phone:</span> {store.customerPhone}</p>
                  <p><span className="font-semibold">Date:</span> {store.eventDate ? format(store.eventDate, 'PPP') : 'TBD'}</p>
                  {store.hallDuration && (
                    <>
                      <p><span className="font-semibold">Hall:</span> {hallDurations.find(d => d.id === store.hallDuration)?.label || 'Not Selected'}</p>
                      <p><span className="font-semibold">Start Time:</span> {store.hallStartTime ? formatTimeToAmPm(store.hallStartTime) : 'Not Selected'}</p>
                      <p><span className="font-semibold">End Time:</span> {store.hallEndTime ? formatTimeToAmPm(store.hallEndTime) : 'Not Selected'}</p>
                    </>
                  )}
                  <p><span className="font-semibold">Subtotal:</span> {formatPrice(subtotal)}</p>
                  <p><span className="font-semibold">Discount (10%):</span> <span className="text-destructive">-{formatPrice(discount)}</span></p>
                  <p><span className="font-semibold">Total:</span> {formatPrice(grandTotal)}</p>
                  <p><span className="font-semibold">Advance:</span> {formatPrice(advanceAmount)}</p>
                  <p><span className="font-semibold">Txn ID:</span> {store.transactionId || 'N/A'}</p>
                  {store.paymentScreenshot && <p><span className="font-semibold">Screenshot:</span> {store.paymentScreenshot.name} ✅</p>}
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !store.paymentScreenshot} 
                  className="gradient-violet text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed" 
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Mail className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Submit & Send to WhatsApp 
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mt-6">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} size="sm" className="sm:size-default">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {step < 3 && (
            <Button onClick={handleNextStep} className="gradient-violet text-primary-foreground" size="sm">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingWizard;
