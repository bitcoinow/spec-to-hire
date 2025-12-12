import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { AdSpace } from "@/components/AdSpace";
import logo from "@/assets/spec2hire-logo.png";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const handleSubscribe = async (billingInterval: "monthly" | "yearly") => {
    setLoading(billingInterval);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { billingInterval }
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  interface Plan {
    name: string;
    price: string;
    period?: string;
    originalPrice?: string;
    savings?: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    action: () => void;
  }

  const monthlyPlans: Plan[] = [
    {
      name: "Free Trial",
      price: "$0",
      description: "Try before you buy",
      features: [
        "1 CV generation",
        "1 cover letter",
        "ATS-optimized format",
        "PDF export",
      ],
      cta: "Start Free Trial",
      popular: false,
      action: () => navigate('/auth'),
    },
    {
      name: "Pro Monthly",
      price: "$12.99",
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
      action: () => handleSubscribe("monthly"),
    },
  ];

  const yearlyPlans: Plan[] = [
    {
      name: "Free Trial",
      price: "$0",
      description: "Try before you buy",
      features: [
        "1 CV generation",
        "1 cover letter",
        "ATS-optimized format",
        "PDF export",
      ],
      cta: "Start Free Trial",
      popular: false,
      action: () => navigate('/auth'),
    },
    {
      name: "Pro Yearly",
      price: "$79.99",
      period: "/year",
      originalPrice: "$155.88",
      savings: "Save 49%",
      description: "Best value for job seekers",
      features: [
        "Everything in Pro Monthly",
        "Priority support",
        "Early access to new features",
        "Annual billing discount",
      ],
      cta: "Get Yearly",
      popular: true,
      action: () => handleSubscribe("yearly"),
    },
  ];

  const plans: Plan[] = isYearly ? yearlyPlans : monthlyPlans;

  return (
    <>
      <Helmet>
        <title>Pricing — Spec2Hire</title>
        <meta name="description" content="Choose your plan: Free trial, Pro Monthly ($12.99/month), or Pro Yearly ($79.99/year) for unlimited CVs." />
        <link rel="canonical" href="https://spec-to-hire.lovable.app/pricing" />
      </Helmet>
      <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Spec2Hire Logo" 
              className="w-8 h-8 rounded-lg"
              width="32"
              height="32"
              loading="lazy"
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
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Choose the plan that works for you. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label 
              htmlFor="billing-toggle" 
              className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <div className="flex items-center gap-2">
              <Label 
                htmlFor="billing-toggle" 
                className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                Yearly
              </Label>
              {isYearly && (
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                  Save 49%
                </span>
              )}
            </div>
          </div>
        </div>

        <AdSpace format="horizontal" className="mb-8" slot="pricing-top" />

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
                  {'originalPrice' in plan && plan.originalPrice && (
                    <span className="text-muted-foreground line-through text-lg mr-2">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
                {'savings' in plan && plan.savings && (
                  <div className="mt-2">
                    <span className="bg-accent/20 text-accent-foreground text-sm font-medium px-2 py-1 rounded">
                      {plan.savings}
                    </span>
                  </div>
                )}
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
                  onClick={plan.action}
                  disabled={loading !== null}
                >
                  {(loading === "monthly" && plan.name === "Pro Monthly") || 
                   (loading === "yearly" && plan.name === "Pro Yearly") 
                    ? "Loading..." 
                    : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <AdSpace format="horizontal" className="mt-12 mb-8" slot="pricing-bottom" />

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
    </>
  );
};

export default Pricing;
