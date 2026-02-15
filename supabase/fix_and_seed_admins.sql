-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up potentially broken users first
DELETE FROM auth.users WHERE email IN (
    'admin@driveyoo.com',
    'csepayaluga01@gmail.com',
    'admin1@driveyoo.com',
    'admin2@driveyoo.com',
    'super@driveyoo.com',
    'root@driveyoo.com',
    'manager@driveyoo.com'
);

-- Re-create the seeding function with dynamic instance_id
CREATE OR REPLACE FUNCTION seed_user_fixed(
    new_email TEXT, 
    new_password TEXT, 
    new_name TEXT, 
    new_role TEXT
) RETURNS VOID AS $$
DECLARE
    new_id UUID := gen_random_uuid();
    target_instance_id UUID;
BEGIN
    -- Attempt to find the correct instance_id from existing users or default
    SELECT instance_id INTO target_instance_id FROM auth.users LIMIT 1;
    
    IF target_instance_id IS NULL THEN
        target_instance_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    -- Insert the new user
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
        updated_at,
        is_super_admin
    ) VALUES (
        new_id,
        target_instance_id,
        new_email,
        crypt(new_password, gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', new_name, 'role', new_role),
        'authenticated',
        'authenticated',
        now(),
        now(),
        FALSE
    );
    
    RAISE NOTICE 'User created: % (Password: %)', new_email, new_password;
END;
$$ LANGUAGE plpgsql;

-- Run the seeding
SELECT seed_user_fixed('admin@driveyoo.com', 'admin123', 'Super Admin', 'admin');
SELECT seed_user_fixed('csepayaluga01@gmail.com', 'admin123', 'CSE Admin', 'admin');
SELECT seed_user_fixed('admin1@driveyoo.com', 'admin123', 'Admin One', 'admin');
SELECT seed_user_fixed('admin2@driveyoo.com', 'admin123', 'Admin Two', 'admin');
SELECT seed_user_fixed('super@driveyoo.com', 'admin123', 'Super User', 'admin');
SELECT seed_user_fixed('root@driveyoo.com', 'admin123', 'Root User', 'admin');
SELECT seed_user_fixed('manager@driveyoo.com', 'admin123', 'Manager', 'admin');

-- Clean up
DROP FUNCTION seed_user_fixed;
