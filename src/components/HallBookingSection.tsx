import { motion } from 'framer-motion';
import { hallDurations, additionalCharges, formatPrice, parseTimeToMinutes, formatMinutesToTime } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Zap, Trash2, Flame, PlugZap } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import sikaraLogo from '@/assets/sikara-logo.png';


const chargeIcons: Record<string, React.ReactNode> = {
  'electricity': <Zap className="w-5 h-5 text-primary" />,
  'cleaning': <Trash2 className="w-5 h-5 text-primary" />,
  'gas': <Flame className="w-5 h-5 text-primary" />,
  'generator': <PlugZap className="w-5 h-5 text-primary" />,
};

const convertTo12Hour = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const HallBookingSection = () => {
  const {
    hallDuration,
    hallStartTime,
    hallEndTime,
    hallHalfMode,
    eventDate,
    setHallDuration,
    setHallStartTime,
    setHallEndTime,
    setHallHalfMode,
  } = useBookingStore();

  const [startAmPm, setStartAmPm] = useState<'AM' | 'PM'>('AM');
  const [endAmPm, setEndAmPm] = useState<'AM' | 'PM'>('PM');

  const selectedDateLabel = eventDate ? format(eventDate, 'PPP') : 'Select a date first';

  const computeEndTime = (start: string) => formatMinutesToTime(parseTimeToMinutes(start) + 240);

  const handle4HourStart = (value: string) => {
    setHallStartTime(value);
    setHallEndTime(computeEndTime(value));
  };

  const timeBlockMessage = () => {
    if (!eventDate) return 'Choose an event date first.';
    if (!hallDuration) return 'Choose a hall booking plan.';
    if (hallDuration === '4hrs' && !hallStartTime) return 'Pick a start time for your 4-hour plan.';
    if (hallDuration === 'half' && !hallHalfMode) return 'Select a half-day mode: morning or evening.';
    if (hallDuration === 'full') return 'Full day booking from evening to evening.';
    return '';
  };

  const selectedTimeRange = hallDuration === '4hrs'
    ? hallStartTime && hallEndTime ? `${convertTo12Hour(hallStartTime)} - ${convertTo12Hour(hallEndTime)}` : 'Not set'
    : hallDuration === 'half'
      ? hallHalfMode === 'morning'
        ? '5:00 AM - 4:00 PM (Tiffin + Lunch)'
        : hallHalfMode === 'evening'
          ? '2:00 PM - 10:00 PM (Lunch + Dinner)'
          : 'Select mode'
      : hallDuration === 'full'
        ? '4:00 PM - 4:00 PM Next Day'
        : 'Not selected';

  return (
    <section id="hall" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <img src={sikaraLogo} alt="Sikara Mahal" className="h-20 w-auto mx-auto mb-4" width={80} height={80} />
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">🏛️ Venue</span>
          <h2 className="section-title mt-2">Mandapam Charges</h2>
          <p className="section-subtitle mt-3">Choose your booking duration</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {hallDurations.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                const nextValue = hallDuration === d.id ? null : d.id;
                setHallDuration(nextValue);
                if (nextValue !== 'half') setHallHalfMode('');
                if (nextValue !== '4hrs') {
                  setHallStartTime('');
                  setHallEndTime('');
                }
                if (nextValue === 'half' && !hallHalfMode) setHallHalfMode('morning');
              }}
              className={`glass-card p-8 text-left transition-all cursor-pointer hover:scale-[1.02] ${
                hallDuration === d.id
                  ? 'ring-2 ring-primary border-primary bg-accent'
                  : ''
              }`}
            >
              <h3 className="font-display text-xl font-bold text-foreground">{d.label}</h3>
              <p className="text-muted-foreground text-sm mt-1">{d.timing}</p>
              <p className="text-3xl font-bold text-primary mt-4">{formatPrice(d.price)}</p>
              <p className="text-muted-foreground text-xs mt-1">+ additional charges</p>
            </motion.button>
          ))}
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected event date</p>
              <p className="text-lg font-semibold text-foreground">{selectedDateLabel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selected booking range</p>
              <p className="text-lg font-semibold text-foreground">{selectedTimeRange}</p>
            </div>
          </div>

          {hallDuration === '4hrs' && (
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">4-Hour Start Time</label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1 rounded-xl border border-border/70 bg-muted px-4 py-3">
                    <p className="text-sm text-muted-foreground">Selected Start</p>
                    <p className="text-lg font-semibold text-foreground">{hallStartTime ? convertTo12Hour(hallStartTime) : '--:-- AM'}</p>
                  </div>
                  <input
                    type="time"
                    value={hallStartTime}
                    onChange={(e) => handle4HourStart(e.target.value)}
                    min="05:00"
                    max="22:00"
                    className="hidden"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => setStartAmPm('AM')}
                      className={`px-3 py-3 rounded-lg font-semibold text-sm transition ${
                        startAmPm === 'AM'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => setStartAmPm('PM')}
                      className={`px-3 py-3 rounded-lg font-semibold text-sm transition ${
                        startAmPm === 'PM'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
                <input
                  type="time"
                  value={hallStartTime}
                  onChange={(e) => handle4HourStart(e.target.value)}
                  min="05:00"
                  max="22:00"
                  className="mt-2 w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              
              <div className="rounded-3xl border border-border/70 bg-accent/30 p-4">
                <p className="text-sm text-muted-foreground">Auto-Calculated End Time</p>
                <div className="mt-2 flex gap-2 items-center justify-between">
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-primary">{hallEndTime ? convertTo12Hour(hallEndTime) : '--:-- PM'}</p>
                    <p className="text-xs text-muted-foreground mt-1">(+4 hours from start)</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEndAmPm('AM')}
                      className={`px-3 py-2 rounded font-semibold text-sm transition ${
                        endAmPm === 'AM'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-muted-foreground border border-border'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => setEndAmPm('PM')}
                      className={`px-3 py-2 rounded font-semibold text-sm transition ${
                        endAmPm === 'PM'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-muted-foreground border border-border'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {hallDuration === 'half' && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setHallHalfMode('morning')}
                  className={`rounded-3xl border p-4 text-left transition ${hallHalfMode === 'morning' ? 'border-primary bg-accent' : 'border-border/70 bg-background'}`}
                >
                  <p className="font-semibold text-foreground">Morning Half</p>
                  <p className="text-sm text-muted-foreground mt-1">05:00 AM – 04:00 PM</p>
                  <p className="text-xs text-muted-foreground mt-2">Includes: Tiffin + Lunch</p>
                </button>
                <button
                  type="button"
                  onClick={() => setHallHalfMode('evening')}
                  className={`rounded-3xl border p-4 text-left transition ${hallHalfMode === 'evening' ? 'border-primary bg-accent' : 'border-border/70 bg-background'}`}
                >
                  <p className="font-semibold text-foreground">Evening Half</p>
                  <p className="text-sm text-muted-foreground mt-1">02:00 PM – 10:00 PM</p>
                  <p className="text-xs text-muted-foreground mt-2">Includes: Lunch + Dinner</p>
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">Additional Charges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalCharges.map((c) => (
              <div key={c.id} className="glass-card p-5 flex items-start gap-3">
                {chargeIcons[c.id] || <Zap className="w-5 h-5 text-primary" />}
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-foreground text-sm">{c.label}</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>{c.unit}</TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-primary font-bold mt-1">{c.rate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HallBookingSection;
