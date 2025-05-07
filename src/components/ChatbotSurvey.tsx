
import React, { useState, useRef, useEffect } from "react";
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatOptions from "./ChatOptions";
import { surveySteps } from "./survey/SurveySteps";
import { Message } from "./survey/types";
import { useSurveyData } from "./survey/useSurveyData";
import SliderInput from "./survey/SliderInput";
import CSVFileUpload from "./survey/CSVFileUpload";
import SurveyProgress from "./survey/SurveyProgress";
import SurveySummary from "./survey/SurveySummary";

const ChatbotSurvey = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showOptions, setShowOptions] = useState<{
    options: { value: string; label: string }[];
    step: number;
  } | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(350);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  
  const {
    surveyData,
    updateSurveyData,
    isSubmitting,
    hasSubmitted,
    handleSubmit
  } = useSurveyData();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleSendMessage = () => {
    if (!currentInput.trim() && !showSlider) return;

    setShowOptions(null);
    setShowSlider(false);
    setIsWaitingForResponse(true);

    const currentStepData = surveySteps[currentStep];
    
    if (currentStepData.field === "websiteUrl") {
      addMessage(currentInput, "user");
      updateSurveyData("websiteUrl", currentInput);
    } else if (currentStepData.field === "userEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentInput)) {
        toast({
          title: "E-mail inválido",
          description: "Por favor, insira um e-mail válido.",
          variant: "destructive"
        });
        setIsWaitingForResponse(false);
        return;
      }
      addMessage(currentInput, "user");
      updateSurveyData("userEmail", currentInput);
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
    setCurrentInput("");
    
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
      
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 scrollbar-hide max-w-[600px] mx-auto w-full">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            type={message.type}
          />
        ))}
        
        {isWaitingForResponse && (
          <ChatMessage content="" type="bot" isTyping={true} />
        )}
        
        {showOptions && (
          <div className="mb-4">
            <ChatOptions
              options={showOptions.options}
              onSelect={handleOptionSelect}
            />
          </div>
        )}
        
        {showSlider && (
          <SliderInput
            value={sliderValue}
            onChange={handleSliderChange}
            onComplete={handleSliderComplete}
          />
        )}
        
        {currentStep === 7 && (
          <CSVFileUpload onFileSelect={handleFileChange} />
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 border-t border-minimal-gray-200 bg-white rounded-b-xl">
        <div className="flex items-center gap-2 max-w-[600px] mx-auto">
          {currentStep === 6 && (
            <div className="relative flex-1">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Digite seu e-mail..."
                className="w-full bg-minimal-gray-50 border-minimal-gray-200 text-minimal-black rounded-full pr-12 focus:border-minimal-black focus:ring-1 focus:ring-minimal-gray-100 transition-all duration-200"
              />
              <Button
                onClick={handleSendMessage}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-minimal-black text-minimal-white hover:bg-minimal-gray-800 transition-all duration-200 p-0"
              >
                <Send size={14} />
              </Button>
            </div>
          )}
          
          {currentStep < 6 && showOptions === null && !showSlider && (
            <>
              <div className="relative flex-1">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Digite sua resposta..."
                  className="w-full bg-minimal-gray-50 border-minimal-gray-200 text-minimal-black rounded-full pr-12 focus:border-minimal-black focus:ring-1 focus:ring-minimal-gray-100 transition-all duration-200"
                />
                <Button
                  onClick={handleSendMessage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-minimal-black text-minimal-white hover:bg-minimal-gray-800 transition-all duration-200 p-0"
                >
                  <Send size={14} />
                </Button>
              </div>
            </>
          )}
          
          {currentStep === surveySteps.length - 1 && (
            <Button
              onClick={onSubmitSurvey}
              disabled={isSubmitting || hasSubmitted}
              className={`w-full text-minimal-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
                hasSubmitted 
                  ? "bg-minimal-gray-400" 
                  : "bg-minimal-black hover:bg-minimal-gray-800"
              }`}
            >
              {isSubmitting ? 'Salvando...' : hasSubmitted ? 'Enviado' : 'Continuar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotSurvey;
