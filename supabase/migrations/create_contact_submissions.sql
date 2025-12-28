-- Create the contact_submissions table
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new', -- new, read, replied
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.contact_submissions enable row level security;

-- Policy: Allow anyone (anon) to insert messages
create policy "Allow public to send messages"
  on public.contact_submissions
  for insert
  with check (true);

-- Policy: Allow admins to view all messages
-- Assuming you have an 'is_admin' function or similar role check. 
-- For now, we'll allow authenticated users to read (or restrict if you have a specific admin role setup)
create policy "Allow authenticated users to view messages"
  on public.contact_submissions
  for select
  using (auth.role() = 'authenticated');
