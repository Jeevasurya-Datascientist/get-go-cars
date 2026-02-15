-- 1. Add registration_number to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS registration_number TEXT;

-- Update existing cars with dummy registration numbers
UPDATE cars 
SET registration_number = 'KA-01-AB-' || floor(random() * 9000 + 1000)::text 
WHERE registration_number IS NULL;

-- 2. Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    image_url TEXT,
    location TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

-- Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Policies for incidents
CREATE POLICY "Admins can view all incidents" ON incidents 
    FOR SELECT USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can insert incidents" ON incidents 
    FOR INSERT WITH CHECK (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can update incidents" ON incidents 
    FOR UPDATE USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can delete incidents" ON incidents 
    FOR DELETE USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- 3. Just in case policies are missing for registration_number updates
-- (Already covered by existing admin policies, but good to be safe)
