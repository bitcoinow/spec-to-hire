import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify cron secret for authorization
  const cronSecret = req.headers.get('x-cron-secret');
  const expectedSecret = Deno.env.get('CRON_SECRET');
  if (!expectedSecret || cronSecret !== expectedSecret) {
    console.log('Unauthorized: Invalid or missing cron secret');
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Checking for scheduled posts to publish...');

    // Find all scheduled posts that should be published now
    const { data: scheduledPosts, error: fetchError } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${scheduledPosts?.length || 0} posts to publish`);

    if (scheduledPosts && scheduledPosts.length > 0) {
      // Update posts to published status
      const postIds = scheduledPosts.map(post => post.id);
      
      const { error: updateError } = await supabaseClient
        .from('blog_posts')
        .update({ 
          status: 'published',
          published: true,
          updated_at: new Date().toISOString()
        })
        .in('id', postIds);

      if (updateError) {
        console.error('Error publishing posts:', updateError);
        throw updateError;
      }

      console.log(`Successfully published ${postIds.length} posts`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        publishedCount: scheduledPosts?.length || 0,
        publishedIds: scheduledPosts?.map(p => p.id) || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in auto-publish-scheduled:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
