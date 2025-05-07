
import React, { useState, useEffect } from "react";
import { Bot, Send, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { surveySteps } from "./SurveySteps";
import { Message } from "./types";
import { useSurveyData } from "./useSurveyData";
import SurveyProgress from "./SurveyProgress";
import SurveySummary from "./SurveySummary";
import { ChatInput } from "@/components/ui/chat-input";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import ChatOptions from "../ChatOptions";
import SliderInput from "./SliderInput";
import CSVFileUpload from "./CSVFileUpload";
import Papa from 'papaparse';

const ExpandableSurveyChat = () => {
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
  const [input, setInput] = useState("");

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
    setInput("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !showSlider) return;
    handleSendMessage(input);
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
    <div className="flex justify-center">
      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
        className="fixed md:relative md:w-full md:max-w-[800px]"
      >
        <ExpandableChatHeader>
          <SurveyProgress
            currentStep={currentStep}
            totalSteps={surveySteps.length}
            onBack={handleBack}
          />
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList smooth={true}>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.type === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  fallback={message.type === "user" ? "US" : "AI"}
                />
                <ChatBubbleMessage
                  variant={message.type === "user" ? "sent" : "received"}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isWaitingForResponse && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  fallback="AI"
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
            
            {showOptions && (
              <div className="pl-10 mb-4 flex flex-col gap-2">
                <ChatOptions
                  options={showOptions.options}
                  onSelect={handleOptionSelect}
                />
              </div>
            )}
            
            {showSlider && (
              <div className="pl-10 mb-4">
                <SliderInput
                  value={sliderValue}
                  onChange={handleSliderChange}
                  onComplete={handleSliderComplete}
                />
              </div>
            )}
            
            {currentStep === 7 && (
              <div className="pl-10 mb-4">
                <CSVFileUpload onFileSelect={handleFileChange} />
              </div>
            )}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          {currentStep === 6 && !showOptions && !showSlider && (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <ChatInput 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite seu e-mail..."
                className="flex-1"
              />
              <Button type="submit" className="bg-minimal-black text-minimal-white">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
          
          {currentStep < 6 && !showOptions && !showSlider && currentStep !== 7 && (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <ChatInput 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button type="submit" className="bg-minimal-black text-minimal-white">
                <Send className="h-4 w-4" />
              </Button>
            </form>
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
              <CornerDownLeft className="ml-2 h-4 w-4" />
            </Button>
          )}
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
};

export default ExpandableSurveyChat;
