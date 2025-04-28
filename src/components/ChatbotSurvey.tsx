
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader } from "lucide-react";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatbotSurvey, steps } from "@/hooks/useChatbotSurvey";
import SurveyHeader from "./survey/SurveyHeader";
import SurveyMessages from "./survey/SurveyMessages";
import SurveyFooter from "./survey/SurveyFooter";
import FileHandler from "./survey/FileHandler";
import { ChatSummary } from "./survey/ChatSummary";

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
  const { messages, setMessages, addMessage } = useChatMessages();
  const {
    currentStep,
    setCurrentStep,
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
    loadPastSurvey,
    surveyForm
  } = useChatbotSurvey(initialSurveyId);

  useEffect(() => {
    console.log("ChatbotSurvey received initialSurveyId:", initialSurveyId);
    if (initialSurveyId) {
      resetAndLoadPastSurvey(initialSurveyId);
    } else if (!isLoadingPastChat) {
      initializeChat();
    }
  }, [initialSurveyId]);

  const resetAndLoadPastSurvey = async (surveyId: string) => {
    console.log("Resetting chat and loading survey:", surveyId);
    try {
      // Clear all old messages
      setMessages([]);
      
      // Reset UI states
      setShowOptions(null);
      setShowSlider(false);
      setCurrentInput("");
      
      // Load the selected survey data
      const data = await loadPastSurvey(surveyId);
      
      if (data) {
        // Only rebuild chat after data is loaded
        rebuildChatHistory();
      }
    } catch (error) {
      console.error("Error in resetAndLoadPastSurvey:", error);
    }
  };

  const rebuildChatHistory = () => {
    console.log("Rebuilding chat history with data:", surveyForm.surveyData);
    
    // Add welcome message
    addMessage(steps[0].question, "bot");
    
    // Add user selection for channel
    const channelLabel = getOptionLabel("canal", surveyForm.surveyData.canal);
    addMessage(channelLabel, "user");
    
    // Add funnel stage question and user's answer
    addMessage(steps[1].question, "bot");
    const funnelLabel = getOptionLabel("funnelStage", surveyForm.surveyData.funnelStage);
    addMessage(funnelLabel, "user");
    
    // Add website URL question and user's answer
    addMessage(steps[2].question, "bot");
    addMessage(surveyForm.surveyData.websiteUrl || "", "user");
    
    // Add message size question and user's answer
    addMessage(steps[3].question, "bot");
    addMessage(`${surveyForm.surveyData.tamanho} caracteres`, "user");
    
    // Add tone of voice question and user's answer
    addMessage(steps[4].question, "bot");
    const toneLabel = getOptionLabel("tomVoz", surveyForm.surveyData.tomVoz);
    addMessage(toneLabel, "user");
    
    // Add triggers question and user's answer
    addMessage(steps[5].question, "bot");
    const triggerLabel = getOptionLabel("gatilhos", surveyForm.surveyData.gatilhos);
    addMessage(triggerLabel, "user");
    
    // Add CSV upload question
    addMessage(steps[6].question, "bot");
    
    // Add CSV file upload confirmation if available
    if (surveyForm.csvFileName) {
      addMessage(`Arquivo processado com sucesso: ${surveyForm.totalCount} linhas carregadas`, "user");
    }
    
    // Add summary question and content
    addMessage(steps[7].question, "bot");
    const summaryContent = (
      <ChatSummary 
        surveyData={surveyForm.surveyData} 
        csvFileName={surveyForm.csvFileName} 
        totalCount={surveyForm.totalCount} 
      />
    );
    addMessage(summaryContent, "bot");
    
    addMessage("Tudo pronto para continuar?", "bot");
    
    // Set current step to the end
    setCurrentStep(7);
    
    // Check if processing is complete and add completion message if needed
    if (surveyForm.isComplete) {
      addCompletionMessage();
    }
  };
  
  const addCompletionMessage = () => {
    const totalRows = surveyForm.totalCount || 0;
    const count = surveyForm.processedCount || 0;
    
    addMessage(
      <div className="space-y-2">
        <p className="font-medium">🎉 Processamento concluído!</p>
        <p className="text-gray-600">
          Todos os {count} contatos foram processados com sucesso.
        </p>
        <Button
          onClick={() => surveyForm.handleDownload()}
          disabled={surveyForm.isDownloading}
          className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
        >
          {surveyForm.isDownloading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Gerando arquivo...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Baixar Campanha Personalizada
            </>
          )}
        </Button>
      </div>,
      "bot"
    );
  };

  const initializeChat = () => {
    if (messages.length === 0) {
      const firstStep = steps[0];
      addMessage(firstStep.question, "bot");
      
      if (firstStep.options) {
        setShowOptions({
          options: firstStep.options,
          step: 0,
          isComplete: false
        });
      }
    }
  };

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
        const summaryContent = (
          <ChatSummary 
            surveyData={surveyForm.surveyData} 
            csvFileName={surveyForm.csvFileName} 
            totalCount={surveyForm.totalCount} 
          />
        );
        
        addMessage(summaryContent, "bot");
        
        setTimeout(() => {
          addMessage("Tudo pronto para continuar?", "bot");
        }, 1000);
      }
    } else {
      addMessage("Clique em 'Consultar Status' para verificar o andamento do processamento.", "bot");
    }
  };

  const getOptionLabel = (field: string, value: string): string => {
    const step = steps.find(s => s.field === field);
    if (!step || !step.options) return value;
    
    const option = step.options.find(opt => opt.value === value);
    return option ? option.label : value;
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
      const data = await surveyForm.checkProgress(surveyForm.processingId);
      
      const totalRows = surveyForm.totalCount || 0;
      const count = surveyForm.processedCount || 0;
      
      addMessage(
        `Status do processamento: ${count}/${totalRows} contatos processados.`,
        "bot"
      );
      
      if (data && data.isComplete && data.count >= totalRows && totalRows > 0) {
        surveyForm.setIsComplete(true);
        addCompletionMessage();
      }
    } catch (error) {
      console.error("Error in handleCheckStatus:", error);
      addMessage(
        "Erro ao verificar o status do processamento. Tente novamente.",
        "bot"
      );
    }
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
