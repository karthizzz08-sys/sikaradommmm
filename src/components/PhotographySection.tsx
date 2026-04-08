import { motion } from 'framer-motion';
import { photoPackages, formatPrice } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Camera, Video, Plane, Star, Crown, Award, Medal } from 'lucide-react';

const tierIcons = {
  silver: Medal,
  gold: Award,
  platinum: Star,
  diamond: Crown,
};

const tierColors = {
  silver: 'from-silver to-silver-light',
  gold: 'from-gold/20 to-gold/5',
  platinum: 'from-accent to-violet-light',
  diamond: 'from-primary/15 to-primary/5',
};

const PhotographySection = () => {
  const { photoPackageId, setPhotoPackage, photoEventCount, setPhotoEventCount } = useBookingStore();

  return (
    <section id="photography" className="py-20 px-4 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">📸 Photography</span>
          <h2 className="section-title mt-2">Sikara Photography</h2>
          <p className="section-subtitle mt-3">Capture every precious moment</p>
        </motion.div>

        {/* Event count toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-card rounded-full p-1 flex gap-1 border border-border">
            {([1, 2] as const).map((count) => (
              <button
                key={count}
                onClick={() => setPhotoEventCount(count)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  photoEventCount === count
                    ? 'gradient-violet text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {count === 1 ? 'Single Event' : '2 Events (Save More!)'}
              </button>
            ))}
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photoPackages.map((pkg, i) => {
            const Icon = tierIcons[pkg.tier];
            const price = photoEventCount === 1 ? pkg.pricePerEvent : pkg.priceFor2Events;
            const isSelected = photoPackageId === pkg.id;

            return (
              <motion.button
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setPhotoPackage(isSelected ? null : pkg.id)}
                className={`glass-card overflow-hidden text-left transition-all hover:scale-[1.02] cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${tierColors[pkg.tier]} p-6`}>
                  {pkg.badge && (
                    <span className="gradient-violet text-primary-foreground text-xs px-3 py-1 rounded-full font-bold">
                      {pkg.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-xl font-bold text-foreground">{pkg.name}</h3>
                  </div>
                  <p className="text-3xl font-bold text-primary mt-3">{formatPrice(price)}</p>
                  <p className="text-muted-foreground text-xs">
                    {photoEventCount === 1 ? 'per event' : 'for 2 events'}
                  </p>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className={`mt-5 py-2.5 rounded-lg text-center font-semibold text-sm transition-colors ${
                    isSelected
                      ? 'gradient-violet text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {isSelected ? 'Selected ✓' : 'Select Package'}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhotographySection;
