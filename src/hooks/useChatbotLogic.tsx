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
  
  const completionMessageAddedRef = useRef(false);
  const statusCheckedRef = useRef(false);
  const loadedSurveyIdRef = useRef<string | null>(null);
  const chatInitializedRef = useRef(false);
  const effectRanRef = useRef(false);
  const isMountedRef = useRef(true);
  const statusCheckAttempts = useRef(0);
  
  const { messages, setMessages, addMessage } = useChatMessages();
  const surveyForm = useSurveyForm();

  useEffect(() => {
    effectRanRef.current = false;
    chatInitializedRef.current = false;
    completionMessageAddedRef.current = false;
    statusCheckedRef.current = false;
    statusCheckAttempts.current = 0;
    
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    console.log("useChatbotLogic effect triggered, initialSurveyId:", initialSurveyId);
    
    const handleInitialSetup = async () => {
      if (initialSurveyId && initialSurveyId !== loadedSurveyIdRef.current) {
        console.log("Loading existing chat:", initialSurveyId);
        
        setMessages([]);
        setShowOptions(null);
        setShowSlider(false);
        setCurrentInput("");
        completionMessageAddedRef.current = false;
        statusCheckedRef.current = false;
        statusCheckAttempts.current = 0;
        
        setIsLoadingPastChat(true);
        loadedSurveyIdRef.current = initialSurveyId;
        chatInitializedRef.current = true;
        
        try {
          console.log("Fetching survey data...");
          const data = await surveyForm.loadSurvey(initialSurveyId);
          console.log("Survey data loaded:", data);
          
          if (data && isMountedRef.current) {
            rebuildChatHistory(data);
            
            if (data.processingStatus?.isComplete) {
              surveyForm.setIsComplete(true);
              surveyForm.setProcessedCount(data.processingStatus.processedCount || 0);
              surveyForm.setTotalCount(data.processingStatus.totalCount || 0);
              
              console.log("Survey is complete, processed count:", data.processingStatus.processedCount);
              
              setTimeout(() => {
                if (isMountedRef.current) {
                  handleCheckStatus(true);
                }
              }, 1000);
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
      } else if (!initialSurveyId && !chatInitializedRef.current) {
        console.log("Starting new chat");
        loadedSurveyIdRef.current = null;
        chatInitializedRef.current = true;
        initializeChat();
        setHasInitialized(true);
      } else {
        setHasInitialized(true);
      }
    };
    
    if (!effectRanRef.current && isMountedRef.current) {
      effectRanRef.current = true;
      handleInitialSetup();
    }
  }, [initialSurveyId]);

  const initializeChat = () => {
    console.log("Initializing new chat");
    if (!isMountedRef.current) return;
    
    setMessages([]);
    completionMessageAddedRef.current = false;
    statusCheckedRef.current = false;
    statusCheckAttempts.current = 0;
    
    addMessage(steps[0].question, "bot");
    
    if (steps[0].options && isMountedRef.current) {
      setShowOptions({
        options: steps[0].options,
        step: 0,
        isComplete: false
      });
    }
    
    setCurrentStep(0);
  };

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
        
        if (data.processingStatus?.isComplete) {
          surveyForm.setIsComplete(true);
          surveyForm.setProcessedCount(data.processingStatus.processedCount || 0);
          surveyForm.setTotalCount(data.processingStatus.totalCount || 0);
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
    
    if (!completionMessageAddedRef.current) {
      console.log("Adding completion message, processed count:", surveyForm.processedCount, "total count:", surveyForm.totalCount);
      addMessage(
        <CompletionMessage
          processedCount={surveyForm.processedCount || 0}
          totalCount={surveyForm.totalCount || 0}
          onDownload={surveyForm.handleDownload}
          isDownloading={surveyForm.isDownloading}
          surveyId={surveyForm.processingId}
        />,
        "bot"
      );
      completionMessageAddedRef.current = true;
    }
  };

  const handleCheckStatus = async (forceCheck = false) => {
    if (!isMountedRef.current) return;
    
    if (!surveyForm.processingId) {
      addMessage(
        "Nenhum processamento em andamento. Por favor, inicie um novo processamento.",
        "bot"
      );
      return;
    }
    
    if (statusCheckedRef.current && !forceCheck) {
      return;
    }
    
    statusCheckedRef.current = true;
    statusCheckAttempts.current += 1;
    
    setTimeout(() => {
      statusCheckedRef.current = false;
    }, 3000);
    
    try {
      console.log(`Checking status for ID: ${surveyForm.processingId}, attempt #${statusCheckAttempts.current}`);
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyForm.processingId,
          fetchData: false
        }
      });
      
      if (error) {
        console.error("Error from checkProgress function:", error);
        throw error;
      }
      
      console.log("Status check response:", data);
      
      if (data.isComplete) {
        surveyForm.setIsComplete(true);
        surveyForm.setProcessedCount(data.count);
        surveyForm.setTotalCount(data.total);
        
        console.log("Processing is complete, count:", data.count, "total:", data.total);
        
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
    console.log("Rebuilding chat history with data:", data);
    if (!isMountedRef.current || !data) return;
    
    addMessage("Bem-vindo de volta ao seu chat!", "bot");
    
    addMessage(
      <ChatSummary
        surveyData={data.surveyData}
        csvFileName={data.surveyData?.csvFileName || ""}
        totalCount={data.processingStatus?.totalCount || 0}
      />,
      "bot"
    );
    
    if (data.processingStatus?.isComplete) {
      if (isMountedRef.current) {
        console.log("Data is complete, adding completion message with count:", 
          data.processingStatus.processedCount, 
          "total:", data.processingStatus.totalCount);
        
        surveyForm.setProcessedCount(data.processingStatus.processedCount);
        surveyForm.setTotalCount(data.processingStatus.totalCount);
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
