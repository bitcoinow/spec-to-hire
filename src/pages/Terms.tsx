import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service — Spec2Hire</title>
        <meta name="description" content="Read Spec2Hire's terms of service to understand the rules for using our platform." />
        <link rel="canonical" href="https://spec-to-hire.lovable.app/terms" />
      </Helmet>
      <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                By accessing or using Spec2Hire ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to modify these terms at any time, and continued use of the Service constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Spec2Hire provides an AI-powered platform that helps users generate tailored CVs and cover letters based on job specifications. The Service includes CV optimization, ATS compatibility checking, keyword matching, and document generation features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                To use certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Not share your account with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Subscription and Payment</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                Spec2Hire offers both free and paid subscription tiers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Free tier includes 3 document exports</li>
                <li>Paid subscriptions are billed monthly or annually</li>
                <li>All payments are processed securely through Stripe</li>
                <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
                <li>Refunds are provided within 14 days of purchase if no exports have been used</li>
                <li>You can cancel your subscription at any time through your account settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Acceptable Use</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                You agree NOT to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Submit false, misleading, or fraudulent information</li>
                <li>Attempt to circumvent usage limits or payment systems</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Use automated scripts or bots to access the Service</li>
                <li>Resell or redistribute generated content as a service to third parties</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                Content ownership:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>You retain ownership of all content you provide to the Service</li>
                <li>Generated CVs and cover letters belong to you</li>
                <li>You grant us a license to use your data to provide and improve the Service</li>
                <li>The Spec2Hire platform, software, and branding are our intellectual property</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. AI-Generated Content</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                Important disclaimers about AI-generated content:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Generated CVs and cover letters are based on AI algorithms and may contain errors</li>
                <li>You are responsible for reviewing and verifying all generated content</li>
                <li>We do not guarantee that generated content will result in job interviews or offers</li>
                <li>ATS optimization is based on best practices but cannot guarantee passage through all ATS systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Disclaimers and Limitations</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We disclaim:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Guarantees about service availability, accuracy, or reliability</li>
                <li>Responsibility for employment outcomes based on generated documents</li>
                <li>Liability for technical errors, downtime, or data loss</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                To the maximum extent permitted by law, Spec2Hire shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Termination</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                We may suspend or terminate your access to the Service immediately if you breach these Terms. You may terminate your account at any time through your account settings. Upon termination, your right to use the Service ceases, though certain provisions (payment obligations, intellectual property, disclaimers) survive termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                For questions about these Terms of Service, please contact us at legal@spec2hire.com
              </p>
            </section>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </>
  );
};

export default Terms;
