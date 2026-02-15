-- Add missing billing_info column to bookings table
-- This is required by the Admin Dashboard Incidents view

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'billing_info') THEN
        ALTER TABLE bookings ADD COLUMN billing_info JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;
