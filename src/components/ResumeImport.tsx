import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Loader2, Sparkles, Copy } from "lucide-react";

interface ResumeImportProps {
  onProfileImported: (profile: any) => void;
}

export const ResumeImport = ({ onProfileImported }: ResumeImportProps) => {
  const [resumeText, setResumeText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll read text files. For PDF/DOCX, user should paste text
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      setResumeText(text);
      toast({
        title: "File loaded",
        description: "Resume text loaded. Click 'Parse Resume' to extract your profile.",
      });
    } else {
      toast({
        title: "Paste your resume text",
        description: "For PDF/DOCX files, please copy and paste the text content directly.",
        variant: "destructive",
      });
    }
  };

  const handleParse = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "No resume text",
        description: "Please paste your resume text first.",
        variant: "destructive",
      });
      return;
    }

    setIsParsing(true);
    setParsedPreview(null);

    try {
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText }
      });

      if (error) throw error;

      if (data.profile) {
        setParsedPreview(data.profile);
        toast({
          title: "Resume parsed!",
          description: "Review the extracted data and click 'Use This Profile' to import.",
        });
      }
    } catch (error: any) {
      console.error('Parse error:', error);
      toast({
        title: "Parse failed",
        description: error.message || "Failed to parse resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleUseProfile = () => {
    if (parsedPreview) {
      onProfileImported(parsedPreview);
      toast({
        title: "Profile imported!",
        description: "Your resume has been imported to your master profile.",
      });
      setResumeText("");
      setParsedPreview(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Import Resume
          </CardTitle>
          <CardDescription>
            Paste your resume text or upload a text file to auto-populate your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.text"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Upload Text File
            </Button>
          </div>

          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here...

Example:
John Doe
Software Engineer | john@email.com | (555) 123-4567

SUMMARY
Experienced software engineer with 5+ years in full-stack development...

EXPERIENCE
Senior Developer at Tech Corp (2020-Present)
• Led team of 5 developers on major product launch
• Reduced load times by 40% through optimization

SKILLS
JavaScript, TypeScript, React, Node.js, Python..."
            className="min-h-[300px] font-mono text-sm"
          />

          <Button
            onClick={handleParse}
            disabled={isParsing || !resumeText.trim()}
            className="w-full gap-2"
          >
            {isParsing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Parsing Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Parse Resume with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {parsedPreview && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-accent" />
              Extracted Profile Preview
            </CardTitle>
            <CardDescription>
              Review the extracted data before importing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p><strong>Name:</strong> {parsedPreview.contact?.name || 'Not found'}</p>
                  <p><strong>Email:</strong> {parsedPreview.contact?.email || 'Not found'}</p>
                  <p><strong>Phone:</strong> {parsedPreview.contact?.phone || 'Not found'}</p>
                  <p><strong>Location:</strong> {parsedPreview.contact?.location || 'Not found'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {[
                    ...(parsedPreview.skills?.technical || []),
                    ...(parsedPreview.skills?.tools || [])
                  ].slice(0, 8).map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {(parsedPreview.skills?.technical?.length || 0) + (parsedPreview.skills?.tools?.length || 0) > 8 && (
                    <span className="text-xs text-muted-foreground">
                      +{(parsedPreview.skills?.technical?.length || 0) + (parsedPreview.skills?.tools?.length || 0) - 8} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Experience ({parsedPreview.experience_snippets?.length || 0} positions)</h4>
              <div className="space-y-2">
                {parsedPreview.experience_snippets?.slice(0, 2).map((exp: any, i: number) => (
                  <div key={i} className="text-sm p-2 bg-muted/50 rounded">
                    <p className="font-medium">{exp.title} at {exp.company}</p>
                    <p className="text-muted-foreground text-xs">{exp.years}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleUseProfile} className="flex-1 gap-2">
                <Copy className="h-4 w-4" />
                Use This Profile
              </Button>
              <Button variant="outline" onClick={() => setParsedPreview(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
