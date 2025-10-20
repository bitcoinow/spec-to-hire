import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, FileJson, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { MasterProfile } from "@/pages/Index";
import { Input } from "@/components/ui/input";

interface ProfileEditorProps {
  profile: MasterProfile | null;
  onProfileChange: (profile: MasterProfile) => void;
}

const defaultProfile: MasterProfile = {
  contact: {
    full_name: "Prince Aigbomian",
    city_country: "London, UK",
    phone: "+44...",
    email: "aigpoj@gmail.com",
    links: ["https://linkedin.com/in/...", "https://github.com/..."],
  },
  summary: "QA & Delivery Ops specialist with X years in retail last-mile...",
  skills: {
    core: ["QA", "SDET", "API testing", "Playwright", "JMeter", "Azure DevOps"],
    domains: ["Retail Ops", "Logistics", "Customer Service"],
    tools: ["Jira", "Confluence", "SQL", "Postman", "Git", "Python"],
  },
  experience_snippets: [
    {
      id: "asda_delivery_ops",
      role: "Delivery Operations Associate",
      company: "ASDA",
      dates: "2023–Present",
      bullets: [
        "Optimised delivery slot allocation, reducing late drops by 18% in 90 days.",
        "Managed route exceptions and customer escalations, improving CSAT from 4.2→4.6.",
        "Built QA playbooks for mini-projects (slot changes, pick-pack flow, substitutions).",
      ],
      tags: ["delivery", "logistics", "customer service", "retail", "QA", "leadership"],
    },
    {
      id: "qa_test_analyst",
      role: "QA/Test Analyst",
      company: "Freelance/Projects",
      dates: "2022–2023",
      bullets: [
        "Created Playwright E2E suites (CI via GitHub Actions) cutting regression time by 70%.",
        "Led JMeter load tests (ramp-up, listeners, assertions) for BlazeDemo clone; 0 Sev-1s post-release.",
      ],
      tags: ["qa", "automation", "jmeter", "playwright", "devops"],
    },
  ],
  education: [
    {
      degree: "MSc MBIT",
      school: "University Name",
      year: "2025",
    },
  ],
  certifications: ["Google Cybersecurity (in progress)"],
};

export const ProfileEditor = ({ profile, onProfileChange }: ProfileEditorProps) => {
  const [jsonText, setJsonText] = useState(
    profile ? JSON.stringify(profile, null, 2) : JSON.stringify(defaultProfile, null, 2)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('master_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        const loadedProfile: MasterProfile = {
          contact: data.contact as any,
          summary: data.summary,
          skills: data.skills as any,
          experience_snippets: data.experience_snippets as any,
          education: data.education as any,
          certifications: data.certifications as any,
        };
        setJsonText(JSON.stringify(loadedProfile, null, 2));
        onProfileChange(loadedProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      
      // Validate required fields
      if (!parsed.contact || !parsed.summary || !parsed.skills || !parsed.experience_snippets) {
        toast({
          title: "Invalid profile",
          description: "Profile must include contact, summary, skills, and experience_snippets",
          variant: "destructive",
        });
        return;
      }

      setIsSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save your profile",
          variant: "destructive",
        });
        return;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('master_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('master_profiles')
          .update({
            contact: parsed.contact,
            summary: parsed.summary,
            skills: parsed.skills,
            experience_snippets: parsed.experience_snippets,
            education: parsed.education || null,
            certifications: parsed.certifications || null,
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('master_profiles')
          .insert({
            user_id: user.id,
            contact: parsed.contact,
            summary: parsed.summary,
            skills: parsed.skills,
            experience_snippets: parsed.experience_snippets,
            education: parsed.education || null,
            certifications: parsed.certifications || null,
          });

        if (error) throw error;
      }

      onProfileChange(parsed);
      
      toast({
        title: "Profile saved",
        description: "Your master profile has been saved successfully",
      });
    } catch (error: any) {
      console.error('Save error:', error);
      
      if (error instanceof SyntaxError) {
        toast({
          title: "Invalid JSON",
          description: "Please check your JSON syntax and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save profile",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadExample = () => {
    const exampleJson = JSON.stringify(defaultProfile, null, 2);
    setJsonText(exampleJson);
    onProfileChange(defaultProfile);
    toast({
      title: "Example loaded",
      description: "Edit the example profile to match your information",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Try to parse as JSON
        const parsed = JSON.parse(content);
        setJsonText(JSON.stringify(parsed, null, 2));
        toast({
          title: "File loaded",
          description: "Profile data loaded from file. Click Save to persist.",
        });
      } catch (error) {
        toast({
          title: "Invalid file",
          description: "Please upload a valid JSON file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <Card className="shadow-xl border-2">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="w-5 h-5 text-primary" />
            </div>
            Master Profile
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Your single source of truth for all job applications. Edit the JSON below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleLoadExample}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <FileJson className="w-4 h-4" />
              <span className="hidden sm:inline">Load Example</span>
              <span className="sm:hidden">Example</span>
            </Button>
            <Button
              onClick={loadProfile}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Reload Saved</span>
              <span className="sm:hidden">Reload</span>
            </Button>
            <label htmlFor="file-upload" className="flex-1 sm:flex-none">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2 w-full"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload JSON</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </label>
            <Input
              id="file-upload"
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="relative">
            <Textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste your master profile JSON here..."
              className="min-h-[400px] sm:min-h-[500px] font-mono text-xs sm:text-sm resize-none overflow-auto"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-success hover:opacity-90 transition-opacity shadow-lg"
            size="lg"
          >
            {isSaving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>

          <Card className="bg-muted/30 border-2 border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Profile Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-mono font-semibold text-primary min-w-[120px] sm:min-w-[140px]">contact:</span>
                  <span className="text-muted-foreground">Your basic contact information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-semibold text-primary min-w-[120px] sm:min-w-[140px]">summary:</span>
                  <span className="text-muted-foreground">Professional summary (1-2 lines)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-semibold text-primary min-w-[120px] sm:min-w-[140px]">skills:</span>
                  <span className="text-muted-foreground">Core skills, domains, and tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-semibold text-primary min-w-[120px] sm:min-w-[140px]">experience:</span>
                  <span className="text-muted-foreground">Reusable achievement bullets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-semibold text-primary min-w-[120px] sm:min-w-[140px]">education:</span>
                  <span className="text-muted-foreground">Degrees and institutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-semibold text-primary min-w-[120px] sm:min-w-[140px]">certifications:</span>
                  <span className="text-muted-foreground">Professional certifications</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
