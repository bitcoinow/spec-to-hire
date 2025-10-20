import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MasterProfile, GeneratedResults } from "@/pages/Index";

interface JobSpecInputProps {
  jobSpec: string;
  onJobSpecChange: (spec: string) => void;
  masterProfile: MasterProfile | null;
  onGenerate: (results: GeneratedResults) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export const JobSpecInput = ({
  jobSpec,
  onJobSpecChange,
  masterProfile,
  onGenerate,
  isGenerating,
  setIsGenerating,
}: JobSpecInputProps) => {
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobSpec.trim()) {
      toast({
        title: "Job spec required",
        description: "Please paste a job specification first",
        variant: "destructive",
      });
      return;
    }

    if (!masterProfile) {
      toast({
        title: "Profile required",
        description: "Please set up your master profile first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // TODO: Integrate with Lovable AI for parsing and generation
      // For now, showing a mock result
      const mockResults: GeneratedResults = {
        parsed_job: {
          title: "Sample Role",
          company: "Sample Company",
          must_have: ["Skill 1", "Skill 2"],
          nice_to_have: ["Skill 3"],
          keywords: ["keyword1", "keyword2"],
          responsibilities: ["Responsibility 1", "Responsibility 2"],
        },
        match: {
          score: 0.85,
          keyword_hits: ["keyword1", "keyword2"],
          skill_gaps: [],
          tool_matches: ["Tool 1"],
        },
        cv_text: "Sample CV content...",
        cover_letter: "Sample cover letter content...",
      };

      onGenerate(mockResults);

      toast({
        title: "Success!",
        description: "CV and cover letter generated successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate documents. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Job Specification
        </CardTitle>
        <CardDescription>
          Paste the job description you want to apply for
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={jobSpec}
          onChange={(e) => onJobSpecChange(e.target.value)}
          placeholder="Paste the full job specification here..."
          className="min-h-[400px] font-mono text-sm resize-none"
        />

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !jobSpec.trim() || !masterProfile}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate CV & Cover Letter
            </>
          )}
        </Button>

        {!masterProfile && (
          <p className="text-sm text-warning text-center">
            ⚠️ Please set up your master profile first
          </p>
        )}
      </CardContent>
    </Card>
  );
};
