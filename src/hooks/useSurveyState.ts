
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SurveyData {
  canal: string;
  funnelStage: string;
  csvData: any[];
  websiteUrl: string;
  tamanho: number;
  tomVoz: string;
  gatilhos: string;
}

export const useSurveyState = () => {
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

  const [surveyData, setSurveyData] = useState<SurveyData>({
    canal: "",
    funnelStage: "",
    csvData: [],
    websiteUrl: "",
    tamanho: 350,
    tomVoz: "",
    gatilhos: ""
  });

  const checkProcessingProgress = async (id: string, totalItems: number) => {
    const stringId = String(id);
    console.log("Checking progress for id:", stringId);

    try {
      const { count, error } = await supabase
        .from('Data set final')
        .select('id', { count: 'exact' })
        .eq('id', stringId);
      
      if (error) {
        console.error("Error checking progress:", error);
        return false;
      }
      
      const processed = count || 0;
      console.log(`Progress: ${processed}/${totalItems} records processed`);
      setProcessedCount(processed);
      
      if (processed < totalItems) {
        return false;
      }
      return true;
    } catch (err) {
      console.error("Exception in checkProcessingProgress:", err);
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      setShowLoading(true);
      setIsSubmitting(true);
      
      if (!surveyData.canal || !surveyData.funnelStage) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        setShowLoading(false);
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
        return;
      }

      setSurveyId(data[0].id);
      console.log("Survey saved with id:", data[0].id);
      return { id: data[0].id, totalItems };

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setShowLoading(false);
    }
  };

  return {
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
    checkProcessingProgress,
    handleSubmit
  };
};
