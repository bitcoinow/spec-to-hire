-- Add scheduling columns to blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS scheduled_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published'));

-- Update existing published posts to have 'published' status
UPDATE blog_posts SET status = 'published' WHERE published = true;
UPDATE blog_posts SET status = 'draft' WHERE published = false;

-- Create automation settings table
CREATE TABLE IF NOT EXISTS blog_automation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled boolean DEFAULT false,
  frequency text DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  categories text[] DEFAULT ARRAY['job_news']::text[],
  auto_publish boolean DEFAULT true,
  last_generated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on automation settings
ALTER TABLE blog_automation_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage automation settings
CREATE POLICY "Admins can manage automation settings"
ON blog_automation_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automation settings updated_at
CREATE TRIGGER update_blog_automation_settings_updated_at
  BEFORE UPDATE ON blog_automation_settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert default automation settings if none exist
INSERT INTO blog_automation_settings (id, enabled, frequency, categories, auto_publish)
SELECT gen_random_uuid(), false, 'weekly', ARRAY['job_news']::text[], true
WHERE NOT EXISTS (SELECT 1 FROM blog_automation_settings);