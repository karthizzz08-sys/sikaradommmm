import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/bookingStore';
import {
  hallDurations, photoPackages, decorationItems, eventItems,
  salonPackages, mensGroomingPackages, cateringPackages, formatPrice,
} from '@/lib/bookingData';

const PriceSummary = ({ className = '' }: { className?: string }) => {
  const store = useBookingStore();

  const hallPrice = store.hallDuration ? hallDurations.find(d => d.id === store.hallDuration)?.price ?? 0 : 0;
  const photoPrice = store.photoPackageId
    ? (() => {
        const pkg = photoPackages.find(p => p.id === store.photoPackageId);
        return store.photoEventCount === 1 ? pkg?.pricePerEvent ?? 0 : pkg?.priceFor2Events ?? 0;
      })()
    : 0;
  const decorPrice = store.selectedDecorations.reduce((sum, id) => sum + (decorationItems.find(x => x.id === id)?.price ?? 0), 0);
  const allSalonPackages = [...salonPackages, ...mensGroomingPackages];
  const salonTotal = store.selectedSalonIds.reduce((sum, id) => sum + (allSalonPackages.find(x => x.id === id)?.price ?? 0), 0);
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
  const hasDiscount = discount > 0;

  if (subtotal === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-card to-card/50 border-2 rounded-xl p-4 sm:p-6 space-y-3 ${className}`}
      style={{
        borderColor: hasDiscount ? '#fbbf24' : 'rgba(139, 92, 246, 0.3)',
      }}
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">Price Summary</h3>
        {hasDiscount && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/20 border border-yellow-400/50 rounded-full">
            <span className="text-xs font-bold text-yellow-400">🎉 10% OFF</span>
          </span>
        )}
      </div>

      {/* Item Breakdown */}
      <div className="space-y-2 text-sm">
        {hallPrice > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hall Booking</span>
            <span className="font-semibold text-foreground">{formatPrice(hallPrice)}</span>
          </div>
        )}
        {photoPrice > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Photography</span>
            <span className="font-semibold text-foreground">{formatPrice(photoPrice)}</span>
          </div>
        )}
        {decorPrice > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Decoration</span>
            <span className="font-semibold text-foreground">{formatPrice(decorPrice)}</span>
          </div>
        )}
        {salonTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Bridal/Grooming</span>
            <span className="font-semibold text-foreground">{formatPrice(salonTotal)}</span>
          </div>
        )}
        {cateringTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Catering</span>
            <span className="font-semibold text-foreground">{formatPrice(cateringTotal)}</span>
          </div>
        )}
        {eventTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Event Items</span>
            <span className="font-semibold text-foreground">{formatPrice(eventTotal)}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-3" />

      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-foreground font-semibold">Subtotal</span>
        <span className="text-lg font-bold text-foreground">{formatPrice(subtotal)}</span>
      </div>

      {/* Discount */}
      {hasDiscount && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-400/15 border border-yellow-400/50 rounded-lg p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Discount (10%)</span>
            <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">-{formatPrice(discount)}</span>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">
            🎉 You got 10% discount! Hall rent is FREE
          </p>
        </motion.div>
      )}

      {/* Final Total */}
      <div className="h-px bg-border my-3" />
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10 p-3 rounded-lg">
        <span className="text-lg font-bold text-foreground">Final Amount</span>
        <span className={`text-2xl font-bold ${hasDiscount ? 'text-green-500' : 'text-primary'}`}>
          {formatPrice(total)}
        </span>
      </div>

      {/* Info Note */}
      <div className="mt-4 px-3 py-2 bg-muted rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">
          ℹ️ <span className="font-semibold">Discount Threshold:</span> Bookings exceeding ₹3,00,000 automatically qualify for 10% discount
        </p>
      </div>
    </motion.div>
  );
};

export default PriceSummary;
