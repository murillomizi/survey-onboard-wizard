
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useProcessingProgress = (surveyId: string | null) => {
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!surveyId) return;

    // Buscar contagem total de linhas do CSV original
    const fetchTotalRows = async () => {
      const { data: surveyData } = await supabase
        .from('mizi_ai_surveys')
        .select('csv_data')
        .eq('id', surveyId)
        .single();

      if (surveyData?.csv_data) {
        setTotalRows(Array.isArray(surveyData.csv_data) ? surveyData.csv_data.length : 0);
      }
    };

    // Configurar canal de realtime para monitorar novas inserções
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
          setProcessedRows(prev => {
            const newCount = prev + 1;
            if (newCount === totalRows) {
              setIsComplete(true);
            }
            return newCount;
          });
        }
      )
      .subscribe();

    // Verificar linhas já processadas
    const checkProcessedRows = async () => {
      const { count } = await supabase
        .from('mizi_ai_personalized_return')
        .select('*', { count: 'exact' })
        .eq('mizi_ai_id', surveyId);

      if (count) {
        setProcessedRows(count);
        if (count === totalRows) {
          setIsComplete(true);
        }
      }
    };

    fetchTotalRows();
    checkProcessedRows();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [surveyId]);

  return { totalRows, processedRows, isComplete };
};
