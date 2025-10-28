import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Shield, Zap, CheckCircle2, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/spec2hire-logo.png";
import StructuredData from "@/components/StructuredData";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [jobSpec, setJobSpec] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !jobSpec) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('submit-waitlist', {
        body: { email, jobSpec }
      });

      if (error) throw error;

      toast.success("Thanks! We'll send your preview CV soon.");
      setEmail("");
      setJobSpec("");
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
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
            <button 
              onClick={scrollToWaitlist}
              className="inline-flex items-center rounded-lg border border-primary bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Generate my CV
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="bg-gradient-to-b from-background to-muted/30" aria-labelledby="hero-heading">
          <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                  Turn any job spec into an ATS-friendly CV & cover letter in <span className="font-display">60 seconds</span>.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Paste the job description. We tailor your CV to the role, optimize for ATS, and draft a matching cover letter.
                </p>
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={scrollToWaitlist}
                    className="rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:opacity-90 transition-opacity"
                  >
                    Generate my CV
                  </button>
                  <button 
                    onClick={scrollToDemo}
                    className="rounded-lg border border-border px-5 py-3 hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                    Watch 45s demo
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">No sign-up required for the first export.</p>
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
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <Icon className="w-8 h-8 text-primary mb-3" aria-hidden="true" />
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
          <section className="mb-20" aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="text-4xl font-bold tracking-tight text-center mb-12 text-foreground">What Our Users Say</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Sarah Mitchell", role: "Software Engineer", text: "Spec2Hire saved me 10+ hours per week. The ATS optimization actually works—I got 3x more interviews!" },
                { name: "James Chen", role: "Product Manager", text: "The AI perfectly matches my experience to job requirements. Best £20 I've spent on my career." },
                { name: "Emily Rodriguez", role: "Marketing Director", text: "Finally landed my dream role! The cover letters are so well-written, I barely need to edit them." },
              ].map((testimonial, i) => (
                <Card key={i} className="shadow-lg bg-card">
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

        {/* Waitlist / First Run */}
        <section id="waitlist" className="container mx-auto px-4 pb-24 max-w-3xl" aria-labelledby="waitlist-heading">
          <Card className="rounded-2xl border bg-card shadow-lg">
            <CardContent className="p-6">
              <h2 id="waitlist-heading" className="text-xl font-semibold tracking-tight text-card-foreground mb-4">
                Try it now (free first export)
              </h2>
              <form onSubmit={handleWaitlistSubmit} className="grid gap-4">
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                  aria-label="Your email address"
                />
                <Textarea
                  name="jobSpec"
                  required
                  rows={6}
                  placeholder="Paste job description…"
                  value={jobSpec}
                  onChange={(e) => setJobSpec(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                  aria-label="Job specification"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Submitting..." : "Generate preview"}
                </Button>
              </form>
              <p className="mt-2 text-xs text-muted-foreground">
                We never share your data. You can delete uploads at any time.
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
              <Link to="/faq" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/how-to-use" className="hover:text-foreground transition-colors">Terms</Link>
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
