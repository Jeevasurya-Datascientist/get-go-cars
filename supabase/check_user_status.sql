-- Check if the user exists and their status
-- If this returns no rows, the user was not registered.
-- If 'email_confirmed_at' is null, they need confirmation.

SELECT 
    id, 
    email, 
    email_confirmed_at, 
    created_at, 
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'admin@driveyoo.com';

-- Check the profile role as well
SELECT * FROM public.profiles 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@driveyoo.com');
