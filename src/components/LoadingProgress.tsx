
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

interface LoadingProgressProps {
  surveyId: string;
  totalContacts: number;
}

export const LoadingProgress = ({ surveyId, totalContacts }: LoadingProgressProps) => {
  const [processedCount, setProcessedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      const { count } = await supabase
        .from('mizi_ai_personalized_return')
        .select('*', { count: 'exact' })
        .eq('mizi_ai_id', surveyId);
      
      setProcessedCount(count || 0);
      
      if (count === totalContacts) {
        setIsComplete(true);
      }
    };

    // Initial check
    checkProgress();

    // Set up real-time subscription
    const subscription = supabase
      .channel('mizi_ai_personalized_return_changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mizi_ai_personalized_return',
          filter: `mizi_ai_id=eq.${surveyId}`
        },
        () => {
          checkProgress();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [surveyId, totalContacts]);

  const progressPercentage = (processedCount / totalContacts) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-6 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-800">Processando contatos</h3>
        <span className="text-sm text-gray-600">
          {processedCount}/{totalContacts}
        </span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        {!isComplete && (
          <>
            <Loader className="animate-spin" size={16} />
            <span>Gerando mensagens personalizadas...</span>
          </>
        )}
        {isComplete && (
          <span className="text-green-600 font-medium">
            Processamento concluído com sucesso!
          </span>
        )}
      </div>
    </div>
  );
};
