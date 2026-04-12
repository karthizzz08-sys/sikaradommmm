  import { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import { Calendar } from '@/components/ui/calendar';
  import { CalendarCheck, Clock, Lock } from 'lucide-react';
  import { supabase } from '@/integrations/supabase/client';
  import { useBookingStore } from '@/lib/bookingStore';
  import { Button } from '@/components/ui/button';
  import { format } from 'date-fns';
  import { toast } from 'sonner';
  import { getAvailableSlots } from '@/lib/timeSlots';
  import { formatTimeToAmPm } from '@/lib/bookingData';

  interface BookingSlot {
    start_time: string;
    end_time: string;
  }

  const AvailabilityChecker = () => {
    const [selected, setSelected] = useState<Date | undefined>();
    const [bookings, setBookings] = useState<BookingSlot[]>([]);
    const [availableSlots, setAvailableSlots] = useState<Array<{ start: string; end: string }>>([]);
    const [selectedHour, setSelectedHour] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const store = useBookingStore();

    // Fetch all booked dates for calendar coloring
    useEffect(() => {
      fetchAllBookedDates();
    }, []);

    const fetchAllBookedDates = async () => {
      const { data } = await supabase.from('bookings').select('date');
      if (data) {
        setBookedDates(data.map(d => new Date(d.date + 'T00:00:00')));
      }
    };

    // Fetch bookings for selected date
    useEffect(() => {
      if (selected) {
        fetchBookingsForDate();
      }
    }, [selected]);

    const fetchBookingsForDate = async () => {
      setLoading(true);
      const dateStr = format(selected!, 'yyyy-MM-dd');
      const { data } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('date', dateStr);
      
      if (data) {
        setBookings(data as BookingSlot[]);
        const available = getAvailableSlots(data);
        setAvailableSlots(available);
      } else {
        setBookings([]);
        setAvailableSlots([{ start: '00:00', end: '23:59' }]);
      }
      setSelectedHour(null);
      setLoading(false);

      // Auto-scroll to availability slots on mobile for booked dates
      const isBooked = data && data.length > 0;
      if (isBooked && window.innerWidth < 768) {
        // Delay to allow DOM to update
        setTimeout(() => {
          const el = document.querySelector('[data-availability-slots]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    // Check if a specific hour is booked
    const isHourBooked = (hour: number): boolean => {
      return bookings.some(booking => {
        const [startH, startM] = booking.start_time.split(':').map(Number);
        const [endH, endM] = booking.end_time.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        const hourMinutes = hour * 60;
        const nextHourMinutes = (hour + 1) * 60;
        return hourMinutes < endMinutes && nextHourMinutes > startMinutes;
      });
    };

    // Generate hourly display for all 24 hours with booking status
    const getHourlyDisplay = () => {
      const allHours: { hour: string; available: boolean }[] = [];
      
      // Generate all 24 hours (00:00 to 23:00)
      for (let h = 0; h < 24; h++) {
        const hour = `${String(h).padStart(2, '0')}:00`;
        // Hour is available if it's NOT booked
        const available = !isHourBooked(h);
        allHours.push({ hour, available });
      }
      return allHours;
    };

    const handleSelectHour = (hour: string) => {
      setSelectedHour(hour);
      store.setEventDate(selected!);
      toast.success(`✅ Selected: ${formatTimeToAmPm(hour)}`);
      // Scroll to booking section
      const el = document.getElementById('hall');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // Check if selected date is a booked date (violet)
    const isSelectedDateBooked = selected
      ? bookedDates.some(d => d.toDateString() === selected.toDateString())
      : false;

    return (
      <section id="availability" className="min-h-screen w-full flex flex-col items-center justify-center py-8 md:py-12 px-4">
        <div className="w-full max-w-6xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 w-full"
          >
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              <CalendarCheck className="inline w-4 h-4 mr-1" /> Availability
            </span>
            <h2 className="section-title mt-2">Check Availability</h2>
            <p className="section-subtitle mt-3">Select a date and time to check availability</p>
          </motion.div>

          <div className="w-full flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 max-w-5xl">
            {/* Calendar Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-slate-200 dark:border-slate-700"
            >
            <div className="p-6 w-full flex flex-col justify-start items-center">
              <h3 className="font-bold text-lg text-foreground mb-6 text-center">📅 Select Date</h3>
              <Calendar
                mode="single"
                selected={selected}
                onSelect={setSelected}
                disabled={(date) => date < new Date()}
                className="p-3 pointer-events-auto"
                modifiers={{ booked: bookedDates }}
                modifiersStyles={{
                  booked: { backgroundColor: '#a78bfa', color: '#fff', fontWeight: 'bold' },
                }}
              />
              <div className="flex gap-4 mt-6 text-xs justify-center items-center flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50">
                  <span className="w-3 h-3 rounded bg-green-500 border border-green-600" />
                  <span className="text-foreground font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: '#a78bfa', borderColor: '#a78bfa' }}></span>
                  <span className="text-foreground font-medium">Booked</span>
                </div>
              </div>

              {/* Green date - Show quick selection button in calendar section */}
              {selected && !isSelectedDateBooked && (
                <Button
                  onClick={() => {
                    store.setEventDate(selected);
                    const el = document.getElementById('hall');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full mt-6 gradient-violet text-primary-foreground py-6 text-base font-semibold"
                >
                  Select this date
                </Button>
              )}
            </div>
            </motion.div>

            {/* Available times - Only show for violet (booked) dates */}
            {selected && isSelectedDateBooked && (
              <motion.div
                data-availability-slots
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full md:flex-1 md:max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 flex flex-col justify-start"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      Available Time Slots
                    </h3>
                  </div>
                  {loading ? (
                    <div className="text-muted-foreground text-sm">Loading...</div>
                  ) : (
                    <>
                      {/* Booked times */}
                    {bookings.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/30 dark:to-red-900/30 border-0 shadow-sm"
                      >
                        <p className="font-semibold text-red-700 dark:text-red-300 text-sm mb-3">❌ Booked Times:</p>
                        <div className="flex flex-wrap gap-2">
                          {bookings.map((b, idx) => (
                            <div key={idx} className="px-3 py-2 rounded-lg bg-red-200/40 dark:bg-red-800/40 text-xs font-medium text-red-700 dark:text-red-300 backdrop-blur-sm">
                              {formatTimeToAmPm(b.start_time)} – {formatTimeToAmPm(b.end_time)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Available time ranges */}
                    {availableSlots.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-0 shadow-sm"
                      >
                        <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-3">📍 Available Ranges:</p>
                        <div className="flex flex-wrap gap-2">
                          {availableSlots.map((slot, idx) => (
                            <div key={idx} className="px-3 py-2 rounded-lg bg-blue-200/40 dark:bg-blue-800/40 text-xs font-medium text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                              {formatTimeToAmPm(slot.start)} – {formatTimeToAmPm(slot.end)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Hourly grid - All 24 hours with booking status */}
                    <div className="mt-6">
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground">Showing all 24 hours (9:00 AM–9:00 PM) for {format(selected, 'MMMM d, yyyy')}</p>
                      </div>
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                        {getHourlyDisplay().map((slot, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={slot.available ? { scale: 1.12, y: -3 } : {}}
                            whileTap={slot.available ? { scale: 0.95 } : {}}
                            onClick={() => slot.available && handleSelectHour(slot.hour)}
                            disabled={!slot.available}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            title={slot.available ? `Available: ${formatTimeToAmPm(slot.hour)}` : `Booked: ${formatTimeToAmPm(slot.hour)}`}
                            className={`py-2 px-2 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-0.5 text-xs ${
                              slot.available
                                ? selectedHour === slot.hour
                                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-400/50 ring-2 ring-purple-300 dark:ring-purple-700 scale-105'
                                  : 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-700 dark:text-emerald-300 hover:shadow-md hover:from-emerald-200 hover:to-green-200 dark:hover:from-emerald-900/60 dark:hover:to-green-900/60 cursor-pointer border border-emerald-200 dark:border-emerald-700/50'
                                : 'bg-gradient-to-br from-rose-200 to-red-200 dark:from-rose-900/50 dark:to-red-900/50 text-rose-600 dark:text-rose-300 cursor-not-allowed opacity-60 border border-rose-300 dark:border-rose-700/50'
                            }`}
                          >
                            {!slot.available && <Lock className="w-3 h-3" />}
                            {formatTimeToAmPm(slot.hour)}
                          </motion.button>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-100 to-green-100 border border-emerald-200"></div>
                          <span className="text-foreground">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-500 to-purple-600 border border-purple-300"></div>
                          <span className="text-foreground">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                          <span className="text-foreground">Booked/Unavailable</span>
                        </div>
                      </div>
                    </div>

                    {selectedHour && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="mt-8 p-6 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border-2 border-violet-200 dark:border-violet-700/50 text-center shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30"
                      >
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500 text-white"
                          >
                            ✓
                          </motion.span>
                          <p className="font-bold text-violet-900 dark:text-violet-300 text-lg">
                            Selected: {selectedHour ? formatTimeToAmPm(selectedHour) : ''}
                          </p>
                        </div>
                        <p className="text-sm text-violet-700 dark:text-violet-400 mb-4">
                          {format(selected, 'EEEE, MMMM d, yyyy')}
                        </p>
                        <Button
                          onClick={() => {
                            store.setEventDate(selected);
                            const el = document.getElementById('hall');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full gradient-violet text-primary-foreground py-6 font-bold shadow-lg hover:shadow-xl transition-all hidden md:block"
                        >
                          Continue Booking →
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
                </div>
            </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  };

  export default AvailabilityChecker;
