-- ==========================================
-- CREATE TABLE (YOUR ORIGINAL + UPDATED)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  date DATE NOT NULL,

  -- NEW: TIME SUPPORT
  start_time TIME,
  end_time TIME,

  status TEXT NOT NULL DEFAULT 'booked'
    CHECK (status IN ('booked', 'blocked')),

  note TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==========================================
-- UPDATE EXISTING TABLE (IMPORTANT FIX)
-- ==========================================

-- Add columns if table already exists
ALTER TABLE public.availability
ADD COLUMN IF NOT EXISTS start_time TIME;

ALTER TABLE public.availability
ADD COLUMN IF NOT EXISTS end_time TIME;

-- Set default values
ALTER TABLE public.availability
ALTER COLUMN start_time SET DEFAULT '00:00';

ALTER TABLE public.availability
ALTER COLUMN end_time SET DEFAULT '23:59';

-- Update old data
UPDATE public.availability
SET start_time = '00:00'
WHERE start_time IS NULL;

UPDATE public.availability
SET end_time = '23:59'
WHERE end_time IS NULL;

-- Make NOT NULL
ALTER TABLE public.availability
ALTER COLUMN start_time SET NOT NULL;

ALTER TABLE public.availability
ALTER COLUMN end_time SET NOT NULL;

-- Remove UNIQUE date (allow multiple bookings per day)
ALTER TABLE public.availability
DROP CONSTRAINT IF EXISTS availability_date_key;

-- ==========================================
-- VALIDATION
-- ==========================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_time_range'
  ) THEN
    ALTER TABLE public.availability
    ADD CONSTRAINT valid_time_range CHECK (end_time > start_time);
  END IF;
END $$;

-- ==========================================
-- ENABLE RLS
-- ==========================================

ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- FIX POLICIES (REMOVE + ADD AGAIN)
-- ==========================================

DROP POLICY IF EXISTS "Anyone can view availability" ON public.availability;
DROP POLICY IF EXISTS "Authenticated users can insert availability" ON public.availability;
DROP POLICY IF EXISTS "Authenticated users can update availability" ON public.availability;
DROP POLICY IF EXISTS "Authenticated users can delete availability" ON public.availability;

CREATE POLICY "Anyone can view availability"
ON public.availability
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert availability"
ON public.availability
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update availability"
ON public.availability
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete availability"
ON public.availability
FOR DELETE
TO authenticated
USING (true);

-- ==========================================
-- OVERLAP PREVENTION (NEW FEATURE)
-- ==========================================

CREATE OR REPLACE FUNCTION prevent_time_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.availability
    WHERE date = NEW.date
      AND id != NEW.id
      AND (
        NEW.start_time < end_time AND NEW.end_time > start_time
      )
  ) THEN
    RAISE EXCEPTION 'Time slot already booked for this date';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER
DROP TRIGGER IF EXISTS check_time_overlap ON public.availability;

CREATE TRIGGER check_time_overlap
BEFORE INSERT OR UPDATE
ON public.availability
FOR EACH ROW
EXECUTE FUNCTION prevent_time_overlap();

-- ==========================================
-- PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_availability_date_time
ON public.availability (date, start_time, end_time);

-- ==========================================
-- DONE ✅
-- ==========================================