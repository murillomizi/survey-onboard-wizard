
import { useCallback } from "react";
import { SurveyController } from "@/controllers/SurveyController";
import { SurveyState, SurveyStateUpdater } from "@/types/survey";

export const useSurveyFileHandler = (updateState: SurveyStateUpdater, state: SurveyState) => {
  const handleFileUpload = useCallback(async (file: File): Promise<boolean> => {
    try {
      const result = await SurveyController.processCSVFile(file);
      
      updateState({
        totalCount: result.totalCount,
        parsedCsvData: result.data
      });
      
      const newSurveyData = {
        ...state.surveyData,
        csvFile: file,
        csvFileName: file.name
      };

      updateState({ surveyData: newSurveyData });
      
      return true;
    } catch (error) {
      return false;
    }
  }, [updateState, state.surveyData]);

  return { handleFileUpload };
};
