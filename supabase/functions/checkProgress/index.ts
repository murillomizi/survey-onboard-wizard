
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResponseData {
  count: number;
  isComplete?: boolean;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { surveyId } = await req.json();

    if (!surveyId) {
      return new Response(
        JSON.stringify({ error: "Missing surveyId parameter" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the survey to determine total rows
    const { data: surveyData, error: surveyError } = await supabase
      .from("mizi_ai_surveys")
      .select("id, csv_data")
      .eq("id", surveyId)
      .single();

    if (surveyError) {
      console.error("Survey fetch error:", surveyError);
      return new Response(
        JSON.stringify({ error: "Error fetching survey data" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const totalRows = surveyData?.csv_data?.length || 0;

    // Count how many processed rows we have for this survey
    const { count, error: countError } = await supabase
      .from("mizi_ai_personalized_return")
      .select("id", { count: "exact", head: true })
      .eq("mizi_ai_id", surveyId);

    if (countError) {
      console.error("Count error:", countError);
      return new Response(
        JSON.stringify({ error: "Error counting processed items" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Determine if processing is complete
    const isComplete = totalRows > 0 && count >= totalRows;
    
    const responseData: ResponseData = { 
      count: count || 0,
      isComplete
    };

    // Return response with processed count and completion status
    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
