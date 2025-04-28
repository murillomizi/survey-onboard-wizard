
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LoadingProgressProps {
  surveyId: string;
  totalRows: number;
  onComplete?: () => void;
}

const LoadingProgress = ({ surveyId, totalRows, onComplete }: LoadingProgressProps) => {
  const [processedRows, setProcessedRows] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!surveyId || totalRows <= 0) return;

    const channel = supabase
      .channel('personalized-returns')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mizi_ai_personalized_return',
          filter: `mizi_ai_id=eq.${surveyId}`
        },
        () => {
          setProcessedRows(prev => {
            const newCount = prev + 1;
            const newProgress = Math.min((newCount / totalRows) * 100, 100);
            setProgress(newProgress);
            
            // Check if processing is complete
            if (newCount >= totalRows && !isComplete) {
              setIsComplete(true);
              if (onComplete) {
                onComplete();
              }
            }
            
            return newCount;
          });
        }
      )
      .subscribe();

    // Fetch initial count
    const fetchInitialCount = async () => {
      try {
        const { count, error } = await supabase
          .from('mizi_ai_personalized_return')
          .select('*', { count: 'exact' })
          .eq('mizi_ai_id', surveyId);
        
        if (error) {
          console.error('Error fetching count:', error);
          return;
        }
        
        if (count !== null) {
          setProcessedRows(count);
          const newProgress = Math.min((count / totalRows) * 100, 100);
          setProgress(newProgress);
          
          // Check if already complete
          if (count >= totalRows) {
            setIsComplete(true);
            if (onComplete) {
              onComplete();
            }
          }
        }
      } catch (err) {
        console.error('Error in fetchInitialCount:', err);
      }
    };

    fetchInitialCount();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [surveyId, totalRows, onComplete, isComplete]);

  return (
    <div className="flex flex-col items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
        >
          <Bot size={18} />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700">
            {isComplete ? "Processamento concluído!" : "Processando suas mensagens personalizadas..."}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {processedRows} de {totalRows} contatos processados
          </p>
        </div>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default LoadingProgress;
