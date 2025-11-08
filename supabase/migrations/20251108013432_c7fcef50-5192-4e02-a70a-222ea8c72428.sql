-- Add image_urls array column to support multiple images per blog post
ALTER TABLE blog_posts ADD COLUMN image_urls text[];

-- Migrate existing single image_url to image_urls array
UPDATE blog_posts 
SET image_urls = ARRAY[image_url]::text[]
WHERE image_url IS NOT NULL;

-- Keep image_url for backward compatibility but make it nullable
-- New blogs will use image_urls array