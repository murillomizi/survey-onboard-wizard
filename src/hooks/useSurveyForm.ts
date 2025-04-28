
import { useSurveyFormState } from "./useSurveyFormState";
import { useSurveyProgress } from "./useSurveyProgress";
import { useSurveyDownload } from "./useSurveyDownload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";

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

  const { startPolling, stopPolling, pollingRef, checkProgress } = useSurveyProgress((count) => {
    setProcessedCount(count);
    if (count >= totalCount && totalCount > 0) {
      setIsComplete(true);
      stopPolling();
    }
  });

  const handleFileUpload = async (file: File): Promise<boolean> => {
    if (file.type !== "text/csv") {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return false;
    }

    return new Promise((resolve) => {
      const csvFileName = file.name;
      
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const filteredData = results.data.filter(row => 
              row && typeof row === 'object' && Object.keys(row).length > 0
            );
            
            if (filteredData.length > 0) {
              setTotalCount(filteredData.length);
              setParsedCsvData(filteredData);
              resolve(true);
            } else {
              toast({
                title: "Arquivo vazio",
                description: "O arquivo CSV não contém dados válidos.",
                variant: "destructive"
              });
              resolve(false);
            }
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erro ao processar arquivo",
            description: "Não foi possível ler o arquivo CSV. Verifique se o formato está correto.",
            variant: "destructive"
          });
          resolve(false);
        }
      });
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
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
    setIsComplete,
    processingId,
    setProcessingId,
    parsedCsvData,
    setParsedCsvData,
    handleSubmit,
    handleDownload: () => processingId ? handleDownload(processingId) : null,
    isDownloading,
    pollingRef,
    handleFileUpload,
    checkProgress,
    isSubmitting: isProcessing,
    csvFileName: surveyData.csvFileName
  };
};
