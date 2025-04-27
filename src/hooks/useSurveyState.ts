import { useState, useRef } from 'react';
import { Message, SurveyData, WebhookStatus } from '../types/survey';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSurveyState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showOptions, setShowOptions] = useState<{
    options: { value: string; label: string }[];
    step: number;
  } | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(350);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const checkProgressInterval = useRef<NodeJS.Timeout | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<WebhookStatus>("idle");
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);

  const [surveyData, setSurveyData] = useState<SurveyData>({
    canal: "",
    funnelStage: "",
    csvData: [],
    websiteUrl: "",
    tamanho: 350,
    tomVoz: "",
    gatilhos: ""
  });

  const fetchProcessedData = async (surveyId: string) => {
    try {
      const { data, error } = await supabase
        .from('Data set final')
        .select('*')
        .eq('id', surveyId);

      if (error) {
        console.error('Error fetching processed data:', error);
        return;
      }

      if (data) {
        setProcessedData(data);
        return data;
      }
    } catch (error) {
      console.error('Error in fetchProcessedData:', error);
    }
    return [];
  };

  const downloadCsv = () => {
    if (!processedData || processedData.length === 0) {
      toast({
        title: "Sem dados para download",
        description: "Não há dados processados disponíveis para download.",
        variant: "destructive"
      });
      return;
    }

    try {
      let csvContent = "";
      
      const headers = Object.keys(processedData[0]);
      csvContent += headers.join(",") + "\n";
      
      processedData.forEach(item => {
        const row = headers.map(header => {
          const value = item[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        });
        csvContent += row.join(",") + "\n";
      });

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const filename = `mizi-personalization-${year}${month}${day}-${hours}${minutes}.csv`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download iniciado",
        description: `O arquivo ${filename} está sendo baixado.`,
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível gerar o arquivo CSV.",
        variant: "destructive"
      });
    }
  };

  const checkWebhookUrl = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'webhook_url')
        .single();

      if (error) {
        console.error('Error fetching webhook URL:', error);
        return null;
      }
      
      if (data && data.value && typeof data.value === 'object') {
        const valueObject = data.value as { url?: string };
        if (valueObject.url) {
          setWebhookUrl(valueObject.url);
          return valueObject.url;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error checking webhook URL:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setShowLoading(true);
      setIsSubmitting(true);
      setWebhookStatus("checking");
      
      if (!surveyData.canal || !surveyData.funnelStage) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        setShowLoading(false);
        setWebhookStatus("error");
        return;
      }
      
      const url = await checkWebhookUrl();
      if (!url) {
        toast({
          title: "Webhook não configurado",
          description: "A URL do webhook não está configurada. Por favor, configure-a antes de continuar.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        setShowLoading(false);
        setWebhookStatus("error");
        return;
      }
      
      let csvDataToSave = surveyData.csvData;
      if (surveyData.csvData && surveyData.csvData.length > 100) {
        csvDataToSave = surveyData.csvData.slice(0, 100);
      }

      const totalItems = csvDataToSave?.length || 0;
      setTotalCount(totalItems);
      
      const { data, error } = await supabase
        .from('mizi_ai_surveys')
        .insert([
          {
            canal: surveyData.canal,
            funnel_stage: surveyData.funnelStage,
            website_url: surveyData.websiteUrl,
            message_length: surveyData.tamanho,
            tone_of_voice: surveyData.tomVoz,
            persuasion_trigger: surveyData.gatilhos,
            csv_data: csvDataToSave
          }
        ])
        .select();

      if (error || !data?.[0]?.id) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar suas respostas. Tente novamente.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        setShowLoading(false);
        setWebhookStatus("error");
        return;
      }

      setSurveyId(data[0].id);
      setWebhookStatus("processing");

      checkProgressInterval.current = setInterval(async () => {
        const processedData = await fetchProcessedData(data[0].id);
        
        const processed = processedData?.length || 0;
        setProcessedCount(processed);
        
        if (processed >= totalItems) {
          if (checkProgressInterval.current) {
            clearInterval(checkProgressInterval.current);
          }
          setIsSubmitting(false);
          setShowLoading(false);
          setWebhookStatus("complete");
          setIsProcessingComplete(true);
          toast({
            title: "Processamento concluído!",
            description: "Todos os dados foram processados com sucesso.",
          });
        }
      }, 2000);

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setShowLoading(false);
      setWebhookStatus("error");
    }
  };

  return {
    messages,
    setMessages,
    currentInput,
    setCurrentInput,
    currentStep,
    setCurrentStep,
    isWaitingForResponse,
    setIsWaitingForResponse,
    showOptions,
    setShowOptions,
    showSlider,
    setShowSlider,
    sliderValue,
    setSliderValue,
    isSubmitting,
    setIsSubmitting,
    csvFileName,
    setCsvFileName,
    showLoading,
    setShowLoading,
    processedCount,
    setProcessedCount,
    totalCount,
    setTotalCount,
    surveyId,
    setSurveyId,
    surveyData,
    setSurveyData,
    checkProgressInterval,
    webhookStatus,
    setWebhookStatus,
    isProcessingComplete,
    setIsProcessingComplete,
    processedData,
    setProcessedData,
    fetchProcessedData,
    downloadCsv,
    handleSubmit
  };
};
