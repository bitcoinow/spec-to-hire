import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export default function SEOHead({ 
  title = "Spec2Hire — Turn Any Job Spec into an ATS-Friendly CV in 60 Seconds",
  description = "AI-powered CV and cover letter generator. Paste any job description and get ATS-optimized, keyword-matched application documents instantly. Stop spending hours tailoring CVs.",
  canonical = "https://spec-to-hire.lovable.app",
  ogImage = "https://spec-to-hire.lovable.app/og-image.jpg"
}: SEOHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
