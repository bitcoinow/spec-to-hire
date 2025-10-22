-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_site_url TEXT,
  category TEXT NOT NULL DEFAULT 'job_news',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can read published blog posts
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

-- Authenticated users can view all blog posts (for admin)
CREATE POLICY "Authenticated users can view all blog posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create blog posts
CREATE POLICY "Authenticated users can create blog posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own blog posts
CREATE POLICY "Authors can update their own blog posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Authors can delete their own blog posts
CREATE POLICY "Authors can delete their own blog posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();