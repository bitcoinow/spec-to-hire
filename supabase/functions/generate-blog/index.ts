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

    const systemPrompt = `You are a professional content writer specializing in job market news and career advice. 
Generate engaging, informative blog posts about ${category || 'job market news'}.
Format the response as JSON with the following structure:
{
  "title": "Compelling blog post title (max 100 characters)",
  "excerpt": "Brief summary for preview (max 200 characters)",
  "content": "Full blog post content in markdown format (500-800 words)",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `Write a blog post about: ${topic}${jobSiteUrl ? `\n\nInclude information relevant to job seekers using ${jobSiteUrl}` : ''}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
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
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI generation failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const blogData = JSON.parse(content);

    // Generate slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return new Response(
      JSON.stringify({
        title: blogData.title,
        slug,
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
