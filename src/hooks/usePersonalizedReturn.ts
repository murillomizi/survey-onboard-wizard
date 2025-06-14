import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePersonalizedReturn(surveyId: string | undefined) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId) return;

    setLoading(true);
    setError(null);

    supabase
      .from("mizi_ai_personalized_return")
      .select("*")
      .eq("mizi_ai_id", surveyId)
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setData(data || []);
        }
        setLoading(false);
      });
  }, [surveyId]);

  return { data, loading, error };
} 