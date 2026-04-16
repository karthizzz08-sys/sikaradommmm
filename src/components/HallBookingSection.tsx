import { motion } from 'framer-motion';
import { hallDurations, additionalCharges, formatPrice, parseTimeToMinutes, formatMinutesToTime } from '@/lib/bookingData';
import { useBookingStore } from '@/lib/bookingStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Zap, Trash2, Flame, PlugZap, AlertCircle, Lock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import sikaraLogo from '@/assets/sikara-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingSlot {
  start_time: string;
  end_time: string;
  updated_at?: string;
}


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
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [manualTimeMode, setManualTimeMode] = useState(false);
  const [redBlockedDates, setRedBlockedDates] = useState<Date[]>([]);

  const selectedDateLabel = eventDate ? format(eventDate, 'PPP') : 'Select a date first';

  // Fetch bookings for the selected date
  useEffect(() => {
    if (eventDate) {
      fetchBookingsForDate();
    }
  }, [eventDate]);

  // Fetch all red blocked dates (>= 15 hours after 5am)
  useEffect(() => {
    fetchRedBlockedDates();
  }, []);

  const fetchBookingsForDate = async () => {
    const dateStr = format(eventDate!, 'yyyy-MM-dd');
    const { data } = await supabase
      .from('bookings')
      .select('start_time, end_time, updated_at')
      .eq('date', dateStr);
    
    if (data) {
      setBookings(data as BookingSlot[]);
    } else {
      setBookings([]);
    }
  };

  // Fetch all dates with >= 15 hours blocked after 5am
  const fetchRedBlockedDates = async () => {
    const { data } = await supabase.from('bookings').select('date, start_time, end_time');
    if (data) {
      const redDates: Date[] = [];
      const dateMap = new Map<string, Array<{start_time: string, end_time: string}>>();
      
      data.forEach(booking => {
        const dateStr = booking.date;
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, []);
        }
        dateMap.get(dateStr)!.push({start_time: booking.start_time, end_time: booking.end_time});
      });
      
      dateMap.forEach((bookings, dateStr) => {
        let totalBlockedMinutes = 0;
        const DAY_START_MINUTES = 5 * 60; // 5am = 300 minutes
        
        bookings.forEach(booking => {
          const [startH, startM] = booking.start_time.split(':').map(Number);
          const [endH, endM] = booking.end_time.split(':').map(Number);
          let startMinutes = startH * 60 + startM;
          let endMinutes = endH * 60 + endM;
          
          if (endMinutes > DAY_START_MINUTES) {
            startMinutes = Math.max(startMinutes, DAY_START_MINUTES);
            totalBlockedMinutes += (endMinutes - startMinutes);
          }
        });
        
        const totalBlockedHours = totalBlockedMinutes / 60;
        if (totalBlockedHours >= 15) {
          redDates.push(new Date(dateStr + 'T00:00:00'));
        }
      });
      
      setRedBlockedDates(redDates);
    }
  };

  // Check if booking duration overlaps with blocked times (with 1-hour buffer after blocked times)
  const checkDurationOverlap = (hour: string, durationHours: number): { conflicts: boolean; conflictingBooking?: BookingSlot; endTime?: string } => {
    const [startH, startM] = hour.split(':').map(Number);
    const startMinutes = startH * 60 + (startM || 0);
    const endMinutes = startMinutes + (durationHours * 60);
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    
    // Check if booking duration overlaps with any blocked time (including 1-hour buffer after blocked time)
    const conflictingBooking = bookings.find(booking => {
      const [bookH, bookM] = booking.start_time.split(':').map(Number);
      const [bookEndH, bookEndM] = booking.end_time.split(':').map(Number);
      const bookStart = bookH * 60 + bookM;
      let bookEnd = bookEndH * 60 + bookEndM;
      
      // Add 1-hour buffer after blocked time ends
      bookEnd += 60;
      
      // Check overlap: if booking starts before blocked ends (with buffer) AND booking ends after blocked starts
      return startMinutes < bookEnd && endMinutes > bookStart;
    });
    
    return {
      conflicts: !!conflictingBooking,
      conflictingBooking,
      endTime: endTimeStr
    };
  };

  // Calculate available time slots for the day
  const getAvailableSlots = (): Array<{ start: string; end: string }> => {
    if (bookings.length === 0) {
      return [{ start: '00:00', end: '23:59' }];
    }
    
    // Sort bookings by start time
    const sortedBookings = [...bookings].sort((a, b) => {
      const aStart = parseInt(a.start_time.replace(':', ''));
      const bStart = parseInt(b.start_time.replace(':', ''));
      return aStart - bStart;
    });
    
    const availableSlots: Array<{ start: string; end: string }> = [];
    
    // Check if there's time before first booking
    const firstBooking = sortedBookings[0];
    const [firstH, firstM] = firstBooking.start_time.split(':').map(Number);
    const firstStartMinutes = firstH * 60 + firstM;
    
    if (firstStartMinutes > 0) {
      availableSlots.push({
        start: '00:00',
        end: firstBooking.start_time
      });
    }
    
    // Find gaps between bookings
    for (let i = 0; i < sortedBookings.length - 1; i++) {
      const currentBooking = sortedBookings[i];
      const nextBooking = sortedBookings[i + 1];
      
      const currentEnd = currentBooking.end_time;
      const nextStart = nextBooking.start_time;
      
      const [currentEndH, currentEndM] = currentEnd.split(':').map(Number);
      const [nextStartH, nextStartM] = nextStart.split(':').map(Number);
      const currentEndMinutes = currentEndH * 60 + currentEndM;
      const nextStartMinutes = nextStartH * 60 + nextStartM;
      
      if (currentEndMinutes < nextStartMinutes) {
        availableSlots.push({
          start: currentEnd,
          end: nextStart
        });
      }
    }
    
    // Check if there's time after last booking
    const lastBooking = sortedBookings[sortedBookings.length - 1];
    const [lastEndH, lastEndM] = lastBooking.end_time.split(':').map(Number);
    const lastEndMinutes = lastEndH * 60 + lastEndM;
    
    if (lastEndMinutes < 24 * 60 - 1) {
      availableSlots.push({
        start: lastBooking.end_time,
        end: '23:59'
      });
    }
    
    return availableSlots;
  };

  const computeEndTime = (start: string) => formatMinutesToTime(parseTimeToMinutes(start) + 240);

  const preset4HourSlots = [
    { id: 'morning', start: '10:00', end: '14:00', label: '10:00 AM - 2:00 PM' },
    { id: 'evening', start: '18:00', end: '22:00', label: '6:00 PM - 10:00 PM' },
  ];

  const handle4HourPreset = (slot: typeof preset4HourSlots[0]) => {
    const { conflicts, conflictingBooking } = checkDurationOverlap(slot.start, 4);
    
    if (conflicts && conflictingBooking) {
      toast.error(
        `❌ This time slot is not available.\n\n` +
        `Your booking: ${convertTo12Hour(slot.start)} - ${convertTo12Hour(slot.end)}\n` +
        `Blocked: ${convertTo12Hour(conflictingBooking.start_time)} - ${convertTo12Hour(conflictingBooking.end_time)}\n` +
        `Please choose another time.`
      );
      return;
    }
    
    setHallStartTime(slot.start);
    setHallEndTime(slot.end);
    toast.success(`✅ Selected: ${slot.label} (4-hour booking)`);
    
    // Scroll to decoration section
    setTimeout(() => {
      const decorationSection = document.getElementById('decoration');
      if (decorationSection) {
        decorationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handle4HourStart = (value: string) => {
    const { conflicts, conflictingBooking, endTime } = checkDurationOverlap(value, 4);
    
    if (conflicts && conflictingBooking) {
      toast.error(
        `❌ This time slot is not available for 4-hour booking.\n\n` +
        `Your booking: ${convertTo12Hour(value)} - ${convertTo12Hour(endTime!)}\n` +
        `Blocked: ${convertTo12Hour(conflictingBooking.start_time)} - ${convertTo12Hour(conflictingBooking.end_time)}\n` +
        `Please choose another time.`
      );
      return;
    }
    
    setHallStartTime(value);
    setHallEndTime(computeEndTime(value));
    toast.success(`✅ Selected: ${convertTo12Hour(value)} - ${convertTo12Hour(endTime!)} (4-hour booking)`);
    
    // Scroll to decoration section
    setTimeout(() => {
      const decorationSection = document.getElementById('decoration');
      if (decorationSection) {
        decorationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  // Check if selected date is a red blocked date (>= 15 hours after 5am)
  const isDateRedBlocked = (): boolean => {
    if (!eventDate) return false;
    return redBlockedDates.some(d => d.toDateString() === eventDate.toDateString());
  };

  // Check if half-day plan conflicts with blocked times (without buffer)
  const checkHalfDayConflict = (mode: 'morning' | 'evening'): boolean => {
    // Special logic for evening plan: if owner update is before 4 PM, show as available (green)
    if (mode === 'evening') {
      const latestUpdate = bookings
        .filter(b => b.updated_at)
        .map(b => new Date(b.updated_at!))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      
      if (latestUpdate) {
        const updateHour = latestUpdate.getHours();
        // If owner update time is before 4 PM (16:00), evening plan is green/available
        if (updateHour < 16) {
          return false; // Not conflicting, show as green
        }
      }
    }
    
    const timeRange = mode === 'morning' 
      ? { start: '05:00', end: '16:00' }
      : { start: '18:00', end: '22:00' };

    const startMinutes = parseTimeToMinutes(timeRange.start);
    const endMinutes = parseTimeToMinutes(timeRange.end);

    return bookings.some(booking => {
      const bookStart = parseTimeToMinutes(booking.start_time);
      const bookEnd = parseTimeToMinutes(booking.end_time);
      
      return startMinutes < bookEnd && endMinutes > bookStart;
    });
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
          ? '6:00 PM - 10:00 PM (Dinner)'
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

        {isDateRedBlocked() ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-lg text-center"
          >
            <div className="text-4xl mb-3">🔴</div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Hall Booking Not Available</h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              This date is fully booked. Hall bookings are not available for this date.
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Please select a different date or explore other services below.
            </p>
          </motion.div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {hallDurations.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              disabled={d.id === 'full' && isDateRedBlocked()}
              onClick={() => {
                const nextValue = hallDuration === d.id ? null : d.id;
                setHallDuration(nextValue);
                if (nextValue !== 'half') setHallHalfMode('');
                if (nextValue !== '4hrs') {
                  setHallStartTime('');
                  setHallEndTime('');
                }
                if (nextValue === 'half' && !hallHalfMode) setHallHalfMode('morning');
                
                // Scroll to timing section when 4 hours is selected
                if (nextValue === '4hrs') {
                  setTimeout(() => {
                    const timingSection = document.getElementById('hall-4hrs-timing');
                    if (timingSection) {
                      timingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 150);
                }

                // Scroll to timing section when half day is selected
                if (nextValue === 'half') {
                  setTimeout(() => {
                    const timingSection = document.getElementById('hall-half-timing');
                    if (timingSection) {
                      timingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 150);
                }

                // Scroll to timing section when full day is selected
                if (nextValue === 'full') {
                  setTimeout(() => {
                    const timingSection = document.getElementById('hall-full-timing');
                    if (timingSection) {
                      timingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 150);
                }
              }}
              className={`glass-card p-8 text-left transition-all ${
                d.id === 'full' && isDateRedBlocked()
                  ? 'cursor-not-allowed opacity-60 border-red-400 bg-red-50/30 dark:bg-red-900/10'
                  : 'cursor-pointer hover:scale-[1.02]'
              } ${
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
            <div id="hall-4hrs-timing" className="mt-6 flex flex-col gap-4">

              {/* Extra Hour Pricing Alert */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Extra Hour Pricing</p>
                  <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">If you need more than 4 hours, one additional hour costs <strong>₹5,000</strong></p>
                </div>
              </div>

              {/* Preset Time Slots */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">4-Hour Plan - Preset Options</label>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {preset4HourSlots.map((slot) => {
                    const { conflicts } = checkDurationOverlap(slot.start, 4);
                    const isSelected = hallStartTime === slot.start && hallEndTime === slot.end;
                    const isAvailable = !conflicts;
                    
                    return (
                      <motion.button
                        key={slot.id}
                        onClick={() => handle4HourPreset(slot)}
                        disabled={!isAvailable}
                        whileHover={isAvailable ? { scale: 1.02 } : {}}
                        whileTap={isAvailable ? { scale: 0.98 } : {}}
                        initial={!isAvailable ? { opacity: 0.8 } : { opacity: 1 }}
                        animate={!isAvailable ? { opacity: [0.8, 1, 0.8], transition: { duration: 2, repeat: Infinity } } : { opacity: 1 }}
                        className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md'
                            : isAvailable
                            ? 'border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10 hover:border-green-500 hover:shadow-md cursor-pointer'
                            : 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 cursor-not-allowed'
                        }`}
                      >
                        {!isAvailable && (
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-red-200 to-transparent dark:from-red-700 opacity-30 pointer-events-none"
                            animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        )}
                        <div className="flex items-center justify-between relative z-10">
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{slot.label}</p>
                              {isAvailable ? (
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </motion.div>
                              ) : (
                                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                  <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </motion.div>
                              )}
                            </div>
                            <p className={`text-xs mt-1 ${
                              isAvailable 
                                ? 'text-green-700 dark:text-green-300' 
                                : 'text-red-700 dark:text-red-300'
                            }`}>
                              {isAvailable ? '✓ Available' : '🔒 Unavailable'}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Manual Time Selection */}
              <div className="border-t border-border/70 pt-4">
                <button
                  onClick={() => setManualTimeMode(!manualTimeMode)}
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition flex items-center gap-2"
                >
                  <span className={`transition-transform ${manualTimeMode ? 'rotate-90' : ''}`}>▶</span>
                  {manualTimeMode ? 'Hide Manual Time Selection' : 'Select Time Manually'}
                </button>

                {manualTimeMode && (
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-foreground">Choose Start Time</label>
                      <input
                        type="time"
                        value={hallStartTime}
                        onChange={(e) => handle4HourStart(e.target.value)}
                        min="05:00"
                        max="22:00"
                        className="w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Select a start time between 5:00 AM and 10:00 PM</p>
                    </div>

                    {hallStartTime && (
                      <div className="rounded-3xl border border-border/70 bg-accent/30 p-4">
                        <p className="text-sm text-muted-foreground">Auto-Calculated End Time</p>
                        <div className="mt-3">
                          <p className="text-2xl font-bold text-primary">{hallEndTime ? convertTo12Hour(hallEndTime) : '--:-- PM'}</p>
                          <p className="text-xs text-muted-foreground mt-1">(+4 hours from start)</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {hallDuration === 'half' && (
            <div id="hall-half-timing" className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { id: 'morning', label: 'Morning Half', time: '05:00 AM – 04:00 PM', description: 'Tiffin + Lunch' },
                  { id: 'evening', label: 'Evening Half', time: '06:00 PM – 10:00 PM', description: 'Dinner' }
                ].map((half) => {
                  const isConflict = checkHalfDayConflict(half.id as 'morning' | 'evening');
                  const isRedBlockedEvening = half.id === 'evening' && isDateRedBlocked();
                  const isSelected = hallHalfMode === half.id;
                  const isAvailable = !isConflict && !isRedBlockedEvening;

                  return (
                    <motion.button
                      key={half.id}
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          setHallHalfMode(half.id as 'morning' | 'evening');
                          toast.success(`✅ Selected: ${half.label}`);
                          
                          // Scroll to decoration section
                          setTimeout(() => {
                            const decorationSection = document.getElementById('decoration');
                            if (decorationSection) {
                              decorationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 300);
                        }
                      }}
                      disabled={!isAvailable}
                      whileHover={isAvailable ? { scale: 1.02 } : {}}
                      whileTap={isAvailable ? { scale: 0.98 } : {}}
                      initial={!isAvailable ? { opacity: 0.8 } : { opacity: 1 }}
                      animate={!isAvailable ? { opacity: [0.8, 1, 0.8], transition: { duration: 2, repeat: Infinity } } : { opacity: 1 }}
                      className={`rounded-3xl border p-4 text-left transition relative overflow-hidden ${
                        isSelected
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md'
                          : isAvailable
                          ? 'border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10 hover:border-green-500 hover:shadow-md cursor-pointer'
                          : 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20 cursor-not-allowed'
                      }`}
                    >
                      {!isAvailable && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-red-200 to-transparent dark:from-red-700 opacity-30 pointer-events-none"
                          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      )}
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold ${isAvailable ? 'text-foreground' : 'text-red-600 dark:text-red-400'}`}>{half.label}</p>
                            {isAvailable ? (
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </motion.div>
                            ) : (
                              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </motion.div>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${isAvailable ? 'text-muted-foreground' : 'text-red-600 dark:text-red-400'}`}>{half.time}</p>
                          <p className={`text-xs mt-2 ${isAvailable ? 'text-muted-foreground' : 'text-red-600 dark:text-red-400'}`}>Includes: {half.description}</p>
                          <p className={`text-xs mt-2 font-semibold ${
                            isAvailable 
                              ? 'text-green-700 dark:text-green-300' 
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            {isAvailable ? '✓ Available' : '🔒 Unavailable'}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {hallDuration === 'full' && (
            <motion.div
              id="hall-full-timing"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="mt-6 space-y-6"
            >
              {/* Full Day Plan Overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700/50 rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.div>
                  <h3 className="font-bold text-lg text-foreground">Full Day Plan Selected</h3>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-purple-900 dark:text-purple-100 font-medium">Your booking time:</p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-purple-200 dark:border-purple-700/50"
                  >
                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Start Time</p>
                      <p className="text-2xl font-bold text-primary">4:00 PM</p>
                      <p className="text-xs text-muted-foreground mt-1 uppercase">Today</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 px-4">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                        className="text-2xl"
                      >
                        →
                      </motion.div>
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">24 Hours</p>
                    </div>

                    <div className="text-center flex-1">
                      <p className="text-xs text-muted-foreground mb-1">End Time</p>
                      <p className="text-2xl font-bold text-primary">4:00 PM</p>
                      <p className="text-xs text-muted-foreground mt-1 uppercase">Next Day</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700"
                  >
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 text-center">
                      📅 {selectedDateLabel} to next day at 4:00 PM
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </div>
        </>
        )}

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
