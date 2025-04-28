
import React, { useEffect } from "react";
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
    handleCheckStatus
  } = useChatbotLogic(initialSurveyId);

  const { addMessage } = useChatMessages();

  // Auto-check status effect from previous implementation
  useEffect(() => {
    if (initialSurveyId && !isLoadingPastChat) {
      const checkProcessingStatus = async () => {
        await handleCheckStatus();
      };
      checkProcessingStatus();
    }
  }, [initialSurveyId, isLoadingPastChat, handleCheckStatus]);

  const handleFileChange = async (file: File) => {
    const success = await surveyForm.handleFileUpload(file);
    if (success) {
      addMessage(`Arquivo processado com sucesso: ${surveyForm.totalCount} linhas carregadas`, "user");
      setIsWaitingForResponse(true);
      setTimeout(() => {
        setIsWaitingForResponse(false);
        moveToNextStep();
      }, 1000);
    }
  };

  const handleSendMessage = () => {
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
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleOptionSelect = (value: string) => {
    if (!showOptions) return;
    
    const selectedOption = showOptions.options.find(opt => opt.value === value);
    if (!selectedOption) return;

    setShowOptions(null);
    setIsWaitingForResponse(true);

    addMessage(selectedOption.label, "user");

    const fieldName = steps[currentStep].field;
    surveyForm.setSurveyData(prev => ({ ...prev, [fieldName]: value }));

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleSliderChange = (val: number[]) => {
    setSliderValue(val[0]);
  };

  const handleSliderComplete = () => {
    addMessage(`${sliderValue} caracteres`, "user");
    surveyForm.setSurveyData(prev => ({ ...prev, tamanho: sliderValue }));
    setShowSlider(false);
    setIsWaitingForResponse(true);

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl">
      <SurveyHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={handleBack}
      />
      
      <SurveyMessages
        messages={messages}
        isWaitingForResponse={isWaitingForResponse || isLoadingPastChat || isLoading}
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
        isSubmitting={surveyForm.isSubmitting}
        isDownloading={surveyForm.isDownloading}
        showInput={currentStep < 6 && !showOptions && !showSlider}
        processingId={surveyForm.processingId}
      />
    </div>
  );
};

export default ChatbotSurvey;
