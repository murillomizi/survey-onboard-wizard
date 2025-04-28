
import { useSurveyManager } from "./useSurveyManager";

/**
 * Hook simplificado que utiliza o SurveyManager para fornecer funcionalidades
 * do formulário de enquete
 */
export const useSurveyForm = () => {
  const surveyManager = useSurveyManager();
  
  return surveyManager;
};
