import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/bookingStore';
import {
  hallDurations, photoPackages, decorationItems, eventItems,
  salonPackages, cateringPackages, formatPrice,
} from '@/lib/bookingData';

const FloatingTotal = () => {
  const store = useBookingStore();
  const [visible, setVisible] = useState(false);

  const hallPrice = store.hallDuration ? hallDurations.find(d => d.id === store.hallDuration)?.price ?? 0 : 0;
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

  const subtotal = hallPrice + photoPrice + decorPrice + salonTotal + cateringTotal + eventTotal;
  const discount = subtotal >= 300000 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  useEffect(() => {
    setVisible(total > 0);
  }, [total]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 gradient-violet p-3 sm:p-4 shadow-2xl"
    >
      <div className="container max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-primary-foreground/80 text-xs sm:text-sm">Estimated Total</p>
          <p className="text-primary-foreground text-lg sm:text-2xl font-bold font-display">{formatPrice(total)}</p>
          {discount > 0 && <p className="text-primary-foreground/70 text-xs">10% discount applied</p>}
        </div>
        <a href="#booking" className="bg-primary-foreground text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-primary-foreground/90 transition-colors text-sm sm:text-base whitespace-nowrap">
          Book Now →
        </a>
      </div>
    </motion.div>
  );
};

export default FloatingTotal;
