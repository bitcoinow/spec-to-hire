import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Download, Copy, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedResults } from "@/pages/Index";
import { MatchScore } from "./MatchScore";

interface ResultsPanelProps {
  results: GeneratedResults | null;
  isGenerating: boolean;
}

export const ResultsPanel = ({ results, isGenerating }: ResultsPanelProps) => {
  const { toast } = useToast();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (isGenerating) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Generating your documents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="shadow-lg bg-gradient-card">
        <CardContent className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Ready to Generate</h3>
              <p className="text-muted-foreground text-sm">
                Paste a job specification and your master profile to generate an ATS-optimized CV and cover letter
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Generated Results
            </CardTitle>
            <CardDescription>
              {results.parsed_job.title} at {results.parsed_job.company}
            </CardDescription>
          </div>
          <MatchScore score={results.match.score} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="cover">Cover Letter</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="cv" className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => handleCopy(results.cv_text, "CV")}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="bg-card border rounded-lg p-6 max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {results.cv_text}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="cover" className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => handleCopy(results.cover_letter, "Cover letter")}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="bg-card border rounded-lg p-6 max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {results.cover_letter}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.match.keyword_hits.map((keyword, i) => (
                    <Badge key={i} variant="default" className="bg-success">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Tool Matches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.match.tool_matches.map((tool, i) => (
                    <Badge key={i} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              {results.match.skill_gaps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    Skill Gaps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results.match.skill_gaps.map((gap, i) => (
                      <Badge key={i} variant="outline" className="border-warning text-warning">
                        {gap}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3">Job Requirements</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Must Have:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {results.parsed_job.must_have.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Nice to Have:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {results.parsed_job.nice_to_have.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
