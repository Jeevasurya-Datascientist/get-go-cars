-- Fix Foreign Key Names to match Frontend Query Requirements

-- 1. Drop existing constraints (if they exist with auto-generated names or old names)
ALTER TABLE incidents DROP CONSTRAINT IF EXISTS incidents_car_id_fkey;
ALTER TABLE incidents DROP CONSTRAINT IF EXISTS incidents_booking_id_fkey;

-- Also try to drop potential auto-generated names just in case
ALTER TABLE incidents DROP CONSTRAINT IF EXISTS incidents_car_id_fkey1;
ALTER TABLE incidents DROP CONSTRAINT IF EXISTS incidents_booking_id_fkey1;

-- 2. Re-create constraints with EXPLICIT names
ALTER TABLE incidents
ADD CONSTRAINT incidents_car_id_fkey
FOREIGN KEY (car_id)
REFERENCES cars(id)
ON DELETE CASCADE;

ALTER TABLE incidents
ADD CONSTRAINT incidents_booking_id_fkey
FOREIGN KEY (booking_id)
REFERENCES bookings(id)
ON DELETE SET NULL;

-- 3. Verify policies exist (re-run to be safe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'incidents' AND policyname = 'Admins can view all incidents'
    ) THEN
        CREATE POLICY "Admins can view all incidents" ON incidents 
            FOR SELECT USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
    END IF;
END
$$;
