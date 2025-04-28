
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SurveyProgress {
  processedCount: number;
  isProcessing: boolean;
  isProcessingComplete: boolean;
  isDownloading: boolean;
  processingId: string | null;
}

export const useSurveyProgress = (onSuccess?: () => void) => {
  const [progress, setProgress] = useState<SurveyProgress>({
    processedCount: 0,
    isProcessing: false,
    isProcessingComplete: false,
    isDownloading: false,
    processingId: null
  });

  const checkProgress = async (surveyId: string) => {
    try {
      console.log(`Checking progress via Edge Function for survey ID: ${surveyId}`);
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { surveyId }
      });
      
      if (error) {
        console.error("Error calling checkProgress Edge Function:", error);
        return;
      }

      if (data) {
        const count = data.count || 0;
        setProgress(prev => ({
          ...prev,
          processedCount: count,
          isProcessingComplete: data.isComplete || false
        }));
        
        if (data.isComplete && onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error in checkProgress:", error);
    }
  };

  return {
    progress,
    setProgress,
    checkProgress
  };
};
