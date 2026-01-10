import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Price IDs for different billing intervals
const PRICE_IDS = {
  weekly: "price_1SnsIDJyt0pEMwCOM89uwilQ",  // $3.99/week
  monthly: "price_1SdVh4Jyt0pEMwCOoUytftDt", // $12.99/month
  yearly: "price_1SdVh6Jyt0pEMwCOWh2AbUeA",  // $79.99/year
};

// Plan names for welcome emails
const PLAN_NAMES: Record<string, string> = {
  weekly: "Pro Weekly ($3.99/week)",
  monthly: "Pro Monthly ($12.99/month)",
  yearly: "Pro Yearly ($79.99/year)",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Parse request body to get billing interval
    const body = await req.json().catch(() => ({}));
    const billingInterval = body.billingInterval || "monthly";
    
    console.log(`[CREATE-CHECKOUT] Starting checkout for ${billingInterval} plan`);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    console.log(`[CREATE-CHECKOUT] User authenticated: ${user.email}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2025-08-27.basil" 
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`[CREATE-CHECKOUT] Found existing Stripe customer: ${customerId}`);
    }

    // Get the appropriate price ID based on billing interval
    const priceId = PRICE_IDS[billingInterval as keyof typeof PRICE_IDS] || PRICE_IDS.monthly;
    const planName = PLAN_NAMES[billingInterval as keyof typeof PLAN_NAMES] || PLAN_NAMES.monthly;
    console.log(`[CREATE-CHECKOUT] Using price ID: ${priceId}`);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/app?subscription=success&plan=${billingInterval}`,
      cancel_url: `${req.headers.get("origin")}/app?subscription=cancelled`,
      // Enable email receipts for payment confirmation
      payment_intent_data: undefined, // Not applicable for subscriptions
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_name: planName,
          billing_interval: billingInterval,
        },
      },
      // Invoice settings ensure receipts are sent
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: {
            user_id: user.id,
          },
        },
      },
    });

    console.log(`[CREATE-CHECKOUT] Checkout session created: ${session.id}`);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[CREATE-CHECKOUT] Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});