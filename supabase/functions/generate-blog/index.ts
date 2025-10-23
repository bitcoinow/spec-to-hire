import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { topic, category, jobSiteUrl } = requestData;
    
    // Input validation
    if (!topic || typeof topic !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid topic: must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (topic.length < 5 || topic.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Topic must be between 5 and 500 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const validCategories = ['job_news', 'hiring_tips', 'industry_trends', 'company_spotlight'];
    if (!category || !validCategories.includes(category)) {
      return new Response(
        JSON.stringify({ error: `Invalid category: must be one of ${validCategories.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate jobSiteUrl if provided
    if (jobSiteUrl) {
      if (typeof jobSiteUrl !== 'string' || jobSiteUrl.length > 2000) {
        return new Response(
          JSON.stringify({ error: 'Job site URL must be a string with max 2000 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      try {
        const url = new URL(jobSiteUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return new Response(
            JSON.stringify({ error: 'Job site URL must use HTTP or HTTPS protocol' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid job site URL format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Generating blog post for topic:', topic);

    const systemPrompt = `You are an expert SEO content writer specializing in job market news and career advice.

CRITICAL SEO & STRUCTURE REQUIREMENTS:

1. TITLE (H1):
   - Maximum 60 characters for SEO
   - Include focus keyword naturally
   - Make it compelling and click-worthy

2. META INFORMATION:
   - Meta Description: Exactly 150-155 characters, include CTA
   - Focus Keyword: Main keyword for the article
   - Secondary Keywords: 2-3 related terms

3. OPENING HOOK (2 short paragraphs):
   - First paragraph: Engaging question or statement (2-3 sentences)
   - Second paragraph: Clear value proposition or bottom line (1-2 sentences)

4. CONTENT STRUCTURE (H2/H3 Hierarchy):
   - Use ## for main sections (H2)
   - Use ### for subsections (H3)
   - Each section: 2-4 short paragraphs max
   - Paragraphs: 2-4 sentences each (never more than 5)

5. FORMATTING FOR SCANNABILITY:
   - Use bullet points for lists
   - Use **bold text** for key terms and emphasis
   - Include "Before/After" examples where relevant
   - Add plenty of white space between sections

6. REQUIRED SECTIONS:
   - Strong introduction with hook
   - 3-5 main content sections with H2 headings
   - FAQ section (3-5 questions) for featured snippets
   - Clear conclusion with actionable CTA

7. SEO BEST PRACTICES:
   - Naturally integrate focus keyword 3-5 times
   - Use secondary keywords throughout
   - Include internal linking suggestions (mention relevant topics)
   - Write descriptive, keyword-rich subheadings
   - Maintain conversational, engaging tone

8. WORD COUNT: 800-1200 words total

CRITICAL: Return ONLY a valid JSON object. Do NOT include any text before or after the JSON.
Do NOT wrap the JSON in markdown code blocks.

Required JSON structure:
{
  "title": "SEO-optimized title (max 60 chars)",
  "metaTitle": "Meta title for SEO (max 60 chars)",  
  "metaDescription": "Compelling meta description with CTA (150-155 chars)",
  "focusKeyword": "main keyword phrase",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3"],
  "excerpt": "Brief summary (max 200 characters)",
  "content": "Full markdown content following all structure rules above",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `Write a blog post about: ${topic}${jobSiteUrl ? `\n\nInclude information relevant to job seekers using ${jobSiteUrl}` : ''}`;

    let response;
    try {
      response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        }),
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `AI generation failed: ${errorText.substring(0, 200)}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse response as JSON:', jsonError);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected AI response structure:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Unexpected response format from AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let content = data.choices[0].message.content;
    
    console.log('Raw AI response length:', content.length);
    console.log('First 200 chars:', content.substring(0, 200));
    
    // Try to extract JSON from markdown code blocks if present
    const jsonBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonBlockMatch) {
      console.log('Extracted JSON from code block');
      content = jsonBlockMatch[1];
    }
    
    // Try to find JSON object in the content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    let blogData;
    try {
      blogData = JSON.parse(content);
      console.log('Successfully parsed JSON on first attempt');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content that failed to parse:', content.substring(0, 1000));
      
      // Try to fix common JSON issues
      try {
        let fixedContent = content
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .trim();
        
        blogData = JSON.parse(fixedContent);
        console.log('Successfully parsed after fixes');
      } catch (secondError) {
        console.error('Still failed after fixes:', secondError);
        const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown parse error';
        return new Response(
          JSON.stringify({ 
            error: `Failed to parse AI response: ${errorMsg}`,
            details: content.substring(0, 500)
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate required fields
    if (!blogData.title || !blogData.content) {
      console.error('Missing required fields in blog data:', Object.keys(blogData));
      return new Response(
        JSON.stringify({ error: 'AI response missing required fields (title or content)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return new Response(
      JSON.stringify({
        title: blogData.title,
        slug,
        metaTitle: blogData.metaTitle || blogData.title,
        metaDescription: blogData.metaDescription || blogData.excerpt,
        focusKeyword: blogData.focusKeyword || '',
        secondaryKeywords: blogData.secondaryKeywords || [],
        excerpt: blogData.excerpt,
        content: blogData.content,
        tags: blogData.tags || [],
        category: category || 'job_news',
        jobSiteUrl: jobSiteUrl || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-blog function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
