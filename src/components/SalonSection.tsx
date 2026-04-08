import { motion } from 'framer-motion';
import { salonPackages, formatPrice } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Star, Crown } from 'lucide-react';
import beauty1 from '@/assets/beauty-1.jpg';
import beauty2 from '@/assets/beauty-2.jpg';
import beauty3 from '@/assets/beauty-3.jpg';
import beauty4 from '@/assets/beauty-4.jpg';

const packageIcons = {
  'normal-makeup': Sparkles,
  'hd-makeup': Star,
  'traditional-makeup': Crown,
};

const SalonSection = () => {
  const { selectedSalonIds, toggleSalon } = useBookingStore();

  return (
    <section id="salon" className="py-20 px-4 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <Crown className="inline w-4 h-4 mr-1" /> Bridal Packages
          </span>
          <h2 className="section-title mt-2">Bridal Section</h2>
          <p className="section-subtitle mt-3">Complete beauty & grooming packages</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 rounded-2xl overflow-hidden">
          <img src={beauty1} alt="Bridal makeup" className="w-full h-40 sm:h-52 object-cover rounded-xl" loading="lazy" width={768} height={512} />
          <img src={beauty2} alt="HD makeup" className="w-full h-40 sm:h-52 object-cover rounded-xl" loading="lazy" width={768} height={512} />
          <img src={beauty3} alt="Mehndi" className="w-full h-40 sm:h-52 object-cover rounded-xl" loading="lazy" width={768} height={512} />
          <img src={beauty4} alt="Groom grooming" className="w-full h-40 sm:h-52 object-cover rounded-xl" loading="lazy" width={768} height={512} />
        </div>

        <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Makeup Packages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salonPackages.map((pkg, i) => {
            const isSelected = selectedSalonIds.includes(pkg.id);
            const Icon = packageIcons[pkg.id as keyof typeof packageIcons] || Sparkles;
            return (
              <motion.label
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelected ? 'ring-2 ring-primary bg-accent' : ''
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleSalon(pkg.id)} />
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-lg font-bold text-foreground">{pkg.name}</h3>
                    </div>
                    <p className="text-primary font-bold text-2xl mt-2">{formatPrice(pkg.price)}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 ml-7">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-primary">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.label>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SalonSection;
