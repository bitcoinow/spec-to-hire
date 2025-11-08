-- Add image_url column to blog_posts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'blog_posts' 
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.blog_posts ADD COLUMN image_url TEXT;
  END IF;
END $$;