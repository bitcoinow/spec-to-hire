import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 255) return false;
  return EMAIL_REGEX.test(email.trim());
}

function sanitizeInput(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return '';
  // Remove potentially dangerous characters and limit length
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove remaining angle brackets
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log(`[SUBMIT-WAITLIST] Request from IP: ${clientIP}`);

    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.log(`[SUBMIT-WAITLIST] Rate limited: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body = await req.json();
    const { email, jobSpec } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      console.log(`[SUBMIT-WAITLIST] Invalid email: ${email}`);
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate and sanitize jobSpec
    if (!jobSpec || typeof jobSpec !== 'string' || jobSpec.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Job specification must be at least 10 characters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255);
    const sanitizedJobSpec = sanitizeInput(jobSpec, 10000); // Max 10k chars

    if (sanitizedJobSpec.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Job specification must be at least 10 characters after sanitization' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[SUBMIT-WAITLIST] Valid submission from: ${sanitizedEmail}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already exists in waitlist
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', sanitizedEmail)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`[SUBMIT-WAITLIST] Email already exists: ${sanitizedEmail}`);
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'You\'re already on our waitlist! We\'ll be in touch soon.' 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Store waitlist entry
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: sanitizedEmail,
        job_spec: sanitizedJobSpec,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('[SUBMIT-WAITLIST] Database error:', insertError);
      throw insertError;
    }

    console.log(`[SUBMIT-WAITLIST] Successfully added to waitlist: ${sanitizedEmail}`);

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
    console.error('[SUBMIT-WAITLIST] Error:', error);
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
