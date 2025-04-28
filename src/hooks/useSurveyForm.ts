
import { useSurveyManager } from "./useSurveyManager";

/**
 * Hook simplificado que utiliza o SurveyManager para fornecer funcionalidades
 * do formulário de enquete
 */
export const useSurveyForm = () => {
  const surveyManager = useSurveyManager();
  
  // Adicionando uma propriedade csvFileName explicitamente para resolver a referência
  return {
    ...surveyManager,
    csvFileName: surveyManager.surveyData?.csvFileName || "",
    loadSurvey: surveyManager.loadSurvey
  };
};
