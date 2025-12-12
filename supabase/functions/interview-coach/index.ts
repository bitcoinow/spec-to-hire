import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { action, jobTitle, companyName, jobDescription, question, answer, questions } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'generate_questions') {
      systemPrompt = `You are an expert interview coach and hiring manager. Generate realistic interview questions for a job candidate.

Return a JSON array of 8-10 interview questions. Each question should be an object with:
{
  "id": "q1",
  "question": "The interview question",
  "type": "behavioral" | "technical" | "situational" | "cultural",
  "difficulty": "easy" | "medium" | "hard",
  "tips": "Brief tip on how to approach this question"
}

Mix question types:
- 3-4 behavioral questions (STAR method applicable)
- 2-3 technical/role-specific questions
- 2 situational questions
- 1-2 cultural fit questions

Make questions specific to the role and company when possible.`;

      userPrompt = `Generate interview questions for:
Position: ${jobTitle}
Company: ${companyName || 'Not specified'}
${jobDescription ? `Job Description: ${jobDescription}` : ''}`;

    } else if (action === 'evaluate_answer') {
      systemPrompt = `You are an expert interview coach. Evaluate the candidate's answer to an interview question.

Return a JSON object with:
{
  "score": 1-10,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "betterAnswer": "A model answer that demonstrates best practices",
  "tips": "Specific actionable tips for improvement"
}

Be constructive but honest. Focus on:
- Clarity and structure (STAR method for behavioral)
- Relevance to the question
- Specific examples and quantifiable results
- Confidence and professionalism`;

      userPrompt = `Question: ${question}

Candidate's Answer: ${answer}

Job Title: ${jobTitle}
Company: ${companyName || 'Not specified'}`;

    } else if (action === 'overall_feedback') {
      systemPrompt = `You are an expert interview coach. Provide overall feedback on a practice interview session.

Return a JSON object with:
{
  "overallScore": 1-100,
  "summary": "2-3 sentence overall assessment",
  "topStrengths": ["strength1", "strength2", "strength3"],
  "areasToImprove": ["area1", "area2", "area3"],
  "recommendations": ["specific recommendation 1", "specific recommendation 2"],
  "readiness": "not_ready" | "needs_practice" | "almost_ready" | "interview_ready"
}`;

      userPrompt = `Review this interview practice session:

Job: ${jobTitle} at ${companyName || 'Company'}

Questions and Answers:
${questions.map((q: any, i: number) => `
Q${i + 1}: ${q.question}
A${i + 1}: ${q.answer || 'Not answered'}
`).join('\n')}`;

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing interview coach action: ${action}`);

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse interview data');
    }

    console.log(`Interview coach ${action} completed successfully`);

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in interview-coach function:', error);
    const message = error instanceof Error ? error.message : 'Interview coach error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});