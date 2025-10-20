import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MasterProfile } from "@/pages/Index";

interface ProfileEditorProps {
  profile: MasterProfile | null;
  onProfileChange: (profile: MasterProfile) => void;
}

const defaultProfile: MasterProfile = {
  contact: {
    full_name: "Your Name",
    city_country: "City, Country",
    phone: "+44...",
    email: "your.email@example.com",
    links: ["https://linkedin.com/in/yourprofile", "https://github.com/yourprofile"],
  },
  summary: "Your professional summary goes here...",
  skills: {
    core: ["Skill 1", "Skill 2", "Skill 3"],
    domains: ["Domain 1", "Domain 2"],
    tools: ["Tool 1", "Tool 2", "Tool 3"],
  },
  experience_snippets: [
    {
      id: "example_role",
      role: "Your Role",
      company: "Company Name",
      dates: "2023–Present",
      bullets: [
        "Achievement 1 with metrics...",
        "Achievement 2 with metrics...",
      ],
      tags: ["tag1", "tag2", "tag3"],
    },
  ],
  education: [
    {
      degree: "Your Degree",
      school: "University Name",
      year: "2023",
    },
  ],
  certifications: ["Certification 1", "Certification 2"],
};

export const ProfileEditor = ({ profile, onProfileChange }: ProfileEditorProps) => {
  const [jsonText, setJsonText] = useState(
    profile ? JSON.stringify(profile, null, 2) : JSON.stringify(defaultProfile, null, 2)
  );
  const { toast } = useToast();

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onProfileChange(parsed);
      toast({
        title: "Profile saved",
        description: "Your master profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again",
        variant: "destructive",
      });
    }
  };

  const handleLoadExample = () => {
    setJsonText(JSON.stringify(defaultProfile, null, 2));
    toast({
      title: "Example loaded",
      description: "Edit the example profile to match your information",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Master Profile
          </CardTitle>
          <CardDescription>
            Your single source of truth for all job applications. Edit the JSON below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleLoadExample}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              Load Example
            </Button>
          </div>

          <Textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Paste your master profile JSON here..."
            className="min-h-[500px] font-mono text-sm resize-none"
          />

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-success hover:opacity-90 transition-opacity"
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>

          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
            <p className="font-semibold">Profile Structure:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>contact:</strong> Your basic contact information</li>
              <li><strong>summary:</strong> Professional summary (1-2 lines)</li>
              <li><strong>skills:</strong> Core skills, domains, and tools</li>
              <li><strong>experience_snippets:</strong> Reusable achievement bullets</li>
              <li><strong>education:</strong> Degrees and institutions</li>
              <li><strong>certifications:</strong> Professional certifications</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
