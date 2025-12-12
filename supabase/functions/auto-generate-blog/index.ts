import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting auto blog generation...');

    // Get automation settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('blog_automation_settings')
      .select('*')
      .single();

    if (settingsError || !settings || !settings.enabled) {
      console.log('Automation is disabled or settings not found');
      return new Response(
        JSON.stringify({ message: 'Automation is disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we should generate based on frequency
    const now = new Date();
    const lastGenerated = settings.last_generated_at ? new Date(settings.last_generated_at) : null;
    
    let shouldGenerate = false;
    if (!lastGenerated) {
      shouldGenerate = true;
    } else {
      const hoursSinceLastGen = (now.getTime() - lastGenerated.getTime()) / (1000 * 60 * 60);
      
      if (settings.frequency === 'daily' && hoursSinceLastGen >= 24) {
        shouldGenerate = true;
      } else if (settings.frequency === 'weekly' && hoursSinceLastGen >= 168) {
        shouldGenerate = true;
      } else if (settings.frequency === 'monthly' && hoursSinceLastGen >= 720) {
        shouldGenerate = true;
      }
    }

    if (!shouldGenerate) {
      console.log('Not time to generate yet based on frequency');
      return new Response(
        JSON.stringify({ message: 'Not time to generate yet' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating blog post via generate-blog function...');

    // Generate trending news topics based on categories
    const topicsByCategory: Record<string, string[]> = {
      job_news: [
        'Breaking: Major shifts in the job market this week',
        'Latest employment report reveals surprising trends',
        'New hiring data shows which industries are booming',
      ],
      hiring_tips: [
        'Top recruiters reveal what they look for in 2024',
        'Interview techniques that are working right now',
        'Resume trends employers are responding to',
      ],
      industry_trends: [
        'Industries experiencing the biggest growth this month',
        'Emerging career paths gaining traction',
        'Sector analysis: Where the opportunities are',
      ],
      company_spotlight: [
        'Companies with the most job openings this week',
        'Tech giants announce major hiring initiatives',
        'Startups disrupting the job market',
      ],
      tech_news: [
        'Latest technology developments affecting the workforce',
        'New tools transforming how we work',
        'Tech industry hiring and layoff updates',
      ],
      ai_trends: [
        'How AI is reshaping job roles across industries',
        'New AI tools for job seekers and professionals',
        'Automation trends and what they mean for your career',
      ],
      companies_hiring: [
        'Companies actively hiring across multiple locations',
        'Remote-first companies expanding their teams',
        'Major employers announce new positions',
      ],
      market_insights: [
        'Economic indicators and their impact on jobs',
        'Salary trends and compensation updates',
        'Labor market forecast for the coming months',
      ],
    };

    const allCategories = settings.categories?.length > 0 
      ? settings.categories 
      : ['job_news', 'tech_news', 'ai_trends', 'companies_hiring'];
    
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const categoryTopics = topicsByCategory[randomCategory] || topicsByCategory.job_news;
    const randomTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];

    // Call the generate-blog function
    const { data: blogData, error: generateError } = await supabaseClient.functions.invoke('generate-blog', {
      body: { 
        topic: randomTopic,
        category: randomCategory,
        jobSiteUrl: null
      }
    });

    if (generateError) {
      console.error('Error generating blog:', generateError);
      throw generateError;
    }

    console.log('Blog generated successfully, saving to database...');

    // Get the first admin user to set as author
    const { data: adminUser, error: adminError } = await supabaseClient
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (adminError || !adminUser) {
      console.error('No admin user found');
      throw new Error('No admin user found');
    }

    // Save the blog post
    const { error: insertError } = await supabaseClient
      .from('blog_posts')
      .insert({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        tags: blogData.tags,
        category: blogData.category,
        job_site_url: blogData.jobSiteUrl,
        image_url: blogData.imageUrl || (blogData.imageUrls?.[0] || null),
        image_urls: blogData.imageUrls || null,
        status: settings.auto_publish ? 'published' : 'draft',
        published: settings.auto_publish,
        author_id: adminUser.user_id,
      });

    if (insertError) {
      console.error('Error saving blog:', insertError);
      throw insertError;
    }

    // Update last generated timestamp
    await supabaseClient
      .from('blog_automation_settings')
      .update({ last_generated_at: now.toISOString() })
      .eq('id', settings.id);

    console.log('Blog post auto-generated and saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        topic: randomTopic,
        category: randomCategory,
        autoPublished: settings.auto_publish
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in auto-generate-blog:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
