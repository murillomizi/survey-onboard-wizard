
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

  const fetchLeadCounts = async () => {
    if (!surveyId) return;
    
    try {
      setIsLoading(true);
      
      const { data: surveyData, error: surveyError } = await supabase
        .from('mizi_ai_surveys')
        .select('csv_data')
        .eq('id', surveyId)
        .single();

      if (surveyError) throw surveyError;
      
      const csvData = surveyData?.csv_data;
      const inputCount = Array.isArray(csvData) ? csvData.length : 0;
      setInputLeads(inputCount);

      // Using a simple string-based filter instead of a complex type
      const { data: processedData, error: processedError } = await supabase
        .from('Data set final')
        .select('*');

      if (processedError) throw processedError;
      
      setProcessedLeads(processedData?.length || 0);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lead counts:", error);
      setError("Failed to load lead processing status");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadCounts();
    
    // Set up real-time listener for both tables
    const miziChannel = supabase.channel('mizi-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'mizi_ai_surveys',
          filter: `id=eq.${surveyId}`
        },
        () => fetchLeadCounts()
      )
      .subscribe();

    const datasetChannel = supabase.channel('dataset-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'Data set final'
        },
        () => fetchLeadCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(miziChannel);
      supabase.removeChannel(datasetChannel);
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
