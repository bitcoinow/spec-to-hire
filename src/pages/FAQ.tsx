import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, ArrowLeft, HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const FAQ = () => {
  const faqCategories = [
    {
      category: "General",
      faqs: [
        {
          question: "What is Spec2Hire?",
          answer: "Spec2Hire is an AI-powered CV generator that transforms job specifications into ATS-optimized CVs and cover letters in seconds. Simply paste a job description, and our advanced AI analyzes it against your master profile to create tailored application documents that pass automated screening systems.",
        },
        {
          question: "Why would I need to use Spec2Hire?",
          answer: "Job applications are time-consuming and often require customizing your CV for each role. Spec2Hire automates this process, saving you hours per application while ensuring your CV is optimized for Applicant Tracking Systems (ATS). This dramatically increases your chances of getting past initial screening and landing interviews.",
        },
        {
          question: "Is my data secure?",
          answer: "Absolutely. Your Master Profile and all generated documents are stored securely with industry-standard encryption. Your data is private and only accessible to you. We never share your information with third parties, and you can delete your account and data at any time.",
        },
        {
          question: "How accurate is the match score?",
          answer: "The match score (0-100%) is calculated using multiple factors: keyword overlap between the job spec and your profile, skills alignment, tool proficiency matches, and domain experience relevance. A score above 80% indicates an excellent match, while 60-79% suggests a good match with some gaps.",
        },
      ],
    },
    {
      category: "Getting Started",
      faqs: [
        {
          question: "Do I need an account to use the converter?",
          answer: "Yes, you need to create a free account to use Spec2Hire. This allows us to securely store your Master Profile and keep track of your generated CVs and cover letters. You can sign up with your email or use Google authentication for quick access.",
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Get Started Free' button on the homepage. You can sign up using your email address and password, or use Google authentication for a faster sign-up process. After creating your account, you'll be guided through setting up your Master Profile.",
        },
        {
          question: "How does the Master Profile work?",
          answer: "Your Master Profile is a single source of truth containing all your professional information: contact details, skills, experience, education, and certifications. You create it once, and Spec2Hire uses it to generate customized CVs for every job application without manual editing.",
        },
        {
          question: "Can I import my existing CV?",
          answer: "Yes! You can import your existing CV by dragging and dropping a .docx file or pasting your resume text directly. Our AI will parse your experience, skills, and education to automatically populate your Master Profile, saving you time on initial setup.",
        },
        {
          question: "What file formats are supported for import?",
          answer: "You can import your existing CV in .docx format or paste plain text directly. When exporting, you can copy the generated content or use the PDF/DOCX export features for professionally formatted documents ready to submit.",
        },
      ],
    },
    {
      category: "Features & Usage",
      faqs: [
        {
          question: "What is ATS optimization?",
          answer: "ATS (Applicant Tracking System) optimization ensures your CV is formatted and written in a way that automated screening systems can easily read and parse. Spec2Hire uses proper formatting, keyword optimization, and structured sections that ATS systems expect, dramatically increasing your chances of passing initial screening.",
        },
        {
          question: "Can I edit the generated CV?",
          answer: "Yes! While Spec2Hire generates optimized content, you have full control to copy, edit, and customize the output. You can also toggle specific sections on/off and regenerate parts that need refinement.",
        },
        {
          question: "How do I export my documents?",
          answer: "You can copy your CV and cover letter text directly from the platform, or use the PDF and DOCX export features to download professionally formatted documents ready for submission.",
        },
        {
          question: "What happens if required skills are missing?",
          answer: "Spec2Hire's analysis will identify skill gaps and show them clearly in the match score breakdown. The AI will still generate the best possible CV using your transferable skills and adjacent experience, while highlighting areas where additional qualifications would strengthen your application.",
        },
        {
          question: "Can I save multiple versions?",
          answer: "Yes! Each time you generate a CV, Spec2Hire creates a 'Job Pack' containing the parsed job description, match analysis, CV, and cover letter. You can maintain a library of all your applications and their match scores through the Job Tracker feature.",
        },
        {
          question: "What is the Interview Coach feature?",
          answer: "The Interview Coach is an AI-powered practice tool that generates customized interview questions based on the job description you're applying for. It provides feedback on your answers and helps you prepare for common and role-specific interview questions.",
        },
        {
          question: "How does the Job Tracker work?",
          answer: "The Job Tracker lets you manage all your job applications in one place. You can track application status, set deadlines, add notes, store contact information, and monitor your progress through the hiring process for each position you've applied to.",
        },
      ],
    },
    {
      category: "Pricing & Plans",
      faqs: [
        {
          question: "How many CVs can I generate for free?",
          answer: "The free trial includes 1 CV generation and 1 cover letter with ATS-optimized formatting and PDF export. This lets you experience the full power of Spec2Hire before committing to a paid plan.",
        },
        {
          question: "What's included in the Pro Weekly plan?",
          answer: "The Pro Weekly plan at $3.99/week includes unlimited CV generations, unlimited cover letters, ATS-optimized formatting, PDF & DOCX export, master profile storage, and match score analysis. It's perfect for active job seekers who need flexibility.",
        },
        {
          question: "What's included in the Pro Monthly plan?",
          answer: "The Pro Monthly plan at $12.99/month includes everything in the Weekly plan plus priority support. It's our most popular option for serious job seekers who want the best value for regular use.",
        },
        {
          question: "What are the Pro Yearly plan benefits?",
          answer: "The Pro Yearly plan at $79.99/year (49% savings) includes everything in Pro Monthly plus priority support, early access to new features, and the annual billing discount. It's the best value for long-term career management.",
        },
        {
          question: "Can I upgrade or downgrade my plan?",
          answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your current billing period. You can manage your subscription through the account settings or contact support for assistance.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processing. All transactions are encrypted and PCI-compliant for your security.",
        },
        {
          question: "Can I cancel my subscription?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to Pro features until the end of your current billing period. There are no cancellation fees.",
        },
      ],
    },
    {
      category: "Technical & Support",
      faqs: [
        {
          question: "Which browsers are supported?",
          answer: "Spec2Hire works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience.",
        },
        {
          question: "Can I use Spec2Hire on mobile devices?",
          answer: "Yes, Spec2Hire is fully responsive and works on mobile devices and tablets. However, for the best experience when creating and editing your Master Profile, we recommend using a desktop or laptop computer.",
        },
        {
          question: "How do I contact support?",
          answer: "You can reach our support team by visiting the FAQ page and using the contact options, or by emailing support directly. Pro subscribers receive priority support with faster response times.",
        },
        {
          question: "What if I encounter a technical issue?",
          answer: "If you experience any technical issues, try refreshing the page or clearing your browser cache. If the problem persists, contact our support team with details about the issue, including any error messages you see, and we'll help resolve it quickly.",
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>FAQ — Spec2Hire</title>
        <meta name="description" content="Frequently asked questions about Spec2Hire. Learn about ATS optimization, match scoring, pricing plans, and more." />
        <link rel="canonical" href="https://spec-to-hire.lovable.app/faq" />
      </Helmet>
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

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-lg">
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>
                  {category.category === "General" && "Basic information about Spec2Hire"}
                  {category.category === "Getting Started" && "How to begin using the platform"}
                  {category.category === "Features & Usage" && "Understanding our tools and capabilities"}
                  {category.category === "Pricing & Plans" && "Subscription options and billing"}
                  {category.category === "Technical & Support" && "Help and troubleshooting"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
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
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Check out our How to Use guide for detailed step-by-step instructions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/how-to-use">
              <Button size="lg" className="bg-gradient-primary">
                View How to Use Guide
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default FAQ;