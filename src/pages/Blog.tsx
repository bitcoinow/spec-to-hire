import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import logo from "@/assets/spec2hire-logo.png";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Spec2Hire Logo" className="w-10 h-10 rounded-lg" />
              <div>
                <h1 className="font-bold text-lg">Spec2Hire</h1>
                <p className="text-xs text-muted-foreground">Blog</p>
              </div>
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedPost(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div className="mb-6">
              <Badge className="mb-4">{selectedPost.category}</Badge>
              <h1 className="text-4xl font-bold mb-4 text-foreground">{selectedPost.title}</h1>
              <p className="text-muted-foreground">
                {new Date(selectedPost.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="text-foreground">
              <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
            </div>

            {selectedPost.job_site_url && (
              <div className="mt-8 p-6 bg-card border rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">Related Job Site</h3>
                <a
                  href={selectedPost.job_site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2 break-all"
                >
                  <span className="break-all">{selectedPost.job_site_url}</span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>
            )}

            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="mt-6 flex gap-2 flex-wrap">
                {selectedPost.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog — Spec2Hire</title>
        <meta name="description" content="Job market insights, career tips, and ATS optimization strategies for job seekers." />
        <link rel="canonical" href="https://spec-to-hire.lovable.app/blog" />
      </Helmet>
      <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Spec2Hire Logo" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="font-bold text-lg">Spec2Hire</h1>
              <p className="text-xs text-muted-foreground">Blog</p>
            </div>
          </Link>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Job Market Insights</h1>
          <p className="text-xl text-muted-foreground">
            Latest news, trends, and tips for job seekers
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="cursor-pointer hover:border-primary transition-colors bg-card"
                onClick={() => setSelectedPost(post)}
              >
                <CardHeader>
                  <Badge className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-card-foreground">{post.title}</CardTitle>
                  <CardDescription className="text-card-foreground/70">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Blog;
