import { motion } from 'framer-motion';
import { cateringPackages, formatPrice } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { UtensilsCrossed, Coffee, Sun, Moon } from 'lucide-react';
import catering1 from '@/assets/catering-1.jpg';
import catering2 from '@/assets/catering-2.jpg';
import catering3 from '@/assets/catering-3.jpg';

const categoryConfig = {
  tiffen: { label: '🟡 Morning Tiffen Menu', icon: Coffee, image: catering1 },
  lunch: { label: '🔴 Lunch Menu', icon: Sun, image: catering2 },
  dinner: { label: '🔵 Dinner Menu', icon: Moon, image: catering3 },
};

const CateringSection = () => {
  const { selectedCatering, toggleCatering, setCateringHeadCount } = useBookingStore();
  const categories: ('tiffen' | 'lunch' | 'dinner')[] = ['tiffen', 'lunch', 'dinner'];

  return (
    <section id="catering" className="py-20 px-4 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <UtensilsCrossed className="inline w-4 h-4 mr-1" /> Catering
          </span>
          <h2 className="section-title mt-2">Catering Packages</h2>
          <p className="section-subtitle mt-3">Delicious South Indian cuisine for your celebration</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 rounded-2xl overflow-hidden">
          <img src={catering1} alt="Morning Tiffen" className="w-full h-48 object-cover rounded-xl" loading="lazy" width={768} height={512} />
          <img src={catering2} alt="Lunch Feast" className="w-full h-48 object-cover rounded-xl" loading="lazy" width={768} height={512} />
          <img src={catering3} alt="Dinner Spread" className="w-full h-48 object-cover rounded-xl" loading="lazy" width={768} height={512} />
        </div>

        <div className="space-y-12">
          {categories.map(cat => {
            const config = categoryConfig[cat];
            const packages = cateringPackages.filter(p => p.category === cat);
            return (
              <div key={cat}>
                <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
                  <config.icon className="w-5 h-5 text-primary" /> {config.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg, i) => {
                    const sel = selectedCatering.find(x => x.packageId === pkg.id);
                    const isSelected = !!sel;
                    return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-card p-6 transition-all hover:scale-[1.02] ${
                          isSelected ? 'ring-2 ring-primary bg-accent' : ''
                        }`}
                      >
                        <label className="cursor-pointer">
                          <div className="flex items-start gap-3 mb-4">
                            <Checkbox checked={isSelected} onCheckedChange={() => toggleCatering(pkg.id)} />
                            <div>
                              <h4 className="font-display text-lg font-bold text-foreground">{pkg.name}</h4>
                              <p className="text-primary font-bold text-2xl mt-1">
                                {formatPrice(pkg.pricePerHead)} <span className="text-sm font-normal text-muted-foreground">/ head</span>
                              </p>
                            </div>
                          </div>
                        </label>
                        <ul className="space-y-1 ml-7 mb-4">
                          {pkg.includes.map((item, j) => (
                            <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="text-primary">✓</span> {item}
                            </li>
                          ))}
                        </ul>
                        {isSelected && (
                          <div className="ml-7 flex items-center gap-2 mt-3 p-3 bg-muted rounded-lg">
                            <span className="text-sm font-semibold text-foreground">Guests:</span>
                            <Input
                              type="number"
                              min={100}
                              step={50}
                              value={sel?.headCount ?? 100}
                              onChange={e => setCateringHeadCount(pkg.id, Math.max(100, Math.round(Number(e.target.value) / 50) * 50))}
                              className="w-24 h-8 text-sm"
                            />
                            <span className="text-sm font-bold text-primary">
                              = {formatPrice(pkg.pricePerHead * (sel?.headCount ?? 100))}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
