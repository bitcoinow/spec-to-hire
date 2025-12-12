import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shield, Zap, CheckCircle2, Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/spec2hire-logo.png";
import StructuredData from "@/components/StructuredData";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, created_at, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (data) setLatestPosts(data);
    };
    fetchLatestPosts();
  }, []);

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatCategory = (cat: string) => cat?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <Helmet>
        <title>Spec2Hire — ATS CV in 60 Seconds</title>
        <meta name="description" content="Paste any job description and get a tailored, ATS-optimized CV + cover letter." />
        <link rel="canonical" href="https://spec-to-hire.lovable.app/" />
      </Helmet>
      <StructuredData />
      <div className="min-h-screen bg-background">
        {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
            <img 
              src={logo} 
              alt="Spec2Hire company logo" 
              className="w-8 h-8 rounded-lg"
              width="32"
              height="32"
              loading="eager"
              fetchPriority="high"
            />
            <span className="font-semibold text-foreground">Spec2Hire</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button onClick={scrollToDemo} className="hidden md:block text-sm text-foreground hover:text-primary transition-colors">
              How it works
            </button>
            <Link to="/pricing" className="hidden md:block text-sm text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/blog" className="hidden md:block text-sm text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <ThemeToggle />
            <Link 
              to="/auth"
              className="inline-flex items-center rounded-lg border border-primary bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="bg-gradient-to-b from-background to-muted/30" aria-labelledby="hero-heading">
          <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]" style={{ contentVisibility: 'auto' }}>
                  ATS-friendly CV & cover letter in <span className="font-display">60 seconds</span>
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  Paste any job spec. We tailor your CV, optimize for ATS, and draft a matching cover letter instantly.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link 
                    to="/auth"
                    className="rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:opacity-90 transition-opacity"
                  >
                    Start Free Trial
                  </Link>
                  <button 
                    onClick={scrollToDemo}
                    className="rounded-lg border border-border px-5 py-3 hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                    Watch 45s demo
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">First 3 exports free • No credit card required</p>
              </div>

              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div id="demo" className="aspect-video rounded-lg bg-muted grid place-items-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <span className="text-muted-foreground">Demo video coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-12 max-w-6xl" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className="text-2xl font-semibold tracking-tight mb-6">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Paste job spec", desc: "We parse skills, responsibilities, and must-have keywords." },
              { icon: Shield, title: "Import your base CV", desc: "Drag-drop .docx or paste experience; we map it to the role." },
              { icon: Sparkles, title: "Export & apply", desc: "Download ATS-friendly PDF/DOCX + a tailored cover letter." }
            ].map(({ icon: Icon, title, desc }, idx) => (
              <Card key={title} className={`rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 group hover-card-${idx + 1}`}>
                <CardContent className="p-5">
                  <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>


        {/* Benefits */}
        <Card className="shadow-xl bg-gradient-to-br from-card to-muted border-2">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-8 text-card-foreground">Why Choose Spec2Hire?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "ATS-compliant formatting that passes automated screening",
                "Keyword optimization matching job requirements",
                "Quantified achievements with metrics and outcomes",
                "Professional cover letters mirroring company language",
                "Match scoring to track application strength",
                "Reusable master profile for all applications",
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                  <p className="text-[15px] leading-relaxed text-card-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          {/* Testimonials */}
          <section className="mt-24 mb-20" aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="text-4xl font-bold tracking-tight text-center mb-12 text-foreground">What Our Users Say</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Sarah Mitchell", role: "Software Engineer", text: "Spec2Hire saved me 10+ hours per week. The ATS optimization actually works—I got 3x more interviews!" },
                { name: "James Chen", role: "Product Manager", text: "The AI perfectly matches my experience to job requirements. Best £20 I've spent on my career." },
                { name: "Emily Rodriguez", role: "Marketing Director", text: "Finally landed my dream role! The cover letters are so well-written, I barely need to edit them." },
              ].map((testimonial, i) => (
                <Card key={i} className={`shadow-lg bg-card transition-all duration-300 group hover-card-${i + 1}`}>
                  <CardContent className="pt-6">
                    <p className="text-[15px] leading-relaxed text-card-foreground mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Social Proof */}
          <section className="mb-20 text-center" aria-labelledby="social-proof-heading">
            <p className="text-sm text-muted-foreground mb-6" id="social-proof-heading">TRUSTED BY JOB SEEKERS AT</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
              <div className="text-2xl font-bold text-foreground">Google</div>
              <div className="text-2xl font-bold text-foreground">Microsoft</div>
              <div className="text-2xl font-bold text-foreground">Amazon</div>
              <div className="text-2xl font-bold text-foreground">Meta</div>
              <div className="text-2xl font-bold text-foreground">Apple</div>
            </div>
          </section>

        {/* Latest News & Insights */}
        {latestPosts.length > 0 && (
          <section className="container mx-auto px-4 py-16 max-w-6xl" aria-labelledby="news-heading">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="news-heading" className="text-3xl font-bold tracking-tight text-foreground">Latest News & Insights</h2>
                <p className="text-muted-foreground mt-2">Stay updated with job market trends, AI, and career tips</p>
              </div>
              <Link 
                to="/blog" 
                className="hidden md:inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                View all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {latestPosts.map((post, i) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className={`h-full overflow-hidden hover:shadow-lg transition-all duration-300 group hover-card-${i + 1}`}>
                    {post.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {formatCategory(post.category)}
                      </span>
                      <h3 className="font-semibold text-lg mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <p className="text-xs text-muted-foreground mt-3">
                        {new Date(post.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                View all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-24 max-w-3xl text-center" aria-labelledby="cta-heading">
          <Card className="rounded-2xl border bg-card shadow-lg">
            <CardContent className="p-12">
              <h2 id="cta-heading" className="text-3xl font-bold tracking-tight text-card-foreground mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Join thousands of job seekers who have transformed their applications with Spec2Hire
              </p>
              <Link 
                to="/auth"
                className="inline-flex items-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                Start Your Free Trial
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                First 3 exports free • No credit card required
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8" role="contentinfo">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Spec2Hire. All rights reserved.</span>
            <nav className="flex gap-4" aria-label="Footer navigation">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </nav>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Landing;
