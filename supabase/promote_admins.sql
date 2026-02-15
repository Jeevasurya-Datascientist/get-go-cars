-- Run this query to promote existing users to Admins
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id 
    FROM auth.users 
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

-- Verify the updates
SELECT email, role 
FROM auth.users 
JOIN public.profiles ON auth.users.id = profiles.id
WHERE role = 'admin';
