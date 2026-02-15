-- Reset Database
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  kyc_verified BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  PRIMARY KEY (id),
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create cars table
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  seats INTEGER NOT NULL,
  price_per_day NUMERIC NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
  rating NUMERIC DEFAULT 5.0,
  year INTEGER NOT NULL,
  transmission TEXT DEFAULT 'automatic',
  features TEXT[] DEFAULT '{}'
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  addons JSONB DEFAULT '[]',
  cancellation_reason TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT
);

-- Create payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  payment_method TEXT
);

-- Create logs table for general logging
CREATE TABLE logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cars
CREATE POLICY "Cars are viewable by everyone." ON cars FOR SELECT USING (true);
CREATE POLICY "Admins can insert cars." ON cars FOR INSERT WITH CHECK (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can update cars." ON cars FOR UPDATE USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can delete cars." ON cars FOR DELETE USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Bookings
CREATE POLICY "Users can view own bookings." ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings." ON bookings FOR SELECT USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Users can create bookings." ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings." ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update bookings." ON bookings FOR UPDATE USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Payments
CREATE POLICY "Users can view own payments." ON payments FOR SELECT USING (exists (select 1 from bookings where id = payments.booking_id and user_id = auth.uid()));
CREATE POLICY "Users can create payments." ON payments FOR INSERT WITH CHECK (exists (select 1 from bookings where id = booking_id and user_id = auth.uid()));
CREATE POLICY "Admins can view payments." ON payments FOR SELECT USING (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Contact Submissions
CREATE POLICY "Allow public to send messages" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to view messages" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if email is in the admin list
  is_admin := new.email IN (
    'admin@driveyoo.com',
    'csepayaluga01@gmail.com',
    'admin1@driveyoo.com',
    'admin2@driveyoo.com',
    'super@driveyoo.com',
    'root@driveyoo.com',
    'manager@driveyoo.com'
  );

  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    CASE 
      WHEN is_admin THEN 'admin'
      ELSE coalesce(new.raw_user_meta_data->>'role', 'customer')
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
