-- Create storage bucket for CV photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cv-photos', 'cv-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own CV photo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cv-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own photos
CREATE POLICY "Users can update their own CV photo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cv-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own CV photo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cv-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to CV photos
CREATE POLICY "CV photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-photos');

-- Add photo_url column to master_profiles
ALTER TABLE public.master_profiles
ADD COLUMN IF NOT EXISTS photo_url TEXT;