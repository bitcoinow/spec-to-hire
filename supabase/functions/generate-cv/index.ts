import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== GENERATE-CV REQUEST RECEIVED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting request processing...');
    
    // Authenticate user with service role
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client to verify user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get JWT token from Authorization header
    const jwt = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt);
    console.log('User auth result:', { userId: user?.id, hasError: !!authError });
    
    if (authError || !user) {
      console.error('Auth error details:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Parsing request body...');
    const requestData = await req.json();
    console.log('Request data keys:', Object.keys(requestData));
    
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
    console.log('Job spec length:', jobSpec.length);
    console.log('Master profile keys:', Object.keys(masterProfile));

    // System prompt for the AI
    const systemPrompt = `You are an ATS coach. Given (A) Job Description and (B) Candidate Profile JSON:

STEP 1: Extract must-have keywords from Job Description
STEP 2: List skill/experience gaps between candidate and role requirements
STEP 3: Produce a role-tailored CV in plain text sections using these headings: Summary, Skills, Experience, Education
STEP 4: Draft a concise cover letter (≤200 words)

ATS-SAFE FORMATTING RULES (CRITICAL):
- Do NOT include tables or images
- Use bullet points with past-tense action verbs
- Use standard headings only (Summary, Skills, Experience, Education, Certifications)
- Plain text, left-aligned, simple formatting
- No columns, no fancy layouts that break ATS parsers
- Use consistent bullet formatting throughout
- Font recommendation for export: Arial 10.5-11pt (body), 12-14pt (headings)
- Line height: 1.0-1.15 for optimal ATS parsing

CV WRITING RULES:
- Start each bullet with strong action verbs (led, built, designed, launched, etc.)
- Use past tense for all completed roles
- Include metrics and outcomes where available from candidate profile
- Integrate job keywords naturally throughout (especially in Summary and Skills)
- Keep CV to 2 pages maximum
- Professional Summary should directly address the target role

COVER LETTER RULES:
- Maximum 200 words, concise and focused
- Mirror job description language and requirements
- Highlight 2-3 strongest matches between candidate and role
- Show genuine interest in the specific position
- Professional but personable tone

MATCHING ANALYSIS:
- Calculate keyword coverage (% of JD keywords found in candidate profile)
- Identify must-have requirements the candidate meets vs. gaps
- List relevant tools/technologies that match

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

    console.log('Calling Lovable AI Gateway...');
    
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
            content: `JOB DESCRIPTION:\n${jobSpec}\n\nCANDIDATE PROFILE:\n${JSON.stringify(masterProfile, null, 2)}\n\nGenerate the complete response in JSON format following all ATS-safe formatting rules.`
          }
        ],
      }),
    });

    console.log('AI Gateway response status:', response.status);

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
    console.log('AI response received, has choices:', !!data.choices);
    
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response. Data:', JSON.stringify(data));
      throw new Error('No content in AI response');
    }

    console.log('Content length:', content.length);

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
      console.error('Content that failed to parse:', content.substring(0, 500));
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
    console.error('=== ERROR IN GENERATE-CV ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Full error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
