import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultiCompanySenderProps {
  cvText: string;
  coverLetter: string;
}

export const MultiCompanySender = ({ cvText, coverLetter }: MultiCompanySenderProps) => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const addCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()]);
      setCompanyInput("");
    }
  };

  const removeCompany = (company: string) => {
    setCompanies(companies.filter(c => c !== company));
  };

  const handleSend = async () => {
    if (companies.length === 0) {
      toast({
        title: "No companies selected",
        description: "Please add at least one company to send to",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    // Simulate sending to multiple companies
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Applications sent!",
      description: `CV and cover letter sent to ${companies.length} ${companies.length === 1 ? 'company' : 'companies'}`,
    });

    setIsSending(false);
    setCompanies([]);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Send to Multiple Companies
        </CardTitle>
        <CardDescription>
          Add companies to send your tailored CV and cover letter
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCompany()}
            placeholder="Company name or email..."
            className="flex-1"
          />
          <Button onClick={addCompany} size="icon" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {companies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <Badge key={company} variant="secondary" className="px-3 py-1.5 text-sm">
                {company}
                <button
                  onClick={() => removeCompany(company)}
                  className="ml-2 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <Button
          onClick={handleSend}
          disabled={isSending || companies.length === 0}
          className="w-full bg-gradient-success hover:opacity-90 transition-opacity"
          size="lg"
        >
          {isSending ? (
            <>
              <Send className="w-4 h-4 mr-2 animate-pulse" />
              Sending to {companies.length} {companies.length === 1 ? 'company' : 'companies'}...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send to {companies.length} {companies.length === 1 ? 'Company' : 'Companies'}
            </>
          )}
        </Button>

        <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
          <p className="font-semibold text-foreground">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const linkedinUrl = `https://www.linkedin.com/jobs/`;
                window.open(linkedinUrl, '_blank');
              }}
            >
              Post on LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const indeedUrl = `https://www.indeed.com/`;
                window.open(indeedUrl, '_blank');
              }}
            >
              Post on Indeed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const glassdoorUrl = `https://www.glassdoor.com/`;
                window.open(glassdoorUrl, '_blank');
              }}
            >
              Post on Glassdoor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const totalJobsUrl = `https://www.totaljobs.com/`;
                window.open(totalJobsUrl, '_blank');
              }}
            >
              Post on TotalJobs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
