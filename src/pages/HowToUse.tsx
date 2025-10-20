import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ArrowLeft, BookOpen, User, FileText, Sparkles, Download } from "lucide-react";

const HowToUse = () => {
  const steps = [
    {
      icon: User,
      title: "1. Create Your Master Profile",
      description: "Start by setting up your comprehensive professional profile",
      details: [
        "Navigate to the 'Master Profile' tab in the application",
        "Click 'Load Example' to see the JSON structure",
        "Fill in your contact information (name, location, email, LinkedIn)",
        "Add your professional summary (1-2 lines highlighting your expertise)",
        "List your core skills, domain knowledge, and tools",
        "Create experience snippets with quantified achievements",
        "Include education and certifications",
        "Click 'Save Profile' to store your information securely",
      ],
      tip: "Pro Tip: Use specific metrics in your experience bullets (e.g., 'Reduced costs by 18%' instead of 'Reduced costs')",
    },
    {
      icon: FileText,
      title: "2. Paste a Job Specification",
      description: "Copy the job description you want to apply for",
      details: [
        "Find a job posting you're interested in",
        "Copy the entire job description (including requirements and responsibilities)",
        "Go to the 'Generate' tab in Spec2Hire",
        "Paste the job spec into the text area",
        "The more complete the job description, the better the results",
      ],
      tip: "Pro Tip: Include the company description if available - it helps the AI match company culture and tone",
    },
    {
      icon: Sparkles,
      title: "3. Generate Tailored Documents",
      description: "Let AI create your customized CV and cover letter",
      details: [
        "Click the 'Generate CV & Cover Letter' button",
        "Wait 20-30 seconds while the AI analyzes the job spec",
        "The AI will parse requirements, match your skills, and create tailored content",
        "Review the match score to see how well you fit the role",
        "Check the Analysis tab to see matched keywords and skill gaps",
      ],
      tip: "Pro Tip: A match score above 80% indicates excellent alignment - apply with confidence!",
    },
    {
      icon: Download,
      title: "4. Review and Export",
      description: "Customize and download your application materials",
      details: [
        "Review the generated CV in the CV tab",
        "Check the cover letter for appropriate tone and content",
        "Use the 'Copy' button to copy text to your clipboard",
        "Paste into your preferred document editor for final formatting",
        "Review the Analysis tab to understand your strengths and gaps",
        "Save the job pack for your records",
      ],
      tip: "Pro Tip: Always do a final review before submitting - check for any company-specific details to personalize",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Spec2Hire</h1>
              <p className="text-xs text-muted-foreground">ATS CV Generator</p>
            </div>
          </Link>
          
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">How to Use Spec2Hire</h1>
          <p className="text-xl text-muted-foreground">
            Follow these simple steps to create perfect CVs in minutes
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-foreground">{detail}</p>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-success-foreground">
                      💡 {step.tip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Tips */}
        <Card className="shadow-lg mt-12">
          <CardHeader>
            <CardTitle>Best Practices for Success</CardTitle>
            <CardDescription>Maximize your results with these tips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Profile Management
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Keep your master profile up-to-date with latest achievements</li>
                  <li>• Use action verbs: Led, Optimized, Implemented, Achieved</li>
                  <li>• Always include metrics and quantifiable outcomes</li>
                  <li>• Tag experience snippets with relevant keywords</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Application Strategy
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Apply to roles with 70%+ match scores for best results</li>
                  <li>• Customize the cover letter opening with company research</li>
                  <li>• Save Job Packs to track applications and follow up</li>
                  <li>• Address skill gaps identified in the analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Create your account and generate your first tailored CV in minutes
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="bg-gradient-primary text-lg px-8 py-6">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HowToUse;
