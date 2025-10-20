import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { JobSpecInput } from "@/components/JobSpecInput";
import { ProfileEditor } from "@/components/ProfileEditor";
import { ResultsPanel } from "@/components/ResultsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Generate Your Perfect CV
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform job specs into ATS-ready CVs in seconds
          </p>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="profile">Master Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
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
              
              <ResultsPanel results={results} isGenerating={isGenerating} />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileEditor
              profile={masterProfile}
              onProfileChange={setMasterProfile}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
