import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  planName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, planName }: WelcomeEmailRequest = await req.json();

    if (!email || !planName) {
      return new Response(
        JSON.stringify({ error: "Email and plan name are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[SEND-WELCOME-EMAIL] Sending welcome email to ${email} for ${planName}`);

    const emailResponse = await resend.emails.send({
      from: "Spec2Hire <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Spec2Hire Pro! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Spec2Hire Pro! 🎉</h1>
            <p style="color: #666; font-size: 16px;">You've subscribed to the <strong>${planName}</strong> plan</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #1e40af; margin-top: 0;">🚀 Getting Started Tips</h2>
            <ol style="padding-left: 20px;">
              <li style="margin-bottom: 12px;">
                <strong>Set Up Your Master Profile</strong><br>
                <span style="color: #666;">Add your contact details, skills, experience, and education. This is your single source of truth for all applications.</span>
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Import Your Existing CV</strong><br>
                <span style="color: #666;">Drag and drop a .docx file or paste your resume text to auto-populate your profile.</span>
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Generate Your First CV</strong><br>
                <span style="color: #666;">Paste a job description and watch as we create an ATS-optimized CV tailored to the role.</span>
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Review Your Match Score</strong><br>
                <span style="color: #666;">Check how well your profile matches the job requirements and identify any skill gaps.</span>
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Track Your Applications</strong><br>
                <span style="color: #666;">Use the Job Tracker to manage all your applications in one place.</span>
              </li>
            </ol>
          </div>
          
          <div style="background: #fefce8; border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #eab308;">
            <h3 style="color: #854d0e; margin-top: 0;">💡 Pro Tip</h3>
            <p style="color: #713f12; margin-bottom: 0;">Keep your Master Profile updated with new skills and experiences. The more complete your profile, the better your generated CVs will match job requirements!</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://spec-to-hire.lovable.app/app" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">Start Creating CVs →</a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Need help? Check out our <a href="https://spec-to-hire.lovable.app/how-to-use" style="color: #2563eb;">How to Use Guide</a> or <a href="https://spec-to-hire.lovable.app/faq" style="color: #2563eb;">FAQ</a></p>
            <p style="margin-top: 16px;">Happy job hunting! 🎯<br><strong>The Spec2Hire Team</strong></p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[SEND-WELCOME-EMAIL] Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SEND-WELCOME-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);