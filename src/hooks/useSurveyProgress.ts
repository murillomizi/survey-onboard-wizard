
import { useRef, useCallback } from "react";
import { SurveyController } from "@/controllers/SurveyController";

/**
 * @deprecated Use o hook useSurveyManager em vez disso
 */
export const useSurveyProgress = (onProgressUpdate: (count: number) => void) => {
  const pollingRef = useRef<number | null>(null);

  const checkProgress = useCallback(async (surveyId: string) => {
    try {
      console.log(`Verificando progresso para ID: ${surveyId}, Timestamp: ${new Date().toISOString()}`);
      
      const status = await SurveyController.checkProgress(surveyId);
      
      if (status) {
        onProgressUpdate(status.processedCount);
      }
      
      return status;
    } catch (error) {
      console.error("Error in checkProgress:", error);
      return null;
    }
  }, [onProgressUpdate]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback((surveyId: string) => {
    stopPolling();
    pollingRef.current = window.setInterval(() => {
      checkProgress(surveyId);
    }, 2000);
  }, [checkProgress, stopPolling]);

  return {
    checkProgress,
    startPolling,
    stopPolling,
    pollingRef
  };
};
