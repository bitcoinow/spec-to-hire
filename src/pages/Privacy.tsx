import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
  return (
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
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                When you use Spec2Hire, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Account information (email address, password)</li>
                <li>Profile data (name, work experience, skills, education)</li>
                <li>Job descriptions and specifications you paste into our system</li>
                <li>Generated CVs and cover letters</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Generate personalized CVs and cover letters tailored to job specifications</li>
                <li>Provide and improve our AI-powered matching and optimization services</li>
                <li>Process your payments and manage your subscription</li>
                <li>Send you service updates and important account notifications</li>
                <li>Analyze usage patterns to enhance our platform's performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                We implement industry-standard security measures to protect your personal information. Your data is encrypted in transit and at rest. We use secure cloud infrastructure with regular backups and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Sharing</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Service providers who help us operate our platform (e.g., cloud hosting, payment processing)</li>
                <li>AI providers to process and generate your CVs and cover letters</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-muted-foreground">
                <li>Access, update, or delete your personal information</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
                <li>Request deletion of your account and associated data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Cookies and Tracking</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your account at any time through your profile settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Spec2Hire is not intended for users under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@spec2hire.com
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
  );
};

export default Privacy;
