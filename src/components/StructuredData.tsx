export default function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Spec2Hire",
    "url": "https://spec-to-hire.lovable.app",
    "logo": "https://spec-to-hire.lovable.app/og-image.jpg",
    "description": "AI-powered CV and cover letter generation platform",
    "sameAs": [
      "https://twitter.com/spec2hire",
      "https://www.linkedin.com/company/spec2hire"
    ]
  };

  const application = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Spec2Hire",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://spec-to-hire.lovable.app",
    "description": "Turn any job spec into an ATS-friendly CV & cover letter in 60 seconds. AI-powered CV generator that transforms job descriptions into ATS-optimized CVs and cover letters instantly.",
    "provider": {
      "@type": "Organization",
      "name": "Spec2Hire"
    },
    "offers": { 
      "@type": "Offer", 
      "price": "0", 
      "priceCurrency": "GBP",
      "description": "First 3 exports free, no credit card required"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "featureList": [
      "ATS-compliant formatting",
      "Keyword optimization",
      "Automated cover letter generation",
      "Match scoring",
      "Multiple export formats (PDF/DOCX)"
    ]
  };
  
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(application) }} 
      />
    </>
  );
}
