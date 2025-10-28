import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JDExtract {
  title: string;
  company?: string;
  keywords: string[];
  responsibilities: string[];
  mustHaves: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobSpec } = await req.json();

    if (!jobSpec) {
      return new Response(
        JSON.stringify({ error: 'Job specification is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Parsing job spec with AI...');

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
            content: 'You are an expert job description parser. Extract structured information from job postings.'
          },
          {
            role: 'user',
            content: `Parse this job description and extract key information:\n\n${jobSpec}`
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'extract_job_details',
            description: 'Extract structured information from a job description',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Job title' },
                company: { type: 'string', description: 'Company name if mentioned' },
                keywords: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Key skills, technologies, and tools mentioned (10-15 items)'
                },
                responsibilities: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Main job responsibilities and duties (5-8 items)'
                },
                mustHaves: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Required qualifications and must-have skills (5-8 items)'
                }
              },
              required: ['title', 'keywords', 'responsibilities', 'mustHaves'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'extract_job_details' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No structured output from AI');
    }

    const extracted: JDExtract = JSON.parse(toolCall.function.arguments);
    
    console.log('Job spec parsed successfully:', extracted.title);

    return new Response(
      JSON.stringify({ success: true, data: extracted }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in parse-job-spec function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
