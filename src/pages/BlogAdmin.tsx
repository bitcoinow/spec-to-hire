import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Switch } from "@/components/ui/switch";

const BlogAdmin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("job_news");
  const [jobSiteUrl, setJobSiteUrl] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    loadBlogPosts();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    
    // Check if user has admin role
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (error || !roles) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the blog admin. Only administrators can manage blog posts.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    setIsAdmin(true);
    setLoading(false);
  };

  const loadBlogPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading blog posts:", error);
    } else {
      setBlogPosts(data || []);
    }
  };

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a blog topic",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { topic, category, jobSiteUrl: jobSiteUrl || null },
      });

      if (error) throw error;

      setGeneratedBlog(data);
      toast({
        title: "Blog generated!",
        description: "Review and save your blog post",
      });
    } catch (error: any) {
      console.error("Error generating blog:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBlog = async (published: boolean) => {
    if (!generatedBlog) return;

    try {
      const { error } = await supabase.from("blog_posts").insert({
        title: generatedBlog.title,
        slug: generatedBlog.slug,
        meta_title: generatedBlog.metaTitle,
        meta_description: generatedBlog.metaDescription,
        focus_keyword: generatedBlog.focusKeyword,
        secondary_keywords: generatedBlog.secondaryKeywords,
        excerpt: generatedBlog.excerpt,
        content: generatedBlog.content,
        tags: generatedBlog.tags,
        category: generatedBlog.category,
        job_site_url: generatedBlog.jobSiteUrl,
        image_url: generatedBlog.imageUrl,
        published,
        author_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: published ? "Blog published!" : "Blog saved as draft",
        description: "Blog post saved successfully",
      });

      setGeneratedBlog(null);
      setTopic("");
      setJobSiteUrl("");
      loadBlogPosts();
    } catch (error: any) {
      console.error("Error saving blog:", error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Blog deleted",
        description: "Blog post deleted successfully",
      });
      loadBlogPosts();
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Blog published" : "Blog unpublished",
      });
      loadBlogPosts();
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Blog Admin</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Panel */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Sparkles className="w-5 h-5" />
                Generate Blog Post
              </CardTitle>
              <CardDescription>AI-powered blog generation for job market news</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic">Blog Topic</Label>
                <Textarea
                  id="topic"
                  placeholder="E.g., Latest trends in remote work opportunities..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job_news">Job News</SelectItem>
                    <SelectItem value="hiring_tips">Hiring Tips</SelectItem>
                    <SelectItem value="industry_trends">Industry Trends</SelectItem>
                    <SelectItem value="company_spotlight">Company Spotlight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="jobSiteUrl">Job Site URL (Optional)</Label>
                <Input
                  id="jobSiteUrl"
                  placeholder="https://example-job-site.com"
                  value={jobSiteUrl}
                  onChange={(e) => setJobSiteUrl(e.target.value)}
                />
              </div>

              <Button onClick={generateBlog} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Blog
                  </>
                )}
              </Button>

              {generatedBlog && (
                <div className="mt-6 space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-lg text-foreground">{generatedBlog.title}</h3>
                  <p className="text-sm text-muted-foreground">{generatedBlog.excerpt}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => saveBlog(false)} variant="outline">
                      Save as Draft
                    </Button>
                    <Button onClick={() => saveBlog(true)}>Publish</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blog Posts List */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Published & Draft Posts</CardTitle>
              <CardDescription>Manage your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogPosts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No blog posts yet</p>
                ) : (
                  blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border rounded-lg bg-background space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">{post.category}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Switch
                            checked={post.published}
                            onCheckedChange={() => togglePublish(post.id, post.published)}
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBlog(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogAdmin;
