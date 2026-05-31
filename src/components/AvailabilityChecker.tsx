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
    const [bookings, setBookings] = useState<BookingSlot[]>([]);
    const [availableSlots, setAvailableSlots] = useState<Array<{ start: string; end: string }>>([]);
    const [selectedHour, setSelectedHour] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [oldUpdatedDates, setOldUpdatedDates] = useState<Date[]>([]);
    const store = useBookingStore();

    // Fetch all booked dates for calendar coloring
    useEffect(() => {
      fetchAllBookedDates();
    }, []);

    const fetchAllBookedDates = async () => {
      const { data } = await supabase.from('bookings').select('date, updated_at, start_time, end_time');
      if (data) {
        const recentlyUpdatedDates: Date[] = [];
        const redUpdateDates: Date[] = [];
        
        // Group bookings by date and calculate total blocked hours after 5am
        const dateMap = new Map<string, Array<{start_time: string, end_time: string}>>();
        
        data.forEach(booking => {
          const dateStr = booking.date;
          if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, []);
          }
          dateMap.get(dateStr)!.push({start_time: booking.start_time, end_time: booking.end_time});
        });
        
        // Check total blocked hours for each date (after 5am onwards)
        dateMap.forEach((bookings, dateStr) => {
          const bookingDate = new Date(dateStr + 'T00:00:00');
          
          // Calculate total blocked hours from 5am (300 minutes) onwards
          let totalBlockedMinutes = 0;
          const DAY_START_MINUTES = 5 * 60; // 5am = 300 minutes
          
          bookings.forEach(booking => {
            const [startH, startM] = booking.start_time.split(':').map(Number);
            const [endH, endM] = booking.end_time.split(':').map(Number);
            let startMinutes = startH * 60 + startM;
            let endMinutes = endH * 60 + endM;
            
            // Only count blocked time from 5am onwards
            if (endMinutes > DAY_START_MINUTES) {
              startMinutes = Math.max(startMinutes, DAY_START_MINUTES);
              totalBlockedMinutes += (endMinutes - startMinutes);
            }
          });
          
          const totalBlockedHours = totalBlockedMinutes / 60;
          
          // If total blocked hours >= 15 after 5am, mark as red
          if (totalBlockedHours >= 15) {
            redUpdateDates.push(bookingDate);
          } else {
            // Otherwise violet (normal update)
            recentlyUpdatedDates.push(bookingDate);
          }
        });
        
        setBookedDates(recentlyUpdatedDates);
        setOldUpdatedDates(redUpdateDates);
      }
    };

    // Fetch bookings for selected date
    useEffect(() => {
      if (store.eventDate) {
        fetchBookingsForDate();
      }
    }, [store.eventDate]);

    const fetchBookingsForDate = async () => {
      setLoading(true);
      const dateStr = format(store.eventDate!, 'yyyy-MM-dd');
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
      // Scroll to booking section
      const el = document.getElementById('hall');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // Check if selected date is a booked date (violet)
    const isSelectedDateBooked = store.eventDate
      ? bookedDates.some(d => d.toDateString() === store.eventDate!.toDateString())
      : false;

    // Auto-scroll to availability slots when a booked date is selected
    useEffect(() => {
      if (store.eventDate && isSelectedDateBooked) {
        setTimeout(() => {
          const el = document.querySelector('[data-availability-slots]');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 400);
      }
    }, [store.eventDate, isSelectedDateBooked]);

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
                selected={store.eventDate || undefined}
                onSelect={(date) => {
                  if (date) {
                    store.setEventDate(date);
                    toast.success(`📅 Date selected: ${format(date, 'PPP')}`);
                    // Scroll to hall booking section
                    setTimeout(() => {
                      const hallSection = document.getElementById('hall');
                      if (hallSection) {
                        hallSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  }
                }}
                disabled={(date) => date < new Date()}
                className="p-3 pointer-events-auto"
                modifiers={{
                  ownerUpdatedOld: oldUpdatedDates,
                  booked: bookedDates.filter(bd => !oldUpdatedDates.some(od => od.toDateString() === bd.toDateString())),
                  selectedAvailable: store.eventDate && !bookedDates.some(bd => bd.toDateString() === store.eventDate!.toDateString()) ? [store.eventDate] : []
                }}
                modifiersStyles={{
                  ownerUpdatedOld: { backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', border: '2px solid #dc2626' },
                  booked: { backgroundColor: 'rgb(236, 199, 172)', color: '#fff', fontWeight: 'bold' },
                  selectedAvailable: { backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', border: '3px solid #059669' },
                }}
              />
              <div className="flex gap-4 mt-6 text-xs justify-center items-center flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: '#dfb698', borderColor: '#f97316' }}></span>
                  <span className="text-foreground font-medium">Partially booked</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444', borderColor: '#dc2626' }}></span>
                  <span className="text-foreground font-medium">Booked</span>
                </div>
              </div>

              {/* Show quick selection button only for non-booked (available) dates */}
              {store.eventDate && !isSelectedDateBooked && (
                <div id="select-date-button">
                  <Button
                    onClick={() => {
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

          </div>
        </div>
      </section>
    );
  };

  export default AvailabilityChecker;
