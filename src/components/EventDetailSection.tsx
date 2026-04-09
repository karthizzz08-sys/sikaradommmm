import { motion } from 'framer-motion';
import { eventItems, formatPrice } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PartyPopper, Utensils, Sparkles } from 'lucide-react';
import b1 from '@/assets/b1.jpeg';
import b2 from '@/assets/b2.jpeg';
import b3 from '@/assets/b3.jpeg';
import b4 from '@/assets/b4.jpeg';
import b5 from '@/assets/b5.jpeg';
import b6 from '@/assets/b6.jpeg';
import b7 from '@/assets/b7.jpeg';
import b8 from '@/assets/b8.jpeg';
import b9 from '@/assets/b9.jpeg';
import b10 from '@/assets/b10.jpeg';
import b11 from '@/assets/b11.jpeg';
import b12 from '@/assets/b12.jpeg';
import b13 from '@/assets/b13.jpeg';
import b14 from '@/assets/b14.jpeg';
import b15 from '@/assets/b15.jpeg';

const categoryIcons: Record<string, React.ReactNode> = {
  'Welcome Setup': <PartyPopper className="w-5 h-5 text-primary" />,
  'Plates & Entry': <Utensils className="w-5 h-5 text-primary" />,
  'Decorations & Effects': <Sparkles className="w-5 h-5 text-primary" />,
};

const imageMap: Record<string, string> = {
  '@/assets/b1.jpeg': b1,
  '@/assets/b2.jpeg': b2,
  '@/assets/b3.jpeg': b3,
  '@/assets/b4.jpeg': b4,
  '@/assets/b5.jpeg': b5,
  '@/assets/b6.jpeg': b6,
  '@/assets/b7.jpeg': b7,
  '@/assets/b8.jpeg': b8,
  '@/assets/b9.jpeg': b9,
  '@/assets/b10.jpeg': b10,
  '@/assets/b11.jpeg': b11,
  '@/assets/b12.jpeg': b12,
  '@/assets/b13.jpeg': b13,
  '@/assets/b14.jpeg': b14,
  '@/assets/b15.jpeg': b15,
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
                      className={`glass-card overflow-hidden cursor-pointer transition-all hover:scale-[1.01] flex flex-col ${
                        isSelected ? 'ring-2 ring-primary bg-accent' : ''
                      }`}
                    >
                      {item.image && (
                        <img 
                          src={imageMap[item.image] || item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-5">
                        <div className="flex items-start gap-3">
                          <Checkbox checked={isSelected} onCheckedChange={() => toggleEventItem(item.id)} />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-sm">{item.name}</p>
                            <p className="text-primary font-bold mt-1">{formatPrice(item.basePrice)}</p>
                            <p className="text-muted-foreground text-xs">{item.unit}</p>
                            {isSelected && item.unit !== 'fixed' && (
                              item.id === 'welcome-drinks' ? (
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 rounded-lg px-0 text-sm"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setEventItemQty(item.id, Math.max(item.minQty, (sel?.qty ?? 1) - 1));
                                    }}
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </Button>
                                  <Input
                                    type="number"
                                    min={item.minQty}
                                    value={sel?.qty ?? 1}
                                    onChange={e => setEventItemQty(item.id, Math.max(item.minQty, Number(e.target.value)))}
                                    className="w-20 h-8 text-sm"
                                    onClick={e => e.stopPropagation()}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 rounded-lg px-0 text-sm"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setEventItemQty(item.id, (sel?.qty ?? 1) + 1);
                                    }}
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </Button>
                                  <span className="text-xs font-semibold text-primary">
                                    = {formatPrice(item.basePrice * (sel?.qty ?? 1))}
                                  </span>
                                </div>
                              ) : (
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
                              )
                            )}
                          </div>
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
