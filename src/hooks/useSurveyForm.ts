
import { useSurveyManager } from "./useSurveyManager";

/**
 * Hook simplificado que utiliza o SurveyManager para fornecer funcionalidades
 * do formulário de enquete
 */
export const useSurveyForm = () => {
  const surveyManager = useSurveyManager();
  
  // Adding the loadSurvey property from surveyManager
  return {
    ...surveyManager,
    csvFileName: surveyManager.surveyData?.csvFileName || "",
    // Make sure loadSurvey is extracted directly from surveyManager
    loadSurvey: surveyManager.loadSurvey
  };
};
