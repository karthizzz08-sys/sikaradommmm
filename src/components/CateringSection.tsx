import { motion } from 'framer-motion';
import { cateringPackages, cateringAddOns, formatPrice, getAllowedCateringCategories } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Coffee, Sun, Moon } from 'lucide-react';
import catering1 from '@/assets/catering-1.jpg';
import catering2 from '@/assets/catering-2.jpg';
import catering3 from '@/assets/catering-3.jpg';

const categoryConfig = {
  tiffen: { label: '🟡 Morning Tiffen Menu', icon: Coffee, image: catering1 },
  lunch: { label: '🔴 Lunch Menu', icon: Sun, image: catering2 },
  dinner: { label: '🔵 Dinner Menu', icon: Moon, image: catering3 },
};

const MIN_HEADCOUNT = 50;
const HEADCOUNT_STEP = 10;

const CateringSection = () => {
  const { selectedCatering, toggleCatering, setCateringHeadCount, selectedCateringAddOns, toggleCateringAddOn, setCateringAddOnQty, hallDuration, hallStartTime, hallHalfMode } = useBookingStore();
  const categories: ('tiffen' | 'lunch' | 'dinner')[] = ['tiffen', 'lunch', 'dinner'];

  const visibleCategories = hallDuration
    ? getAllowedCateringCategories(hallDuration, hallStartTime, hallHalfMode)
    : categories;
  const categoryLabel = visibleCategories.length === 1
    ? visibleCategories[0] === 'tiffen' ? 'Tiffin'
      : visibleCategories[0] === 'lunch' ? 'Lunch'
      : 'Dinner'
    : visibleCategories.length === 3 ? 'All menus' : null;

  const totalPlates = selectedCatering.reduce((total, sel) => total + sel.headCount, 0);
  const totalPrice = selectedCatering.reduce((total, sel) => {
    const pkg = cateringPackages.find(x => x.id === sel.packageId);
    return total + (pkg ? pkg.pricePerHead * sel.headCount : 0);
  }, 0);
  const totalAddOnsPrice = selectedCateringAddOns.reduce((total, sel) => {
    const addon = cateringAddOns.find(x => x.id === sel.id);
    return total + (addon ? addon.price * sel.qty : 0);
  }, 0);

  const clampHeadCount = (value: number) => Math.max(MIN_HEADCOUNT, Math.round(value / HEADCOUNT_STEP) * HEADCOUNT_STEP);

  return (
    <section id="catering" className="pb-28 pt-20 px-4 bg-secondary/30">
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

        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border/70 bg-muted/70 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground">
            {hallDuration ? (
              categoryLabel ? (
                <span>Showing the <span className="font-semibold text-foreground">{categoryLabel}</span> menu for your selected hall booking.</span>
              ) : (
                <span>No menu is available for the selected hall time. Adjust your start time or plan to enable catering.</span>
              )
            ) : (
              <span>Select a hall booking plan and time above to filter available catering menus.</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 rounded-2xl overflow-hidden">
          <img src={catering1} alt="Morning Tiffen" className="w-full h-48 object-cover rounded-xl" loading="lazy" width={768} height={512} />
          <img src={catering2} alt="Lunch Feast" className="w-full h-48 object-cover rounded-xl" loading="lazy" width={768} height={512} />
          <img src={catering3} alt="Dinner Spread" className="w-full h-48 object-cover rounded-xl" loading="lazy" width={768} height={512} />
        </div>

        <div className="space-y-12">
          {visibleCategories.length > 0 ? visibleCategories.map(cat => {
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
                          <div className="ml-7 flex flex-col gap-3 mt-3 rounded-lg bg-muted p-3 md:flex-row md:items-center md:justify-between">
                            <span className="text-sm font-semibold text-foreground">Plates:</span>
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-lg px-0 text-lg"
                                onClick={() => setCateringHeadCount(pkg.id, clampHeadCount((sel?.headCount ?? MIN_HEADCOUNT) - HEADCOUNT_STEP))}
                                aria-label={`Decrease ${pkg.name} plates`}
                              >
                                −
                              </Button>
                              <Input
                                type="number"
                                min={MIN_HEADCOUNT}
                                step={HEADCOUNT_STEP}
                                value={sel?.headCount ?? MIN_HEADCOUNT}
                                onChange={e => setCateringHeadCount(pkg.id, clampHeadCount(Number(e.target.value)))}
                                className="w-24 h-10 text-sm"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-lg px-0 text-lg"
                                onClick={() => setCateringHeadCount(pkg.id, clampHeadCount((sel?.headCount ?? MIN_HEADCOUNT) + HEADCOUNT_STEP))}
                                aria-label={`Increase ${pkg.name} plates`}
                              >
                                +
                              </Button>
                            </div>
                            <span className="text-sm font-bold text-primary">
                              = {formatPrice(pkg.pricePerHead * (sel?.headCount ?? MIN_HEADCOUNT))}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          }) : (
            <div className="rounded-3xl border border-border/70 bg-muted p-8 text-center text-sm text-muted-foreground">
              No catering menu is available at the selected time. Please choose 01:00–10:00, 11:00–15:00 or 16:00–22:00.
            </div>
          )}
        </div>

        <div className="mt-16 rounded-3xl border border-border/70 bg-muted/30 p-8">
          <h3 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
            Add-On Menu Items
          </h3>
          {(visibleCategories.includes('lunch') || visibleCategories.includes('dinner')) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cateringAddOns.map((addon) => {
                const sel = selectedCateringAddOns.find(x => x.id === addon.id);
                const isSelected = !!sel;
                return (
                  <label
                    key={addon.id}
                    className={`glass-card p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                      isSelected ? 'ring-2 ring-primary bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCateringAddOn(addon.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{addon.icon}</span>
                          <p className="font-semibold text-foreground text-sm">{addon.name}</p>
                        </div>
                        <p className="text-primary font-bold">{formatPrice(addon.price)}</p>
                        <p className="text-muted-foreground text-xs mb-2">{addon.unit}</p>
                        {isSelected && (
                          <div className="flex items-center gap-2 mt-3 bg-muted p-2 rounded-lg">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 rounded px-0 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (sel && sel.qty > 1) {
                                  setCateringAddOnQty(addon.id, sel.qty - 1);
                                }
                              }}
                              aria-label="Decrease quantity"
                            >
                              −
                            </Button>
                            <Input
                              type="number"
                              min={1}
                              value={sel?.qty ?? 1}
                              onChange={(e) => setCateringAddOnQty(addon.id, Math.max(1, Number(e.target.value)))}
                              className="w-16 h-7 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 rounded px-0 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCateringAddOnQty(addon.id, (sel?.qty ?? 1) + 1);
                              }}
                              aria-label="Increase quantity"
                            >
                              +
                            </Button>
                            <span className="text-xs font-semibold text-primary ml-auto">
                              {formatPrice(addon.price * (sel?.qty ?? 1))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-muted p-8 text-center text-sm text-muted-foreground">
              <p>Add-on items are only available for Lunch and Dinner menus.</p>
              <p className="mt-2 text-xs">Please select a lunch or dinner time slot to see available add-ons.</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 left-0 right-0 z-20 mx-auto mt-8 w-full max-w-6xl rounded-t-3xl border border-border/70 bg-background/95 px-4 py-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Catering summary</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{totalPlates} plates</p>
            </div>
            <div className="space-y-2 text-right">
              {totalPrice > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Catering Total</p>
                  <p className="font-semibold text-primary">{formatPrice(totalPrice)}</p>
                </div>
              )}
              {totalAddOnsPrice > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Add-Ons Total</p>
                  <p className="font-semibold text-primary">{formatPrice(totalAddOnsPrice)}</p>
                </div>
              )}
              <div className="pt-2 border-t border-border">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Grand Total</p>
                <p className="mt-1 text-2xl font-bold text-primary">{formatPrice(totalPrice + totalAddOnsPrice)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
