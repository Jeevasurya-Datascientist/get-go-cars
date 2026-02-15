-- FINAL FIX SCRIPT (CORRECTED)
-- This script will forcefully reset the incidents table to guarantee correct Schema and Foreign Keys.

-- 1. Add registration_number to cars table if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'registration_number') THEN
        ALTER TABLE cars ADD COLUMN registration_number TEXT;
    END IF;
END $$;

-- Populate dummy registration numbers
UPDATE cars 
SET registration_number = 'TN-38-C-' || floor(random() * 9000 + 1000)::text 
WHERE registration_number IS NULL;


-- 2. DROP and RECREATE incidents table (Guarantees foreign key names)
DROP TABLE IF EXISTS incidents;

CREATE TABLE incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    car_id UUID NOT NULL,
    booking_id UUID,
    reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- MISSING COLUMN ADDED HERE
    type TEXT NOT NULL CHECK (type IN ('theft', 'damage', 'speeding', 'maintenance', 'other')),
    
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    image_url TEXT,
    location TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    
    -- EXPLICIT NAMING OF CONSTRAINTS (Required for Frontend)
    CONSTRAINT incidents_car_id_fkey FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    CONSTRAINT incidents_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- 3. Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- 4. Re-apply Policies
CREATE POLICY "Admins can view all incidents" ON incidents 
    FOR SELECT USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can insert incidents" ON incidents 
    FOR INSERT WITH CHECK (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can update incidents" ON incidents 
    FOR UPDATE USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can delete incidents" ON incidents 
    FOR DELETE USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
