import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { blogId } = await req.json();

    if (!blogId) {
      throw new Error("Blog ID is required");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the blog post
    const { data: blog, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, category, content')
      .eq('id', blogId)
      .single();

    if (fetchError || !blog) {
      throw new Error("Blog post not found");
    }

    console.log(`Generating images for blog: ${blog.title}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate 3 images for the blog post
    const imageUrls: string[] = [];
    const imagePrompts = [
      `Professional blog header image for: ${blog.title}. Style: modern, clean, professional, relevant to job search and career development. High quality, suitable for web use.`,
      `Infographic style illustration about: ${blog.title}. Clean design, professional, suitable for blog content.`,
      `Professional workplace or career-related image for: ${blog.title}. Modern style, high quality.`
    ];

    for (const prompt of imagePrompts) {
      try {
        console.log(`Generating image with prompt: ${prompt.substring(0, 50)}...`);
        
        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: prompt
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (!imageResponse.ok) {
          console.error(`Image generation failed: ${imageResponse.status}`);
          continue;
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (imageUrl) {
          imageUrls.push(imageUrl);
          console.log(`Image generated successfully (${imageUrls.length}/3)`);
        }
      } catch (imageError) {
        console.error("Error generating individual image:", imageError);
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("Failed to generate any images");
    }

    console.log(`Generated ${imageUrls.length} images, updating blog post...`);

    // Update the blog post with the generated images
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        image_urls: imageUrls,
        image_url: imageUrls[0]
      })
      .eq('id', blogId);

    if (updateError) {
      throw updateError;
    }

    console.log("Blog post updated successfully with images");

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrls,
        message: `Generated ${imageUrls.length} images for the blog post` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-blog-images function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate images" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
