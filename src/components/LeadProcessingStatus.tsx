
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface LeadProcessingStatusProps {
  surveyId: string | null;
}

const LeadProcessingStatus = ({ surveyId }: LeadProcessingStatusProps) => {
  const [inputLeads, setInputLeads] = useState<number>(0);
  const [processedLeads, setProcessedLeads] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId) return;

    const fetchLeadCounts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the input lead count from mizi_ai_surveys
        const { data: surveyData, error: surveyError } = await supabase
          .from('mizi_ai_surveys')
          .select('csv_data')
          .eq('id', surveyId)
          .single();

        if (surveyError) throw surveyError;
        
        const inputCount = surveyData.csv_data ? surveyData.csv_data.length : 0;
        setInputLeads(inputCount);

        // Fetch the processed lead count from Data set final 
        // We're looking for records that match the survey_id
        const { data: processedData, error: processedError } = await supabase
          .from('Data set final')
          .select('count')
          .eq('survey_id', surveyId)
          .maybeSingle();

        // If no data is returned, we assume 0 processed leads
        const processedCount = processedData ? parseInt(processedData.count.toString()) : 0;
        setProcessedLeads(processedCount);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching lead counts:", error);
        setError("Failed to load lead processing status");
        setIsLoading(false);
      }
    };

    fetchLeadCounts();
    
    // Set up real-time listener for updates to processed leads
    const channel = supabase
      .channel('lead-processing-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'Data set final',
          filter: `survey_id=eq.${surveyId}`
        },
        (payload) => {
          // Reload the processed leads count when data changes
          fetchLeadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [surveyId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Carregando status do processamento...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-2">{error}</div>;
  }

  const progressPercentage = inputLeads > 0 ? (processedLeads / inputLeads) * 100 : 0;

  return (
    <div className="space-y-2 py-4">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Processamento de Leads</span>
        <span className="text-gray-500">
          {processedLeads} de {inputLeads} leads processados
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <p className="text-xs text-gray-500">
        {progressPercentage < 100 ? 
          "Seus dados estão sendo processados pelo Make.com. Isso pode levar alguns minutos." :
          "Todos os leads foram processados com sucesso!"
        }
      </p>
    </div>
  );
};

export default LeadProcessingStatus;
