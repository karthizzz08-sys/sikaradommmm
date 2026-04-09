import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { CalendarCheck } from 'lucide-react';
import { useBookingStore } from '@/lib/bookingStore';
import { Button } from '@/components/ui/button';

const AvailabilityChecker = () => {
  const [selected, setSelected] = useState<Date | undefined>();
  const { setEventDate } = useBookingStore();

  // Handle confirm
  const handleSelectDate = () => {
    if (!selected) {
      alert('Please select a date');
      return;
    }

    setEventDate(selected);

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
            <CalendarCheck className="inline w-4 h-4 mr-1" /> Select Date
          </span>
          <h2 className="section-title mt-2">Choose Your Date</h2>
          <p className="section-subtitle mt-3">
            Select your preferred event date
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

          {/* SELECT BUTTON */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 w-full"
            >
              <Button
                onClick={handleSelectDate}
                className="gradient-violet text-primary-foreground rounded-full px-6 w-full"
              >
                Select This Date & Continue
              </Button>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};

export default AvailabilityChecker;