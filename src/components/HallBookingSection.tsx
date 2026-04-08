import { motion } from 'framer-motion';
import { hallDurations, additionalCharges, formatPrice, parseTimeToMinutes, formatMinutesToTime, timeIntervalsOverlap } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Zap, Trash2, Flame, PlugZap } from 'lucide-react';
import { format } from 'date-fns';
import sikaraLogo from '@/assets/sikara-logo.png';


const chargeIcons: Record<string, React.ReactNode> = {
  'electricity': <Zap className="w-5 h-5 text-primary" />,
  'cleaning': <Trash2 className="w-5 h-5 text-primary" />,
  'gas': <Flame className="w-5 h-5 text-primary" />,
  'generator': <PlugZap className="w-5 h-5 text-primary" />,
};

const HallBookingSection = () => {
  const {
    hallDuration,
    hallStartTime,
    hallEndTime,
    hallHalfMode,
    eventDate,
    bookingHistory,
    setHallDuration,
    setHallStartTime,
    setHallEndTime,
    setHallHalfMode,
  } = useBookingStore();

  const selectedDateLabel = eventDate ? format(eventDate, 'PPP') : 'Select a date first';
  const bookingsForDate = eventDate
    ? bookingHistory.filter((b) => b.date === format(eventDate, 'dd/MM/yyyy'))
    : [];

  const computeEndTime = (start: string) => formatMinutesToTime(parseTimeToMinutes(start) + 240);

  const hasOverlap = (start: string, end: string) => bookingsForDate.some((booking) => {
    if (!booking.hallStartTime || !booking.hallEndTime) return false;
    return timeIntervalsOverlap(start, end, booking.hallStartTime, booking.hallEndTime);
  });

  const handle4HourStart = (value: string) => {
    setHallStartTime(value);
    setHallEndTime(computeEndTime(value));
  };

  const timeBlockMessage = () => {
    if (!eventDate) return 'Choose an event date first to see live availability.';
    if (!hallDuration) return 'Choose a hall booking plan to see available slots.';
    if (hallDuration === '4hrs' && !hallStartTime) return 'Pick a start time for your 4-hour plan.';
    if (hallDuration === 'half' && !hallHalfMode) return 'Select a half-day mode: morning or evening.';
    if (hallDuration === 'full') return 'Full day booking reserves evening-to-evening availability.';
    return '';
  };

  const selectedTimeRange = hallDuration === '4hrs'
    ? hallStartTime && hallEndTime ? `${hallStartTime} - ${hallEndTime}` : 'Not set'
    : hallDuration === 'half'
      ? hallHalfMode === 'morning'
        ? '01:00 - 16:00 (Tiffin + Lunch)'
        : hallHalfMode === 'evening'
          ? '16:00 - 16:00 next day (All menus)'
          : 'Select mode'
      : hallDuration === 'full'
        ? '16:00 - 16:00 next day'
        : 'Not selected';

  const conflict = hallDuration === '4hrs' && hallStartTime && hallEndTime
    ? hasOverlap(hallStartTime, hallEndTime)
    : hallDuration === 'half' && hallHalfMode
      ? bookingsForDate.some((booking) => {
          if (!booking.hallStartTime || !booking.hallEndTime) return false;
          const halfStart = hallHalfMode === 'morning' ? '01:00' : '16:00';
          const halfEnd = hallHalfMode === 'morning' ? '16:00' : '16:00';
          return timeIntervalsOverlap(halfStart, halfEnd, booking.hallStartTime, booking.hallEndTime);
        })
      : false;

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
            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] items-end">
              <div>
                <label className="text-sm font-semibold text-foreground">4-Hour Start Time</label>
                <input
                  type="time"
                  value={hallStartTime}
                  onChange={(e) => handle4HourStart(e.target.value)}
                  min="01:00"
                  max="22:00"
                  className="mt-2 w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="rounded-3xl border border-border/70 bg-muted p-4">
                <p className="text-sm text-muted-foreground">End time</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{hallEndTime || 'Auto'}</p>
              </div>
            </div>
          )}

          {hallDuration === 'half' && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setHallHalfMode('morning')}
                className={`rounded-3xl border p-4 text-left transition ${hallHalfMode === 'morning' ? 'border-primary bg-accent' : 'border-border/70 bg-background'}`}
              >
                <p className="font-semibold text-foreground">Morning Half</p>
                <p className="text-sm text-muted-foreground mt-1">01:00 AM – 04:00 PM</p>
              </button>
              <button
                type="button"
                onClick={() => setHallHalfMode('evening')}
                className={`rounded-3xl border p-4 text-left transition ${hallHalfMode === 'evening' ? 'border-primary bg-accent' : 'border-border/70 bg-background'}`}
              >
                <p className="font-semibold text-foreground">Evening Half</p>
                <p className="text-sm text-muted-foreground mt-1">04:00 PM – 04:00 PM next day</p>
              </button>
            </div>
          )}

          {eventDate && (
            <div className="mt-8 rounded-3xl border border-border/70 bg-muted p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Same-day availability</p>
              {bookingsForDate.length > 0 ? (
                <div className="space-y-3">
                  {bookingsForDate.map((booking) => (
                    <div key={booking.id} className="rounded-2xl bg-background p-3 text-sm flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{booking.hallDuration === '4hrs' ? '4-Hour booking' : booking.hallDuration === 'half' ? `Half-day (${booking.hallHalfMode})` : 'Full Day'}</p>
                        <p className="text-muted-foreground text-xs">{booking.hallStartTime} - {booking.hallEndTime}</p>
                      </div>
                      <span className="text-xs font-medium text-primary">Booked</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No bookings yet on this date. All slots are available.</p>
              )}
              {hallDuration && (
                <p className={`mt-4 text-sm ${conflict ? 'text-destructive' : 'text-foreground'}`}>
                  {timeBlockMessage()}
                  {conflict && ' This selection overlaps existing bookings.'}
                </p>
              )}
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
