
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';

export interface SurveyData {
  canal: string;
  funnelStage: string;
  csvData: any[];
  websiteUrl: string;
  tamanho: number;
  tomVoz: string;
  gatilhos: string;
}

export const useSurveyData = (initialData?: Partial<SurveyData>) => {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    canal: initialData?.canal || "",
    funnelStage: initialData?.funnelStage || "",
    csvData: initialData?.csvData || [],
    websiteUrl: initialData?.websiteUrl || "",
    tamanho: initialData?.tamanho || 350,
    tomVoz: initialData?.tomVoz || "",
    gatilhos: initialData?.gatilhos || ""
  });

  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvRowCount, setCsvRowCount] = useState(0);

  const handleFileUpload = async (file: File): Promise<boolean> => {
    if (file.type !== "text/csv") {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return false;
    }

    return new Promise((resolve) => {
      setCsvFileName(file.name);
      
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const filteredData = results.data.filter(row => 
              row && typeof row === 'object' && Object.keys(row).length > 0
            );
            
            if (filteredData.length > 0) {
              setCsvRowCount(filteredData.length);
              setSurveyData(prev => ({
                ...prev,
                csvData: filteredData
              }));
              resolve(true);
            } else {
              toast({
                title: "Arquivo vazio",
                description: "O arquivo CSV não contém dados válidos.",
                variant: "destructive"
              });
              resolve(false);
            }
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erro ao processar arquivo",
            description: "Não foi possível ler o arquivo CSV. Verifique se o formato está correto.",
            variant: "destructive"
          });
          resolve(false);
        }
      });
    });
  };

  return {
    surveyData,
    setSurveyData,
    csvFileName,
    csvRowCount,
    handleFileUpload
  };
};
