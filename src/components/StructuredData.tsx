export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Spec2Hire",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://spec-to-hire.lovable.app",
    "description": "Turn any job spec into an ATS-friendly CV & cover letter in 60 seconds.",
    "offers": { 
      "@type": "Offer", 
      "price": "0", 
      "priceCurrency": "GBP" 
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  };
  
  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} 
    />
  );
}
