import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface AdSpaceProps {
  slot?: string;
  format?: "horizontal" | "vertical" | "square";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSpace = ({ slot = "demo", format = "horizontal", className = "" }: AdSpaceProps) => {
  const adRef = useRef<HTMLModElement>(null);
  
  const heights = {
    horizontal: "h-[90px]",
    vertical: "h-[600px]",
    square: "h-[250px]"
  };

  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <Card className={`bg-muted/30 border-dashed overflow-hidden ${heights[format]} ${className}`}>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-6863700262799619"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Card>
  );
};
