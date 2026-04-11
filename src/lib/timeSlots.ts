/**
 * Time Slots Utility
 * Calculates available time slots by removing booked times from full day
 * Full day: 00:00 - 23:59
 */

interface TimeSlot {
  start: string;
  end: string;
}

interface BookedSlot {
  start_time: string;
  end_time: string;
}

/**
 * Converts time string (HH:MM) to minutes since midnight
 * @param time "14:30" or "2:30 PM"
 * @returns minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  // Handle both 24-hour and 12-hour formats
  const parts = time.replace(/\s+(AM|PM)/i, '').split(':');
  let hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1] || '0');
  
  if (time.toUpperCase().includes('PM') && hours !== 12) {
    hours += 12;
  }
  if (time.toUpperCase().includes('AM') && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
};

/**
 * Converts minutes since midnight to time string (HH:MM)
 * @param minutes 
 * @returns "HH:MM" format
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Sorts booked slots and merges overlapping ones
 * @param bookings Array of booked time slots
 * @returns Sorted and merged bookings
 */
export const mergeBookings = (bookings: BookedSlot[]): TimeSlot[] => {
  if (bookings.length === 0) return [];
  
  const sorted = bookings
    .map(b => ({
      start: timeToMinutes(b.start_time),
      end: timeToMinutes(b.end_time),
    }))
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i].start <= last.end) {
      // Overlapping - merge
      last.end = Math.max(last.end, sorted[i].end);
    } else {
      // Non-overlapping - add new
      merged.push(sorted[i]);
    }
  }

  return merged.map(slot => ({
    start: minutesToTime(slot.start),
    end: minutesToTime(slot.end),
  }));
};

/**
 * Calculates available time slots for a full day minus booked slots
 * @param bookings Array of booked time slots
 * @returns Array of available time slots
 * 
 * Example:
 * Bookings: [{ start_time: "10:00", end_time: "13:00" }]
 * Returns: [
 *   { start: "00:00", end: "10:00" },
 *   { start: "13:00", end: "23:59" }
 * ]
 */
export const getAvailableSlots = (bookings: BookedSlot[]): TimeSlot[] => {
  const DAY_START = 0; // 00:00
  const DAY_END = 24 * 60 - 1; // 23:59

  if (bookings.length === 0) {
    return [{ start: '00:00', end: '23:59' }];
  }

  const merged = mergeBookings(bookings);
  const available: TimeSlot[] = [];

  // Check if there's time before first booking
  const firstStart = timeToMinutes(merged[0].start);
  if (firstStart > DAY_START) {
    available.push({
      start: minutesToTime(DAY_START),
      end: merged[0].start,
    });
  }

  // Check gaps between bookings
  for (let i = 0; i < merged.length - 1; i++) {
    const currentEnd = timeToMinutes(merged[i].end);
    const nextStart = timeToMinutes(merged[i + 1].start);
    if (currentEnd < nextStart) {
      available.push({
        start: merged[i].end,
        end: merged[i + 1].start,
      });
    }
  }

  // Check if there's time after last booking
  const lastEnd = timeToMinutes(merged[merged.length - 1].end);
  if (lastEnd < DAY_END) {
    available.push({
      start: merged[merged.length - 1].end,
      end: minutesToTime(DAY_END),
    });
  }

  return available;
};

/**
 * Calculate total available hours for a day
 * @param bookings Array of booked time slots
 * @returns Available hours as decimal (e.g., 13.5)
 */
export const calculateAvailableHours = (bookings: BookedSlot[]): number => {
  const available = getAvailableSlots(bookings);
  const totalMinutes = available.reduce((sum, slot) => {
    const start = timeToMinutes(slot.start);
    const end = timeToMinutes(slot.end);
    return sum + (end - start);
  }, 0);
  return parseFloat((totalMinutes / 60).toFixed(1));
};

/**
 * Generate hourly slots for a time range
 * Used for displaying available hours in UI
 * @param startTime "HH:MM"
 * @param endTime "HH:MM"
 * @returns Array of hourly slots
 */
export const generateHourlySlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];
  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  while (current < end) {
    slots.push(minutesToTime(current));
    current += 60; // Add 1 hour
  }

  return slots;
};

/**
 * Check if a time slot is within booked hours
 * @param checkTime "HH:MM"
 * @param bookings Array of booked slots
 * @returns true if time is booked
 */
export const isTimeBooked = (checkTime: string, bookings: BookedSlot[]): boolean => {
  const checkMinutes = timeToMinutes(checkTime);
  return bookings.some(booking => {
    const start = timeToMinutes(booking.start_time);
    const end = timeToMinutes(booking.end_time);
    return checkMinutes >= start && checkMinutes < end;
  });
};
