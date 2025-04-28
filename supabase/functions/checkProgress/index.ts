
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    )
    
    const { surveyId, fetchData } = await req.json()
    console.log(`Checking progress for survey ID: ${surveyId}, fetchData: ${fetchData}`)

    if (!surveyId) {
      return new Response(
        JSON.stringify({ error: 'Survey ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Verify if the survey exists
    const { data: surveyData, error: surveyError } = await supabase
      .from('mizi_ai_surveys')
      .select('*')
      .eq('id', surveyId)
      .single()
    
    if (surveyError || !surveyData) {
      return new Response(
        JSON.stringify({ error: 'Survey not found', details: surveyError }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Count the number of processed entries in the personalized return table
    const { count, error: countError } = await supabase
      .from('mizi_ai_personalized_return')
      .select('*', { count: 'exact', head: true })
      .eq('mizi_ai_id', surveyId)
    
    if (countError) {
      return new Response(
        JSON.stringify({ error: 'Error counting processed entries', details: countError }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // CSV data length for comparison
    const csvDataLength = Array.isArray(surveyData.csv_data) ? surveyData.csv_data.length : 0
    console.log(`Survey has ${csvDataLength} entries, ${count} processed`)
    
    // If the client wants to fetch the processed data
    let processedData = null
    if (fetchData) {
      const { data, error } = await supabase
        .from('mizi_ai_personalized_return')
        .select('*')
        .eq('mizi_ai_id', surveyId)
      
      if (error) {
        return new Response(
          JSON.stringify({ error: 'Error fetching processed data', details: error }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      processedData = data
      console.log(`Retrieved ${data?.length || 0} processed records for download`)
    }

    // Determine if processing is complete
    const isComplete = csvDataLength > 0 && count >= csvDataLength

    return new Response(
      JSON.stringify({
        count,
        total: csvDataLength,
        isComplete,
        surveyId,
        processedData: fetchData ? processedData : null
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
    
  } catch (error) {
    console.error('Error in Edge Function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
