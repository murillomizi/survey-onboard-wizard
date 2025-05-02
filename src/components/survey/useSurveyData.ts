
import { useState } from "react";
import { SurveyData } from "./types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSurveyData = () => {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    canal: "",
    funnelStage: "",
    csvData: [],
    websiteUrl: "",
    tamanho: 350,
    tomVoz: "",
    gatilhos: "",
    userEmail: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const updateSurveyData = (field: keyof SurveyData, value: any) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Check if the survey has already been submitted
    if (hasSubmitted) {
      toast({
        title: "Submissão já realizada",
        description: "Sua base já foi processada, espere o e-mail com os contatos personalizados.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!surveyData.canal || !surveyData.funnelStage || !surveyData.userEmail) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      let csvDataToSave = surveyData.csvData;
      if (surveyData.csvData && surveyData.csvData.length > 100) {
        csvDataToSave = surveyData.csvData.slice(0, 100);
        console.log('CSV data trimmed to 100 records to avoid payload size issues');
      }
      
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

      if (error) {
        console.error('Error saving survey:', error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar suas respostas. Tente novamente.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Survey data saved:', data);
      setIsSubmitting(false);
      
      // Mark as submitted to prevent multiple submissions
      setHasSubmitted(true);
      return true;
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    surveyData,
    updateSurveyData,
    isSubmitting,
    hasSubmitted,
    handleSubmit
  };
};
