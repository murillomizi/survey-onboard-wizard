import { useState, useEffect, useRef, useCallback } from "react";
import { SurveyController } from "@/controllers/SurveyController";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface SurveyState {
  surveyData: {
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
  };
  isProcessing: boolean;
  processedCount: number;
  totalCount: number;
  isComplete: boolean;
  processingId: string | null;
  parsedCsvData: any[];
  isDownloading: boolean;
}

/**
 * Hook para gerenciamento do estado e operações de enquetes
 */
export const useSurveyManager = (initialSurveyId?: string | null) => {
  // Estado inicial
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
  
  const [isLoading, setIsLoading] = useState(!!initialSurveyId);
  const pollingRef = useRef<number | null>(null);
  
  // Método para atualizar partes específicas do estado
  const updateState = useCallback((updates: Partial<SurveyState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  // Método para atualizar os dados da enquete
  const setSurveyData = useCallback((data: any) => {
    setState(prevState => ({
      ...prevState,
      surveyData: typeof data === 'function' ? data(prevState.surveyData) : data
    }));
  }, []);

  // Método para verificar o progresso do processamento
  const checkProgress = useCallback(async (surveyId: string) => {
    try {
      // Usar a edge function para verificar o progresso
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyId,
          fetchData: false
        }
      });
      
      if (error) {
        throw error;
      }
      
      updateState({
        processedCount: data.count,
        totalCount: data.total,
        isComplete: data.isComplete
      });
      
      return {
        processedCount: data.count,
        totalCount: data.total,
        isComplete: data.isComplete
      };
    } catch (error) {
      console.error("Error checking progress:", error);
      return null;
    }
  }, [updateState]);

  // Iniciar polling para verificar o progresso
  const startPolling = useCallback((surveyId: string) => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
    }
    
    pollingRef.current = window.setInterval(() => {
      checkProgress(surveyId);
    }, 2000);
  }, [checkProgress]);

  // Parar polling
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Carregar enquete existente
  const loadSurvey = useCallback(async (surveyId: string) => {
    if (!surveyId) return;
    
    setIsLoading(true);
    try {
      const details = await SurveyController.getSurveyDetails(surveyId);
      
      if (!details) {
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os dados da enquete.",
          variant: "destructive"
        });
        return;
      }
      
      updateState({
        surveyData: details.surveyData,
        processedCount: details.processingStatus.processedCount,
        totalCount: details.processingStatus.totalCount,
        isComplete: details.processingStatus.isComplete,
        processingId: details.id,
        parsedCsvData: details.parsedCsvData
      });
      
      // Se ainda estiver em processamento, iniciar polling
      if (!details.processingStatus.isComplete && details.processingStatus.totalCount > 0) {
        startPolling(surveyId);
      }
      
      return details;
    } catch (error) {
      console.error("Error loading survey:", error);
      toast({
        title: "Erro ao carregar chat",
        description: "Ocorreu um erro ao carregar o chat selecionado.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [updateState, startPolling]);

  // Processar arquivo CSV
  const handleFileUpload = useCallback(async (file: File): Promise<boolean> => {
    try {
      const result = await SurveyController.processCSVFile(file);
      
      updateState({
        totalCount: result.totalCount,
        parsedCsvData: result.data
      });
      
      setSurveyData(prev => ({
        ...prev,
        csvFile: file,
        csvFileName: file.name
      }));
      
      return true;
    } catch (error) {
      return false;
    }
  }, [updateState, setSurveyData]);

  // Enviar formulário
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const { surveyData, parsedCsvData } = state;
    
    if (!surveyData.canal || parsedCsvData.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    updateState({ isProcessing: true });
    
    try {
      const surveyId = await SurveyController.createSurvey(surveyData, parsedCsvData);
      
      if (surveyId) {
        updateState({ processingId: surveyId });
        startPolling(surveyId);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      updateState({ isProcessing: false });
    }
  }, [state, updateState, startPolling]);

  // Download de dados processados
  const handleDownload = useCallback(async () => {
    if (!state.processingId) return;
    
    updateState({ isDownloading: true });
    try {
      await SurveyController.downloadProcessedData(state.processingId);
    } finally {
      updateState({ isDownloading: false });
    }
  }, [state.processingId, updateState]);

  // Carregar enquete inicial se houver ID
  useEffect(() => {
    if (initialSurveyId) {
      loadSurvey(initialSurveyId);
    }
  }, [initialSurveyId, loadSurvey]);

  // Limpar polling quando componente é desmontado
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    ...state,
    setSurveyData,
    setIsProcessing: (value: boolean) => updateState({ isProcessing: value }),
    setProcessedCount: (value: number) => updateState({ processedCount: value }),
    setTotalCount: (value: number) => updateState({ totalCount: value }),
    setIsComplete: (value: boolean) => updateState({ isComplete: value }),
    setProcessingId: (value: string | null) => updateState({ processingId: value }),
    setParsedCsvData: (value: any[]) => updateState({ parsedCsvData: value }),
    handleFileUpload,
    handleSubmit,
    handleDownload,
    checkProgress,
    startPolling,
    stopPolling,
    loadSurvey,
    isLoading,
    isSubmitting: state.isProcessing,
    csvFileName: state.surveyData.csvFileName
  };
};
