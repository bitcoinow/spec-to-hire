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
    <Card className={`bg-muted/30 border-dashed flex items-center justify-center ${heights[format]} ${className}`}>
      <div className="text-center text-muted-foreground text-xs space-y-1">
        <div className="font-semibold">Advertisement Space</div>
        <div className="text-[10px]">Google AdSense Slot: {slot}</div>
      </div>
      {/* Placeholder for Google AdSense - replace with actual AdSense code */}
      {/* <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins> */}
    </Card>
  );
};
