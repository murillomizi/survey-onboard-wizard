import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePersonalizedReturn(surveyId: string | undefined) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId) {
      console.log("usePersonalizedReturn: surveyId não fornecido");
      return;
    }

    console.log("usePersonalizedReturn: Buscando dados para surveyId:", surveyId);
    setLoading(true);
    setError(null);

    supabase
      .from("mizi_ai_personalized_return")
      .select("*")
      .eq("mizi_ai_id", surveyId)
      .then(({ data, error }) => {
        console.log("usePersonalizedReturn: Resposta do Supabase:", { data, error });
        
        if (error) {
          console.error("usePersonalizedReturn: Erro ao buscar dados:", error);
          setError(error.message);
        } else {
          console.log("usePersonalizedReturn: Dados encontrados:", data?.length || 0, "registros");
          setData(data || []);
        }
        setLoading(false);
      });
  }, [surveyId]);

  return { data, loading, error };
} 