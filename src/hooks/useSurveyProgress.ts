
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSurveyProgress = (onProgressUpdate: (count: number) => void) => {
  const pollingRef = useRef<number | null>(null);

  const checkProgress = async (surveyId: string) => {
    try {
      console.log(`Checking progress via Edge Function for survey ID: ${surveyId}, Timestamp: ${new Date().toISOString()}`);
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { surveyId }
      });
      
      console.log('Edge Function response:', data);
      
      if (error) {
        console.error("Error calling checkProgress Edge Function:", error);
        return;
      }

      if (data) {
        const count = data.count || 0;
        onProgressUpdate(count);
      }
    } catch (error) {
      console.error("Error in checkProgress:", error);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = (surveyId: string) => {
    stopPolling();
    pollingRef.current = window.setInterval(() => {
      checkProgress(surveyId);
    }, 2000);
  };

  return {
    checkProgress,
    startPolling,
    stopPolling,
    pollingRef
  };
};
