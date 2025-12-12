import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Layout, FileText, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateStyle = "modern" | "classic" | "minimal" | "executive" | "creative";

interface Template {
  id: TemplateStyle;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  preview: string;
}

interface ResumeTemplatesProps {
  selectedTemplate: TemplateStyle;
  onSelectTemplate: (template: TemplateStyle) => void;
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Pro",
    description: "Clean, contemporary design with subtle accents",
    icon: <Layout className="w-5 h-5" />,
    features: ["Two-column layout", "Skills sidebar", "Color accents"],
    preview: "border-l-4 border-primary",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format favored by recruiters",
    icon: <FileText className="w-5 h-5" />,
    features: ["Single column", "Conservative style", "ATS-optimized"],
    preview: "border-t-4 border-muted-foreground",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant with focus on content",
    icon: <Sparkles className="w-5 h-5" />,
    features: ["Clean spacing", "Light borders", "Typography focus"],
    preview: "border border-border",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior roles",
    icon: <Briefcase className="w-5 h-5" />,
    features: ["Bold headers", "Summary emphasis", "Professional tone"],
    preview: "border-b-4 border-primary",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with unique visual elements",
    icon: <GraduationCap className="w-5 h-5" />,
    features: ["Icon integration", "Visual hierarchy", "Modern fonts"],
    preview: "bg-gradient-to-br from-primary/5 to-accent/5",
  },
];

export const ResumeTemplates = ({ selectedTemplate, onSelectTemplate }: ResumeTemplatesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="w-5 h-5" />
          CV Templates
        </CardTitle>
        <CardDescription>
          Choose a template style for your generated CV
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={cn(
                "relative p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              )}
              
              {/* Preview */}
              <div className={cn(
                "h-20 rounded-md bg-muted mb-3 flex items-center justify-center",
                template.preview
              )}>
                <div className="text-muted-foreground">
                  {template.icon}
                </div>
              </div>
              
              <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {feature}
                  </Badge>
                ))}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Template formatting functions for CV generation
export const getTemplatePrompt = (style: TemplateStyle): string => {
  const prompts: Record<TemplateStyle, string> = {
    modern: `FORMAT STYLE: Modern Professional
- Use a clean two-column mental layout where appropriate
- Include visual separators between sections (----)
- Use bullet points with "•" symbol
- Put skills in a compact, categorized format
- Add subtle section markers like "▪" for subsections`,
    
    classic: `FORMAT STYLE: Classic Traditional
- Use single column layout
- Clear section headings in CAPITALS
- Standard bullet points with "-"
- Chronological experience listing
- Conservative, formal tone throughout`,
    
    minimal: `FORMAT STYLE: Minimal Elegant
- Maximum white space and breathing room
- Section headings with simple underlines
- Bullet points with "·"
- Only essential information
- Clean typography focus`,
    
    executive: `FORMAT STYLE: Executive Summary
- Start with strong executive summary
- Bold emphasis on achievements and metrics
- Leadership and strategic focus
- Section headings with "═" underlines
- Professional and authoritative tone`,
    
    creative: `FORMAT STYLE: Creative Modern
- Dynamic section ordering based on strengths
- Use "→" for progression and achievements
- Include relevant icons as text symbols where appropriate
- Modern action-oriented language
- Highlight unique value propositions`,
  };
  
  return prompts[style];
};