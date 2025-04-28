
import { useState } from "react";

interface SurveyFormState {
  canal: string;
  csvFile: File | null;
  csvFileName: string;
  websiteUrl: string;
  tamanho: number;
  touchpoints: string;
  tomVoz: string;
  template: string;
  gatilhos: string;
  funnelStage: string;
}

/**
 * @deprecated Use o hook useSurveyManager em vez disso
 */
export const useSurveyFormState = () => {
  const [surveyData, setSurveyData] = useState<SurveyFormState>({
    canal: "linkedin",
    csvFile: null,
    csvFileName: "",
    websiteUrl: "",
    tamanho: 350,
    touchpoints: "3",
    tomVoz: "neutro",
    template: "proposta",
    gatilhos: "sem-gatilho",
    funnelStage: "topo"
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [parsedCsvData, setParsedCsvData] = useState<any[]>([]);

  return {
    surveyData,
    setSurveyData,
    isProcessing,
    setIsProcessing,
    processedCount,
    setProcessedCount,
    totalCount,
    setTotalCount,
    isComplete,
    setIsComplete,
    processingId,
    setProcessingId,
    parsedCsvData,
    setParsedCsvData,
  };
};
