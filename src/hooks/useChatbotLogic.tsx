
import { useState, useRef, useEffect } from 'react';
import { useSurveyForm } from '@/hooks/useSurveyForm';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Step, steps } from '@/hooks/useChatbotSurvey';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatSummary } from "@/components/survey/ChatSummary";
import CompletionMessage from "@/components/survey/CompletionMessage";

export const useChatbotLogic = (initialSurveyId?: string | null) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showOptions, setShowOptions] = useState<{
    options: { value: string; label: string }[];
    step: number;
    isComplete: boolean;
  } | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(350);
  const [isLoadingPastChat, setIsLoadingPastChat] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Refs para controlar estados internos e evitar loops infinitos
  const completionMessageAddedRef = useRef(false);
  const statusCheckedRef = useRef(false);
  const loadedSurveyIdRef = useRef<string | null>(null);
  const chatInitializedRef = useRef(false);
  const effectRanRef = useRef(false);
  const isMountedRef = useRef(true);
  
  const { messages, setMessages, addMessage } = useChatMessages();
  const surveyForm = useSurveyForm();

  // Efeito para limpar flags quando o componente é desmontado
  useEffect(() => {
    // Reset effect flags on mount
    effectRanRef.current = false;
    chatInitializedRef.current = false;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Efeito para inicializar o chat ou carregar um chat existente apenas uma vez
  useEffect(() => {
    const handleInitialSetup = async () => {
      // Caso 1: Carregando um chat existente
      if (initialSurveyId && initialSurveyId !== loadedSurveyIdRef.current) {
        // Reset state for a clean loading
        setMessages([]);
        setShowOptions(null);
        setShowSlider(false);
        setCurrentInput("");
        completionMessageAddedRef.current = false;
        statusCheckedRef.current = false;
        
        // Mark as loading and set current survey
        setIsLoadingPastChat(true);
        loadedSurveyIdRef.current = initialSurveyId;
        chatInitializedRef.current = true;
        
        try {
          const data = await surveyForm.loadSurvey(initialSurveyId);
          
          if (data && isMountedRef.current) {
            rebuildChatHistory(data);
            
            // Check completion status
            if (data.processingStatus?.isComplete) {
              surveyForm.setIsComplete(true);
              surveyForm.setProcessedCount(data.processingStatus.processedCount || 0);
            }
          }
        } catch (error) {
          console.error("Error loading survey:", error);
          if (isMountedRef.current) {
            addMessage("Erro ao carregar o chat. Por favor, tente novamente.", "bot");
          }
        } finally {
          if (isMountedRef.current) {
            setIsLoadingPastChat(false);
            setHasInitialized(true);
          }
        }
      } 
      // Caso 2: Iniciando um novo chat
      else if (!initialSurveyId && !chatInitializedRef.current) {
        loadedSurveyIdRef.current = null;
        chatInitializedRef.current = true;
        initializeChat();
        setHasInitialized(true);
      }
    };
    
    if (!effectRanRef.current && isMountedRef.current) {
      effectRanRef.current = true;
      handleInitialSetup();
    }
  }, [initialSurveyId, surveyForm]);

  const resetAndLoadPastSurvey = async (surveyId: string) => {
    if (!isMountedRef.current) return;
    
    try {
      setIsLoadingPastChat(true);
      setMessages([]);
      setShowOptions(null);
      setShowSlider(false);
      setCurrentInput("");
      
      const data = await surveyForm.loadSurvey(surveyId);
      
      if (data && isMountedRef.current) {
        rebuildChatHistory(data);
        
        // Check completion status
        if (data.processingStatus?.isComplete) {
          surveyForm.setIsComplete(true);
          surveyForm.setProcessedCount(data.processingStatus.processedCount || 0);
        }
      }
    } catch (error) {
      console.error("Error in resetAndLoadPastSurvey:", error);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingPastChat(false);
      }
    }
  };

  const initializeChat = () => {
    if (!isMountedRef.current) return;
    
    // Limpar mensagens anteriores
    setMessages([]);
    
    // Adicionar a primeira mensagem do bot
    const firstStep = steps[0];
    addMessage(firstStep.question, "bot");
    
    // Mostrar opções se o primeiro passo tiver opções
    if (firstStep.options && isMountedRef.current) {
      setShowOptions({
        options: firstStep.options,
        step: 0,
        isComplete: false
      });
    }
  };

  const handleBack = () => {
    if (!isMountedRef.current || currentStep <= 0) return;
    
    setMessages(prev => prev.slice(0, -2));
    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    setShowOptions(null);
    setShowSlider(false);
    setCurrentInput("");
    
    const prevStepData = steps[previousStep];
    if (prevStepData.options && isMountedRef.current) {
      setShowOptions({
        options: prevStepData.options,
        step: previousStep,
        isComplete: surveyForm.isComplete
      });
    } else if (prevStepData.inputType === "slider" && isMountedRef.current) {
      setShowSlider(true);
    }
  };

  const moveToNextStep = () => {
    if (!isMountedRef.current) return;
    
    const nextStep = currentStep + 1;
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      addMessage(steps[nextStep].question, "bot");
      
      if (steps[nextStep].options && isMountedRef.current) {
        setShowOptions({
          options: steps[nextStep].options,
          step: nextStep,
          isComplete: surveyForm.isComplete
        });
      }
      
      if (steps[nextStep].inputType === "slider" && isMountedRef.current) {
        setShowSlider(true);
      }
      
      if (steps[nextStep].inputType === "summary" && isMountedRef.current) {
        addMessage(
          <ChatSummary 
            surveyData={surveyForm.surveyData} 
            csvFileName={surveyForm.csvFileName} 
            totalCount={surveyForm.totalCount} 
          />, 
          "bot"
        );
        
        setTimeout(() => {
          if (isMountedRef.current) {
            addMessage("Tudo pronto para continuar?", "bot");
          }
        }, 1000);
      }
    } else if (isMountedRef.current) {
      addMessage("Clique em 'Consultar Status' para verificar o andamento do processamento.", "bot");
    }
  };

  const addCompletionMessage = () => {
    if (!isMountedRef.current) return;
    
    // Adiciona a mensagem de conclusão apenas se não foi adicionada antes
    if (!completionMessageAddedRef.current) {
      addMessage(
        <CompletionMessage
          processedCount={surveyForm.processedCount || 0}
          onDownload={surveyForm.handleDownload}
          isDownloading={surveyForm.isDownloading}
        />,
        "bot"
      );
      completionMessageAddedRef.current = true;
    }
  };

  const handleCheckStatus = async () => {
    if (!isMountedRef.current) return;
    
    if (!surveyForm.processingId) {
      addMessage(
        "Nenhum processamento em andamento. Por favor, inicie um novo processamento.",
        "bot"
      );
      return;
    }
    
    // Prevent duplicate status checks
    if (statusCheckedRef.current) {
      return;
    }
    
    statusCheckedRef.current = true;
    // Reset flag after 3 seconds to allow another check
    setTimeout(() => {
      statusCheckedRef.current = false;
    }, 3000);
    
    try {
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyForm.processingId,
          fetchData: false
        }
      });
      
      if (error) throw error;
      
      if (data.isComplete) {
        surveyForm.setIsComplete(true);
        surveyForm.setProcessedCount(data.count);
        surveyForm.setTotalCount(data.total);
        
        if (!completionMessageAddedRef.current && isMountedRef.current) {
          addCompletionMessage();
        } else if (isMountedRef.current) {
          addMessage(
            "Processamento já concluído. Você pode baixar sua campanha personalizada.",
            "bot"
          );
        }
      } else if (isMountedRef.current) {
        const totalRows = data.total || surveyForm.totalCount || 0;
        const processedCount = data.count || 0;
        
        addMessage(
          `Status do processamento: ${processedCount}/${totalRows} contatos processados (ID: ${surveyForm.processingId}). Por favor, tente novamente em alguns instantes.`,
          "bot"
        );
      }
    } catch (error) {
      console.error("Error in handleCheckStatus:", error);
      if (isMountedRef.current) {
        addMessage(
          "Erro ao verificar o status do processamento. Tente novamente.",
          "bot"
        );
      }
    }
  };

  const rebuildChatHistory = (data: any) => {
    if (!isMountedRef.current || !data) return;
    
    // Reconstruir histórico básico
    addMessage("Bem-vindo de volta ao seu chat!", "bot");
    
    // Mostrar resumo dos dados carregados
    addMessage(
      <ChatSummary
        surveyData={data.surveyData}
        csvFileName={data.surveyData?.csvFileName || ""}
        totalCount={data.processingStatus?.totalCount || 0}
      />,
      "bot"
    );
    
    // Adicionar mensagem de status
    if (data.processingStatus?.isComplete) {
      if (isMountedRef.current) {
        addCompletionMessage();
        completionMessageAddedRef.current = true;
      }
    } else {
      addMessage(
        "Você pode verificar o status do processamento clicando em 'Consultar Status'.",
        "bot"
      );
    }
  };

  return {
    currentStep,
    currentInput,
    setCurrentInput,
    isWaitingForResponse,
    setIsWaitingForResponse,
    showOptions,
    setShowOptions,
    showSlider,
    setShowSlider,
    sliderValue,
    setSliderValue,
    isLoadingPastChat,
    messages,
    surveyForm,
    handleBack,
    moveToNextStep,
    addCompletionMessage,
    handleCheckStatus,
    completionMessageAddedRef,
    statusCheckedRef,
    hasInitialized
  };
};
