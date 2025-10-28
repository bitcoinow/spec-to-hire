import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/spec2hire-logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
            <img 
              src={logo} 
              alt="Spec2Hire company logo" 
              className="w-10 h-10 rounded-lg"
              width="40"
              height="40"
            />
            <div>
              <span className="font-bold text-lg">Spec2Hire</span>
              <p className="text-xs text-muted-foreground">ATS CV Generator</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/faq" className="hidden md:block">
              <Button variant="ghost" aria-label="Frequently Asked Questions">FAQ</Button>
            </Link>
            <Link to="/how-to-use" className="hidden md:block">
              <Button variant="ghost" aria-label="How to use Spec2Hire">How to Use</Button>
            </Link>
            <Link to="/blog" className="hidden sm:block">
              <Button variant="ghost" aria-label="Read our blog">Blog</Button>
            </Link>
            <Link to="/auth" className="hidden sm:block">
              <Button variant="outline" size="sm" aria-label="Sign in to your account">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-gradient-primary" size="sm" aria-label="Get started for free">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-20 max-w-7xl" aria-labelledby="hero-heading">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6" role="status" aria-label="Feature highlight">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              AI-Powered CV Generation
            </div>
            
            <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Turn Any Job Spec into an ATS-Friendly CV in 60 Seconds
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Stop spending hours tailoring CVs. Paste any job description and get ATS-optimized CVs and cover letters instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-gradient-primary text-lg px-8 py-6 focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Generate your CV now">
                  Generate My CV
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Watch 45 second demo video">
                  Watch 45s Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-20" role="list" aria-label="Key features">
            <Card className="shadow-lg border-2 hover:border-primary transition-colors bg-card focus-within:ring-2 focus-within:ring-primary" role="listitem">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-foreground flex items-center justify-center mb-4" aria-hidden="true">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">Lightning Fast</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  Generate tailored CVs in under 30 seconds. No more hours of manual editing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg border-2 hover:border-primary transition-colors bg-card focus-within:ring-2 focus-within:ring-primary" role="listitem">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-foreground flex items-center justify-center mb-4" aria-hidden="true">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">ATS-Optimized</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  Built to pass Applicant Tracking Systems with keyword optimization and proper formatting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg border-2 hover:border-primary transition-colors bg-card focus-within:ring-2 focus-within:ring-primary" role="listitem">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-foreground flex items-center justify-center mb-4" aria-hidden="true">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">AI-Powered Matching</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  Smart algorithms match your experience with job requirements for maximum relevance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* How It Works */}
          <section className="mb-20" aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-4xl font-bold text-center mb-12 text-foreground">How It Works</h2>
            
            <ol className="grid md:grid-cols-4 gap-8" role="list">
              {[
                { step: "1", title: "Create Profile", desc: "Set up your master profile once with all your experience" },
                { step: "2", title: "Paste Job Spec", desc: "Copy any job description you want to apply for" },
                { step: "3", title: "AI Generation", desc: "Our AI analyzes and creates tailored documents" },
                { step: "4", title: "Download & Apply", desc: "Get your CV and cover letter ready to send" },
              ].map((item, i) => (
                <li key={i} className="text-center" role="listitem">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-foreground text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg" aria-label={`Step ${item.step}`}>
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </li>
              ))}
            </ol>
          </section>

        {/* Benefits */}
        <Card className="shadow-xl bg-gradient-to-br from-card to-muted border-2">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-card-foreground">Why Choose Spec2Hire?</h2>
            
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
                  <p className="text-card-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          {/* Testimonials */}
          <section className="mb-20" aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="text-4xl font-bold text-center mb-12 text-foreground">What Our Users Say</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Sarah Mitchell", role: "Software Engineer", text: "Spec2Hire saved me 10+ hours per week. The ATS optimization actually works—I got 3x more interviews!" },
                { name: "James Chen", role: "Product Manager", text: "The AI perfectly matches my experience to job requirements. Best £20 I've spent on my career." },
                { name: "Emily Rodriguez", role: "Marketing Director", text: "Finally landed my dream role! The cover letters are so well-written, I barely need to edit them." },
              ].map((testimonial, i) => (
                <Card key={i} className="shadow-lg bg-card">
                  <CardContent className="pt-6">
                    <p className="text-card-foreground mb-4 italic">"{testimonial.text}"</p>
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

          {/* CTA */}
          <section className="text-center mt-20" aria-labelledby="cta-heading">
            <h2 id="cta-heading" className="text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of job seekers who have streamlined their application process
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-gradient-primary text-lg px-8 py-6 focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Start creating your CV for free">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
          </section>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8" role="contentinfo">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Spec2Hire. All rights reserved.
            </p>
            <nav className="flex items-center gap-6" aria-label="Footer navigation">
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded">
                FAQ
              </Link>
              <Link to="/how-to-use" className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded">
                How to Use
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
