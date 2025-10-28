import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, jobSpec } = await req.json();

    if (!email || !jobSpec) {
      return new Response(
        JSON.stringify({ error: 'Email and job spec are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store waitlist entry
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email,
        job_spec: jobSpec,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Database error:', insertError);
      throw insertError;
    }

    // TODO: Send email notification with preview CV
    // This could call the generate-cv function and email the result
    console.log(`Waitlist submission received from ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you! We\'ll send your preview CV to your email soon.' 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in submit-waitlist function:', error);
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