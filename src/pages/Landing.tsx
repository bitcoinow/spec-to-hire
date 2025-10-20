import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Sparkles, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Spec2Hire</h1>
              <p className="text-xs text-muted-foreground">ATS CV Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/faq">
              <Button variant="ghost">FAQ</Button>
            </Link>
            <Link to="/how-to-use">
              <Button variant="ghost">How to Use</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-gradient-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered CV Generation
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Transform Job Specs into Perfect CVs in Seconds
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Stop spending hours tailoring your CV for each application. Spec2Hire uses advanced AI to parse job descriptions and generate ATS-optimized CVs and cover letters that get you noticed.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-gradient-primary text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/how-to-use">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <Card className="shadow-lg border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Generate tailored CVs in under 30 seconds. No more hours of manual editing.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>ATS-Optimized</CardTitle>
              <CardDescription>
                Built to pass Applicant Tracking Systems with keyword optimization and proper formatting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-success flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-success-foreground" />
              </div>
              <CardTitle>AI-Powered Matching</CardTitle>
              <CardDescription>
                Smart algorithms match your experience with job requirements for maximum relevance.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Profile", desc: "Set up your master profile once with all your experience" },
              { step: "2", title: "Paste Job Spec", desc: "Copy any job description you want to apply for" },
              { step: "3", title: "AI Generation", desc: "Our AI analyzes and creates tailored documents" },
              { step: "4", title: "Download & Apply", desc: "Get your CV and cover letter ready to send" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <Card className="shadow-xl bg-gradient-card border-2">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Spec2Hire?</h2>
            
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
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-20">
          <h2 className="text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of job seekers who have streamlined their application process
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="bg-gradient-primary text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 Spec2Hire. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
              <Link to="/how-to-use" className="text-sm text-muted-foreground hover:text-foreground">
                How to Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
