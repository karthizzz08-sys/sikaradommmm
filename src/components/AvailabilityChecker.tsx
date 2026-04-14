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
      setLoading(false);

      // Auto-scroll to availability slots when booked date is selected
      const isBooked = data && data.length > 0;
      if (isBooked) {
        // Delay to allow DOM to update - longer delay for better smoothness
        setTimeout(() => {
          const el = document.querySelector('[data-availability-slots]');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
      }
    };



    // Check if selected date is a booked date (violet)
    const isSelectedDateBooked = selected
      ? bookedDates.some(d => d.toDateString() === selected.toDateString())
      : false;

    // Auto-scroll to availability slots when a booked date is selected
    useEffect(() => {
      if (selected && isSelectedDateBooked) {
        setTimeout(() => {
          const el = document.querySelector('[data-availability-slots]');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 400);
      }
    }, [selected, isSelectedDateBooked]);

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
                modifiers={{
                  booked: bookedDates,
                  selectedAvailable: selected && !bookedDates.some(bd => bd.toDateString() === selected.toDateString()) ? [selected] : []
                }}
                modifiersStyles={{
                  booked: { backgroundColor: '#a78bfa', color: '#fff', fontWeight: 'bold' },
                  selectedAvailable: { backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', border: '3px solid #059669' },
                }}
              />
              <div className="flex gap-4 mt-6 text-xs justify-center items-center flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <span className="w-3 h-3 rounded bg-gray-400 border border-gray-500" />
                  <span className="text-foreground font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50">
                  <span className="w-3 h-3 rounded bg-green-500 border border-green-600" />
                  <span className="text-foreground font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: '#a78bfa', borderColor: '#a78bfa' }}></span>
                  <span className="text-foreground font-medium">Booked</span>
                </div>
              </div>

              {/* Show quick selection button only for non-booked (available) dates */}
              {selected && !isSelectedDateBooked && (
                <div id="select-date-button">
                  <Button
                    onClick={() => {
                      store.setEventDate(selected);
                      const el = document.getElementById('hall');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full mt-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-4 px-6 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-violet-500 hover:border-violet-600 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                  >
                    Select this date 
                  </Button>
                </div>
              )}
            </div>
            </motion.div>

            {/* Available times - Only show for violet (booked) dates */}
            {selected && isSelectedDateBooked && (
              <motion.div
                data-availability-slots
                id="availability-slots"
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
                      {/* Combined Time Slots Box */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md"
                      >
                        {/* Non Available Slots */}
                        {bookings.length > 0 && (
                          <div className="mb-6">
                            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-3">❌ Non Available Slots:</p>
                            <div className="flex flex-wrap gap-2">
                              {bookings.map((b, idx) => (
                                <button
                                  key={idx}
                                  disabled
                                  className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-xs font-medium text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-700/50 cursor-not-allowed opacity-60 transition-all duration-200"
                                >
                                  {formatTimeToAmPm(b.start_time)} – {formatTimeToAmPm(b.end_time)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Available time ranges */}
                        {availableSlots.length > 0 && (
                          <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-3">✅ Available Ranges:</p>
                            <div className="flex flex-wrap gap-2">
                              {availableSlots.map((slot, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    store.setEventDate(selected!);
                                    const el = document.getElementById('hall');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700/50 hover:bg-green-200 dark:hover:bg-green-900/50 hover:border-green-400 dark:hover:border-green-600 transition-all duration-200 cursor-pointer active:scale-95"
                                >
                                  {formatTimeToAmPm(slot.start)} – {formatTimeToAmPm(slot.end)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
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
