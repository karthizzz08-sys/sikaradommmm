import { motion } from 'framer-motion';
import { decorationItems, formatPrice } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Flower2, DoorOpen, Lamp, Car, Sparkles } from 'lucide-react';
import decor1 from '@/assets/decor-1.jpg';
import decor2 from '@/assets/decor-2.jpg';
import decor3 from '@/assets/decor-3.jpg';
import decor4 from '@/assets/decor-4.jpg';
import decor5 from '@/assets/decor-5.jpg';
import decor6 from '@/assets/decor-6.jpg';
import decor7 from '@/assets/decor-7.jpg';
import decor8 from '@/assets/decor-8.jpg';
import decor9 from '@/assets/decor-9.jpg';

const decorImages: Record<string, string> = {
  'stage-basic': decor6,
  'stage-premium': decor1,
  'stage-grand': decor5,
  'entrance': decor2,
  'table-decor': decor3,
  'car-decor': decor4,
  'mandapam-floral': decor7,
  'reception-decor': decor8,
  'outdoor-arch': decor9,
};

const decorIcons: Record<string, React.ReactNode> = {
  'stage-basic': <Flower2 className="w-5 h-5 text-primary" />,
  'stage-premium': <Flower2 className="w-5 h-5 text-primary" />,
  'stage-grand': <Lamp className="w-5 h-5 text-primary" />,
  'entrance': <DoorOpen className="w-5 h-5 text-primary" />,
  'table-decor': <Lamp className="w-5 h-5 text-primary" />,
  'car-decor': <Car className="w-5 h-5 text-primary" />,
  'mandapam-floral': <Flower2 className="w-5 h-5 text-primary" />,
  'reception-decor': <Sparkles className="w-5 h-5 text-primary" />,
  'outdoor-arch': <DoorOpen className="w-5 h-5 text-primary" />,
};

const DecorationSection = () => {
  const { selectedDecorations, toggleDecoration } = useBookingStore();

  return (
    <section id="decoration" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-background to-background" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <Flower2 className="inline w-4 h-4 mr-1" /> Decoration
          </span>
          <h2 className="section-title mt-2">Elegant Decorations</h2>
          <p className="section-subtitle mt-3">Silver & White themed décor for your special day</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {decorationItems.map((item, i) => {
            const isSelected = selectedDecorations.includes(item.id);
            const img = decorImages[item.id];
            return (
              <motion.label
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelected ? 'ring-2 ring-primary bg-accent' : ''
                }`}
              >
                {img && (
                  <img src={img} alt={item.name} className="w-full h-40 object-cover" loading="lazy" width={768} height={512} />
                )}
                <div className="p-5 flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleDecoration(item.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      {decorIcons[item.id]}
                      <h3 className="font-display text-lg font-bold text-foreground">{item.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                    <p className="text-primary font-bold text-xl mt-3">{formatPrice(item.price)}</p>
                  </div>
                </div>
              </motion.label>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DecorationSection;
