import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const categoryDescriptions: Record<string, string> = {
      job_news: 'breaking job market news, employment statistics, workforce changes',
      hiring_tips: 'interview strategies, resume optimization, job search techniques',
      industry_trends: 'emerging industries, career pivots, sector growth',
      company_spotlight: 'companies hiring, workplace culture, employer news',
      tech_news: 'technology developments, software updates, tech industry layoffs and hiring',
      ai_trends: 'AI tools, automation impacts, AI careers, machine learning developments',
      companies_hiring: 'major employers with open positions, hiring sprees, expansion news',
      market_insights: 'salary trends, economic forecasts, labor market analysis',
    };

    const categoryContext = categoryDescriptions[category] || categoryDescriptions.job_news;

    console.log('Generating trending topics for category:', category);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a trending news analyst specializing in job markets, technology, and career development. Generate timely, newsworthy blog topic ideas that would attract readers interested in careers and employment. Focus on: ${categoryContext}`
          },
          {
            role: 'user',
            content: `Generate 6 trending blog topic ideas for the "${category.replace(/_/g, ' ')}" category. 

Requirements:
- Topics should feel current and timely (reference "latest", "2024", "this week", "new report")
- Each topic should be specific and compelling
- Mix of different angles: news, analysis, how-to, predictions
- Topics should be 10-20 words each
- Make them click-worthy but not clickbait

Return ONLY a JSON array of 6 topic strings, nothing else.`
          }
        ],
      }),
    });

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
      
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON array from the response
    let topics: string[];
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        topics = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and clean up
        topics = content
          .split('\n')
          .map((line: string) => line.replace(/^[\d\.\-\*]+\s*/, '').trim())
          .filter((line: string) => line.length > 10);
      }
    } catch (parseError) {
      console.error('Failed to parse topics:', parseError);
      // Final fallback
      topics = content
        .split('\n')
        .map((line: string) => line.replace(/^[\d\.\-\*]+\s*/, '').replace(/"/g, '').trim())
        .filter((line: string) => line.length > 10)
        .slice(0, 6);
    }

    console.log('Generated topics:', topics);

    return new Response(
      JSON.stringify({ topics: topics.slice(0, 6) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-blog-topics:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
