import { Card } from "@/components/ui/card";

interface AdSpaceProps {
  slot?: string;
  format?: "horizontal" | "vertical" | "square";
  className?: string;
}

export const AdSpace = ({ slot = "demo", format = "horizontal", className = "" }: AdSpaceProps) => {
  const heights = {
    horizontal: "h-[90px]",
    vertical: "h-[600px]",
    square: "h-[250px]"
  };

  return (
    <Card className={`bg-muted/30 border-dashed overflow-hidden ${heights[format]} ${className}`}>
      <ins className="adsbygoogle"
           style={{ display: "block", width: "100%", height: "100%" }}
           data-ad-client="ca-pub-6863700262799619"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </Card>
  );
};
