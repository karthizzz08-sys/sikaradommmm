import { motion } from 'framer-motion';
import { eventItems, formatPrice } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PartyPopper, Utensils, Sparkles } from 'lucide-react';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import catering1 from '@/assets/catering-1.jpg';
import catering2 from '@/assets/catering-2.jpg';
import catering3 from '@/assets/catering-3.jpg';
import decorEntrance from '@/assets/decor-entrance.jpg';
import decorTable from '@/assets/decor-table.jpg';
import decorStage from '@/assets/decor-stage.jpg';
import decor1 from '@/assets/decor-1.jpg';
import decor2 from '@/assets/decor-2.jpg';
import decor3 from '@/assets/decor-3.jpg';

const categoryIcons: Record<string, React.ReactNode> = {
  'Welcome Setup': <PartyPopper className="w-5 h-5 text-primary" />,
  'Plates & Entry': <Utensils className="w-5 h-5 text-primary" />,
  'Decorations & Effects': <Sparkles className="w-5 h-5 text-primary" />,
};

const imageMap: Record<string, string> = {
  '@/assets/gallery-1.jpg': gallery1,
  '@/assets/gallery-2.jpg': gallery2,
  '@/assets/gallery-4.jpg': gallery4,
  '@/assets/gallery-5.jpg': gallery5,
  '@/assets/gallery-6.jpg': gallery6,
  '@/assets/catering-1.jpg': catering1,
  '@/assets/catering-2.jpg': catering2,
  '@/assets/catering-3.jpg': catering3,
  '@/assets/decor-entrance.jpg': decorEntrance,
  '@/assets/decor-table.jpg': decorTable,
  '@/assets/decor-stage.jpg': decorStage,
  '@/assets/decor-1.jpg': decor1,
  '@/assets/decor-2.jpg': decor2,
  '@/assets/decor-3.jpg': decor3,
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
                      className={`glass-card overflow-hidden cursor-pointer transition-all hover:scale-[1.01] ${
                        isSelected ? 'ring-2 ring-primary bg-accent' : ''
                      }`}
                    >
                      {item.image && (
                        <img 
                          src={imageMap[item.image] || item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover"
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
