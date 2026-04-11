# Time Slots Algorithm - Technical Reference

## 📚 Core Concept

**Goal**: Given a full day (00:00 - 23:59) and multiple booked time slots, calculate remaining available time slots.

**Problem**: Customer books 10:00-13:00 and 15:00-20:00. What times are available?

**Solution**: Calculate gaps between bookings.

---

## 🧮 Algorithm Breakdown

### Step 1: Convert Times to Minutes

```typescript
timeToMinutes("10:00") → 600 (10 * 60)
timeToMinutes("13:00") → 780 (13 * 60)
timeToMinutes("15:30") → 930 (15 * 60 + 30)
```

### Step 2: Sort and Merge Overlapping Bookings

Given bookings:
- 10:00 - 13:00
- 12:00 - 14:00 (overlaps with above)
- 15:00 - 20:00

After merge:
- 10:00 - 14:00 (merged)
- 15:00 - 20:00

```typescript
// Pseudocode
const sorted = bookings.sort((a, b) => a.start - b.start);
const merged = [sorted[0]];

for (let i = 1; i < sorted.length; i++) {
  const last = merged[merged.length - 1];
  if (sorted[i].start <= last.end) {
    // Overlapping - extend end
    last.end = Math.max(last.end, sorted[i].end);
  } else {
    // Gap found - add new
    merged.push(sorted[i]);
  }
}
```

### Step 3: Calculate Gaps

Given merged bookings:
- 10:00 - 14:00 (600-840 minutes)
- 15:00 - 20:00 (900-1200 minutes)

Gaps (available):
1. **00:00 - 10:00** (0-600 min) = 600 min = 10 hours
2. **14:00 - 15:00** (840-900 min) = 60 min = 1 hour
3. **20:00 - 23:59** (1200-1439 min) = 239 min ≈ 4 hours

```typescript
// Pseudocode
const gaps = [];

// Before first booking
if (merged[0].start > DAY_START) {
  gaps.push({ start: DAY_START, end: merged[0].start });
}

// Between bookings
for (let i = 0; i < merged.length - 1; i++) {
  if (merged[i].end < merged[i+1].start) {
    gaps.push({ start: merged[i].end, end: merged[i+1].start });
  }
}

// After last booking
if (merged[merged.length-1].end < DAY_END) {
  gaps.push({ start: merged[merged.length-1].end, end: DAY_END });
}
```

---

## 🎯 Complete Example

### Input

```javascript
const bookings = [
  { start_time: "10:00", end_time: "13:00" },
  { start_time: "15:00", end_time: "20:00" }
];
```

### Execution

```
Step 1: Convert to minutes
├─ Booking 1: 600-780 min
└─ Booking 2: 900-1200 min

Step 2: Sort & Merge
├─ Already sorted
└─ No overlaps, so: [600-780, 900-1200]

Step 3: Calculate gaps
├─ Before first: 0-600 (gap)
├─ Between: 780-900 (gap)
└─ After last: 1200-1440 (gap)

Step 4: Convert back to time
├─ 0-600 min → "00:00" - "10:00"
├─ 780-900 min → "13:00" - "15:00"
└─ 1200-1440 min → "20:00" - "23:59"

Available: 10 + 2 + 3.98 ≈ 15.98 hours ≈ 16 hours
```

### Output

```javascript
[
  { start: "00:00", end: "10:00" },
  { start: "13:00", end: "15:00" },
  { start: "20:00", end: "23:59" }
]

availableHours = 16
```

---

## 🔢 Time Conversion

### 24-Hour to Minutes

```typescript
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

Examples:
"00:00" → 0
"06:00" → 360
"12:30" → 750
"18:45" → 1125
"23:59" → 1439
```

### Minutes to 24-Hour

```typescript
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

Examples:
0 → "00:00"
360 → "06:00"
750 → "12:30"
1125 → "18:45"
1439 → "23:59"
```

---

## 📊 Time Slot Display

### Generate Hourly Grid

```typescript
function generateHourlySlots(startTime: string, endTime: string): string[] {
  const slots = [];
  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  while (current < end) {
    slots.push(minutesToTime(current));
    current += 60; // Add 1 hour
  }
  
  return slots;
}

Example:
generateHourlySlots("10:00", "15:00")
→ ["10:00", "11:00", "12:00", "13:00", "14:00"]
```

### Check if Time is Booked

```typescript
function isTimeBooked(checkTime: string, bookings: BookedSlot[]): boolean {
  const checkMinutes = timeToMinutes(checkTime);
  
  return bookings.some(booking => {
    const start = timeToMinutes(booking.start_time);
    const end = timeToMinutes(booking.end_time);
    return checkMinutes >= start && checkMinutes < end;
  });
}

Example:
isTimeBooked("11:00", [{ start_time: "10:00", end_time: "13:00" }])
→ true (11:00 is between 10:00-13:00)

isTimeBooked("14:00", [{ start_time: "10:00", end_time: "13:00" }])
→ false (14:00 is after 13:00)
```

---

## ⏱️ Available Hours Calculation

### Formula

```
Total Available = Sum of all gap durations

For each gap:
  duration_minutes = timeToMinutes(gap.end) - timeToMinutes(gap.start)
  
Total Available Hours = Total_Minutes / 60 (rounded to 1 decimal)
```

### Example

```
Gaps:
├─ "00:00" - "10:00" = 600 minutes = 10.0 hours
├─ "13:00" - "15:00" = 120 minutes = 2.0 hours
└─ "20:00" - "23:59" = 239 minutes = 3.98 hours

Total Available = 10.0 + 2.0 + 3.98 = 15.98 → 16.0 hours
```

---

## 🔄 Edge Cases

### Case 1: No Bookings

```javascript
bookings = []
Expected: Full 24 hours available
getAvailableSlots([]) → [{ start: "00:00", end: "23:59" }]
availableHours → 24
```

### Case 2: Full Day Booked

```javascript
bookings = [{ start_time: "00:00", end_time: "23:59" }]
Expected: 0 hours available
getAvailableSlots(bookings) → []
availableHours → 0
```

### Case 3: Multiple Adjacent Bookings

```javascript
bookings = [
  { start_time: "10:00", end_time: "13:00" },
  { start_time: "13:00", end_time: "16:00" }  // Adjacent, not overlapping
]
Expected: Treated as one continuous block
Merge result: [{ start: 600, end: 960 }]
Available: [00:00-10:00], [16:00-23:59] = 14 hours
```

### Case 4: Single Hour Gaps

```javascript
bookings = [
  { start_time: "10:00", end_time: "11:00" },
  { start_time: "12:00", end_time: "13:00" },
  { start_time: "14:00", end_time: "15:00" }
]
Available: Many 1-hour gaps between bookings
```

### Case 5: Midnight Crossing

```javascript
bookings = [
  { start_time: "23:00", end_time: "23:59" }
]
Expected: Last hour booked
Available: [00:00-23:00]
availableHours: 23
```

---

## 💾 Database Queries

### Get Booked Times for Date

```sql
SELECT start_time, end_time 
FROM bookings 
WHERE date = '2026-04-15' 
ORDER BY start_time ASC;
```

Returns:
```
start_time | end_time
10:00:00   | 13:00:00
15:00:00   | 20:00:00
```

### Check if Slot Available

```sql
SELECT COUNT(*) FROM bookings 
WHERE date = '2026-04-15' 
  AND start_time < '14:00'::time 
  AND end_time > '14:00'::time;

-- If COUNT > 0: Booked
-- If COUNT = 0: Available
```

---

## 🎨 UI Rendering Logic

### Hourly Button Display

```typescript
const hourlyDisplay = getHourlyDisplay(); // All 24 hours with status

{hourlyDisplay.map((slot) => (
  <Button
    key={slot.hour}
    disabled={!slot.available}
    onClick={() => handleSelectHour(slot.hour)}
    className={slot.available ? 'green' : 'red-locked'}
  >
    {slot.hour}
  </Button>
))}
```

### Status States

```typescript
{
  hour: "10:00",
  available: false  // ← Red/locked
}

{
  hour: "14:00",
  available: true   // ← Green/clickable
}
```

---

## 📈 Performance Analysis

| Operation | Time Complexity | Space Complexity | Note |
|-----------|-----------------|------------------|------|
| Sort bookings | O(n log n) | O(n) | Merge sort |
| Merge overlaps | O(n) | O(n) | Single pass |
| Calculate gaps | O(n) | O(n) | Linear scan |
| Total | O(n log n) | O(n) | Dominated by sort |

For typical use case (5-10 bookings/day):
- Time: < 1ms
- Memory: < 1KB

---

## ✅ Test Cases

### Test 1: Basic Gap

```typescript
test('calculates gap between two bookings', () => {
  const bookings = [
    { start_time: "10:00", end_time: "13:00" },
    { start_time: "15:00", end_time: "20:00" }
  ];
  const slots = getAvailableSlots(bookings);
  expect(slots).toHaveLength(3);
  expect(slots[1]).toEqual({ start: "13:00", end: "15:00" });
});
```

### Test 2: Overlapping Merge

```typescript
test('merges overlapping bookings', () => {
  const bookings = [
    { start_time: "10:00", end_time: "13:00" },
    { start_time: "12:00", end_time: "14:00" }
  ];
  const slots = getAvailableSlots(bookings);
  expect(slots).toHaveLength(2); // Before 10, after 14
});
```

### Test 3: Available Hours

```typescript
test('calculates total available hours', () => {
  const bookings = [
    { start_time: "10:00", end_time: "13:00" }  // 3 hours blocked
  ];
  const hours = calculateAvailableHours(bookings);
  expect(hours).toBe(21); // 24 - 3
});
```

---

## 🚀 Integration

### In AdminDashboard (Create Booking)

```typescript
// Owner just needs to set times
// No availability logic needed - all dates available
const handleSave = async () => {
  const payload = {
    date: selectedDate,
    start_time: startTime,     // "10:00"
    end_time: endTime,         // "13:00"
    customer_name: customerName,
    notes: notes
  };
  await supabase.from('bookings').insert(payload);
};
```

### In AvailabilityChecker (View Availability)

```typescript
// Customer gets calculated availability
const fetchBookingsForDate = async () => {
  const { data } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('date', selectedDate);
  
  // Use utility to calculate
  const available = getAvailableSlots(data);      // Gap calculation
  const hours = calculateAvailableHours(data);    // Hour counting
  
  setAvailableSlots(available);
  setAvailableHours(hours);
};
```

---

## 📝 Summary

✅ **Algorithm**: Merge-sort + gap-finding approach  
✅ **Time**: O(n log n) - fast enough for 1000s of bookings  
✅ **Space**: O(n) - minimal memory  
✅ **Accuracy**: Handles overlaps, edge cases, all day scenarios  
✅ **Integration**: Seamless with React components via Supabase
