import { Briefcase } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Spec2Hire</h1>
            <p className="text-xs text-muted-foreground">ATS CV Generator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
