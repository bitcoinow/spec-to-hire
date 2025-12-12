import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { BlogCalendar } from "@/components/BlogCalendar";
import { BlogAutomationSettings } from "@/components/BlogAutomationSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const BlogAdmin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("job_news");
  const [jobSiteUrl, setJobSiteUrl] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [showSchedulePicker, setShowSchedulePicker] = useState<string | null>(null);
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

  const saveBlog = async (published: boolean, scheduleDate?: Date) => {
    if (!generatedBlog) return;

    try {
      const status = scheduleDate ? 'scheduled' : (published ? 'published' : 'draft');
      
      const { error } = await supabase.from("blog_posts").insert({
        title: generatedBlog.title,
        slug: generatedBlog.slug,
        excerpt: generatedBlog.excerpt,
        content: generatedBlog.content,
        tags: generatedBlog.tags,
        category: generatedBlog.category,
        job_site_url: generatedBlog.jobSiteUrl,
        image_url: generatedBlog.imageUrl || (generatedBlog.imageUrls?.[0] || null),
        image_urls: generatedBlog.imageUrls || null,
        published: published && !scheduleDate,
        status,
        scheduled_at: scheduleDate?.toISOString() || null,
        author_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: scheduleDate ? "Blog scheduled!" : (published ? "Blog published!" : "Blog saved as draft"),
        description: scheduleDate 
          ? `Blog post scheduled for ${format(scheduleDate, "PPP 'at' p")}`
          : "Blog post saved successfully",
      });

      setGeneratedBlog(null);
      setTopic("");
      setJobSiteUrl("");
      setScheduledDate(undefined);
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

  const scheduleExistingPost = async (postId: string, date: Date) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ 
          scheduled_at: date.toISOString(),
          status: 'scheduled',
          published: false
        })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post scheduled",
        description: `Scheduled for ${format(date, "PPP 'at' p")}`,
      });
      
      setShowSchedulePicker(null);
      loadBlogPosts();
    } catch (error: any) {
      console.error("Error scheduling post:", error);
      toast({
        title: "Scheduling failed",
        description: error.message || "Failed to schedule post",
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

  const generateImagesForPost = async (id: string, title: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-images", {
        body: { blogId: id },
      });

      if (error) throw error;

      toast({
        title: "Images generated!",
        description: `Generated ${data.imageUrls?.length || 0} images for "${title}"`,
      });
      loadBlogPosts();
    } catch (error: any) {
      console.error("Error generating images:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Blog Admin</h1>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
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
                    <SelectItem value="tech_news">Tech News</SelectItem>
                    <SelectItem value="ai_trends">AI & Automation</SelectItem>
                    <SelectItem value="companies_hiring">Companies Hiring</SelectItem>
                    <SelectItem value="market_insights">Market Insights</SelectItem>
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
                  {generatedBlog.imageUrls && generatedBlog.imageUrls.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {generatedBlog.imageUrls.length} image{generatedBlog.imageUrls.length > 1 ? 's' : ''} generated
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {generatedBlog.imageUrls.slice(0, 3).map((url: string, idx: number) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Blog preview ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => saveBlog(false)} variant="outline" size="sm">
                      Save as Draft
                    </Button>
                    <Button onClick={() => saveBlog(true)} size="sm">Publish Now</Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="secondary" size="sm">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={(date) => {
                            setScheduledDate(date);
                            if (date) saveBlog(false, date);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                          {!post.image_urls || post.image_urls.length === 0 ? (
                            <p className="text-xs text-orange-500 mt-1">No images</p>
                          ) : (
                            <p className="text-xs text-green-600 mt-1">
                              {post.image_urls.length} image{post.image_urls.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                          {(!post.image_urls || post.image_urls.length === 0) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateImagesForPost(post.id, post.title)}
                              disabled={loading}
                            >
                              <Sparkles className="w-4 h-4" />
                            </Button>
                          )}
                          {post.status === 'draft' && (
                            <Popover open={showSchedulePicker === post.id} onOpenChange={(open) => setShowSchedulePicker(open ? post.id : null)}>
                              <PopoverTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <CalendarIcon className="w-4 h-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  onSelect={(date) => date && scheduleExistingPost(post.id, date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
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
          </TabsContent>

          <TabsContent value="schedule">
            <BlogCalendar 
              posts={blogPosts} 
              onDateSelect={(date) => console.log('Selected date:', date)} 
            />
          </TabsContent>

          <TabsContent value="automation">
            <div className="max-w-2xl mx-auto">
              <BlogAutomationSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BlogAdmin;
