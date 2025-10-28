-- Create waitlist table for storing preview CV requests
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  job_spec TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'sent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Create index on status for filtering
CREATE INDEX idx_waitlist_status ON public.waitlist(status);

-- Create index on created_at for sorting
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for waitlist form)
CREATE POLICY "Anyone can submit to waitlist"
ON public.waitlist
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy for admins to view all waitlist entries
CREATE POLICY "Authenticated users can view waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (true);