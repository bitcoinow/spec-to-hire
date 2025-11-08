import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-base">
            Select the plan that works best for you
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
          {/* Free Plan */}
          <Card className="border-2 hover:border-muted-foreground/20 transition-all">
            <CardHeader className="space-y-4">
              <div className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl">Free</CardTitle>
                <CardDescription className="text-sm sm:text-base">Perfect for trying out</CardDescription>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-bold">$0</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm flex-1">3 CV generations per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm flex-1">Basic ATS optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm flex-1">Master profile storage</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full h-11" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-primary relative overflow-hidden hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-primary" />
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Zap className="w-3.5 h-3.5" />
                Popular
              </div>
            </div>
            <CardHeader className="space-y-4 pt-6">
              <div className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl">Pro</CardTitle>
                <CardDescription className="text-sm sm:text-base">For serious job seekers</CardDescription>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">£20</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-semibold flex-1">Unlimited CV generations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm flex-1">Advanced ATS optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm flex-1">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm flex-1">No ads</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-full bg-success/10 p-1 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm flex-1">Direct company sending</span>
                </li>
              </ul>
              <Button 
                className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg" 
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? "Loading..." : "Upgrade to Pro"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
