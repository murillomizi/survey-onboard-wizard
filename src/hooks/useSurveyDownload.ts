
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import Papa from "papaparse";

export const useSurveyDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (processingId: string) => {
    if (!processingId) {
      console.error("Cannot download: No processing ID available");
      toast({
        title: "Erro no download",
        description: "ID de processamento não disponível.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: { 
          surveyId: processingId,
          fetchData: true
        }
      });
      
      if (error || !data?.processedData || data.processedData.length === 0) {
        throw new Error(error?.message || "No data found for download");
      }
      
      const csv = Papa.unparse(data.processedData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campanha_personalizada_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Sua campanha personalizada está sendo baixada."
      });
      
    } catch (error) {
      console.error("Error in handleDownload:", error);
      toast({
        title: "Erro ao baixar",
        description: "Ocorreu um erro ao tentar baixar o arquivo.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownload
  };
};
