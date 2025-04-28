
import { useSurveyFormState } from "./useSurveyFormState";
import { useSurveyProgress } from "./useSurveyProgress";
import { useSurveyDownload } from "./useSurveyDownload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSurveyForm = () => {
  const {
    surveyData,
    setSurveyData,
    isProcessing,
    setIsProcessing,
    processedCount,
    setProcessedCount,
    totalCount,
    setTotalCount,
    isComplete,
    setIsComplete,
    processingId,
    setProcessingId,
    parsedCsvData,
    setParsedCsvData
  } = useSurveyFormState();

  const { isDownloading, handleDownload } = useSurveyDownload();

  const { startPolling, stopPolling, pollingRef } = useSurveyProgress((count) => {
    setProcessedCount(count);
    if (count >= totalCount && totalCount > 0) {
      setIsComplete(true);
      stopPolling();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!surveyData.canal || parsedCsvData.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .insert([{
          canal: surveyData.canal,
          funnel_stage: surveyData.touchpoints,
          website_url: surveyData.websiteUrl,
          message_length: surveyData.tamanho,
          tone_of_voice: surveyData.tomVoz,
          persuasion_trigger: surveyData.gatilhos,
          csv_data: parsedCsvData
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const surveyId = data[0].id;
        setProcessingId(surveyId);
        startPolling(surveyId);
        
        toast({
          title: "Processamento iniciado",
          description: "Suas configurações foram salvas e o processamento foi iniciado."
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas configurações.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    surveyData,
    setSurveyData,
    isProcessing,
    processedCount,
    totalCount,
    setTotalCount,
    isComplete,
    processingId,
    parsedCsvData,
    setParsedCsvData,
    handleSubmit,
    handleDownload,
    isDownloading,
    pollingRef
  };
};
