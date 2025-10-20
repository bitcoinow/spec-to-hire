import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { JobSpecInput } from "@/components/JobSpecInput";
import { ProfileEditor } from "@/components/ProfileEditor";
import { ResultsPanel } from "@/components/ResultsPanel";
import { AdSpace } from "@/components/AdSpace";
import { PricingModal } from "@/components/PricingModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { Crown } from "lucide-react";

export interface MasterProfile {
  contact: {
    full_name: string;
    city_country: string;
    phone: string;
    email: string;
    links: string[];
  };
  summary: string;
  skills: {
    core: string[];
    domains: string[];
    tools: string[];
  };
  experience_snippets: Array<{
    id: string;
    role: string;
    company: string;
    dates: string;
    bullets: string[];
    tags: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  certifications?: string[];
}

export interface ParsedJob {
  title: string;
  company?: string;
  seniority?: string;
  location?: string;
  must_have: string[];
  nice_to_have: string[];
  keywords: string[];
  responsibilities: string[];
}

export interface GeneratedResults {
  parsed_job: ParsedJob;
  match: {
    score: number;
    keyword_hits: string[];
    skill_gaps: string[];
    tool_matches: string[];
  };
  cv_text: string;
  cover_letter: string;
}

const Index = () => {
  const [jobSpec, setJobSpec] = useState("");
  const [masterProfile, setMasterProfile] = useState<MasterProfile | null>(null);
  const [results, setResults] = useState<GeneratedResults | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'profile' ? 'profile' : 'generate';
  const [isPro, setIsPro] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('master_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          const loadedProfile: MasterProfile = {
            contact: data.contact as any,
            summary: data.summary,
            skills: data.skills as any,
            experience_snippets: data.experience_snippets as any,
            education: data.education as any,
            certifications: data.certifications as any,
          };
          setMasterProfile(loadedProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (!error && data) {
          setIsPro(data.subscribed || false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };
    
    loadProfile();
    checkSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {!isPro && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-semibold">Free Plan:</span> 3 generations remaining this month
              </p>
              <Button size="sm" onClick={() => setPricingOpen(true)}>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Generate Your Perfect CV
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform job specs into ATS-ready CVs in seconds
          </p>
        </div>

        {!isPro && (
          <AdSpace format="horizontal" className="mb-6" slot="top-banner" />
        )}

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="profile">Master Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <JobSpecInput
                  jobSpec={jobSpec}
                  onJobSpecChange={setJobSpec}
                  masterProfile={masterProfile}
                  onGenerate={(generatedResults) => {
                    setResults(generatedResults);
                    setIsGenerating(false);
                  }}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                />
                {!isPro && (
                  <AdSpace format="square" slot="sidebar-1" />
                )}
              </div>
              
              <ResultsPanel results={results} isGenerating={isGenerating} />
            </div>
            
            {!isPro && (
              <AdSpace format="horizontal" className="mt-6" slot="bottom-banner" />
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileEditor
              profile={masterProfile}
              onProfileChange={setMasterProfile}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <PricingModal open={pricingOpen} onOpenChange={setPricingOpen} />
    </div>
  );
};

export default Index;
