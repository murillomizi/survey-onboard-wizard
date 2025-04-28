
import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSurveyPolling = () => {
  const pollingRef = useRef<number | null>(null);

  const checkProgress = useCallback(async (surveyId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyId,
          fetchData: false
        }
      });
      
      if (error) {
        throw error;
      }
      
      return {
        processedCount: data.count,
        totalCount: data.total,
        isComplete: data.isComplete
      };
    } catch (error) {
      console.error("Error checking progress:", error);
      return null;
    }
  }, []);

  const startPolling = useCallback((surveyId: string, onUpdate: (data: any) => void) => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
    }
    
    pollingRef.current = window.setInterval(async () => {
      const progress = await checkProgress(surveyId);
      if (progress) {
        onUpdate(progress);
      }
    }, 2000);
  }, [checkProgress]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  return { checkProgress, startPolling, stopPolling };
};
