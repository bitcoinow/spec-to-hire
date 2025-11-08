-- Drop the existing delete policy
DROP POLICY IF EXISTS "Authors can delete their own blog posts" ON blog_posts;

-- Create new policy that allows both authors and admins to delete posts
CREATE POLICY "Authors and admins can delete blog posts"
  ON blog_posts
  FOR DELETE
  USING (
    auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role)
  );