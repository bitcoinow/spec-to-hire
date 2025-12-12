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
    
    const validCategories = ['job_news', 'hiring_tips', 'industry_trends', 'company_spotlight', 'tech_news', 'ai_trends', 'companies_hiring', 'market_insights'];
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

    console.log('Generating blog post for topic:', topic, 'category:', category);

    // Category-specific prompts for trending news
    const categoryPrompts: Record<string, string> = {
      job_news: 'Focus on current job market developments, employment statistics, and workforce trends.',
      hiring_tips: 'Provide actionable hiring and job search strategies with current best practices.',
      industry_trends: 'Analyze current industry shifts, emerging sectors, and career opportunities.',
      company_spotlight: 'Highlight companies that are actively hiring, their culture, and opportunities.',
      tech_news: 'Cover the latest technology news, software developments, and how they affect job seekers and tech professionals.',
      ai_trends: 'Discuss current AI developments, automation impacts on jobs, AI tools for productivity, and AI-related career opportunities.',
      companies_hiring: 'Report on major companies with active job openings, hiring sprees, and expansion news.',
      market_insights: 'Provide economic analysis, salary trends, and job market forecasts.',
    };

    const categoryContext = categoryPrompts[category] || categoryPrompts.job_news;

    const systemPrompt = `You are an expert journalist and SEO content writer specializing in job market news, technology, AI, and career advice. 
You write timely, newsworthy content that covers current trends and breaking developments. 
Your articles are well-researched, factual, and provide actionable insights for job seekers and professionals.
Write as if reporting on current events in December 2024.
${categoryContext}`;

    const userPrompt = `Write a detailed, timely news article about: ${topic}

Context: This is a ${category.replace(/_/g, ' ')} article. ${categoryContext}
${jobSiteUrl ? `\nInclude relevant context for job seekers using ${jobSiteUrl}` : ''}

Important requirements:
- Write as current news/trending content (reference "recent developments", "this week", "latest reports")
- Include specific details, statistics, and examples where relevant
- Use proper markdown with clear heading hierarchy (## for H2, ### for H3)
- Add blank lines between paragraphs for readability
- Include quotes or expert perspectives where appropriate
- Add a comprehensive FAQ section with 5-7 relevant questions
- Write in an engaging, journalistic tone while being informative
- Include actionable takeaways for readers`;

    // Generate multiple images using AI (at least 3)
    const imageUrls: string[] = [];
    const imagePrompts = [
      `Professional blog header image for: ${topic}. Style: modern, clean, professional, relevant to job search and career development. High quality, suitable for web use.`,
      `Infographic style illustration about: ${topic}. Clean design, professional, suitable for blog content.`,
      `Professional workplace or career-related image for: ${topic}. Modern style, high quality.`
    ];

    for (const imagePrompt of imagePrompts) {
      try {
        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              { role: 'user', content: imagePrompt }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const url = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (url) {
            imageUrls.push(url);
            console.log(`Blog image ${imageUrls.length} generated successfully`);
          }
        } else {
          console.warn(`Failed to generate blog image ${imageUrls.length + 1}`);
        }
      } catch (imageError) {
        console.error(`Image generation error for image ${imageUrls.length + 1}:`, imageError);
      }
    }

    console.log(`Generated ${imageUrls.length} images for blog post`);

    // Use different models based on category for variety and quality
    const modelChoice = ['tech_news', 'ai_trends', 'market_insights'].includes(category) 
      ? 'openai/gpt-5' 
      : 'google/gemini-2.5-flash';
    
    console.log('Using model:', modelChoice);

    let response;
    try {
      response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelChoice,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_blog_post",
                description: "Create a comprehensive SEO-optimized blog post",
                parameters: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "SEO-optimized title (max 60 characters), compelling and click-worthy"
                    },
                    metaTitle: {
                      type: "string",
                      description: "Meta title for SEO (max 60 characters)"
                    },
                    metaDescription: {
                      type: "string",
                      description: "Compelling meta description with CTA (150-155 characters)"
                    },
                    focusKeyword: {
                      type: "string",
                      description: "Main keyword phrase for SEO"
                    },
                    secondaryKeywords: {
                      type: "array",
                      items: { type: "string" },
                      description: "2-3 related keyword terms"
                    },
                    excerpt: {
                      type: "string",
                      description: "Brief summary (max 200 characters)"
                    },
                    content: {
                      type: "string",
                      description: "Full markdown content (1000-1500 words). CRITICAL FORMATTING: Use ## for main H2 headings, ### for H3 subheadings. Add blank lines (\\n\\n) between ALL paragraphs and after headings. Structure: 1) Engaging introduction (2-3 paragraphs), 2) 4-6 main sections with ## headings, 3) FAQ section (## Frequently Asked Questions) with 5-7 Q&A pairs formatted as ### for questions, 4) Conclusion with CTA. Use bullet points with proper spacing, **bold** for emphasis, maintain 2-4 sentence paragraphs with blank lines between them."
                    },
                    tags: {
                      type: "array",
                      items: { type: "string" },
                      description: "3-5 relevant tags for the blog post"
                    }
                  },
                  required: ["title", "metaTitle", "metaDescription", "focusKeyword", "secondaryKeywords", "excerpt", "content", "tags"],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: "function", function: { name: "create_blog_post" } }
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

    const message = data.choices[0].message;
    
    // Extract tool call response
    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.error('No tool calls in response:', JSON.stringify(message));
      return new Response(
        JSON.stringify({ error: 'AI did not return structured blog data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const toolCall = message.tool_calls[0];
    if (toolCall.function.name !== 'create_blog_post') {
      console.error('Unexpected tool call:', toolCall.function.name);
      return new Response(
        JSON.stringify({ error: 'Unexpected AI response structure' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let blogData;
    try {
      blogData = JSON.parse(toolCall.function.arguments);
      console.log('Successfully extracted blog data from tool call');
    } catch (parseError) {
      console.error('Failed to parse tool call arguments:', parseError);
      console.error('Arguments:', toolCall.function.arguments.substring(0, 500));
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse AI response data',
          details: parseError instanceof Error ? parseError.message : 'Unknown error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
        jobSiteUrl: jobSiteUrl || null,
        imageUrls: imageUrls.length > 0 ? imageUrls : null,
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : null // Backward compatibility
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
