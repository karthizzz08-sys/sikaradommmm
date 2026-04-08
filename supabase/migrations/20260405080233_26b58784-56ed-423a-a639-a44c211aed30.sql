
-- Create availability table for owner to manage blocked/booked dates
CREATE TABLE public.availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'blocked')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Everyone can read availability (to check dates)
CREATE POLICY "Anyone can view availability"
  ON public.availability FOR SELECT
  USING (true);

-- Only authenticated admin can manage availability
-- For now allow any authenticated user (owner will be the only one with login)
CREATE POLICY "Authenticated users can insert availability"
  ON public.availability FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update availability"
  ON public.availability FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete availability"
  ON public.availability FOR DELETE
  TO authenticated
  USING (true);
