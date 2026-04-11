-- Create bookings table for storing booked time slots
-- All dates are available by default, only booked slots stored
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id),
  owner_name TEXT
);

-- Create index for faster queries by date
CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings(date);
CREATE INDEX IF NOT EXISTS bookings_date_range_idx ON bookings(date, start_time, end_time);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public can view all bookings
CREATE POLICY "Public can view bookings" ON bookings
  FOR SELECT USING (true);

-- Authenticated users can insert bookings
CREATE POLICY "Authenticated can insert bookings" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Owner can update/delete their own bookings
CREATE POLICY "Owner can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid() = owner_id);
