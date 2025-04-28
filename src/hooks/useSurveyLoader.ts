
import { useState, useCallback } from "react";
import { SurveyController } from "@/controllers/SurveyController";
import { toast } from "@/components/ui/use-toast";
import { SurveyState, SurveyStateUpdater } from "@/types/survey";

export const useSurveyLoader = (updateState: SurveyStateUpdater) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadSurvey = useCallback(async (surveyId: string) => {
    if (!surveyId) return;
    
    setIsLoading(true);
    try {
      const details = await SurveyController.getSurveyDetails(surveyId);
      
      if (!details) {
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os dados da enquete.",
          variant: "destructive"
        });
        return;
      }
      
      updateState({
        surveyData: details.surveyData,
        processedCount: details.processingStatus.processedCount,
        totalCount: details.processingStatus.totalCount,
        isComplete: details.processingStatus.isComplete,
        processingId: details.id,
        parsedCsvData: details.parsedCsvData
      });
      
      return details;
    } catch (error) {
      console.error("Error loading survey:", error);
      toast({
        title: "Erro ao carregar chat",
        description: "Ocorreu um erro ao carregar o chat selecionado.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [updateState]);

  return { loadSurvey, isLoading };
};
