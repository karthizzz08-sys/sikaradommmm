import { motion } from 'framer-motion';
import { eventItems, formatPrice } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PartyPopper, Utensils, Sparkles } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'Welcome Setup': <PartyPopper className="w-5 h-5 text-primary" />,
  'Plates & Entry': <Utensils className="w-5 h-5 text-primary" />,
  'Decorations & Effects': <Sparkles className="w-5 h-5 text-primary" />,
};

const EventDetailSection = () => {
  const { selectedEventItems, toggleEventItem, setEventItemQty } = useBookingStore();
  const categories = [...new Set(eventItems.map(e => e.category))];

  return (
    <section id="events" className="py-20 px-4 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <PartyPopper className="inline w-4 h-4 mr-1" /> Event Services
          </span>
          <h2 className="section-title mt-2">Event Add-Ons</h2>
          <p className="section-subtitle mt-3">Customize every detail of your celebration</p>
        </motion.div>

        <div className="space-y-10">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                {categoryIcons[cat]} {cat}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventItems.filter(e => e.category === cat).map(item => {
                  const sel = selectedEventItems.find(x => x.id === item.id);
                  const isSelected = !!sel;
                  return (
                    <label
                      key={item.id}
                      className={`glass-card p-5 cursor-pointer transition-all hover:scale-[1.01] ${
                        isSelected ? 'ring-2 ring-primary bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleEventItem(item.id)} />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">{item.name}</p>
                          <p className="text-primary font-bold mt-1">{formatPrice(item.basePrice)}</p>
                          <p className="text-muted-foreground text-xs">{item.unit}</p>
                          {isSelected && item.unit !== 'fixed' && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">Qty:</span>
                              <Input
                                type="number"
                                min={item.minQty}
                                value={sel?.qty ?? 1}
                                onChange={e => setEventItemQty(item.id, Math.max(item.minQty, Number(e.target.value)))}
                                className="w-20 h-8 text-sm"
                                onClick={e => e.stopPropagation()}
                              />
                              <span className="text-xs font-semibold text-primary">
                                = {formatPrice(item.basePrice * (sel?.qty ?? 1))}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailSection;
