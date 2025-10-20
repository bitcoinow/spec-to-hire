import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, ArrowLeft, HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Spec2Hire?",
      answer: "Spec2Hire is an AI-powered CV generator that transforms job specifications into ATS-optimized CVs and cover letters in seconds. Simply paste a job description, and our advanced AI analyzes it against your master profile to create tailored application documents.",
    },
    {
      question: "How does the Master Profile work?",
      answer: "Your Master Profile is a single source of truth containing all your professional information: contact details, skills, experience, education, and certifications. You create it once, and Spec2Hire uses it to generate customized CVs for every job application without manual editing.",
    },
    {
      question: "What is ATS optimization?",
      answer: "ATS (Applicant Tracking System) optimization ensures your CV is formatted and written in a way that automated screening systems can easily read and parse. Spec2Hire uses proper formatting, keyword optimization, and structured sections that ATS systems expect, dramatically increasing your chances of passing initial screening.",
    },
    {
      question: "How accurate is the match score?",
      answer: "The match score (0-100%) is calculated using multiple factors: keyword overlap between the job spec and your profile, skills alignment, tool proficiency matches, and domain experience relevance. A score above 80% indicates an excellent match, while 60-79% suggests a good match with some gaps.",
    },
    {
      question: "Can I edit the generated CV?",
      answer: "Yes! While Spec2Hire generates optimized content, you have full control to copy, edit, and customize the output. You can also toggle specific sections on/off and regenerate parts that need refinement.",
    },
    {
      question: "How do I export my documents?",
      answer: "Currently, you can copy your CV and cover letter text directly from the platform. Export features for PDF and DOCX formats are coming soon, allowing you to download professionally formatted documents ready to submit.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Your Master Profile and all generated documents are stored securely with industry-standard encryption. Your data is private and only accessible to you. We never share your information with third parties.",
    },
    {
      question: "What happens if required skills are missing?",
      answer: "Spec2Hire's analysis will identify skill gaps and show them clearly in the match score breakdown. The AI will still generate the best possible CV using your transferable skills and adjacent experience, while highlighting areas where additional qualifications would strengthen your application.",
    },
    {
      question: "Can I save multiple versions?",
      answer: "Yes! Each time you generate a CV, Spec2Hire creates a 'Job Pack' containing the parsed job description, match analysis, CV, and cover letter. You can maintain a library of all your applications and their match scores.",
    },
    {
      question: "How many CVs can I generate?",
      answer: "During your free trial, you can generate unlimited CVs. The AI uses Lovable AI powered by Google Gemini, which includes free usage credits. After the free credits are used, you can add more credits as needed.",
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
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Spec2Hire
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>
              Find answers to the most frequently asked questions about our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Check out our How to Use guide for detailed step-by-step instructions
          </p>
          <Link to="/how-to-use">
            <Button size="lg" className="bg-gradient-primary">
              View How to Use Guide
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
