
import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import { toast } from "@/components/ui/use-toast";
import { surveySteps } from "./survey/SurveySteps";
import { Message } from "./survey/types";
import { useSurveyData } from "./survey/useSurveyData";
import SurveyProgress from "./survey/SurveyProgress";
import SurveySummary from "./survey/SurveySummary";
import ChatContainer from "./survey/ChatContainer";
import ChatFooter from "./survey/ChatFooter";

const ChatbotSurvey = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showOptions, setShowOptions] = useState<{
    options: { value: string; label: string }[];
    step: number;
  } | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(350);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  
  const {
    surveyData,
    updateSurveyData,
    isSubmitting,
    hasSubmitted,
    handleSubmit
  } = useSurveyData();

  const addMessage = (content: React.ReactNode, type: "user" | "bot") => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), content, type }
    ]);
  };

  useEffect(() => {
    if (messages.length === 0) {
      const firstStep = surveySteps[0];
      addMessage(firstStep.question, "bot");
      
      if (firstStep.options) {
        setShowOptions({
          options: firstStep.options,
          step: 0
        });
      }
    }
  }, []);

  const handleSendMessage = (message: string) => {
    if (!message.trim() && !showSlider) return;

    setShowOptions(null);
    setShowSlider(false);
    setIsWaitingForResponse(true);

    const currentStepData = surveySteps[currentStep];
    
    if (currentStepData.field === "websiteUrl") {
      addMessage(message, "user");
      updateSurveyData("websiteUrl", message);
    } else if (currentStepData.field === "userEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(message)) {
        toast({
          title: "E-mail inválido",
          description: "Por favor, insira um e-mail válido.",
          variant: "destructive"
        });
        setIsWaitingForResponse(false);
        return;
      }
      addMessage(message, "user");
      updateSurveyData("userEmail", message);
    }

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

    const fieldName = surveySteps[currentStep].field as keyof typeof surveyData;
    updateSurveyData(fieldName, value);

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
    updateSurveyData("tamanho", sliderValue);
    setShowSlider(false);
    setIsWaitingForResponse(true);

    setTimeout(() => {
      setIsWaitingForResponse(false);
      moveToNextStep();
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "text/csv") {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
      return;
    }
    
    if (file) {
      setCsvFileName(file.name);

      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data)) {
            const filteredData = results.data.filter(row => 
              row && typeof row === 'object' && Object.keys(row).length > 0
            );
            
            if (filteredData.length > 0) {
              addMessage(`Arquivo processado com sucesso: ${filteredData.length} linhas carregadas`, "user");
              updateSurveyData("csvData", filteredData);
              
              console.log('CSV data processed:', filteredData.length, 'rows');
              
              setIsWaitingForResponse(true);
              setTimeout(() => {
                setIsWaitingForResponse(false);
                moveToNextStep();
              }, 1000);
            } else {
              toast({
                title: "Arquivo vazio",
                description: "O arquivo CSV não contém dados válidos.",
                variant: "destructive"
              });
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
        }
      });
    }
  };

  const moveToNextStep = () => {
    const nextStep = currentStep + 1;
    
    if (nextStep < surveySteps.length) {
      setCurrentStep(nextStep);
      addMessage(surveySteps[nextStep].question, "bot");
      
      if (surveySteps[nextStep].options) {
        setShowOptions({
          options: surveySteps[nextStep].options,
          step: nextStep
        });
      }
      
      if (surveySteps[nextStep].inputType === "slider") {
        setShowSlider(true);
      }
      
      if (surveySteps[nextStep].inputType === "summary") {
        const summaryContent = <SurveySummary surveyData={surveyData} csvFileName={csvFileName} />;
        addMessage(summaryContent, "bot");
        
        setTimeout(() => {
          addMessage("Tudo pronto para continuar?", "bot");
        }, 1000);
      }
    } else {
      addMessage("Obrigado por completar a pesquisa! Clique em 'Continuar' para prosseguir.", "bot");
    }
  };

  const handleBack = () => {
    if (currentStep <= 0) return;
    
    setMessages(prev => prev.slice(0, -2));
    
    const previousStep = currentStep - 1;
    setCurrentStep(previousStep);
    
    setShowOptions(null);
    setShowSlider(false);
    
    const prevStepData = surveySteps[previousStep];
    if (prevStepData.options) {
      setShowOptions({
        options: prevStepData.options,
        step: previousStep
      });
    } else if (prevStepData.inputType === "slider") {
      setShowSlider(true);
    }
  };

  const onSubmitSurvey = async () => {
    const success = await handleSubmit();
    if (success) {
      addMessage("Ótimo! Sua base está sendo processada e em breve você receberá um e-mail em " + surveyData.userEmail + " com seus contatos personalizados.", "bot");
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-minimal-gray-200 shadow-sm">
      <SurveyProgress 
        currentStep={currentStep} 
        totalSteps={surveySteps.length} 
        onBack={handleBack} 
      />
      
      <ChatContainer 
        messages={messages}
        isWaitingForResponse={isWaitingForResponse}
        showOptions={showOptions}
        showSlider={showSlider}
        sliderValue={sliderValue}
        currentStep={currentStep}
        onOptionSelect={handleOptionSelect}
        onSliderChange={handleSliderChange}
        onSliderComplete={handleSliderComplete}
        onFileChange={handleFileChange}
      />
      
      <ChatFooter 
        currentStep={currentStep}
        totalSteps={surveySteps.length}
        onSendMessage={handleSendMessage}
        onSubmitSurvey={onSubmitSurvey}
        isSubmitting={isSubmitting}
        hasSubmitted={hasSubmitted}
        showOptions={!!showOptions}
        showSlider={showSlider}
      />
    </div>
  );
};

export default ChatbotSurvey;
