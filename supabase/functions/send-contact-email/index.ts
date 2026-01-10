import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactFormRequest = await req.json();

    // Input validation
    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be between 2 and 100 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.length < 3 || subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Subject must be between 3 and 200 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!message || typeof message !== 'string' || message.length < 10 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message must be between 10 and 5000 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[SEND-CONTACT-EMAIL] Processing contact form from ${email}`);

    // Send notification to support team
    const supportEmailResponse = await resend.emails.send({
      from: "Spec2Hire Contact Form <onboarding@resend.dev>",
      to: ["onboarding@resend.dev"], // Replace with actual support email when domain is verified
      reply_to: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This message was sent via the Spec2Hire contact form.
          </p>
        </body>
        </html>
      `,
    });

    console.log("[SEND-CONTACT-EMAIL] Support notification sent:", supportEmailResponse);

    // Send confirmation to user
    const userEmailResponse = await resend.emails.send({
      from: "Spec2Hire <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message! - Spec2Hire",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Thank You, ${name}! 📬</h1>
            <p style="color: #666; font-size: 16px;">We've received your message and will get back to you soon.</p>
          </div>
          
          <div style="background: #f0f9ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #1e40af; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="background: #fff; border-radius: 8px; padding: 16px; margin-top: 12px; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          
          <div style="background: #fefce8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #854d0e; margin-top: 0;">⏱️ Expected Response Time</h3>
            <p style="color: #713f12; margin-bottom: 0;">We typically respond within 24-48 hours during business days. Pro subscribers receive priority support with faster response times.</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <p style="color: #666;">In the meantime, check out our resources:</p>
            <a href="https://spec-to-hire.lovable.app/faq" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 4px;">FAQ</a>
            <a href="https://spec-to-hire.lovable.app/how-to-use" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 4px;">How to Use</a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Best regards,<br><strong>The Spec2Hire Team</strong></p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[SEND-CONTACT-EMAIL] User confirmation sent:", userEmailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SEND-CONTACT-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);