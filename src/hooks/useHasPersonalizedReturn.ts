import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useHasPersonalizedReturn(surveyId: string | undefined) {
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!surveyId) return;
    setLoading(true);
    supabase
      .from("mizi_ai_personalized_return")
      .select("id", { count: "exact", head: true })
      .eq("mizi_ai_id", surveyId)
      .then(({ count, error }) => {
        setExists(!!count && count > 0);
        setLoading(false);
      });
  }, [surveyId]);

  return { exists, loading };
} 