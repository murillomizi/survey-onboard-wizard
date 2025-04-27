
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from checkProgress Edge Function!");

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the current time for logging
    const timestamp = new Date().toISOString();
    
    // Parse the request body
    const { surveyId } = await req.json();
    
    console.log(`EdgeFunction checkProgress: Starting check for survey ID: ${surveyId}\n`);
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Query the processed rows
    const { data, error, count } = await supabaseClient
      .from('mizi_ai_personalized_return')
      .select('*', { count: 'exact' })
      .eq('mizi_ai_id', surveyId);
    
    if (error) {
      console.error(`EdgeFunction checkProgress: Error querying data: ${error.message}`);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 400 
        }
      );
    }
    
    const rowCount = data?.length || 0;
    console.log(`EdgeFunction checkProgress: Found ${rowCount} rows for survey ID ${surveyId}\n`);
    
    // Return the result
    return new Response(
      JSON.stringify({ 
        count: rowCount,
        timestamp: timestamp,
        status: 'success' 
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    );
  } catch (error) {
    console.error(`EdgeFunction checkProgress: Unhandled error: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        error: 'An unhandled error occurred',
        errorDetails: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      }
    );
  }
});
