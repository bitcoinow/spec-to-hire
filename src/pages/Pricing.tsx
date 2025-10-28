import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/spec2hire-logo.png";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free Trial",
      price: "£0",
      description: "Try before you buy",
      features: [
        "1 CV generation",
        "1 cover letter",
        "ATS-optimized format",
        "PDF export",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Pro",
      price: "£20",
      period: "/month",
      description: "For active job seekers",
      features: [
        "Unlimited CV generations",
        "Unlimited cover letters",
        "ATS-optimized format",
        "PDF & DOCX export",
        "Master profile storage",
        "Match score analysis",
        "Priority support",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "One-Time",
      price: "£5",
      period: "/CV",
      description: "Pay as you go",
      features: [
        "Single CV generation",
        "Single cover letter",
        "ATS-optimized format",
        "PDF & DOCX export",
        "Valid for 7 days",
      ],
      cta: "Buy Credits",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Spec2Hire Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-semibold text-foreground">Spec2Hire</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-sm text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Button onClick={() => navigate('/auth')} size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the plan that works for you. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-semibold tracking-tight mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-[15px] leading-relaxed">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-[15px] leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full text-sm font-semibold"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate('/auth')}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            All plans include ATS-optimized formatting and secure data handling.
          </p>
          <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">
            Need a custom plan? <Link to="/faq" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
