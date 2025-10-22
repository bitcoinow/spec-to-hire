import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
      console.log('Calling generate-cv function...');
      
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated. Please sign in again.');
      }
      
      console.log('User authenticated, calling function...');
      
      const { data, error } = await supabase.functions.invoke('generate-cv', {
        body: {
          jobSpec,
          masterProfile,
        },
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Function error details:', {
          message: error.message,
          name: error.name,
          context: error.context,
          status: error.context?.status
        });
        throw error;
      }

      if (!data) {
        console.error('No data returned from function');
        throw new Error('No data returned from function');
      }

      console.log('Generation successful:', data);
      onGenerate(data);

      toast({
        title: "Success!",
        description: "CV and cover letter generated successfully",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      
      let errorMessage = "Failed to generate documents. Please try again.";
      
      if (error.message?.includes('Not authenticated')) {
        errorMessage = "Session expired. Please refresh the page and sign in again.";
      } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        errorMessage = "Rate limit exceeded. Please try again in a moment.";
      } else if (error.message?.includes('402') || error.message?.includes('credits')) {
        errorMessage = "AI credits depleted. Please add credits to continue.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
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
