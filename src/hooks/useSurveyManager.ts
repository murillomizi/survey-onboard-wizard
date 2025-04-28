
import { useState, useEffect, useCallback } from "react";
import { SurveyController } from "@/controllers/SurveyController";
import { useSurveyPolling } from "./useSurveyPolling";
import { useSurveyLoader } from "./useSurveyLoader";
import { useSurveyFileHandler } from "./useSurveyFileHandler";
import { SurveyState } from "@/types/survey";

export const useSurveyManager = (initialSurveyId?: string | null) => {
  const [state, setState] = useState<SurveyState>({
    surveyData: {
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
    },
    isProcessing: false,
    processedCount: 0,
    totalCount: 0,
    isComplete: false,
    processingId: null,
    parsedCsvData: [],
    isDownloading: false
  });

  const updateState = useCallback((updates: Partial<SurveyState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  const { startPolling, stopPolling } = useSurveyPolling();
  const { loadSurvey, isLoading } = useSurveyLoader(updateState);
  const { handleFileUpload } = useSurveyFileHandler(updateState, state);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    updateState({ isProcessing: true });
    
    try {
      const surveyId = await SurveyController.createSurvey(state.surveyData, state.parsedCsvData);
      
      if (surveyId) {
        updateState({ processingId: surveyId });
        startPolling(surveyId, (progress) => {
          updateState({
            processedCount: progress.processedCount,
            totalCount: progress.totalCount,
            isComplete: progress.isComplete
          });
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      updateState({ isProcessing: false });
    }
  }, [state.surveyData, state.parsedCsvData, startPolling, updateState]);

  const handleDownload = useCallback(async () => {
    if (!state.processingId) return;
    
    updateState({ isDownloading: true });
    try {
      await SurveyController.downloadProcessedData(state.processingId);
    } finally {
      updateState({ isDownloading: false });
    }
  }, [state.processingId, updateState]);

  useEffect(() => {
    if (initialSurveyId) {
      loadSurvey(initialSurveyId);
    }
    return () => stopPolling();
  }, [initialSurveyId, loadSurvey, stopPolling]);

  return {
    ...state,
    setSurveyData: (data: any) => setState(prevState => ({
      ...prevState,
      surveyData: typeof data === 'function' ? data(prevState.surveyData) : data
    })),
    setIsProcessing: (value: boolean) => updateState({ isProcessing: value }),
    setProcessedCount: (value: number) => updateState({ processedCount: value }),
    setTotalCount: (value: number) => updateState({ totalCount: value }),
    setIsComplete: (value: boolean) => updateState({ isComplete: value }),
    setProcessingId: (value: string | null) => updateState({ processingId: value }),
    setParsedCsvData: (value: any[]) => updateState({ parsedCsvData: value }),
    handleFileUpload,
    handleSubmit,
    handleDownload,
    isLoading,
    isSubmitting: state.isProcessing,
    csvFileName: state.surveyData.csvFileName,
    // Explicitly adding loadSurvey to the returned object
    loadSurvey
  };
};
