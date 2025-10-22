-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update blog_posts policies to restrict publishing to admins
-- Drop the existing policy that allows any authenticated user to update
DROP POLICY IF EXISTS "Authors can update their own blog posts" ON public.blog_posts;

-- Create new policies: Authors can update their drafts, but only admins can publish
CREATE POLICY "Authors can update their own draft posts"
ON public.blog_posts
FOR UPDATE
USING (
  auth.uid() = author_id 
  AND (
    published = false 
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Comment: After running this migration, you need to manually insert admin roles for users
-- Example: INSERT INTO public.user_roles (user_id, role) VALUES ('user-uuid-here', 'admin');