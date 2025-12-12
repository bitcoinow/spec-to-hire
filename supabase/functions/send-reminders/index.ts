import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting reminder check...");

    // Get all users with notification preferences
    const { data: prefsData, error: prefsError } = await supabaseAdmin
      .from("notification_preferences")
      .select("*");

    if (prefsError) {
      console.error("Error fetching preferences:", prefsError);
      throw prefsError;
    }

    if (!prefsData || prefsData.length === 0) {
      console.log("No notification preferences found");
      return new Response(
        JSON.stringify({ message: "No preferences to process" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let emailsSent = 0;
    const today = new Date();

    for (const prefs of prefsData) {
      const userId = prefs.user_id;
      const reminderDays = prefs.reminder_days_before;

      // Get user email
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (userError || !userData?.user?.email) {
        console.log(`No email found for user ${userId}`);
        continue;
      }

      const userEmail = userData.user.email;

      // Check deadline reminders
      if (prefs.email_deadline_reminders) {
        const reminderDate = new Date(today);
        reminderDate.setDate(reminderDate.getDate() + reminderDays);
        const reminderDateStr = reminderDate.toISOString().split("T")[0];

        const { data: deadlines, error: deadlinesError } = await supabaseAdmin
          .from("job_applications")
          .select("*")
          .eq("user_id", userId)
          .eq("deadline", reminderDateStr)
          .neq("status", "rejected")
          .neq("status", "withdrawn");

        if (!deadlinesError && deadlines && deadlines.length > 0) {
          console.log(`Found ${deadlines.length} upcoming deadlines for ${userEmail}`);

          const deadlineList = deadlines
            .map((job) => `• ${job.job_title} at ${job.company_name}`)
            .join("\n");

          try {
            await resend.emails.send({
              from: "Spec2Hire <notifications@resend.dev>",
              to: [userEmail],
              subject: `⏰ ${deadlines.length} Application Deadline${deadlines.length > 1 ? "s" : ""} Coming Up!`,
              html: `
                <h2>Application Deadline Reminder</h2>
                <p>You have ${deadlines.length} application deadline${deadlines.length > 1 ? "s" : ""} in ${reminderDays} day${reminderDays > 1 ? "s" : ""}:</p>
                <pre style="background:#f5f5f5;padding:16px;border-radius:8px;">${deadlineList}</pre>
                <p>Don't miss your chance! Log in to review and submit your applications.</p>
                <p style="color:#666;font-size:12px;">You received this email because you have deadline reminders enabled in Spec2Hire.</p>
              `,
            });
            emailsSent++;
            console.log(`Deadline reminder sent to ${userEmail}`);
          } catch (emailError) {
            console.error(`Failed to send deadline reminder to ${userEmail}:`, emailError);
          }
        }
      }

      // Check interview reminders (for jobs in "interviewing" status with upcoming notes)
      if (prefs.email_interview_reminders) {
        const { data: interviews, error: interviewsError } = await supabaseAdmin
          .from("job_applications")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "interviewing");

        if (!interviewsError && interviews && interviews.length > 0) {
          // Filter jobs where notes mention a date in the next few days
          const upcomingInterviews = interviews.filter((job) => {
            if (!job.notes) return false;
            // Simple date detection in notes
            const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/g;
            const matches = job.notes.match(datePattern);
            if (matches) {
              for (const match of matches) {
                const noteDate = new Date(match);
                const diffDays = Math.ceil((noteDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays <= reminderDays) {
                  return true;
                }
              }
            }
            return false;
          });

          if (upcomingInterviews.length > 0) {
            console.log(`Found ${upcomingInterviews.length} upcoming interviews for ${userEmail}`);

            const interviewList = upcomingInterviews
              .map((job) => `• ${job.job_title} at ${job.company_name}`)
              .join("\n");

            try {
              await resend.emails.send({
                from: "Spec2Hire <notifications@resend.dev>",
                to: [userEmail],
                subject: `🎯 Interview Reminder: ${upcomingInterviews.length} Upcoming Interview${upcomingInterviews.length > 1 ? "s" : ""}`,
                html: `
                  <h2>Interview Reminder</h2>
                  <p>You have ${upcomingInterviews.length} interview${upcomingInterviews.length > 1 ? "s" : ""} coming up:</p>
                  <pre style="background:#f5f5f5;padding:16px;border-radius:8px;">${interviewList}</pre>
                  <p>Good luck! Make sure to prepare and review your notes.</p>
                  <p style="color:#666;font-size:12px;">You received this email because you have interview reminders enabled in Spec2Hire.</p>
                `,
              });
              emailsSent++;
              console.log(`Interview reminder sent to ${userEmail}`);
            } catch (emailError) {
              console.error(`Failed to send interview reminder to ${userEmail}:`, emailError);
            }
          }
        }
      }
    }

    console.log(`Reminder check complete. ${emailsSent} emails sent.`);

    return new Response(
      JSON.stringify({ success: true, emailsSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-reminders:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});