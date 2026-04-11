# Booking System - Developer Quick Start

**Status**: ✅ Production Ready | **Build**: ✅ 11.65s | **Errors**: 0

---

## 🚀 Quick Overview

```
┌─────────────────────────────────────────────────────┐
│           REVERSE AVAILABILITY SYSTEM                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📅 ALL DATES AVAILABLE BY DEFAULT                  │
│     ↓                                               │
│  👨‍💼 OWNER MARKS BOOKED SLOTS (not availability)    │
│     ↓                                               │
│  ⚙️ SYSTEM CALCULATES AVAILABLE GAPS                │
│     ↓                                               │
│  👥 CUSTOMER SEES REMAINING HOURS                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📁 File Changes Summary

### Created

- ✅ `src/lib/timeSlots.ts` - Time gap calculation utility
- ✅ `supabase/migrations/20260411_create_bookings_table.sql` - Database table

### Updated

- 📝 `src/pages/AdminDashboard.tsx` - Now creates bookings instead of marking availability
- 📝 `src/components/AvailabilityChecker.tsx` - Shows hourly grid with available/booked slots

### Documentation

- 📚 `BOOKING_SYSTEM_GUIDE.md` - Complete system guide
- 📚 `TIME_SLOTS_ALGORITHM.md` - Algorithm documentation
- 📚 `DEV_QUICK_START.md` (this file)

---

## 🔧 Key Classes & Functions

### `src/lib/timeSlots.ts`

```typescript
// Main function - calculates available time slots
getAvailableSlots(bookings: BookedSlot[]): TimeSlot[]
// Returns: [{ start: "00:00", end: "10:00" }, ...]

// Calculate total available hours
calculateAvailableHours(bookings: BookedSlot[]): number
// Returns: 16 (hours as decimal)

// Check if time is booked
isTimeBooked(time: string, bookings: BookedSlot[]): boolean
// Returns: true if booked, false if available

// Create hourly display list
generateHourlySlots(start: string, end: string): string[]
// Returns: ["10:00", "11:00", "12:00", ...]

// Internal: Convert time to minutes
timeToMinutes(time: string): number
// Input: "14:30" → Output: 870

// Internal: Convert minutes to time
minutesToTime(minutes: number): string
// Input: 870 → Output: "14:30"
```

---

## 📊 Data Models

### Booking Row

```typescript
interface BookingRow {
  id: string;                    // UUID
  date: string;                  // "2026-04-15"
  start_time: string;            // "10:00:00"
  end_time: string;              // "13:00:00"
  customer_name: string | null;  // "John Smith"
  customer_email: string | null; // "john@example.com"
  notes: string | null;          // "Wedding reception"
  owner_id: string | null;       // UUID of owner
  owner_name: string | null;     // "admin@example.com"
}
```

### Available Slots (calculated)

```typescript
interface TimeSlot {
  start: string;  // "00:00"
  end: string;    // "10:00"
}

// Example: Two Time Slots
[
  { start: "00:00", end: "10:00" },   // 10 hours
  { start: "13:00", end: "15:00" },   // 2 hours
  { start: "20:00", end: "23:59" }    // 4 hours
]
// Total: 16 hours available
```

---

## 🔌 API Calls

### Fetch Bookings for Date

```typescript
const { data } = await supabase
  .from('bookings')
  .select('start_time, end_time')
  .eq('date', '2026-04-15');

// Returns:
[
  { start_time: "10:00", end_time: "13:00" },
  { start_time: "15:00", end_time: "20:00" }
]
```

### Create Booking

```typescript
const { error } = await supabase.from('bookings').insert({
  date: '2026-04-15',
  start_time: '10:00',
  end_time: '13:00',
  customer_name: 'John Smith',
  customer_email: 'john@example.com',
  notes: 'Wedding reception',
  owner_id: 'user-uuid',
  owner_name: 'admin@example.com'
});
```

### Update Booking

```typescript
const { error } = await supabase
  .from('bookings')
  .update({
    end_time: '14:00',
    customer_name: 'Jane Doe'
  })
  .eq('id', 'booking-uuid');
```

### Delete Booking

```typescript
const { error } = await supabase
  .from('bookings')
  .delete()
  .eq('id', 'booking-uuid');
```

---

## 🎯 Common Tasks

### Calculate Total Available Hours for a Date

```typescript
import { calculateAvailableHours } from '@/lib/timeSlots';

const fetchAndShowAvailable = async (date: string) => {
  const { data } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('date', date);
  
  const hours = calculateAvailableHours(data || []);
  console.log(`${hours} hours available`);  // e.g., "16 hours available"
};
```

### Show Available Time Ranges

```typescript
import { getAvailableSlots } from '@/lib/timeSlots';

const fetchAndShowSlots = async (date: string) => {
  const { data } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('date', date);
  
  const slots = getAvailableSlots(data || []);
  slots.forEach(slot => {
    console.log(`Available: ${slot.start} - ${slot.end}`);
  });
  // Output example:
  // Available: 00:00 - 10:00
  // Available: 13:00 - 15:00
  // Available: 20:00 - 23:59
};
```

### Generate Hourly Display Grid

```typescript
import { generateHourlySlots, isTimeBooked } from '@/lib/timeSlots';

const generateGrid = async (date: string) => {
  const { data } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('date', date);
  
  const allHours = [];
  for (let h = 0; h < 24; h++) {
    const hour = `${String(h).padStart(2, '0')}:00`;
    const booked = isTimeBooked(hour, data || []);
    allHours.push({ hour, booked });
  }
  
  return allHours;
  // Output:
  // [
  //   { hour: "00:00", booked: false },
  //   { hour: "10:00", booked: true },
  //   { hour: "13:00", booked: false },
  //   ...
  // ]
};
```

### Check If Specific Time is Booked

```typescript
import { isTimeBooked } from '@/lib/timeSlots';

const checkTime = async (date: string, checkTime: string) => {
  const { data } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('date', date);
  
  const isBooked = isTimeBooked(checkTime, data || []);
  console.log(`${checkTime} is ${isBooked ? 'BOOKED' : 'AVAILABLE'}`);
};

// Example:
checkTime('2026-04-15', '11:00');  // Output: "11:00 is BOOKED" (if booking 10:00-13:00 exists)
checkTime('2026-04-15', '14:00');  // Output: "14:00 is AVAILABLE"
```

---

## 🧪 Testing Examples

### Test: No Bookings

```typescript
const bookings = [];
const slots = getAvailableSlots(bookings);
console.assert(slots.length === 1);
console.assert(slots[0].start === '00:00');
console.assert(slots[0].end === '23:59');
console.log('✓ Test passed: no bookings = full day available');
```

### Test: Single Booking

```typescript
const bookings = [
  { start_time: '10:00', end_time: '13:00' }
];
const slots = getAvailableSlots(bookings);
console.assert(slots.length === 2);
console.assert(slots[0].end === '10:00');
console.assert(slots[1].start === '13:00');
console.log('✓ Test passed: single booking creates gaps');
```

### Test: Available Hours

```typescript
const bookings = [
  { start_time: '10:00', end_time: '13:00' }  // 3 hours
];
const hours = calculateAvailableHours(bookings);
console.assert(hours === 21); // 24 - 3 = 21
console.log('✓ Test passed: 21 hours available');
```

---

## 📋 Component Integration

### AdminDashboard Component

**What it does**:
- Manages owner login
- Shows calendar to select date
- Time input for start/end times
- Customer info fields (name, email, notes)
- CREATE/UPDATE/DELETE bookings

**Key State Variables**:
```typescript
const [selectedDate, setSelectedDate] = useState<Date>();
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [customerName, setCustomerName] = useState('');
const [bookings, setBookings] = useState<BookingRow[]>([]);
```

**Key Functions**:
```typescript
fetchBookings()              // Load all bookings
handleSave()                 // Create/update booking
handleDelete(id)             // Delete booking
handleEdit(booking)          // Load booking for editing
```

### AvailabilityChecker Component

**What it does**:
- Shows calendar to select date
- Fetches bookings for selected date
- Calculates available slots
- Displays hourly grid (green=available, red=booked)
- Shows total available hours

**Key State Variables**:
```typescript
const [selected, setSelected] = useState<Date>();
const [bookings, setBookings] = useState<BookingSlot[]>([]);
const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
const [availableHours, setAvailableHours] = useState(24);
const [selectedHour, setSelectedHour] = useState<string | null>(null);
```

**Key Functions**:
```typescript
fetchBookingsForDate()       // Fetch bookings for date
getHourlyDisplay()           // Generate 24-hour grid with status
handleSelectHour(hour)       // Handle hour selection
```

---

## 🚨 Common Errors & Solutions

### Error: "Cannot read property 'start_time' of undefined"

**Cause**: Bookings data is null or undefined

**Solution**:
```typescript
// Instead of:
const slots = getAvailableSlots(data);

// Use:
const slots = getAvailableSlots(data || []);
```

### Error: "Cannot insert booking - UNIQUE violation"

**Cause**: Trying to create duplicate booking

**Solution**: Check if booking already exists before inserting

### Error: "RLS policy violation - SELECT denied"

**Cause**: RLS policies not applied or permissions wrong

**Solution**: Run migration to apply policies:
```bash
supabase migration up
```

### Error: "Type 'any' has no properties"

**Cause**: Missing type annotations

**Solution**: Use interfaces:
```typescript
interface BookingSlot {
  start_time: string;
  end_time: string;
}
```

---

## 🔄 Data Flow Diagram

### Owner Creates Booking

```
AdminDashboard
    ↓
Select Date (Apr 15)
Select Time (10:00 - 13:00)
Enter Customer (John Smith)
Click "Create Booking"
    ↓
handleSave() executes
    ↓
supabase.from('bookings').insert({...})
    ↓
Supabase validates & stores
    ↓
fetchBookings() refreshes list
    ↓
UI updates with new booking
```

### Customer Checks Availability

```
AvailabilityChecker
    ↓
Select Date (Apr 15)
    ↓
useEffect triggers
    ↓
fetchBookingsForDate() executes
    ↓
supabase.from('bookings').select(...).eq('date', '2026-04-15')
    ↓
Returns: [
  { start_time: "10:00", end_time: "13:00" },
  { start_time: "15:00", end_time: "20:00" }
]
    ↓
getAvailableSlots(data) calculates gaps
    ↓
Returns: [
  { start: "00:00", end: "10:00" },
  { start: "13:00", end: "15:00" },
  { start: "20:00", end: "23:59" }
]
    ↓
calculateAvailableHours(data) → 16 hours
    ↓
UI renders:
- Calendar
- Booked times (red)
- Available times (green)
- Total hours: "16 hours available"
```

---

## 📚 Key Files Reference

| File | Purpose | Type |
|------|---------|------|
| `src/lib/timeSlots.ts` | Time gap calculation | Utility |
| `src/pages/AdminDashboard.tsx` | Owner booking management | Component |
| `src/components/AvailabilityChecker.tsx` | Customer availability view | Component |
| `supabase/migrations/20260411_create_bookings_table.sql` | Database schema | Migration |
| `BOOKING_SYSTEM_GUIDE.md` | Full documentation | Docs |
| `TIME_SLOTS_ALGORITHM.md` | Algorithm explanation | Docs |

---

## ✅ Deployment Checklist

- [ ] Pull latest code
- [ ] Run `npm install` (if needed)
- [ ] Verify build: `npm run build` (should show "✓ built in Xs")
- [ ] Check zero errors: `npm run build 2>&1 | grep error` (should be empty)
- [ ] Apply migration: `supabase migration up`
- [ ] Test Owner Dashboard:
  - [ ] Login works
  - [ ] Can create booking
  - [ ] Can edit booking
  - [ ] Can delete booking
- [ ] Test Customer Side:
  - [ ] Calendar selects dates
  - [ ] Shows available hours
  - [ ] Can select available times
- [ ] Deploy to production

---

## 🎓 Example Usage

### Scenario: Hall Books Both Friday and Saturday

**Friday (Apr 15)**:
- 10:00-13:00: Wedding (John)
- 15:00-20:00: Party (Sarah)

**Saturday (Apr 16)**:
- 09:00-11:00: Conference (Tech Corp)

**Customer interactions**:

```
Customer 1: Checks Friday
→ Sees: 16 hours available
→ Available: 00:00-10:00, 13:00-15:00, 20:00-23:59

Customer 2: Checks Saturday
→ Sees: 22 hours available
→ Available: 00:00-09:00, 11:00-23:59
→ Booked: 09:00-11:00
```

---

## 🐛 Debugging Tips

### Check if date has bookings

```typescript
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('date', '2026-04-15');

console.log('Bookings:', data);
// Should show array or empty []
```

### Verify calculation is correct

```typescript
const bookings = data || [];
const available = getAvailableSlots(bookings);
const hours = calculateAvailableHours(bookings);

console.log('Available slots:', available);
console.log('Available hours:', hours);
```

### Check individual hour status

```typescript
const hour = '11:00';
const isBooked = isTimeBooked(hour, bookings);
console.log(`${hour} is ${isBooked ? '🔴 BOOKED' : '🟢 AVAILABLE'}`);
```

---

## 🔗 Related Documentation

- [BOOKING_SYSTEM_GUIDE.md](BOOKING_SYSTEM_GUIDE.md) - Complete system guide
- [TIME_SLOTS_ALGORITHM.md](TIME_SLOTS_ALGORITHM.md) - Algorithm explanation
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)

---

## ✨ Quick Build & Deploy

```bash
# 1. Build
npm run build

# 2. Check for errors
npm run build 2>&1 | grep -i error

# 3. If no errors, deploy
git add .
git commit -m "Deploy booking system"
git push

# 4. Apply database migration
supabase migration up
```

**Expected build output**:
```
✓ built in 11.65s
```

**Expected errors**:
```
(none)
```

---

**Ready to code? Start with [BOOKING_SYSTEM_GUIDE.md](BOOKING_SYSTEM_GUIDE.md)!**
