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
import { AdSpace } from "@/components/AdSpace";

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
              <img 
                src={logo} 
                alt="Spec2Hire Logo" 
                className="w-10 h-10 rounded-lg"
                width="40"
                height="40"
                loading="lazy"
              />
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
            <div className="mb-8">
              <Badge className="mb-4">{selectedPost.category}</Badge>
              <h1 className="text-4xl font-bold mb-4 text-foreground leading-tight">{selectedPost.title}</h1>
              <p className="text-muted-foreground mb-6">
                {new Date(selectedPost.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              
              {selectedPost.image_url && (
                <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
                  <img 
                    src={selectedPost.image_url} 
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              )}
            </div>

            {/* Ad Space - Top of Content */}
            <div className="my-8">
              <AdSpace slot="1234567890" format="horizontal" />
            </div>

            <div className="text-foreground blog-content">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-foreground" {...props} />,
                  ul: ({node, ...props}) => <ul className="mb-4 ml-6 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="mb-4 ml-6 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                }}
              >
                {selectedPost.content}
              </ReactMarkdown>
            </div>

            {/* Ad Space - After Content */}
            <div className="my-8">
              <AdSpace slot="0987654321" format="horizontal" />
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
            <img 
              src={logo} 
              alt="Spec2Hire Logo" 
              className="w-10 h-10 rounded-lg"
              width="40"
              height="40"
              loading="lazy"
            />
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

        {/* Ad Space - Top of Blog List */}
        <div className="mb-8">
          <AdSpace slot="1122334455" format="horizontal" />
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
                className="cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg bg-card overflow-hidden"
                onClick={() => setSelectedPost(post)}
              >
                {post.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader>
                  <Badge className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-card-foreground line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="text-card-foreground/70 line-clamp-3">{post.excerpt}</CardDescription>
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

        {/* Ad Space - Bottom of Blog List */}
        {!loading && blogPosts.length > 0 && (
          <div className="mt-8">
            <AdSpace slot="5544332211" format="horizontal" />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Blog;
