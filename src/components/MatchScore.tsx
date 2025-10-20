import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
}

export const MatchScore = ({ score }: MatchScoreProps) => {
  const percentage = Math.round(score * 100);
  
  const getScoreColor = () => {
    if (score >= 0.8) return "text-success border-success";
    if (score >= 0.6) return "text-warning border-warning";
    return "text-destructive border-destructive";
  };

  const getScoreLabel = () => {
    if (score >= 0.8) return "Excellent Match";
    if (score >= 0.6) return "Good Match";
    return "Fair Match";
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className={cn(
        "text-3xl font-bold",
        getScoreColor()
      )}>
        {percentage}%
      </div>
      <div className={cn(
        "text-xs font-medium px-2 py-1 rounded-full border",
        getScoreColor()
      )}>
        {getScoreLabel()}
      </div>
    </div>
  );
};
