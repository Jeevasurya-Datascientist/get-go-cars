-- STEP 1: RESET
-- Delete the corrupted user records that are causing 500 errors
DELETE FROM auth.users 
WHERE email IN (
    'admin@driveyoo.com',
    'csepayaluga01@gmail.com',
    'admin1@driveyoo.com',
    'admin2@driveyoo.com',
    'super@driveyoo.com',
    'root@driveyoo.com',
    'manager@driveyoo.com'
);

-- STOP HERE!
-- GO TO THE APP (http://localhost:5173/auth?mode=register) AND REGISTER 'admin@driveyoo.com' MANUALLY.
-- YOU CAN USE THE PASSWORD 'admin123'.

-- STEP 2: CONFIRM & PROMOTE (Run this AFTER registering)
-- This will bypass the email verification requirement
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email IN (
    'admin@driveyoo.com',
    'csepayaluga01@gmail.com',
    'admin1@driveyoo.com',
    'admin2@driveyoo.com',
    'super@driveyoo.com',
    'root@driveyoo.com',
    'manager@driveyoo.com'
);

-- Ensure they are admins in the profiles table (just in case the trigger didn't catch it)
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email IN (
        'admin@driveyoo.com',
        'csepayaluga01@gmail.com',
        'admin1@driveyoo.com',
        'admin2@driveyoo.com',
        'super@driveyoo.com',
        'root@driveyoo.com',
        'manager@driveyoo.com'
    )
);
