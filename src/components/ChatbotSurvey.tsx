
import React, { useEffect, useRef } from "react";
import { useChatbotLogic } from "@/hooks/useChatbotLogic";
import SurveyHeader from "./survey/SurveyHeader";
import SurveyMessages from "./survey/SurveyMessages";
import SurveyFooter from "./survey/SurveyFooter";
import FileHandler from "./survey/FileHandler";
import { steps } from "@/hooks/useChatbotSurvey";
import { useChatMessages } from "@/hooks/useChatMessages";

interface ChatbotSurveyProps {
  initialSurveyId?: string | null;
  onSubmitSuccess?: (surveyId: string) => void;
  isLoading?: boolean;
}

const ChatbotSurvey: React.FC<ChatbotSurveyProps> = ({ 
  initialSurveyId = null, 
  onSubmitSuccess,
  isLoading = false
}) => {
  // Ref para controlar notificações ao componente pai
  const notifiedParentRef = useRef(false);
  const isComponentMountedRef = useRef(true);
  
  const {
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
    handleCheckStatus,
    hasInitialized
  } = useChatbotLogic(initialSurveyId);

  const { addMessage } = useChatMessages();

  useEffect(() => {
    isComponentMountedRef.current = true;
    
    // Cleanup on unmount
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  const handleFileChange = async (file: File) => {
    if (!isComponentMountedRef.current) return false;
    
    const success = await surveyForm.handleFileUpload(file);
    if (success) {
      addMessage(`Arquivo processado com sucesso: ${surveyForm.totalCount} linhas carregadas`, "user");
      setIsWaitingForResponse(true);
      setTimeout(() => {
        if (isComponentMountedRef.current) {
          setIsWaitingForResponse(false);
          moveToNextStep();
        }
      }, 1000);
    }
    return success;
  };

  const handleSendMessage = () => {
    if (!isComponentMountedRef.current) return;
    if (!currentInput.trim() && !showSlider) return;

    setShowOptions(null);
    setShowSlider(false);
    setIsWaitingForResponse(true);

    const currentStepData = steps[currentStep];
    
    if (currentStepData.field === "websiteUrl") {
      addMessage(currentInput, "user");
      surveyForm.setSurveyData(prev => ({ ...prev, websiteUrl: currentInput }));
    }

    setCurrentInput("");

    setTimeout(() => {
      if (isComponentMountedRef.current) {
        setIsWaitingForResponse(false);
        moveToNextStep();
      }
    }, 1000);
  };

  const handleOptionSelect = (value: string) => {
    if (!isComponentMountedRef.current) return;
    if (!showOptions) return;
    
    const selectedOption = showOptions.options.find(opt => opt.value === value);
    if (!selectedOption) return;

    setShowOptions(null);
    setIsWaitingForResponse(true);

    addMessage(selectedOption.label, "user");

    const fieldName = steps[currentStep].field;
    surveyForm.setSurveyData(prev => ({ ...prev, [fieldName]: value }));

    setTimeout(() => {
      if (isComponentMountedRef.current) {
        setIsWaitingForResponse(false);
        moveToNextStep();
      }
    }, 1000);
  };

  const handleSliderChange = (val: number[]) => {
    if (!isComponentMountedRef.current) return;
    setSliderValue(val[0]);
  };

  const handleSliderComplete = () => {
    if (!isComponentMountedRef.current) return;
    
    addMessage(`${sliderValue} caracteres`, "user");
    surveyForm.setSurveyData(prev => ({ ...prev, tamanho: sliderValue }));
    setShowSlider(false);
    setIsWaitingForResponse(true);

    setTimeout(() => {
      if (isComponentMountedRef.current) {
        setIsWaitingForResponse(false);
        moveToNextStep();
      }
    }, 1000);
  };

  // Efeito para notificar o componente pai sobre o ID de processamento, apenas uma vez
  useEffect(() => {
    if (surveyForm.processingId && onSubmitSuccess && !notifiedParentRef.current && isComponentMountedRef.current) {
      onSubmitSuccess(surveyForm.processingId);
      notifiedParentRef.current = true;
    }
  }, [surveyForm.processingId, onSubmitSuccess]);

  // Determinar se o componente está realmente carregando
  const isActuallyLoading = isLoading || isLoadingPastChat || !hasInitialized;

  // Debug log para identificar estados de carregamento
  console.log("ChatbotSurvey render states:", {
    isLoading,
    isLoadingPastChat,
    hasInitialized,
    isActuallyLoading,
    initialSurveyId,
    messagesCount: messages.length
  });

  if (isActuallyLoading) {
    console.log("ChatbotSurvey is in loading state");
    return (
      <div className="flex flex-col h-[600px] bg-white rounded-xl items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-blue-200 rounded mb-2"></div>
          <div className="h-3 w-36 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Determinar se deve mostrar o input de texto
  // Alteramos a condição para não mostrar o input de texto quando o processamento estiver completo
  const shouldShowInput = currentStep < 6 && !showOptions && !showSlider && !surveyForm.isComplete;

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
      <SurveyHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={handleBack}
      />
      
      <SurveyMessages
        messages={messages}
        isWaitingForResponse={isWaitingForResponse}
        showOptions={showOptions}
        showSlider={showSlider}
        sliderValue={sliderValue}
        onOptionSelect={handleOptionSelect}
        onSliderChange={handleSliderChange}
        onSliderComplete={handleSliderComplete}
        isComplete={surveyForm.isComplete}
      />
      
      <FileHandler onFileChange={handleFileChange} />
      
      <SurveyFooter
        currentStep={currentStep}
        totalSteps={steps.length}
        currentInput={currentInput}
        onInputChange={setCurrentInput}
        onSendMessage={handleSendMessage}
        onFileUpload={() => {
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) {
            (fileInput as HTMLElement).click();
          }
        }}
        onSubmit={surveyForm.handleSubmit}
        onCheckStatus={handleCheckStatus}
        onDownload={surveyForm.handleDownload}
        isSubmitting={surveyForm.isSubmitting}
        isDownloading={surveyForm.isDownloading}
        showInput={shouldShowInput}
        processingId={surveyForm.processingId}
        isComplete={surveyForm.isComplete}
        processedCount={surveyForm.processedCount}
      />
    </div>
  );
};

export default ChatbotSurvey;
