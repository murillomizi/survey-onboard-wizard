
import { useState, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";

interface SurveyFormState {
  canal: string;
  csvFile: File | null;
  csvFileName: string;
  websiteUrl: string;
  tamanho: number;
  touchpoints: string;
  tomVoz: string;
  template: string;
  gatilhos: string;
}

export const useSurveyForm = () => {
  const [surveyData, setSurveyData] = useState<SurveyFormState>({
    canal: "linkedin",
    csvFile: null,
    csvFileName: "",
    websiteUrl: "",
    tamanho: 350,
    touchpoints: "3",
    tomVoz: "neutro",
    template: "proposta",
    gatilhos: "sem-gatilho"
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [parsedCsvData, setParsedCsvData] = useState<any[]>([]);
  const pollingRef = useRef<number | null>(null);

  const checkProgress = async (surveyId: string) => {
    try {
      console.log(`Checking progress via Edge Function for survey ID: ${surveyId}, Timestamp: ${new Date().toISOString()}`);
      
      // Usar a Edge Function em vez de uma consulta direta ao banco de dados
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { surveyId }
      });
      
      console.log('Edge Function response:', data);
      
      if (error) {
        console.error("Error calling checkProgress Edge Function:", error);
        return;
      }

      if (data) {
        const count = data.count || 0;
        setProcessedCount(count);
        console.log(`Processed ${count}/${totalCount} records (via Edge Function)`);
        
        if (count >= totalCount && count > 0) {
          console.log("Processing complete!");
          setIsComplete(true);
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error("Error in checkProgress:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!surveyData.csvFile || parsedCsvData.length === 0) {
      toast({
        title: "Arquivo necessário",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Starting processing, showing loading overlay...");
    setIsProcessing(true);
    setProcessedCount(0);
    setIsComplete(false);
    
    try {
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .insert([
          {
            canal: surveyData.canal,
            touchpoints: surveyData.touchpoints,
            website_url: surveyData.websiteUrl,
            message_length: surveyData.tamanho,
            tone_of_voice: surveyData.tomVoz,
            template: surveyData.template,
            persuasion_trigger: surveyData.gatilhos,
            csv_data: parsedCsvData,
            csv_file_name: surveyData.csvFileName
          }
        ])
        .select();

      if (error) {
        console.error("Error submitting survey:", error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar suas configurações.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      if (data && data.length > 0) {
        const surveyId = data[0].id;
        console.log("Survey saved with ID:", surveyId);
        setProcessingId(surveyId);
        
        await checkProgress(surveyId);
        
        if (pollingRef.current) {
          window.clearInterval(pollingRef.current);
        }
        
        pollingRef.current = window.setInterval(() => {
          checkProgress(surveyId);
        }, 2000);
        
        toast({
          title: "Processamento iniciado",
          description: "Suas configurações foram salvas e o processamento foi iniciado."
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processingId) return;
    
    try {
      console.log("Fetching processed data for download...");
      const { data, error } = await supabase
        .from("mizi_ai_personalized_return")
        .select("*")
        .eq("mizi_ai_id", processingId);
      
      if (error) {
        console.error("Error fetching processed data:", error);
        toast({
          title: "Erro ao baixar dados",
          description: "Não foi possível baixar os dados processados.",
          variant: "destructive"
        });
        return;
      }
      
      if (!data || data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há dados processados para download.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Generating CSV with", data.length, "rows");
      const csv = Papa.unparse(data);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `campanha-personalizada-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "O download da sua campanha personalizada foi iniciado."
      });
    } catch (error) {
      console.error("Error in handleDownload:", error);
      toast({
        title: "Erro no download",
        description: "Ocorreu um erro ao preparar o download.",
        variant: "destructive"
      });
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
    pollingRef
  };
};
