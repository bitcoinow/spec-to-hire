-- Fix security issue: Restrict waitlist SELECT to admins only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view waitlist" ON public.waitlist;

-- Create new restrictive policy - only admins can view waitlist data
CREATE POLICY "Only admins can view waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));