
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
  const completionMessageAddedRef = useRef(false);
  const statusCheckedRef = useRef(false);
  const loadedSurveyIdRef = useRef<string | null>(null);
  const chatInitializedRef = useRef(false);
  
  const { messages, setMessages, addMessage } = useChatMessages();
  const surveyForm = useSurveyForm();

  // Efeito para inicializar o chat ou carregar um chat existente
  useEffect(() => {
    if (initialSurveyId && initialSurveyId !== loadedSurveyIdRef.current) {
      resetAndLoadPastSurvey(initialSurveyId);
      loadedSurveyIdRef.current = initialSurveyId;
      completionMessageAddedRef.current = false;
      statusCheckedRef.current = false;
      chatInitializedRef.current = true;
    } else if (!initialSurveyId && !chatInitializedRef.current) {
      // Inicializa um novo chat apenas se ainda não foi inicializado
      chatInitializedRef.current = true;
      initializeChat();
    }
  }, [initialSurveyId]);

  const resetAndLoadPastSurvey = async (surveyId: string) => {
    try {
      setIsLoadingPastChat(true);
      setMessages([]);
      setShowOptions(null);
      setShowSlider(false);
      setCurrentInput("");
      
      const data = await surveyForm.loadSurvey(surveyId);
      
      if (data) {
        rebuildChatHistory();
      }
    } catch (error) {
      console.error("Error in resetAndLoadPastSurvey:", error);
    } finally {
      setTimeout(() => {
        setIsLoadingPastChat(false);
      }, 500);
    }
  };

  const initializeChat = () => {
    console.log("Initializing new chat");
    // Limpar mensagens anteriores
    setMessages([]);
    
    // Adicionar a primeira mensagem do bot
    const firstStep = steps[0];
    addMessage(firstStep.question, "bot");
    
    // Mostrar opções se o primeiro passo tiver opções
    if (firstStep.options) {
      setShowOptions({
        options: firstStep.options,
        step: 0,
        isComplete: false
      });
    }
  };

  const handleBack = () => {
    if (currentStep <= 0) return;
    
    setMessages(prev => prev.slice(0, -2));
    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    setShowOptions(null);
    setShowSlider(false);
    setCurrentInput("");
    
    const prevStepData = steps[previousStep];
    if (prevStepData.options) {
      setShowOptions({
        options: prevStepData.options,
        step: previousStep,
        isComplete: surveyForm.isComplete
      });
    } else if (prevStepData.inputType === "slider") {
      setShowSlider(true);
    }
  };

  const moveToNextStep = () => {
    const nextStep = currentStep + 1;
    
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      addMessage(steps[nextStep].question, "bot");
      
      if (steps[nextStep].options) {
        setShowOptions({
          options: steps[nextStep].options,
          step: nextStep,
          isComplete: surveyForm.isComplete
        });
      }
      
      if (steps[nextStep].inputType === "slider") {
        setShowSlider(true);
      }
      
      if (steps[nextStep].inputType === "summary") {
        addMessage(
          <ChatSummary 
            surveyData={surveyForm.surveyData} 
            csvFileName={surveyForm.csvFileName} 
            totalCount={surveyForm.totalCount} 
          />, 
          "bot"
        );
        
        setTimeout(() => {
          addMessage("Tudo pronto para continuar?", "bot");
        }, 1000);
      }
    } else {
      addMessage("Clique em 'Consultar Status' para verificar o andamento do processamento.", "bot");
    }
  };

  const addCompletionMessage = () => {
    console.log("Adding completion message");
    console.log(`Completion data: processedCount=${surveyForm.processedCount}, totalCount=${surveyForm.totalCount}`);
    
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
    if (!surveyForm.processingId) {
      addMessage(
        "Nenhum processamento em andamento. Por favor, inicie um novo processamento.",
        "bot"
      );
      return;
    }
    
    try {
      console.log("Checking status for survey ID:", surveyForm.processingId);
      
      const { data, error } = await supabase.functions.invoke('checkProgress', {
        body: {
          surveyId: surveyForm.processingId,
          fetchData: false
        }
      });
      
      if (error) throw error;
      
      console.log("CheckProgress response:", data);
      
      if (data.isComplete) {
        surveyForm.setIsComplete(true);
        surveyForm.setProcessedCount(data.count);
        surveyForm.setTotalCount(data.total);
        
        if (!completionMessageAddedRef.current) {
          addCompletionMessage();
        } else {
          addMessage(
            "Processamento já concluído. Você pode baixar sua campanha personalizada.",
            "bot"
          );
        }
      } else {
        const totalRows = data.total || surveyForm.totalCount || 0;
        const processedCount = data.count || 0;
        
        addMessage(
          `Status do processamento: ${processedCount}/${totalRows} contatos processados (ID: ${surveyForm.processingId}). Por favor, tente novamente em alguns instantes.`,
          "bot"
        );
      }
    } catch (error) {
      console.error("Error in handleCheckStatus:", error);
      addMessage(
        "Erro ao verificar o status do processamento. Tente novamente.",
        "bot"
      );
    }
  };

  const rebuildChatHistory = () => {
    // Function to rebuild chat history would go here
    // This is a placeholder for the actual implementation
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
    statusCheckedRef
  };
};
