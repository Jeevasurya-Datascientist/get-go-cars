-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to seed a user with a specific ID and password
CREATE OR REPLACE FUNCTION seed_user(
    new_email TEXT, 
    new_password TEXT, 
    new_name TEXT, 
    new_role TEXT
) RETURNS VOID AS $$
DECLARE
    new_id UUID := gen_random_uuid();
BEGIN
    -- Only insert if user doesn't exist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = new_email) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role,
            created_at,
            updated_at
        ) VALUES (
            new_id,
            '00000000-0000-0000-0000-000000000000', -- Default instance UUID
            new_email,
            crypt(new_password, gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}',
            jsonb_build_object('full_name', new_name, 'role', new_role),
            'authenticated',
            'authenticated',
            now(),
            now()
        );

        -- The handle_new_user trigger should take care of the profile, 
        -- but the trigger relies on 'new.id' which works fine here.
        
        -- Explicitly log the creation
        RAISE NOTICE 'User created: % (Password: %)', new_email, new_password;
    ELSE
        RAISE NOTICE 'User already exists: %', new_email;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Seed the requested admin users with password 'admin123'
SELECT seed_user('admin@driveyoo.com', 'admin123', 'Super Admin', 'admin');
SELECT seed_user('csepayaluga01@gmail.com', 'admin123', 'CSE Admin', 'admin');
SELECT seed_user('admin1@driveyoo.com', 'admin123', 'Admin One', 'admin');
SELECT seed_user('admin2@driveyoo.com', 'admin123', 'Admin Two', 'admin');
SELECT seed_user('super@driveyoo.com', 'admin123', 'Super User', 'admin');
SELECT seed_user('root@driveyoo.com', 'admin123', 'Root User', 'admin');
SELECT seed_user('manager@driveyoo.com', 'admin123', 'Manager', 'admin');

-- Cleanup (Optional: remove the function helper)
-- DROP FUNCTION seed_user;
