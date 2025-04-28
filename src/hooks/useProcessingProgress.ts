
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useProcessingProgress = (surveyId: string | null, totalRows: number) => {
  const [processedCount, setProcessedCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!surveyId || !isMonitoring) return;

    // Initial count check
    const fetchCurrentCount = async () => {
      const { count } = await supabase
        .from('mizi_ai_personalized_return')
        .select('*', { count: 'exact' })
        .eq('mizi_ai_id', surveyId);
      
      if (count) setProcessedCount(count);
    };

    fetchCurrentCount();

    // Set up real-time listener
    const channel = supabase
      .channel('processing-progress')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mizi_ai_personalized_return',
          filter: `mizi_ai_id=eq.${surveyId}`
        },
        () => {
          setProcessedCount(prev => {
            const newCount = prev + 1;
            return newCount;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [surveyId, isMonitoring]);

  const startMonitoring = () => setIsMonitoring(true);
  const stopMonitoring = () => setIsMonitoring(false);

  return {
    processedCount,
    totalRows,
    isComplete: processedCount >= totalRows,
    progress: Math.min((processedCount / totalRows) * 100, 100),
    startMonitoring,
    stopMonitoring,
    isMonitoring
  };
};
