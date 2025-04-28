
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Edge function para verificar o progresso do processamento
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Obter parâmetros da requisição
    const { surveyId, fetchData } = await req.json();
    console.log(`Checking progress for survey ID: ${surveyId}, fetchData: ${fetchData}`);
    
    if (!surveyId) {
      return new Response(
        JSON.stringify({ error: 'Missing survey ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Obter dados do survey
    const { data: surveyData, error: surveyError } = await supabase
      .from('mizi_ai_surveys')
      .select('csv_data')
      .eq('id', surveyId)
      .single();
      
    if (surveyError) {
      console.error('Error fetching survey data:', surveyError);
      throw surveyError;
    }
    
    // Calcular número total de linhas
    const totalEntries = Array.isArray(surveyData?.csv_data) ? surveyData.csv_data.length : 0;
    console.log(`Survey has ${totalEntries} entries`);
    
    // Contar registros processados
    const { data: processedData, error: dataError } = await supabase
      .from('mizi_ai_personalized_return')
      .select('*')
      .eq('mizi_ai_id', surveyId);
      
    if (dataError) {
      console.error('Error fetching processed data:', dataError);
      throw dataError;
    }
    
    const processedCount = processedData?.length || 0;
    console.log(`${processedCount} processed`);
    
    // Verificar se está completo - consideramos processado se tiver pelo menos um registro processado
    // e se o número de registros processados for maior ou igual ao número total de entradas
    const isComplete = processedCount > 0 && (processedCount >= totalEntries);
    
    // Retornar resposta
    return new Response(
      JSON.stringify({ 
        count: processedCount, 
        total: totalEntries,
        isComplete,
        processedData: fetchData ? processedData : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in checkProgress edge function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
