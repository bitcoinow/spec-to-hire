import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData = await req.json();
    const { jobSpec, masterProfile } = requestData;
    
    // Input validation
    if (!jobSpec || typeof jobSpec !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid jobSpec: must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (jobSpec.length < 10 || jobSpec.length > 50000) {
      return new Response(
        JSON.stringify({ error: 'jobSpec must be between 10 and 50000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!masterProfile || typeof masterProfile !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid masterProfile: must be an object' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!jobSpec || !masterProfile) {
      return new Response(
        JSON.stringify({ error: 'Job spec and master profile are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing CV generation request...');

    // System prompt for the AI
    const systemPrompt = `You are an ATS-savvy career writer. Given:
1) RAW_JOB_SPEC (text)
2) MASTER_PROFILE (JSON)

Your tasks:
A. Parse RAW_JOB_SPEC to structured JSON (title, company, seniority, location, must_have, nice_to_have, keywords, responsibilities).
B. Compute a JD–Profile match analysis with:
   - score (0-1): overall match percentage
   - keyword_hits: array of keywords from JD found in profile
   - skill_gaps: array of required skills missing from profile
   - tool_matches: array of tools/technologies matching between JD and profile
C. Generate two outputs:
   1) ATS CV in plain text sections (no tables). Include a Requirements Matrix line. Use bullet points with metrics where possible.
   2) 1-page cover letter mirroring JD language (200-300 words).

Rules:
- Use only verifiable data from MASTER_PROFILE
- Prefer quantified, outcome-based bullets (metric + lever + outcome)
- Maximize inclusion of MUST_HAVE and KEYWORDS without keyword stuffing
- Keep CV to 2 pages max (plain text) and letter to 200–300 words
- Use standard sections: Professional Summary, Core Skills, Experience, Education, Certifications
- Use simple headings, no tables, left-aligned, 10-11pt equivalent
- Include exact JD title in Summary line

CRITICAL: Return JSON with this exact structure:
{
  "parsed_job": {
    "title": "string",
    "company": "string",
    "seniority": "string",
    "location": "string",
    "must_have": ["string"],
    "nice_to_have": ["string"],
    "keywords": ["string"],
    "responsibilities": ["string"]
  },
  "match": {
    "score": 0.0,
    "keyword_hits": ["string"],
    "skill_gaps": ["string"],
    "tool_matches": ["string"]
  },
  "cv_text": "string",
  "cover_letter": "string"
}`;

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
          {
            role: 'user',
            content: `JOB SPECIFICATION:\n${jobSpec}\n\nMASTER PROFILE:\n${JSON.stringify(masterProfile, null, 2)}\n\nGenerate the parsed job, match analysis, CV, and cover letter in JSON format.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
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
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the AI response - it should be JSON
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // If parsing fails, create a structured response from the text
      result = {
        parsed_job: {
          title: 'Unable to parse',
          company: 'Unknown',
          must_have: [],
          nice_to_have: [],
          keywords: [],
          responsibilities: [],
        },
        match: {
          score: 0.5,
          keyword_hits: [],
          skill_gaps: [],
          tool_matches: [],
        },
        cv_text: content,
        cover_letter: 'Please review the generated content above.',
      };
    }

    console.log('CV generation completed successfully');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-cv function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
