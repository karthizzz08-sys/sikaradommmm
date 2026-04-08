import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBookingStore } from '@/lib/bookingStore';
import { Button } from '@/components/ui/button';

const AvailabilityChecker = () => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { setEventDate, setHallStartTime, setHallEndTime } = useBookingStore();

  // Fetch date + time bookings
  useEffect(() => {
    const fetchDates = async () => {
      const { data } = await supabase
        .from('availability')
        .select('date, start_time, end_time');

      if (data) setBookings(data);
    };
    fetchDates();
  }, []);

  // Check time overlap
  const isTimeBooked = () => {
    if (!selected || !startTime || !endTime) return false;

    const selectedDate = selected.toISOString().split('T')[0];

    return bookings.some((b) => {
      return (
        b.date === selectedDate &&
        startTime < b.end_time &&
        endTime > b.start_time
      );
    });
  };

  // Handle confirm
  const handleSelectDate = () => {
    if (!selected || !startTime || !endTime) {
      alert('Please select date and time');
      return;
    }

    if (isTimeBooked()) {
      alert('This time slot is already booked');
      return;
    }

    setEventDate(selected);
    setHallStartTime(startTime);
    setHallEndTime(endTime);

    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="availability" className="py-20 px-4">
      <div className="container max-w-xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            <CalendarCheck className="inline w-4 h-4 mr-1" /> Availability
          </span>
          <h2 className="section-title mt-2">Check Availability</h2>
          <p className="section-subtitle mt-3">
            Select date and time to check hall availability
          </p>
        </motion.div>

        <div className="glass-card p-6 flex flex-col items-center">

          {/* CALENDAR */}
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            disabled={(date) => date < new Date()}
            className="p-3 pointer-events-auto"
          />

          {/* TIME PICKER */}
          {selected && (
            <div className="mt-4 w-full flex flex-col gap-3">

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded p-2 w-full"
              />

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border rounded p-2 w-full"
              />

            </div>
          )}

          {/* STATUS */}
          {selected && startTime && endTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col items-center gap-3"
            >
              <div
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm ${
                  isTimeBooked()
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {isTimeBooked() ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Time Slot Already Booked
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Time Slot Available
                  </>
                )}
              </div>

              {!isTimeBooked() && (
                <Button
                  onClick={handleSelectDate}
                  className="gradient-violet text-primary-foreground rounded-full px-6"
                >
                  Confirm Time & Book Now
                </Button>
              )}
            </motion.div>
          )}

          {/* LEGEND */}
          <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-destructive/20 border border-destructive/40" /> Booked Slot
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-100 border border-green-400" /> Available Slot
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AvailabilityChecker;